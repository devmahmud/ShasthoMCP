import { db } from './connection.js';
import {
  doctors,
  specialties,
  hospitals,
  chamberSchedules,
  divisions,
  districts,
  insuranceProviders,
  doctorInsurance,
  doctorReviews,
} from './schema.js';
import { eq, like, and, or, sql, gte, lte, desc } from 'drizzle-orm';
import { findSpecialtiesForSymptoms } from './data/symptoms.js';
import { DAY_NAMES } from '../types.js';

// ============================================
// Doctor Queries
// ============================================

export const searchDoctors = (query: string, limit = 20, offset = 0) => {
  const searchTerm = `%${query.toLowerCase()}%`;
  const safeLimit = Math.min(Math.max(1, limit), 100); // Clamp between 1-100
  const safeOffset = Math.max(0, offset);

  return db.query.doctors.findMany({
    where: or(
      like(sql`lower(${doctors.nameEn})`, searchTerm),
      like(sql`lower(${doctors.nameBn})`, searchTerm),
      like(sql`lower(${doctors.designation})`, searchTerm)
    ),
    with: {
      primarySpecialty: true,
    },
    limit: safeLimit,
    offset: safeOffset,
  });
};

export const getDoctorById = (doctorId: string) => {
  return db.query.doctors.findFirst({
    where: eq(doctors.id, doctorId),
    with: {
      primarySpecialty: true,
      chamberSchedules: {
        with: {
          hospital: {
            with: {
              division: true,
              district: true,
            },
          },
        },
      },
      insuranceNetworks: {
        with: {
          insuranceProvider: true,
        },
      },
    },
  });
};

export const findDoctorsBySpecialty = async (
  specialtyId: string,
  divisionId?: string,
  limit = 20
) => {
  if (divisionId) {
    // Use a subquery approach: find doctors who have schedules in the specified division
    const doctorIdsInDivision = await db
      .select({ doctorId: chamberSchedules.doctorId })
      .from(chamberSchedules)
      .innerJoin(hospitals, eq(chamberSchedules.hospitalId, hospitals.id))
      .where(and(eq(hospitals.divisionId, divisionId), eq(chamberSchedules.isActive, true)))
      .groupBy(chamberSchedules.doctorId);

    const doctorIds = doctorIdsInDivision.map((d) => d.doctorId);

    if (doctorIds.length === 0) {
      return [];
    }

    return db.query.doctors.findMany({
      where: and(
        eq(doctors.primarySpecialtyId, specialtyId),
        sql`${doctors.id} IN (${sql.join(
          doctorIds.map((id) => sql`${id}`),
          sql`, `
        )})`
      ),
      with: {
        primarySpecialty: true,
        chamberSchedules: {
          with: {
            hospital: {
              with: {
                division: true,
              },
            },
          },
        },
      },
      limit,
    });
  }

  return db.query.doctors.findMany({
    where: eq(doctors.primarySpecialtyId, specialtyId),
    with: {
      primarySpecialty: true,
      chamberSchedules: {
        with: {
          hospital: {
            with: {
              division: true,
            },
          },
        },
      },
    },
    limit,
  });
};

export const findDoctorsByLocation = (divisionId: string, districtId?: string, limit = 20) => {
  return db.query.chamberSchedules
    .findMany({
      with: {
        doctor: {
          with: {
            primarySpecialty: true,
          },
        },
        hospital: {
          with: {
            division: true,
            district: true,
          },
        },
      },
    })
    .then((schedules) => {
      const filteredSchedules = schedules.filter((s) => {
        if (districtId) {
          return s.hospital.districtId === districtId;
        }
        return s.hospital.divisionId === divisionId;
      });

      // Group by doctor to avoid duplicates
      const doctorMap = new Map();
      filteredSchedules.forEach((s) => {
        if (!doctorMap.has(s.doctorId)) {
          doctorMap.set(s.doctorId, {
            ...s.doctor,
            chambers: [],
          });
        }
        doctorMap.get(s.doctorId).chambers.push({
          hospital: s.hospital,
          schedule: {
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            fee: s.consultationFee,
          },
        });
      });

      return Array.from(doctorMap.values()).slice(0, limit);
    });
};

