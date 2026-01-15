import {
  getDayName,
  type DoctorWithSpecialty,
  type DoctorWithRelations,
  type FormattedDoctor,
  type FormattedSchedule,
  type FormattedInsuranceNetwork,
} from './types.js';

// ============================================
// JSON Field Parser
// ============================================

export const parseJsonField = <T>(field: string | T | null | undefined, fallback: T): T => {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return fallback;
    }
  }
  return field;
};

// ============================================
// Doctor Formatter
// ============================================

export const formatDoctor = (doctor: DoctorWithSpecialty | DoctorWithRelations): FormattedDoctor => {
  const qualifications = parseJsonField<string[]>(doctor.qualifications, []);
  const languages = parseJsonField<string[]>(doctor.languages, ['Bengali', 'English']);
  const subSpecialties = parseJsonField<string[]>(doctor.subSpecialties, []);

  return {
    id: doctor.id,
    name: {
      english: doctor.nameEn,
      bengali: doctor.nameBn,
    },
    bmdcRegistration: doctor.bmdcRegNo,
    qualifications,
    specialty: doctor.primarySpecialty?.nameEn || doctor.primarySpecialtyId,
    subSpecialties,
    designation: doctor.designation,
    experienceYears: doctor.experienceYears,
    gender: doctor.gender,
    languages,
    consultationFee: {
      min: doctor.consultationFeeMin,
      max: doctor.consultationFeeMax,
    },
    telemedicineAvailable: doctor.telemedicineAvailable,
    bio: doctor.bio,
    contact: {
      phone: doctor.phone,
      email: doctor.email,
    },
  };
};

// ============================================
// Schedule Formatter
// ============================================

export interface ScheduleInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  consultationFee: number | null;
  appointmentRequired: boolean | null;
  serialSystem: string | null;
  hospital: {
    nameEn: string;
    type: string;
    area: string | null;
    address: string | null;
    division?: { nameEn: string } | null;
  };
}

export const formatSchedule = (schedule: ScheduleInput): FormattedSchedule => ({
  day: getDayName(schedule.dayOfWeek),
  hospital: {
    name: schedule.hospital.nameEn,
    type: schedule.hospital.type,
    area: schedule.hospital.area,
    address: schedule.hospital.address,
    division: schedule.hospital.division?.nameEn,
  },
  timing: `${schedule.startTime} - ${schedule.endTime}`,
  fee: schedule.consultationFee,
  appointmentRequired: schedule.appointmentRequired,
  serialSystem: schedule.serialSystem,
});

// ============================================
// Insurance Network Formatter
// ============================================

export interface InsuranceNetworkInput {
  insuranceProvider: {
    nameEn: string;
  };
  panelNumber: string | null;
}

export const formatInsuranceNetwork = (network: InsuranceNetworkInput): FormattedInsuranceNetwork => ({
  provider: network.insuranceProvider.nameEn,
  panelNumber: network.panelNumber,
});

// ============================================
// Response Helpers
// ============================================

export const createTextResponse = (data: unknown) => ({
  content: [
    {
      type: 'text' as const,
      text: JSON.stringify(data, null, 2),
    },
  ],
});

export const createErrorResponse = (message: string, isError = false) => ({
  content: [
    {
      type: 'text' as const,
      text: message,
    },
  ],
  ...(isError && { isError: true }),
});
