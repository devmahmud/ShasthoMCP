import { describe, it, expect } from 'vitest';
import { findSpecialtiesForSymptoms, symptomMappings } from '../src/db/data/symptoms.js';

describe('Symptom Mapping', () => {
  describe('findSpecialtiesForSymptoms', () => {
    // ============================================
    // Cardiology Tests
    // ============================================
    describe('Cardiology symptoms', () => {
      it('should identify chest pain as cardiology with urgent urgency', () => {
        const result = findSpecialtiesForSymptoms('I have chest pain');
        
        expect(result.specialtyIds).toContain('cardiology');
        expect(result.urgency).toBe('urgent');
        expect(result.matchedSymptoms).toContain('chest pain');
        expect(result.advice).toBeDefined();
      });

      it('should identify heart palpitations', () => {
        const result = findSpecialtiesForSymptoms('My heart is racing and I feel palpitation');
        
        expect(result.specialtyIds[0]).toBe('cardiology');
        expect(result.matchedSymptoms).toContain('palpitation');
      });

      it('should identify high blood pressure', () => {
        const result = findSpecialtiesForSymptoms('I have high blood pressure and hypertension');
        
        expect(result.specialtyIds).toContain('cardiology');
        expect(result.matchedSymptoms.length).toBeGreaterThanOrEqual(1);
      });
    });

    // ============================================
    // Neurology Tests
    // ============================================
    describe('Neurology symptoms', () => {
      it('should identify headache and migraine', () => {
        const result = findSpecialtiesForSymptoms('I have severe headache and migraine');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.matchedSymptoms).toContain('headache');
        expect(result.matchedSymptoms).toContain('migraine');
      });

      it('should identify stroke symptoms with urgent urgency', () => {
        const result = findSpecialtiesForSymptoms('My father had a stroke and paralysis');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.urgency).toBe('urgent');
        expect(result.matchedSymptoms).toContain('stroke');
        expect(result.matchedSymptoms).toContain('paralysis');
      });

      it('should identify dizziness and vertigo', () => {
        const result = findSpecialtiesForSymptoms('I feel dizziness and have vertigo');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.matchedSymptoms).toContain('dizziness');
        expect(result.matchedSymptoms).toContain('vertigo');
      });
    });

    // ============================================
    // Gastroenterology Tests
    // ============================================
    describe('Gastroenterology symptoms', () => {
      it('should identify stomach pain', () => {
        const result = findSpecialtiesForSymptoms('I have stomach pain and acidity');
        
        expect(result.specialtyIds).toContain('gastroenterology');
        expect(result.matchedSymptoms).toContain('stomach pain');
        expect(result.matchedSymptoms).toContain('acidity');
      });

      it('should identify liver problems', () => {
        const result = findSpecialtiesForSymptoms('I have jaundice and fatty liver');
        
        expect(result.specialtyIds).toContain('gastroenterology');
        expect(result.matchedSymptoms).toContain('jaundice');
        expect(result.matchedSymptoms).toContain('fatty liver');
      });

      it('should identify digestive issues', () => {
        const result = findSpecialtiesForSymptoms('I have diarrhea and constipation');
        
        expect(result.specialtyIds).toContain('gastroenterology');
      });
    });

    // ============================================
    // Pulmonology Tests
    // ============================================
    describe('Pulmonology symptoms', () => {
      it('should identify cough and cold', () => {
        const result = findSpecialtiesForSymptoms('I have cough and cold with fever');
        
        expect(result.specialtyIds).toContain('pulmonology');
        expect(result.matchedSymptoms).toContain('cough');
        expect(result.matchedSymptoms).toContain('cold');
      });

      it('should identify asthma', () => {
        const result = findSpecialtiesForSymptoms('I have asthma and wheezing');
        
        expect(result.specialtyIds).toContain('pulmonology');
        expect(result.matchedSymptoms).toContain('asthma');
        expect(result.matchedSymptoms).toContain('wheezing');
      });
    });

    // ============================================
    // Nephrology Tests
    // ============================================
    describe('Nephrology symptoms', () => {
      it('should identify kidney problems with urgent urgency', () => {
        const result = findSpecialtiesForSymptoms('I have kidney pain and kidney stone');
        
        expect(result.specialtyIds).toContain('nephrology');
        expect(result.urgency).toBe('urgent');
        expect(result.matchedSymptoms).toContain('kidney pain');
        expect(result.matchedSymptoms).toContain('kidney stone');
      });

      it('should identify urinary problems', () => {
        const result = findSpecialtiesForSymptoms('I have urinary infection and blood in urine');
        
        expect(result.specialtyIds).toContain('nephrology');
      });
    });

    // ============================================
    // Dermatology Tests
    // ============================================
    describe('Dermatology symptoms', () => {
      it('should identify skin problems', () => {
        const result = findSpecialtiesForSymptoms('I have skin rash and itching');
        
        expect(result.specialtyIds).toContain('dermatology');
        expect(result.matchedSymptoms).toContain('rash');
        expect(result.matchedSymptoms).toContain('itching');
      });

      it('should identify acne and hair loss', () => {
        const result = findSpecialtiesForSymptoms('I have acne and hair loss');
        
        expect(result.specialtyIds).toContain('dermatology');
        expect(result.matchedSymptoms).toContain('acne');
        expect(result.matchedSymptoms).toContain('hair loss');
      });
    });

    // ============================================
    // Psychiatry Tests
    // ============================================
    describe('Psychiatry symptoms', () => {
      it('should identify depression and anxiety with urgent urgency', () => {
        const result = findSpecialtiesForSymptoms('I have depression and anxiety');
        
        expect(result.specialtyIds).toContain('psychiatry');
        expect(result.urgency).toBe('urgent');
        expect(result.matchedSymptoms).toContain('depression');
        expect(result.matchedSymptoms).toContain('anxiety');
      });

      it('should provide helpline for suicidal thoughts', () => {
        const result = findSpecialtiesForSymptoms('I have suicidal thoughts');
        
        expect(result.specialtyIds).toContain('psychiatry');
        expect(result.advice).toContain('Kaan Pete Roi');
      });

      it('should identify sleep problems', () => {
        const result = findSpecialtiesForSymptoms('I have insomnia and cant sleep');
        
        expect(result.specialtyIds).toContain('psychiatry');
      });
    });

    // ============================================
    // Pediatrics Tests
    // ============================================
    describe('Pediatrics symptoms', () => {
      it('should identify child-related symptoms', () => {
        const result = findSpecialtiesForSymptoms('My baby has fever');
        
        expect(result.specialtyIds).toContain('pediatrics');
        expect(result.matchedSymptoms).toContain('baby');
      });

      it('should identify vaccination queries', () => {
        const result = findSpecialtiesForSymptoms('I need vaccination for my child');
        
        expect(result.specialtyIds).toContain('pediatrics');
        expect(result.matchedSymptoms).toContain('child');
        expect(result.matchedSymptoms).toContain('vaccination');
      });
    });

    // ============================================
    // Gynecology Tests
    // ============================================
    describe('Gynecology symptoms', () => {
      it('should identify pregnancy-related queries', () => {
        const result = findSpecialtiesForSymptoms('I am pregnant and need checkup');
        
        expect(result.specialtyIds).toContain('gynecology');
        expect(result.matchedSymptoms).toContain('pregnant');
      });

      it('should identify menstrual problems', () => {
        const result = findSpecialtiesForSymptoms('I have irregular period and heavy bleeding');
        
        expect(result.specialtyIds).toContain('gynecology');
        expect(result.matchedSymptoms).toContain('irregular period');
        expect(result.matchedSymptoms).toContain('heavy bleeding');
      });
    });

    // ============================================
    // Orthopedics Tests
    // ============================================
    describe('Orthopedics symptoms', () => {
      it('should identify bone and joint pain', () => {
        const result = findSpecialtiesForSymptoms('I have back pain and knee pain');
        
        expect(result.specialtyIds).toContain('orthopedics');
        expect(result.matchedSymptoms).toContain('back pain');
        expect(result.matchedSymptoms).toContain('knee pain');
      });

      it('should identify fractures', () => {
        const result = findSpecialtiesForSymptoms('I have a fracture and broken bone');
        
        expect(result.specialtyIds).toContain('orthopedics');
        expect(result.matchedSymptoms).toContain('fracture');
        expect(result.matchedSymptoms).toContain('broken bone');
      });
    });

    // ============================================
    // ENT Tests
    // ============================================
    describe('ENT symptoms', () => {
      it('should identify ear problems', () => {
        const result = findSpecialtiesForSymptoms('I have ear pain and hearing loss');
        
        expect(result.specialtyIds).toContain('ent');
        expect(result.matchedSymptoms).toContain('ear pain');
        expect(result.matchedSymptoms).toContain('hearing loss');
      });

      it('should identify throat and sinus problems', () => {
        const result = findSpecialtiesForSymptoms('I have sore throat and sinusitis');
        
        expect(result.specialtyIds).toContain('ent');
        expect(result.matchedSymptoms).toContain('sore throat');
        expect(result.matchedSymptoms).toContain('sinusitis');
      });
    });

    // ============================================
    // Ophthalmology Tests
    // ============================================
    describe('Ophthalmology symptoms', () => {
      it('should identify eye problems', () => {
        const result = findSpecialtiesForSymptoms('I have blurred vision and eye pain');
        
        expect(result.specialtyIds).toContain('ophthalmology');
        expect(result.matchedSymptoms).toContain('blurred vision');
        expect(result.matchedSymptoms).toContain('eye pain');
      });

      it('should identify cataract', () => {
        const result = findSpecialtiesForSymptoms('I have cataract and need glasses');
        
        expect(result.specialtyIds).toContain('ophthalmology');
        expect(result.matchedSymptoms).toContain('cataract');
        expect(result.matchedSymptoms).toContain('glasses');
      });
    });

    // ============================================
    // Dentistry Tests
    // ============================================
    describe('Dentistry symptoms', () => {
      it('should identify tooth problems', () => {
        const result = findSpecialtiesForSymptoms('I have tooth pain and toothache');
        
        expect(result.specialtyIds).toContain('dentistry');
        expect(result.matchedSymptoms).toContain('tooth pain');
        expect(result.matchedSymptoms).toContain('toothache');
      });
    });

    // ============================================
    // Oncology Tests
    // ============================================
    describe('Oncology symptoms', () => {
      it('should identify cancer with urgent urgency', () => {
        const result = findSpecialtiesForSymptoms('I have been diagnosed with cancer');
        
        expect(result.specialtyIds).toContain('oncology');
        expect(result.urgency).toBe('urgent');
      });

      it('should identify tumor and lump', () => {
        const result = findSpecialtiesForSymptoms('I have a tumor and need chemotherapy');
        
        expect(result.specialtyIds).toContain('oncology');
        expect(result.matchedSymptoms).toContain('tumor');
        expect(result.matchedSymptoms).toContain('chemotherapy');
      });
    });

    // ============================================
    // Bengali Language Tests
    // ============================================
    describe('Bengali language support', () => {
      it('should identify Bengali symptoms - chest pain', () => {
        const result = findSpecialtiesForSymptoms('আমার বুকে ব্যথা হচ্ছে');
        
        expect(result.specialtyIds).toContain('cardiology');
        expect(result.matchedSymptoms).toContain('বুকে ব্যথা');
      });

      it('should identify Bengali symptoms - headache', () => {
        const result = findSpecialtiesForSymptoms('আমার মাথা ব্যথা');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.matchedSymptoms).toContain('মাথা ব্যথা');
      });

      it('should identify Bengali symptoms - diabetes', () => {
        const result = findSpecialtiesForSymptoms('আমার ডায়াবেটিস আছে');
        
        expect(result.specialtyIds).toContain('endocrinology');
        expect(result.matchedSymptoms).toContain('ডায়াবেটিস');
      });

      it('should identify Bengali symptoms - skin problem', () => {
        const result = findSpecialtiesForSymptoms('আমার চর্মরোগ আছে');
        
        expect(result.specialtyIds).toContain('dermatology');
      });

      it('should identify Bengali symptoms - pregnancy', () => {
        const result = findSpecialtiesForSymptoms('আমি প্রেগন্যান্সি পরীক্ষা করাতে চাই');
        
        expect(result.specialtyIds).toContain('gynecology');
      });
    });

    // ============================================
    // Multiple Symptoms Tests
    // ============================================
    describe('Multiple symptoms handling', () => {
      it('should prioritize specialties based on multiple matches', () => {
        const result = findSpecialtiesForSymptoms('I have chest pain and shortness of breath');
        
        expect(result.specialtyIds[0]).toBe('cardiology');
        expect(result.matchedSymptoms.length).toBeGreaterThanOrEqual(2);
      });

      it('should handle mixed symptoms from different specialties', () => {
        const result = findSpecialtiesForSymptoms('I have headache and stomach pain');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.specialtyIds).toContain('gastroenterology');
      });

      it('should deduplicate matched symptoms', () => {
        const result = findSpecialtiesForSymptoms('chest pain chest pain chest pain');
        
        // Should only have one 'chest pain' entry
        const chestPainCount = result.matchedSymptoms.filter(s => s === 'chest pain').length;
        expect(chestPainCount).toBe(1);
      });
    });

    // ============================================
    // Edge Cases
    // ============================================
    describe('Edge cases', () => {
      it('should return empty results for unrecognized symptoms', () => {
        const result = findSpecialtiesForSymptoms('xyz123 random text');
        
        expect(result.specialtyIds).toHaveLength(0);
        expect(result.matchedSymptoms).toHaveLength(0);
        expect(result.urgency).toBe('routine');
      });

      it('should handle empty string', () => {
        const result = findSpecialtiesForSymptoms('');
        
        expect(result.specialtyIds).toHaveLength(0);
        expect(result.matchedSymptoms).toHaveLength(0);
      });

      it('should handle case-insensitive matching for English', () => {
        const result = findSpecialtiesForSymptoms('CHEST PAIN');
        
        expect(result.specialtyIds).toContain('cardiology');
        expect(result.matchedSymptoms).toContain('chest pain');
      });

      it('should match partial phrases', () => {
        const result = findSpecialtiesForSymptoms('I am having a severe headache today');
        
        expect(result.specialtyIds).toContain('neurology');
        expect(result.matchedSymptoms).toContain('headache');
      });
    });
  });

  describe('Symptom Mappings Data', () => {
    it('should have valid structure for all mappings', () => {
      for (const mapping of symptomMappings) {
        expect(mapping.keywords).toBeDefined();
        expect(Array.isArray(mapping.keywords)).toBe(true);
        expect(mapping.keywords.length).toBeGreaterThan(0);
        
        expect(mapping.keywordsBn).toBeDefined();
        expect(Array.isArray(mapping.keywordsBn)).toBe(true);
        
        expect(mapping.specialtyIds).toBeDefined();
        expect(Array.isArray(mapping.specialtyIds)).toBe(true);
        expect(mapping.specialtyIds.length).toBeGreaterThan(0);
        
        expect(['routine', 'urgent', 'emergency']).toContain(mapping.urgency);
      }
    });

    it('should have no duplicate specialties in individual mappings', () => {
      for (const mapping of symptomMappings) {
        const uniqueIds = new Set(mapping.specialtyIds);
        expect(uniqueIds.size).toBe(mapping.specialtyIds.length);
      }
    });

    it('should cover all major specialty categories', () => {
      const allSpecialties = new Set<string>();
      
      for (const mapping of symptomMappings) {
        mapping.specialtyIds.forEach(id => allSpecialties.add(id));
      }

      // Check for essential specialties
      const essentialSpecialties = [
        'cardiology',
        'neurology',
        'gastroenterology',
        'pulmonology',
        'nephrology',
        'dermatology',
        'psychiatry',
        'pediatrics',
        'gynecology',
        'orthopedics',
        'ent',
        'ophthalmology',
        'dentistry',
        'medicine',
      ];

      for (const specialty of essentialSpecialties) {
        expect(allSpecialties.has(specialty)).toBe(true);
      }
    });
  });
});