export const findDoctorsByHospital = (hospitalName: string) => {
  const searchTerm = `%${hospitalName.toLowerCase()}%`;

  return db.query.hospitals
    .findMany({
      where: or(
        like(sql`lower(${hospitals.nameEn})`, searchTerm),
        like(sql`lower(${hospitals.nameBn})`, searchTerm)
      ),
      with: {
        division: true,
        district: true,
        chamberSchedules: {
          with: {
            doctor: {
              with: {
                primarySpecialty: true,
              },
            },
          },
        },
      },
    })
    .then((results) => {
      return results.map((hospital) => ({
        hospital: {
          id: hospital.id,
          nameEn: hospital.nameEn,
          nameBn: hospital.nameBn,
          type: hospital.type,
          division: hospital.division?.nameEn,
          district: hospital.district?.nameEn,
          address: hospital.address,
          phone: hospital.phone,
          hasEmergency: hospital.hasEmergency,
          is24Hours: hospital.is24Hours,
        },
        doctors: hospital.chamberSchedules.map((cs) => ({
          id: cs.doctor.id,
          nameEn: cs.doctor.nameEn,
          nameBn: cs.doctor.nameBn,
          specialty: cs.doctor.primarySpecialty.nameEn,
          schedule: {
            dayOfWeek: cs.dayOfWeek,
            startTime: cs.startTime,
            endTime: cs.endTime,
            fee: cs.consultationFee,
          },
        })),
      }));
    });
};

export const findDoctorsAvailableToday = (specialtyId?: string, divisionId?: string) => {
  const today = new Date().getDay(); // 0-6, Sunday = 0

  return db.query.chamberSchedules
    .findMany({
      where: and(eq(chamberSchedules.dayOfWeek, today), eq(chamberSchedules.isActive, true)),
      with: {
        doctor: {
          with: {
            primarySpecialty: true,
          },
        },
        hospital: {
          with: {
            division: true,
            district: true,
          },
        },
      },
    })
    .then((schedules) => {
      let filtered = schedules;

      if (specialtyId) {
        filtered = filtered.filter((s) => s.doctor.primarySpecialtyId === specialtyId);
      }

      if (divisionId) {
        filtered = filtered.filter((s) => s.hospital.divisionId === divisionId);
      }

      return filtered.map((s) => ({
        doctor: {
          id: s.doctor.id,
          nameEn: s.doctor.nameEn,
          nameBn: s.doctor.nameBn,
          specialty: s.doctor.primarySpecialty.nameEn,
          qualifications: JSON.parse(s.doctor.qualifications),
        },
        hospital: {
          nameEn: s.hospital.nameEn,
          area: s.hospital.area,
          division: s.hospital.division?.nameEn,
        },
        schedule: {
          startTime: s.startTime,
          endTime: s.endTime,
          fee: s.consultationFee,
          serialSystem: s.serialSystem,
        },
      }));
    });
};

export const getChamberSchedule = (doctorId: string) => {
  return db.query.chamberSchedules
    .findMany({
      where: and(eq(chamberSchedules.doctorId, doctorId), eq(chamberSchedules.isActive, true)),
      with: {
        hospital: {
          with: {
            division: true,
            district: true,
          },
        },
      },
    })
    .then((schedules) =>
      schedules.map((s) => ({
        day: DAY_NAMES[s.dayOfWeek],
        dayOfWeek: s.dayOfWeek,
        hospital: {
          nameEn: s.hospital.nameEn,
          nameBn: s.hospital.nameBn,
          type: s.hospital.type,
          area: s.hospital.area,
          address: s.hospital.address,
          phone: s.hospital.phone,
          division: s.hospital.division?.nameEn,
          district: s.hospital.district?.nameEn,
        },
        startTime: s.startTime,
        endTime: s.endTime,
        consultationFee: s.consultationFee,
        appointmentRequired: s.appointmentRequired,
        serialSystem: s.serialSystem,
        maxPatients: s.maxPatients,
      }))
    );
};

