import { describe, it, expect } from 'vitest';
import { divisionsData, districtsData } from '../src/db/data/districts.js';
import { hospitalsData } from '../src/db/data/hospitals.js';
import { doctorsData } from '../src/db/data/doctors.js';
import { chamberSchedulesData as schedulesData } from '../src/db/data/schedules.js';
import { specialtiesData } from '../src/db/data/specialties.js';
import { insuranceProvidersData, doctorInsuranceData } from '../src/db/data/insurance.js';

describe('Data Integrity Tests', () => {
  // ============================================
  // Divisions Data Tests
  // ============================================
  describe('Divisions Data', () => {
    it('should have all 8 divisions of Bangladesh', () => {
      expect(divisionsData.length).toBe(8);
    });

    it('should have unique IDs for all divisions', () => {
      const ids = divisionsData.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have both English and Bengali names for all divisions', () => {
      for (const division of divisionsData) {
        expect(division.nameEn).toBeDefined();
        expect(division.nameEn.length).toBeGreaterThan(0);
        expect(division.nameBn).toBeDefined();
        expect(division.nameBn.length).toBeGreaterThan(0);
      }
    });

    it('should include major divisions', () => {
      const divisionNames = divisionsData.map((d) => d.nameEn.toLowerCase());
      const majorDivisions = [
        'dhaka',
        'chittagong',
        'rajshahi',
        'khulna',
        'sylhet',
        'rangpur',
        'barisal',
        'mymensingh',
      ];

      for (const division of majorDivisions) {
        expect(divisionNames).toContain(division);
      }
    });
  });

  // ============================================
  // Districts Data Tests
  // ============================================
  describe('Districts Data', () => {
    it('should have at least 64 districts of Bangladesh', () => {
      expect(districtsData.length).toBeGreaterThanOrEqual(64);
    });

    it('should have unique IDs for all districts', () => {
      const ids = districtsData.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid division references', () => {
      const divisionIds = new Set(divisionsData.map((d) => d.id));

      for (const district of districtsData) {
        expect(divisionIds.has(district.divisionId)).toBe(true);
      }
    });

    it('should have both English and Bengali names', () => {
      for (const district of districtsData) {
        expect(district.nameEn).toBeDefined();
        expect(district.nameEn.length).toBeGreaterThan(0);
        expect(district.nameBn).toBeDefined();
        expect(district.nameBn.length).toBeGreaterThan(0);
      }
    });

    it('should have correct division distribution', () => {
      const districtCountByDivision = new Map<string, number>();

      for (const district of districtsData) {
        const count = districtCountByDivision.get(district.divisionId) || 0;
        districtCountByDivision.set(district.divisionId, count + 1);
      }

      // Each division should have at least 1 district
      for (const divisionId of divisionsData.map((d) => d.id)) {
        expect(districtCountByDivision.get(divisionId)).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // ============================================
  // Specialties Data Tests
  // ============================================
  describe('Specialties Data', () => {
    it('should have at least 15 specialties', () => {
      expect(specialtiesData.length).toBeGreaterThanOrEqual(15);
    });

    it('should have unique IDs', () => {
      const ids = specialtiesData.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have required fields', () => {
      for (const specialty of specialtiesData) {
        expect(specialty.id).toBeDefined();
        expect(specialty.nameEn).toBeDefined();
        expect(specialty.nameBn).toBeDefined();
        expect(specialty.category).toBeDefined();
      }
    });

    it('should include essential medical specialties', () => {
      const specialtyIds = specialtiesData.map((s) => s.id);
      const essentialSpecialties = [
        'medicine',
        'cardiology',
        'neurology',
        'gastroenterology',
        'orthopedics',
        'gynecology',
        'pediatrics',
        'dermatology',
        'ent',
        'ophthalmology',
      ];

      for (const specialty of essentialSpecialties) {
        expect(specialtyIds).toContain(specialty);
      }
    });
  });

  // ============================================
  // Hospitals Data Tests
  // ============================================
  describe('Hospitals Data', () => {
    it('should have at least 50 hospitals', () => {
      expect(hospitalsData.length).toBeGreaterThanOrEqual(50);
    });

    it('should have unique IDs', () => {
      const ids = hospitalsData.map((h) => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid division and district references', () => {
      const divisionIds = new Set(divisionsData.map((d) => d.id));
      const districtIds = new Set(districtsData.map((d) => d.id));

      for (const hospital of hospitalsData) {
        if (hospital.divisionId) {
          expect(divisionIds.has(hospital.divisionId)).toBe(true);
        }
        if (hospital.districtId) {
          expect(districtIds.has(hospital.districtId)).toBe(true);
        }
      }
    });

    it('should have valid hospital types', () => {
      const validTypes = ['government', 'private', 'clinic', 'diagnostic'];

      for (const hospital of hospitalsData) {
        expect(validTypes).toContain(hospital.type);
      }
    });

    it('should have required fields', () => {
      for (const hospital of hospitalsData) {
        expect(hospital.id).toBeDefined();
        expect(hospital.nameEn).toBeDefined();
        expect(hospital.nameEn.length).toBeGreaterThan(0);
        expect(hospital.type).toBeDefined();
      }
    });

    it('should have some hospitals with emergency services', () => {
      const emergencyHospitals = hospitalsData.filter((h) => h.hasEmergency);
      expect(emergencyHospitals.length).toBeGreaterThan(0);
    });

    it('should have hospitals in multiple divisions', () => {
      const divisionsWithHospitals = new Set(
        hospitalsData.filter((h) => h.divisionId).map((h) => h.divisionId)
      );
      expect(divisionsWithHospitals.size).toBeGreaterThanOrEqual(3);
    });
  });

  // ============================================
  // Doctors Data Tests
  // ============================================
  describe('Doctors Data', () => {
    it('should have at least 50 doctors', () => {
      expect(doctorsData.length).toBeGreaterThanOrEqual(50);
    });

    it('should have unique IDs', () => {
      const ids = doctorsData.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid specialty references', () => {
      const specialtyIds = new Set(specialtiesData.map((s) => s.id));

      for (const doctor of doctorsData) {
        expect(specialtyIds.has(doctor.primarySpecialtyId)).toBe(true);
      }
    });

    it('should have required fields', () => {
      for (const doctor of doctorsData) {
        expect(doctor.id).toBeDefined();
        expect(doctor.nameEn).toBeDefined();
        expect(doctor.nameEn.length).toBeGreaterThan(0);
        expect(doctor.bmdcRegNo).toBeDefined();
        expect(doctor.primarySpecialtyId).toBeDefined();
        expect(doctor.qualifications).toBeDefined();
      }
    });

    it('should have valid gender values', () => {
      const validGenders = ['male', 'female'];

      for (const doctor of doctorsData) {
        if (doctor.gender) {
          expect(validGenders).toContain(doctor.gender);
        }
      }
    });

    it('should have valid consultation fee ranges', () => {
      for (const doctor of doctorsData) {
        if (doctor.consultationFeeMin !== undefined && doctor.consultationFeeMax !== undefined) {
          expect(doctor.consultationFeeMin).toBeLessThanOrEqual(doctor.consultationFeeMax);
          expect(doctor.consultationFeeMin).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should have valid rating values', () => {
      for (const doctor of doctorsData) {
        if (doctor.avgRating !== undefined) {
          expect(doctor.avgRating).toBeGreaterThanOrEqual(0);
          expect(doctor.avgRating).toBeLessThanOrEqual(5);
        }
      }
    });

    it('should cover multiple specialties', () => {
      const specialtyCoverage = new Set(doctorsData.map((d) => d.primarySpecialtyId));
      expect(specialtyCoverage.size).toBeGreaterThanOrEqual(10);
    });

    it('should have valid qualifications format', () => {
      for (const doctor of doctorsData) {
        // Qualifications can be either an array or a JSON string
        const qualifications = doctor.qualifications;
        if (Array.isArray(qualifications)) {
          expect(qualifications.length).toBeGreaterThan(0);
        } else if (typeof qualifications === 'string') {
          // Either a comma-separated string or JSON array
          if (qualifications.startsWith('[')) {
            const parsed = JSON.parse(qualifications);
            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed.length).toBeGreaterThan(0);
          } else {
            // Comma-separated string
            expect(qualifications.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  // ============================================
  // Schedules Data Tests
  // ============================================
  describe('Schedules Data', () => {
    it('should have at least 100 schedules', () => {
      expect(schedulesData.length).toBeGreaterThanOrEqual(100);
    });

    it('should have unique IDs', () => {
      const ids = schedulesData.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid doctor references', () => {
      const doctorIds = new Set(doctorsData.map((d) => d.id));

      for (const schedule of schedulesData) {
        expect(doctorIds.has(schedule.doctorId)).toBe(true);
      }
    });

    it('should have valid hospital references', () => {
      const hospitalIds = new Set(hospitalsData.map((h) => h.id));

      for (const schedule of schedulesData) {
        expect(hospitalIds.has(schedule.hospitalId)).toBe(true);
      }
    });

    it('should have valid day of week values', () => {
      for (const schedule of schedulesData) {
        expect(schedule.dayOfWeek).toBeGreaterThanOrEqual(0);
        expect(schedule.dayOfWeek).toBeLessThanOrEqual(6);
      }
    });

    it('should have valid time format', () => {
      const timeRegex = /^\d{2}:\d{2}$/;

      for (const schedule of schedulesData) {
        expect(timeRegex.test(schedule.startTime)).toBe(true);
        expect(timeRegex.test(schedule.endTime)).toBe(true);
      }
    });

    it('should have valid consultation fees', () => {
      for (const schedule of schedulesData) {
        if (schedule.consultationFee !== undefined) {
          expect(schedule.consultationFee).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should have valid serial system values', () => {
      const validSystems = ['token', 'appointment', 'both', 'online', 'spot'];

      for (const schedule of schedulesData) {
        if (schedule.serialSystem) {
          expect(validSystems).toContain(schedule.serialSystem);
        }
      }
    });

    it('should cover all doctors', () => {
      const doctorsWithSchedules = new Set(schedulesData.map((s) => s.doctorId));
      const allDoctorIds = new Set(doctorsData.map((d) => d.id));

      // All doctors should have at least one schedule
      for (const doctorId of allDoctorIds) {
        expect(doctorsWithSchedules.has(doctorId)).toBe(true);
      }
    });
  });

  // ============================================
  // Insurance Data Tests
  // ============================================
  describe('Insurance Data', () => {
    it('should have insurance providers', () => {
      expect(insuranceProvidersData.length).toBeGreaterThan(0);
    });

    it('should have unique provider IDs', () => {
      const ids = insuranceProvidersData.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid provider types', () => {
      const validTypes = ['government', 'private', 'corporate', 'health'];

      for (const provider of insuranceProvidersData) {
        expect(validTypes).toContain(provider.type);
      }
    });

    it('should have required fields for providers', () => {
      for (const provider of insuranceProvidersData) {
        expect(provider.id).toBeDefined();
        expect(provider.nameEn).toBeDefined();
        expect(provider.type).toBeDefined();
      }
    });

    it('should have valid doctor-insurance relationships', () => {
      const doctorIds = new Set(doctorsData.map((d) => d.id));
      const providerIds = new Set(insuranceProvidersData.map((i) => i.id));

      for (const relation of doctorInsuranceData) {
        expect(doctorIds.has(relation.doctorId)).toBe(true);
        expect(providerIds.has(relation.insuranceProviderId)).toBe(true);
      }
    });
  });

  // ============================================
  // Cross-Reference Tests
  // ============================================
  describe('Cross-Reference Integrity', () => {
    it('should have consistent specialty coverage between doctors and specialties', () => {
      const specialtiesInUse = new Set(doctorsData.map((d) => d.primarySpecialtyId));
      const allSpecialties = new Set(specialtiesData.map((s) => s.id));

      // All used specialties should exist
      for (const specialtyId of specialtiesInUse) {
        expect(allSpecialties.has(specialtyId)).toBe(true);
      }
    });

    it('should have hospitals in districts that belong to correct divisions', () => {
      const divisionByDistrict = new Map<string, string>();
      for (const district of districtsData) {
        divisionByDistrict.set(district.id, district.divisionId);
      }

      for (const hospital of hospitalsData) {
        if (hospital.districtId && hospital.divisionId) {
          const expectedDivision = divisionByDistrict.get(hospital.districtId);
          expect(hospital.divisionId).toBe(expectedDivision);
        }
      }
    });

    it('should have schedules with valid doctor-hospital pairs', () => {
      const doctorIds = new Set(doctorsData.map((d) => d.id));
      const hospitalIds = new Set(hospitalsData.map((h) => h.id));

      for (const schedule of schedulesData) {
        expect(doctorIds.has(schedule.doctorId)).toBe(true);
        expect(hospitalIds.has(schedule.hospitalId)).toBe(true);
      }
    });
  });

  // ============================================
  // Data Quality Tests
  // ============================================
  describe('Data Quality', () => {
    it('should have diverse hospital types', () => {
      const types = new Set(hospitalsData.map((h) => h.type));
      expect(types.size).toBeGreaterThanOrEqual(3);
    });

    it('should have doctors with varying experience levels', () => {
      const experienceLevels = doctorsData
        .filter((d) => d.experienceYears !== undefined)
        .map((d) => d.experienceYears);

      if (experienceLevels.length > 0) {
        const min = Math.min(...experienceLevels);
        const max = Math.max(...experienceLevels);
        expect(max - min).toBeGreaterThanOrEqual(5);
      }
    });

    it('should have both male and female doctors', () => {
      const genders = new Set(doctorsData.filter((d) => d.gender).map((d) => d.gender));
      expect(genders.has('male')).toBe(true);
      expect(genders.has('female')).toBe(true);
    });

    it('should have schedules across all days of the week', () => {
      const daysWithSchedules = new Set(schedulesData.map((s) => s.dayOfWeek));
      // At least 5 days should have schedules (excluding some weekend days is okay)
      expect(daysWithSchedules.size).toBeGreaterThanOrEqual(5);
    });

    it('should have hospitals with phone numbers', () => {
      const hospitalsWithPhone = hospitalsData.filter((h) => h.phone);
      expect(hospitalsWithPhone.length).toBeGreaterThan(hospitalsData.length / 2);
    });
  });
});
