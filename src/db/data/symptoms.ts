/**
 * Symptom-to-Specialty Mapping
 * Maps common symptoms and conditions to appropriate medical specialties
 * Used for natural language queries like "I have chest pain"
 */

export interface SymptomMapping {
  keywords: string[];         // Keywords/phrases that trigger this mapping
  keywordsBn: string[];       // Bengali keywords
  specialtyIds: string[];     // Recommended specialties (in priority order)
  urgency: 'routine' | 'urgent' | 'emergency';
  advice?: string;
}

export const symptomMappings: SymptomMapping[] = [
  // ============================================
  // CARDIOLOGY - Heart Related
  // ============================================
  {
    keywords: ['chest pain', 'heart pain', 'heart attack', 'angina', 'palpitation', 'heartbeat', 'irregular heartbeat', 'fast heartbeat', 'heart racing', 'shortness of breath', 'breathlessness', 'cardiac', 'heart disease', 'high blood pressure', 'hypertension', 'cholesterol'],
    keywordsBn: ['বুকে ব্যথা', 'হার্টের ব্যথা', 'হার্ট অ্যাটাক', 'হৃদরোগ', 'উচ্চ রক্তচাপ', 'বুক ধড়ফড়', 'শ্বাসকষ্ট'],
    specialtyIds: ['cardiology', 'cardiac-surgery'],
    urgency: 'urgent',
    advice: 'If experiencing severe chest pain, seek emergency care immediately.',
  },

  // ============================================
  // NEUROLOGY - Brain & Nerve Related
  // ============================================
  {
    keywords: ['headache', 'migraine', 'head pain', 'seizure', 'epilepsy', 'fits', 'stroke', 'paralysis', 'numbness', 'tingling', 'memory loss', 'forgetfulness', 'dementia', 'alzheimer', 'tremor', 'shaking', 'parkinson', 'dizziness', 'vertigo', 'fainting', 'unconscious'],
    keywordsBn: ['মাথা ব্যথা', 'মাইগ্রেন', 'মৃগী রোগ', 'স্ট্রোক', 'পক্ষাঘাত', 'অবশতা', 'স্মৃতিশক্তি কমে যাওয়া', 'মাথা ঘোরা'],
    specialtyIds: ['neurology', 'neurosurgery'],
    urgency: 'urgent',
    advice: 'Sudden severe headache, paralysis, or speech difficulty may indicate stroke - seek emergency care.',
  },

  // ============================================
  // GASTROENTEROLOGY - Digestive System
  // ============================================
  {
    keywords: ['stomach pain', 'abdominal pain', 'belly pain', 'gastric', 'acidity', 'heartburn', 'acid reflux', 'ulcer', 'vomiting', 'nausea', 'diarrhea', 'loose motion', 'constipation', 'bloating', 'gas', 'indigestion', 'liver', 'jaundice', 'hepatitis', 'fatty liver', 'gallbladder', 'gall stone', 'appendix', 'ibs', 'crohn'],
    keywordsBn: ['পেট ব্যথা', 'গ্যাস্ট্রিক', 'এসিডিটি', 'বদহজম', 'বমি', 'ডায়রিয়া', 'কোষ্ঠকাঠিন্য', 'জন্ডিস', 'লিভার', 'পিত্তথলি'],
    specialtyIds: ['gastroenterology', 'general-surgery'],
    urgency: 'routine',
  },

  // ============================================
  // PULMONOLOGY - Respiratory/Lung
  // ============================================
  {
    keywords: ['cough', 'cold', 'flu', 'fever', 'breathing problem', 'asthma', 'wheezing', 'bronchitis', 'pneumonia', 'tb', 'tuberculosis', 'chest infection', 'lung', 'respiratory', 'copd', 'sleep apnea', 'snoring'],
    keywordsBn: ['কাশি', 'সর্দি', 'জ্বর', 'শ্বাসকষ্ট', 'হাঁপানি', 'নিউমোনিয়া', 'যক্ষ্মা', 'ফুসফুস'],
    specialtyIds: ['pulmonology', 'medicine'],
    urgency: 'routine',
  },

  // ============================================
  // NEPHROLOGY - Kidney Related
  // ============================================
  {
    keywords: ['kidney pain', 'kidney stone', 'urinary infection', 'uti', 'blood in urine', 'frequent urination', 'burning urination', 'kidney failure', 'dialysis', 'creatinine', 'kidney disease'],
    keywordsBn: ['কিডনি ব্যথা', 'কিডনি পাথর', 'প্রস্রাবে জ্বালাপোড়া', 'প্রস্রাবে রক্ত', 'কিডনি রোগ', 'ডায়ালাইসিস'],
    specialtyIds: ['nephrology', 'urology'],
    urgency: 'urgent',
  },

  // ============================================
  // ENDOCRINOLOGY - Hormones & Diabetes
  // ============================================
  {
    keywords: ['diabetes', 'sugar', 'blood sugar', 'insulin', 'thyroid', 'hormonal', 'hormone', 'weight gain', 'weight loss', 'obesity', 'overweight', 'pcos', 'menstrual irregular', 'growth hormone'],
    keywordsBn: ['ডায়াবেটিস', 'বহুমূত্র', 'সুগার', 'থাইরয়েড', 'হরমোন', 'মোটা হয়ে যাওয়া', 'ওজন কমে যাওয়া'],
    specialtyIds: ['endocrinology', 'medicine'],
    urgency: 'routine',
  },

  // ============================================
  // DERMATOLOGY - Skin Related
  // ============================================
  {
    keywords: ['skin problem', 'skin disease', 'rash', 'itching', 'allergy', 'allergic', 'eczema', 'psoriasis', 'acne', 'pimple', 'hair loss', 'baldness', 'dandruff', 'fungal infection', 'ringworm', 'skin infection', 'burn'],
    keywordsBn: ['চর্মরোগ', 'চুলকানি', 'এলার্জি', 'ব্রণ', 'চুল পড়া', 'দাদ', 'ছত্রাক'],
    specialtyIds: ['dermatology'],
    urgency: 'routine',
  },

  // ============================================
  // PSYCHIATRY - Mental Health
  // ============================================
  {
    keywords: ['depression', 'anxiety', 'stress', 'mental health', 'panic attack', 'insomnia', 'sleep problem', 'sleeping problem', 'cant sleep', 'bipolar', 'schizophrenia', 'ocd', 'addiction', 'drug addiction', 'alcohol', 'suicidal', 'suicide'],
    keywordsBn: ['বিষণ্নতা', 'উদ্বেগ', 'মানসিক সমস্যা', 'ঘুমের সমস্যা', 'নেশা', 'মাদকাসক্তি'],
    specialtyIds: ['psychiatry'],
    urgency: 'urgent',
    advice: 'If having suicidal thoughts, please call Kaan Pete Roi: 01779-554391',
  },

  // ============================================
  // PEDIATRICS - Children
  // ============================================
  {
    keywords: ['child', 'baby', 'infant', 'newborn', 'toddler', 'kid', 'children', 'pediatric', 'vaccination', 'vaccine', 'child fever', 'child cough', 'child diarrhea', 'growth problem', 'developmental delay'],
    keywordsBn: ['শিশু', 'বাচ্চা', 'নবজাতক', 'শিশু রোগ', 'টিকা', 'বাচ্চার জ্বর'],
    specialtyIds: ['pediatrics'],
    urgency: 'routine',
  },

  // ============================================
  // GYNECOLOGY - Women's Health
  // ============================================
  {
    keywords: ['pregnancy', 'pregnant', 'period problem', 'menstrual', 'menstruation', 'irregular period', 'heavy bleeding', 'vaginal', 'pcos', 'fertility', 'infertility', 'ivf', 'ovary', 'uterus', 'cervix', 'pap smear', 'breast lump', 'menopause', 'delivery', 'cesarean', 'c-section', 'miscarriage', 'abortion'],
    keywordsBn: ['গর্ভাবস্থা', 'প্রেগন্যান্সি', 'মাসিক সমস্যা', 'পিরিয়ড', 'বন্ধ্যাত্ব', 'প্রসব', 'সিজার'],
    specialtyIds: ['gynecology'],
    urgency: 'routine',
  },

  // ============================================
  // ORTHOPEDICS - Bones & Joints
  // ============================================
  {
    keywords: ['bone pain', 'joint pain', 'back pain', 'neck pain', 'spine', 'arthritis', 'fracture', 'broken bone', 'knee pain', 'hip pain', 'shoulder pain', 'leg pain', 'arm pain', 'sports injury', 'ligament', 'muscle pain', 'osteoporosis', 'slipped disc', 'disc problem'],
    keywordsBn: ['হাড়ের ব্যথা', 'জয়েন্ট ব্যথা', 'কোমর ব্যথা', 'ঘাড় ব্যথা', 'হাঁটু ব্যথা', 'বাত', 'ভাঙ্গা হাড়'],
    specialtyIds: ['orthopedics', 'rheumatology', 'physical-medicine'],
    urgency: 'routine',
  },

  // ============================================
  // ENT - Ear, Nose, Throat
  // ============================================
  {
    keywords: ['ear pain', 'ear infection', 'hearing loss', 'deaf', 'tinnitus', 'ringing ear', 'nose block', 'nasal', 'sinus', 'sinusitis', 'throat pain', 'sore throat', 'tonsil', 'voice problem', 'hoarseness', 'snoring', 'sleep apnea', 'adenoid'],
    keywordsBn: ['কানে ব্যথা', 'কানে শুনতে না পাওয়া', 'নাক বন্ধ', 'সাইনাস', 'গলা ব্যথা', 'টনসিল'],
    specialtyIds: ['ent'],
    urgency: 'routine',
  },

  // ============================================
  // OPHTHALMOLOGY - Eye Related
  // ============================================
  {
    keywords: ['eye problem', 'vision problem', 'blurred vision', 'cant see', 'eye pain', 'red eye', 'eye infection', 'cataract', 'glaucoma', 'glasses', 'spectacles', 'lasik', 'retina', 'diabetic eye'],
    keywordsBn: ['চোখের সমস্যা', 'দেখতে না পাওয়া', 'চোখে ব্যথা', 'চোখ লাল', 'ছানি', 'চশমা'],
    specialtyIds: ['ophthalmology'],
    urgency: 'routine',
  },

  // ============================================
  // UROLOGY - Urinary & Male Reproductive
  // ============================================
  {
    keywords: ['prostate', 'urinary problem', 'urine problem', 'bladder', 'erectile dysfunction', 'impotence', 'male infertility', 'testis', 'testicle pain', 'hydrocele', 'circumcision'],
    keywordsBn: ['প্রস্রাবের সমস্যা', 'প্রোস্টেট', 'মূত্রথলি', 'পুরুষ বন্ধ্যাত্ব'],
    specialtyIds: ['urology'],
    urgency: 'routine',
  },

  // ============================================
  // ONCOLOGY - Cancer
  // ============================================
  {
    keywords: ['cancer', 'tumor', 'lump', 'chemotherapy', 'radiation', 'malignant', 'biopsy', 'leukemia', 'lymphoma', 'breast cancer', 'lung cancer', 'colon cancer'],
    keywordsBn: ['ক্যান্সার', 'টিউমার', 'কেমোথেরাপি'],
    specialtyIds: ['oncology', 'hematology'],
    urgency: 'urgent',
  },

  // ============================================
  // DENTISTRY
  // ============================================
  {
    keywords: ['tooth pain', 'toothache', 'dental', 'teeth', 'gum', 'cavity', 'root canal', 'tooth extraction', 'braces', 'orthodontic', 'wisdom tooth', 'dental implant'],
    keywordsBn: ['দাঁতে ব্যথা', 'দাঁতের সমস্যা', 'মাড়ি', 'মাড়ি থেকে রক্ত'],
    specialtyIds: ['dentistry'],
    urgency: 'routine',
  },

  // ============================================
  // GENERAL / MEDICINE
  // ============================================
  {
    keywords: ['fever', 'weakness', 'fatigue', 'tired', 'body ache', 'general checkup', 'health checkup', 'routine checkup', 'annual checkup', 'not feeling well', 'unwell', 'sick'],
    keywordsBn: ['জ্বর', 'দুর্বলতা', 'ক্লান্তি', 'শরীর ব্যথা', 'অসুস্থ'],
    specialtyIds: ['medicine'],
    urgency: 'routine',
  },
];