// ============================================
// NEW: Fee Range Filter
// ============================================

export const findDoctorsByFeeRange = async (
  minFee?: number,
  maxFee?: number,
  specialtyId?: string,
  divisionId?: string,
  limit = 20
) => {
  // Build base conditions
  const conditions = [
    specialtyId ? eq(doctors.primarySpecialtyId, specialtyId) : undefined,
    minFee ? gte(doctors.consultationFeeMin, minFee) : undefined,
    maxFee ? lte(doctors.consultationFeeMax, maxFee) : undefined,
  ].filter(Boolean);

  // If divisionId is provided, filter at database level
  if (divisionId) {
    const doctorIdsInDivision = await db
      .select({ doctorId: chamberSchedules.doctorId })
      .from(chamberSchedules)
      .innerJoin(hospitals, eq(chamberSchedules.hospitalId, hospitals.id))
      .where(and(eq(hospitals.divisionId, divisionId), eq(chamberSchedules.isActive, true)))
      .groupBy(chamberSchedules.doctorId);

    const doctorIds = doctorIdsInDivision.map((d) => d.doctorId);

    if (doctorIds.length === 0) {
      return [];
    }

    conditions.push(
      sql`${doctors.id} IN (${sql.join(
        doctorIds.map((id) => sql`${id}`),
        sql`, `
      )})`
    );
  }

  const results = await db.query.doctors.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      primarySpecialty: true,
    },
    limit,
  });

  return results.map((doc) => ({
    id: doc.id,
    nameEn: doc.nameEn,
    nameBn: doc.nameBn,
    specialty: doc.primarySpecialty.nameEn,
    designation: doc.designation,
    experienceYears: doc.experienceYears,
    feeRange: {
      min: doc.consultationFeeMin,
      max: doc.consultationFeeMax,
    },
    telemedicineAvailable: doc.telemedicineAvailable,
  }));
};

// ============================================
// NEW: Symptom-Based Search
// ============================================

export const findDoctorsBySymptoms = async (symptomQuery: string, divisionId?: string, limit = 10) => {
  const { specialtyIds, urgency, advice, matchedSymptoms } = findSpecialtiesForSymptoms(symptomQuery);

  if (specialtyIds.length === 0) {
    return {
      message: 'Could not match symptoms to a specialty. Please consult a general medicine doctor.',
      urgency: 'routine',
      suggestedSpecialties: ['medicine'],
      doctors: [],
    };
  }

  // Get doctors from matched specialties
  const doctorResults = await db.query.doctors.findMany({
    where: or(...specialtyIds.slice(0, 3).map((id) => eq(doctors.primarySpecialtyId, id))),
    with: {
      primarySpecialty: true,
      chamberSchedules: {
        with: {
          hospital: {
            with: {
              division: true,
            },
          },
        },
      },
    },
    limit: limit * 2,
  });

  let filteredDoctors = doctorResults;
  if (divisionId) {
    filteredDoctors = doctorResults.filter((doc) =>
      doc.chamberSchedules.some((cs) => cs.hospital.divisionId === divisionId)
    );
  }

  // Get specialty names
  const specialtyDetails = await db.query.specialties.findMany({
    where: or(...specialtyIds.map((id) => eq(specialties.id, id))),
  });

  return {
    matchedSymptoms,
    urgency,
    advice,
    suggestedSpecialties: specialtyDetails.map((s) => ({
      id: s.id,
      nameEn: s.nameEn,
      nameBn: s.nameBn,
    })),
    doctors: filteredDoctors.slice(0, limit).map((doc) => ({
      id: doc.id,
      nameEn: doc.nameEn,
      nameBn: doc.nameBn,
      specialty: doc.primarySpecialty.nameEn,
      specialtyBn: doc.primarySpecialty.nameBn,
      designation: doc.designation,
      qualifications: JSON.parse(doc.qualifications),
      experienceYears: doc.experienceYears,
      feeRange: {
        min: doc.consultationFeeMin,
        max: doc.consultationFeeMax,
      },
      telemedicineAvailable: doc.telemedicineAvailable,
    })),
  };
};

