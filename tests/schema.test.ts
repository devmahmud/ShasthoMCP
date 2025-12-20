import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Tests for MCP tool input schemas
 * These schemas mirror what the MCP server expects
 */

describe('MCP Tool Schemas', () => {
  // ============================================
  // Search Doctors Schema
  // ============================================
  describe('search_doctors schema', () => {
    const searchDoctorsSchema = z.object({
      query: z.string().min(1),
      limit: z.number().optional().default(10),
    });

    it('should validate valid search query', () => {
      const input = { query: 'cardiologist' };
      const result = searchDoctorsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with optional limit', () => {
      const input = { query: 'heart doctor', limit: 5 };
      const result = searchDoctorsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty query', () => {
      const input = { query: '' };
      const result = searchDoctorsSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  // ============================================
  // Get Doctor Schema
  // ============================================
  describe('get_doctor schema', () => {
    const getDoctorSchema = z.object({
      doctorId: z.string().min(1),
    });

    it('should validate valid doctor ID', () => {
      const input = { doctorId: 'dr-afzalur-rahman' };
      const result = getDoctorSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject missing doctor ID', () => {
      const input = {};
      const result = getDoctorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  // ============================================
  // Find Doctors by Specialty Schema
  // ============================================
  describe('find_doctors_by_specialty schema', () => {
    const findBySpecialtySchema = z.object({
      specialty: z.string().min(1),
      division: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate with specialty only', () => {
      const input = { specialty: 'cardiology' };
      const result = findBySpecialtySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with specialty and division', () => {
      const input = { specialty: 'neurology', division: 'dhaka' };
      const result = findBySpecialtySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with all parameters', () => {
      const input = { specialty: 'orthopedics', division: 'chittagong', limit: 20 };
      const result = findBySpecialtySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors by Location Schema
  // ============================================
  describe('find_doctors_by_location schema', () => {
    const findByLocationSchema = z.object({
      division: z.string().min(1),
      district: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate with division only', () => {
      const input = { division: 'dhaka' };
      const result = findByLocationSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with division and district', () => {
      const input = { division: 'dhaka', district: 'dhaka-city' };
      const result = findByLocationSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors by Hospital Schema
  // ============================================
  describe('find_doctors_by_hospital schema', () => {
    const findByHospitalSchema = z.object({
      hospitalName: z.string().min(1),
    });

    it('should validate hospital name', () => {
      const input = { hospitalName: 'Square Hospital' };
      const result = findByHospitalSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate partial hospital name', () => {
      const input = { hospitalName: 'DMCH' };
      const result = findByHospitalSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors Available Today Schema
  // ============================================
  describe('find_doctors_available_today schema', () => {
    const findAvailableTodaySchema = z.object({
      specialty: z.string().optional(),
      division: z.string().optional(),
    });

    it('should validate with no parameters', () => {
      const input = {};
      const result = findAvailableTodaySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with specialty', () => {
      const input = { specialty: 'medicine' };
      const result = findAvailableTodaySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with both parameters', () => {
      const input = { specialty: 'pediatrics', division: 'dhaka' };
      const result = findAvailableTodaySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors by Symptoms Schema
  // ============================================
  describe('find_doctors_by_symptoms schema', () => {
    const findBySymptomSchema = z.object({
      symptoms: z.string().min(1),
      division: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate symptoms query', () => {
      const input = { symptoms: 'chest pain and shortness of breath' };
      const result = findBySymptomSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate Bengali symptoms', () => {
      const input = { symptoms: 'বুকে ব্যথা' };
      const result = findBySymptomSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with location filter', () => {
      const input = { symptoms: 'headache', division: 'dhaka' };
      const result = findBySymptomSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors by Fee Range Schema
  // ============================================
  describe('find_doctors_by_fee schema', () => {
    const findByFeeSchema = z.object({
      minFee: z.number().optional(),
      maxFee: z.number().optional(),
      specialty: z.string().optional(),
      division: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate with min fee', () => {
      const input = { minFee: 500 };
      const result = findByFeeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with max fee', () => {
      const input = { maxFee: 1500 };
      const result = findByFeeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with fee range', () => {
      const input = { minFee: 500, maxFee: 1500 };
      const result = findByFeeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with all filters', () => {
      const input = { minFee: 500, maxFee: 2000, specialty: 'cardiology', division: 'dhaka' };
      const result = findByFeeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Emergency Hospitals Schema
  // ============================================
  describe('find_emergency_hospitals schema', () => {
    const findEmergencySchema = z.object({
      division: z.string().optional(),
      district: z.string().optional(),
    });

    it('should validate with no parameters', () => {
      const input = {};
      const result = findEmergencySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with division', () => {
      const input = { division: 'dhaka' };
      const result = findEmergencySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with division and district', () => {
      const input = { division: 'dhaka', district: 'dhaka-city' };
      const result = findEmergencySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Find Doctors by Insurance Schema
  // ============================================
  describe('find_doctors_by_insurance schema', () => {
    const findByInsuranceSchema = z.object({
      insuranceProviderId: z.string().min(1),
      specialty: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate with provider ID', () => {
      const input = { insuranceProviderId: 'green-delta' };
      const result = findByInsuranceSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with specialty filter', () => {
      const input = { insuranceProviderId: 'metlife', specialty: 'cardiology' };
      const result = findByInsuranceSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject missing provider ID', () => {
      const input = { specialty: 'medicine' };
      const result = findByInsuranceSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  // ============================================
  // Get Top Rated Doctors Schema
  // ============================================
  describe('get_top_rated_doctors schema', () => {
    const topRatedSchema = z.object({
      specialty: z.string().optional(),
      division: z.string().optional(),
      limit: z.number().optional().default(10),
    });

    it('should validate with no parameters', () => {
      const input = {};
      const result = topRatedSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with specialty', () => {
      const input = { specialty: 'dermatology' };
      const result = topRatedSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with all parameters', () => {
      const input = { specialty: 'psychiatry', division: 'dhaka', limit: 5 };
      const result = topRatedSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // Get Chamber Schedule Schema
  // ============================================
  describe('get_chamber_schedule schema', () => {
    const chamberScheduleSchema = z.object({
      doctorId: z.string().min(1),
    });

    it('should validate doctor ID', () => {
      const input = { doctorId: 'dr-afzalur-rahman' };
      const result = chamberScheduleSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject missing doctor ID', () => {
      const input = {};
      const result = chamberScheduleSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  // ============================================
  // List Hospitals Schema
  // ============================================
  describe('list_hospitals schema', () => {
    const listHospitalsSchema = z.object({
      division: z.string().optional(),
      type: z.enum(['government', 'private', 'clinic', 'diagnostic']).optional(),
    });

    it('should validate with no parameters', () => {
      const input = {};
      const result = listHospitalsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with division', () => {
      const input = { division: 'dhaka' };
      const result = listHospitalsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate with type', () => {
      const input = { type: 'government' };
      const result = listHospitalsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const input = { type: 'invalid' };
      const result = listHospitalsSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