/**
 * Find matching specialties for a given symptom query
 */
export function findSpecialtiesForSymptoms(query: string): {
  specialtyIds: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  advice?: string;
  matchedSymptoms: string[];
} {
  const queryLower = query.toLowerCase();
  const matchedSymptoms: string[] = [];
  const specialtyScores = new Map<string, number>();
  let highestUrgency: 'routine' | 'urgent' | 'emergency' = 'routine';
  let advice: string | undefined;

  for (const mapping of symptomMappings) {
    // Check English keywords
    for (const keyword of mapping.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        matchedSymptoms.push(keyword);
        
        // Add scores to specialties (higher priority = higher score)
        mapping.specialtyIds.forEach((id, index) => {
          const score = specialtyScores.get(id) || 0;
          specialtyScores.set(id, score + (mapping.specialtyIds.length - index));
        });

        // Update urgency
        if (mapping.urgency === 'emergency') {
          highestUrgency = 'emergency';
        } else if (mapping.urgency === 'urgent' && highestUrgency !== 'emergency') {
          highestUrgency = 'urgent';
        }

        if (mapping.advice) {
          advice = mapping.advice;
        }
      }
    }

    // Check Bengali keywords
    for (const keyword of mapping.keywordsBn) {
      if (query.includes(keyword)) {
        matchedSymptoms.push(keyword);
        
        mapping.specialtyIds.forEach((id, index) => {
          const score = specialtyScores.get(id) || 0;
          specialtyScores.set(id, score + (mapping.specialtyIds.length - index));
        });

        if (mapping.urgency === 'emergency') {
          highestUrgency = 'emergency';
        } else if (mapping.urgency === 'urgent' && highestUrgency !== 'emergency') {
          highestUrgency = 'urgent';
        }

        if (mapping.advice) {
          advice = mapping.advice;
        }
      }
    }
  }

  // Sort specialties by score
  const sortedSpecialties = Array.from(specialtyScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  return {
    specialtyIds: sortedSpecialties,
    urgency: highestUrgency,
    advice,
    matchedSymptoms: [...new Set(matchedSymptoms)],
  };
}

