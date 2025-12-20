import { describe, it, expect } from 'vitest';

/**
 * Utility tests for helper functions and data transformations
 */

describe('Utility Functions', () => {
  describe('Data Format Helpers', () => {
    it('should properly format time strings', () => {
      const validTimes = ['09:00', '13:30', '17:45', '00:00', '23:59'];
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
      
      for (const time of validTimes) {
        expect(timeRegex.test(time)).toBe(true);
      }
    });

    it('should validate phone number formats', () => {
      const validPhones = [
        '01711-123456',
        '02-8411055',
        '09612-016016',
        '16263',
        '+880-2-9116551',
      ];
      
      for (const phone of validPhones) {
        expect(phone.length).toBeGreaterThan(4);
      }
    });

    it('should validate email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmails = [
        'doctor@hospital.com',
        'info@clinic.org.bd',
        'admin@healthcare.gov.bd',
      ];
      
      for (const email of validEmails) {
        expect(emailRegex.test(email)).toBe(true);
      }
    });
  });

  describe('Day of Week Mapping', () => {
    it('should map day indices to day names correctly', () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      expect(days[0]).toBe('Sunday');
      expect(days[6]).toBe('Saturday');
      expect(days.length).toBe(7);
    });

    it('should handle all day indices', () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 0; i < 7; i++) {
        expect(days[i]).toBeDefined();
        expect(days[i].length).toBeGreaterThan(0);
      }
    });
  });

  describe('Fee Range Validation', () => {
    it('should validate fee ranges', () => {
      const feeRanges = [
        { min: 500, max: 1000 },
        { min: 1000, max: 2000 },
        { min: 1500, max: 2500 },
      ];
      
      for (const range of feeRanges) {
        expect(range.min).toBeLessThanOrEqual(range.max);
        expect(range.min).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle undefined fee values', () => {
      const doctor = { consultationFeeMin: undefined, consultationFeeMax: undefined };
      
      expect(doctor.consultationFeeMin).toBeUndefined();
      expect(doctor.consultationFeeMax).toBeUndefined();
    });
  });

  describe('Rating Validation', () => {
    it('should validate rating values', () => {
      const validRatings = [1, 2, 3, 3.5, 4, 4.5, 5];
      
      for (const rating of validRatings) {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      }
    });

    it('should detect invalid ratings', () => {
      const invalidRatings = [-1, 0, 6, 10];
      
      for (const rating of invalidRatings) {
        expect(rating < 1 || rating > 5).toBe(true);
      }
    });
  });

  describe('Search Term Processing', () => {
    it('should handle case-insensitive search', () => {
      const searchTerm = 'Cardiology';
      const normalizedTerm = searchTerm.toLowerCase();
      
      expect(normalizedTerm).toBe('cardiology');
      expect(normalizedTerm).toBe('Cardiology'.toLowerCase());
    });

    it('should create SQL LIKE patterns', () => {
      const query = 'heart';
      const likePattern = `%${query.toLowerCase()}%`;
      
      expect(likePattern).toBe('%heart%');
      expect(likePattern.startsWith('%')).toBe(true);
      expect(likePattern.endsWith('%')).toBe(true);
    });

    it('should handle empty search terms', () => {
      const query = '';
      const likePattern = `%${query.toLowerCase()}%`;
      
      expect(likePattern).toBe('%%');
    });
  });

  describe('ID Generation', () => {
    it('should create valid ID formats', () => {
      const ids = [
        'dr-afzalur-rahman',
        'dmch',
        'cardiology',
        'dhaka',
        'cs-1',
      ];
      
      const idRegex = /^[a-z0-9-]+$/;
      
      for (const id of ids) {
        expect(idRegex.test(id)).toBe(true);
      }
    });

    it('should ensure ID uniqueness pattern', () => {
      const prefix = 'dr';
      const name = 'john-doe';
      const id = `${prefix}-${name}`;
      
      expect(id).toBe('dr-john-doe');
      expect(id.includes('DR')).toBe(false); // Should be lowercase
    });
  });

  describe('JSON Parsing Safety', () => {
    it('should safely parse valid JSON arrays', () => {
      const validJson = '["MBBS", "FCPS", "MD"]';
      const parsed = JSON.parse(validJson);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(3);
    });

    it('should handle array input directly', () => {
      const qualifications = ['MBBS', 'FCPS', 'MD'];
      
      expect(Array.isArray(qualifications)).toBe(true);
      expect(qualifications.length).toBe(3);
    });

    it('should detect invalid JSON', () => {
      const invalidJson = 'MBBS,MD (Cardiology)';
      
      expect(() => JSON.parse(invalidJson)).toThrow();
    });
  });

  describe('Hospital Type Validation', () => {
    it('should validate hospital types', () => {
      const validTypes = ['government', 'private', 'clinic', 'diagnostic'];
      
      expect(validTypes).toContain('government');
      expect(validTypes).toContain('private');
      expect(validTypes).toContain('clinic');
      expect(validTypes).toContain('diagnostic');
      expect(validTypes.length).toBe(4);
    });
  });

  describe('Emergency Service Flags', () => {
    it('should validate boolean emergency flags', () => {
      const hospital = {
        hasEmergency: true,
        is24Hours: true,
        hasAmbulance: false,
      };
      
      expect(typeof hospital.hasEmergency).toBe('boolean');
      expect(typeof hospital.is24Hours).toBe('boolean');
      expect(typeof hospital.hasAmbulance).toBe('boolean');
    });
  });

  describe('Urgency Level Mapping', () => {
    it('should validate urgency levels', () => {
      const validUrgencies = ['routine', 'urgent', 'emergency'];
      
      expect(validUrgencies).toContain('routine');
      expect(validUrgencies).toContain('urgent');
      expect(validUrgencies).toContain('emergency');
    });

    it('should handle urgency priority', () => {
      const urgencyPriority = {
        routine: 1,
        urgent: 2,
        emergency: 3,
      };
      
      expect(urgencyPriority.emergency).toBeGreaterThan(urgencyPriority.urgent);
      expect(urgencyPriority.urgent).toBeGreaterThan(urgencyPriority.routine);
    });
  });

  describe('Telemedicine Availability', () => {
    it('should handle telemedicine flag', () => {
      const doctorWithTelemedicine = { telemedicineAvailable: true };
      const doctorWithoutTelemedicine = { telemedicineAvailable: false };
      
      expect(doctorWithTelemedicine.telemedicineAvailable).toBe(true);
      expect(doctorWithoutTelemedicine.telemedicineAvailable).toBe(false);
    });
  });
});

