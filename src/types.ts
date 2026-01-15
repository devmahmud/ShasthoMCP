import type {
  Doctor,
  Specialty,
  Hospital,
  Division,
  District,
  ChamberSchedule,
  InsuranceProvider,
  DoctorInsurance,
} from './db/schema.js';

// ============================================
// Extended Types with Relations
// ============================================

export interface DoctorWithSpecialty extends Doctor {
  primarySpecialty: Specialty;
}

export interface HospitalWithLocation extends Hospital {
  division?: Division | null;
  district?: District | null;
}

export interface ChamberScheduleWithHospital extends ChamberSchedule {
  hospital: HospitalWithLocation;
}

export interface ChamberScheduleWithDoctor extends ChamberSchedule {
  doctor: DoctorWithSpecialty;
  hospital: HospitalWithLocation;
}

export interface DoctorInsuranceWithProvider extends DoctorInsurance {
  insuranceProvider: InsuranceProvider;
}

export interface DoctorWithRelations extends Doctor {
  primarySpecialty: Specialty;
  chamberSchedules: ChamberScheduleWithHospital[];
  insuranceNetworks?: DoctorInsuranceWithProvider[];
}

// Generic type for MCP tool arguments (allows any record)
export type ToolArgs<T> = T & Record<string, unknown>;

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================
// Formatted Output Types
// ============================================

export interface FormattedDoctor {
  id: string;
  name: {
    english: string;
    bengali: string | null;
  };
  bmdcRegistration: string | null;
  qualifications: string[];
  specialty: string;
  subSpecialties: string[];
  designation: string | null;
  experienceYears: number | null;
  gender: 'male' | 'female';
  languages: string[];
  consultationFee: {
    min: number | null;
    max: number | null;
  };
  telemedicineAvailable: boolean | null;
  bio: string | null;
  contact: {
    phone: string | null;
    email: string | null;
  };
}

export interface FormattedSchedule {
  day: string;
  hospital: {
    name: string;
    type: string;
    area: string | null;
    address: string | null;
    division: string | undefined;
  };
  timing: string;
  fee: number | null;
  appointmentRequired: boolean | null;
  serialSystem: string | null;
}

export interface FormattedInsuranceNetwork {
  provider: string;
  panelNumber: string | null;
}

// ============================================
// Helper Types
// ============================================

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type DayName = (typeof DAY_NAMES)[number];

export const getDayName = (dayOfWeek: number): DayName => {
  return DAY_NAMES[dayOfWeek] ?? DAY_NAMES[0];
};

// ============================================
// Tool Argument Types
// ============================================

export interface SearchDoctorsArgs {
  query: string;
  limit?: number;
  offset?: number;
}

export interface GetDoctorDetailsArgs {
  doctor_id: string;
}

export interface FindDoctorsBySpecialtyArgs {
  specialty: string;
  division?: string;
  limit?: number;
}

export interface FindDoctorsByLocationArgs {
  division: string;
  district?: string;
  limit?: number;
}

export interface FindDoctorsByHospitalArgs {
  hospital_name: string;
}

export interface FindDoctorsAvailableTodayArgs {
  specialty?: string;
  division?: string;
}

export interface GetChamberScheduleArgs {
  doctor_id: string;
}

export interface ListHospitalsArgs {
  division?: string;
  type?: 'government' | 'private' | 'clinic' | 'diagnostic';
}

export interface FindDoctorsBySymptomsArgs {
  symptoms: string;
  division?: string;
  limit?: number;
}

export interface FindDoctorsByFeeArgs {
  min_fee?: number;
  max_fee?: number;
  specialty?: string;
  division?: string;
  limit?: number;
}

export interface FindEmergencyHospitalsArgs {
  division?: string;
  district?: string;
}

export interface FindDoctorsByInsuranceArgs {
  insurance_provider: string;
  specialty?: string;
  limit?: number;
}

export interface GetTopRatedDoctorsArgs {
  specialty?: string;
  division?: string;
  limit?: number;
}