// ============================================
// NEW: Emergency Hospital Finder
// ============================================

export const findEmergencyHospitals = (divisionId?: string, districtId?: string) => {
  return db.query.hospitals
    .findMany({
      where: and(
        eq(hospitals.hasEmergency, true),
        divisionId ? eq(hospitals.divisionId, divisionId) : undefined,
        districtId ? eq(hospitals.districtId, districtId) : undefined
      ),
      with: {
        division: true,
        district: true,
      },
      orderBy: (hospitals, { desc }) => [desc(hospitals.is24Hours)],
    })
    .then((results) =>
      results.map((h) => ({
        id: h.id,
        nameEn: h.nameEn,
        nameBn: h.nameBn,
        type: h.type,
        address: h.address,
        area: h.area,
        division: h.division?.nameEn,
        district: h.district?.nameEn,
        phone: h.phone,
        emergencyPhone: h.emergencyPhone,
        is24Hours: h.is24Hours,
        hasAmbulance: h.hasAmbulance,
        bedCount: h.bedCount,
      }))
    );
};

// ============================================
// NEW: Insurance Network Queries
// ============================================

export const listInsuranceProviders = () => {
  return db.query.insuranceProviders.findMany({
    where: eq(insuranceProviders.isActive, true),
    orderBy: (insuranceProviders, { asc }) => [asc(insuranceProviders.nameEn)],
  });
};

export const findDoctorsByInsurance = (insuranceProviderId: string, specialtyId?: string, limit = 20) => {
  return db.query.doctorInsurance
    .findMany({
      where: and(
        eq(doctorInsurance.insuranceProviderId, insuranceProviderId),
        eq(doctorInsurance.isActive, true)
      ),
      with: {
        doctor: {
          with: {
            primarySpecialty: true,
            chamberSchedules: {
              with: {
                hospital: true,
              },
            },
          },
        },
        insuranceProvider: true,
      },
    })
    .then((results) => {
      let filtered = results;

      if (specialtyId) {
        filtered = results.filter((r) => r.doctor.primarySpecialtyId === specialtyId);
      }

      return filtered.slice(0, limit).map((r) => ({
        doctor: {
          id: r.doctor.id,
          nameEn: r.doctor.nameEn,
          nameBn: r.doctor.nameBn,
          specialty: r.doctor.primarySpecialty.nameEn,
          designation: r.doctor.designation,
          feeRange: {
            min: r.doctor.consultationFeeMin,
            max: r.doctor.consultationFeeMax,
          },
        },
        panelNumber: r.panelNumber,
        insurance: {
          id: r.insuranceProvider.id,
          nameEn: r.insuranceProvider.nameEn,
        },
      }));
    });
};

export const getDoctorInsuranceNetworks = (doctorId: string) => {
  return db.query.doctorInsurance
    .findMany({
      where: and(eq(doctorInsurance.doctorId, doctorId), eq(doctorInsurance.isActive, true)),
      with: {
        insuranceProvider: true,
      },
    })
    .then((results) =>
      results.map((r) => ({
        providerId: r.insuranceProviderId,
        providerName: r.insuranceProvider.nameEn,
        providerNameBn: r.insuranceProvider.nameBn,
        type: r.insuranceProvider.type,
        panelNumber: r.panelNumber,
      }))
    );
};

// ============================================
// NEW: Doctor Reviews/Ratings
// ============================================

