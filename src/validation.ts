import { z } from 'zod';

// ============================================
// Validation Schemas for Tool Inputs
// ============================================

export const SearchDoctorsSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Query too long'),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
});

export const GetDoctorDetailsSchema = z.object({
  doctor_id: z.string().min(1, 'Doctor ID is required'),
});

export const FindDoctorsBySpecialtySchema = z.object({
  specialty: z.string().min(1, 'Specialty is required'),
  division: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const FindDoctorsByLocationSchema = z.object({
  division: z.string().min(1, 'Division is required'),
  district: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const FindDoctorsByHospitalSchema = z.object({
  hospital_name: z.string().min(1, 'Hospital name is required'),
});

export const FindDoctorsAvailableTodaySchema = z.object({
  specialty: z.string().optional(),
  division: z.string().optional(),
});

export const GetChamberScheduleSchema = z.object({
  doctor_id: z.string().min(1, 'Doctor ID is required'),
});

export const ListHospitalsSchema = z.object({
  division: z.string().optional(),
  type: z.enum(['government', 'private', 'clinic', 'diagnostic']).optional(),
});

export const FindDoctorsBySymptomsSchema = z.object({
  symptoms: z.string().min(1, 'Symptoms description is required').max(500, 'Description too long'),
  division: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

export const FindDoctorsByFeeSchema = z.object({
  min_fee: z.number().int().min(0).optional(),
  max_fee: z.number().int().min(0).optional(),
  specialty: z.string().optional(),
  division: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const FindEmergencyHospitalsSchema = z.object({
  division: z.string().optional(),
  district: z.string().optional(),
});

export const FindDoctorsByInsuranceSchema = z.object({
  insurance_provider: z.string().min(1, 'Insurance provider is required'),
  specialty: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const GetTopRatedDoctorsSchema = z.object({
  specialty: z.string().optional(),
  division: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

// ============================================
// Validation Helper
// ============================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessages = result.error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join('; ');
  return { success: false, error: errorMessages };
}

// ============================================
// Schema Map for Tool Names
// ============================================

export const toolSchemas = {
  search_doctors: SearchDoctorsSchema,
  get_doctor_details: GetDoctorDetailsSchema,
  find_doctors_by_specialty: FindDoctorsBySpecialtySchema,
  find_doctors_by_location: FindDoctorsByLocationSchema,
  find_doctors_by_hospital: FindDoctorsByHospitalSchema,
  find_doctors_available_today: FindDoctorsAvailableTodaySchema,
  get_chamber_schedule: GetChamberScheduleSchema,
  list_hospitals: ListHospitalsSchema,
  find_doctors_by_symptoms: FindDoctorsBySymptomsSchema,
  find_doctors_by_fee: FindDoctorsByFeeSchema,
  find_emergency_hospitals: FindEmergencyHospitalsSchema,
  find_doctors_by_insurance: FindDoctorsByInsuranceSchema,
  get_top_rated_doctors: GetTopRatedDoctorsSchema,
  // Tools with no input validation needed
  list_specialties: z.object({}),
  list_divisions: z.object({}),
  list_insurance_providers: z.object({}),
} as const;

export type ToolSchemaName = keyof typeof toolSchemas;