export const getDoctorReviews = (doctorId: string, limit = 10) => {
  return db.query.doctorReviews
    .findMany({
      where: and(eq(doctorReviews.doctorId, doctorId), eq(doctorReviews.isApproved, true)),
      orderBy: desc(doctorReviews.createdAt),
      limit,
    })
    .then((reviews) =>
      reviews.map((r) => ({
        rating: r.rating,
        reviewText: r.reviewText,
        patientName: r.patientName || 'Anonymous',
        isVerified: r.isVerified,
        createdAt: r.createdAt,
      }))
    );
};

export const getTopRatedDoctors = async (specialtyId?: string, divisionId?: string, limit = 10) => {
  const conditions = [
    gte(doctors.avgRating, 4.0), // Only show doctors with 4+ rating
    specialtyId ? eq(doctors.primarySpecialtyId, specialtyId) : undefined,
  ].filter(Boolean);

  // If divisionId is provided, filter at database level
  if (divisionId) {
    const doctorIdsInDivision = await db
      .select({ doctorId: chamberSchedules.doctorId })
      .from(chamberSchedules)
      .innerJoin(hospitals, eq(chamberSchedules.hospitalId, hospitals.id))
      .where(and(eq(hospitals.divisionId, divisionId), eq(chamberSchedules.isActive, true)))
      .groupBy(chamberSchedules.doctorId);

    const doctorIds = doctorIdsInDivision.map((d) => d.doctorId);

    if (doctorIds.length === 0) {
      return [];
    }

    conditions.push(
      sql`${doctors.id} IN (${sql.join(
        doctorIds.map((id) => sql`${id}`),
        sql`, `
      )})`
    );
  }

  const results = await db.query.doctors.findMany({
    where: and(...conditions),
    with: {
      primarySpecialty: true,
    },
    orderBy: desc(doctors.avgRating),
    limit,
  });

  return results.map((doc) => ({
    id: doc.id,
    nameEn: doc.nameEn,
    nameBn: doc.nameBn,
    specialty: doc.primarySpecialty.nameEn,
    designation: doc.designation,
    experienceYears: doc.experienceYears,
    rating: doc.avgRating,
    totalReviews: doc.totalReviews,
    feeRange: {
      min: doc.consultationFeeMin,
      max: doc.consultationFeeMax,
    },
  }));
};

// ============================================
// Specialty Queries
// ============================================

export const listSpecialties = () => {
  return db.query.specialties.findMany({
    orderBy: (specialties, { asc }) => [asc(specialties.category), asc(specialties.nameEn)],
  });
};

export const getSpecialtyByName = (name: string) => {
  const searchTerm = `%${name.toLowerCase()}%`;

  return db.query.specialties.findFirst({
    where: or(
      like(sql`lower(${specialties.nameEn})`, searchTerm),
      like(sql`lower(${specialties.nameBn})`, searchTerm)
    ),
  });
};

// ============================================
// Hospital Queries
// ============================================

export const listHospitals = (divisionId?: string, type?: string) => {
  return db.query.hospitals.findMany({
    where: and(
      divisionId ? eq(hospitals.divisionId, divisionId) : undefined,
      type ? eq(hospitals.type, type as any) : undefined
    ),
    with: {
      division: true,
      district: true,
    },
    orderBy: (hospitals, { asc }) => [asc(hospitals.nameEn)],
  });
};

// ============================================
// Division/District Queries
// ============================================

export const listDivisions = () => {
  return db.query.divisions.findMany({
    with: {
      districts: true,
    },
    orderBy: (divisions, { asc }) => [asc(divisions.nameEn)],
  });
};

export const getDivisionByName = (name: string) => {
  const searchTerm = `%${name.toLowerCase()}%`;

  return db.query.divisions.findFirst({
    where: or(
      like(sql`lower(${divisions.nameEn})`, searchTerm),
      like(sql`lower(${divisions.nameBn})`, searchTerm)
    ),
    with: {
      districts: true,
    },
  });
};
