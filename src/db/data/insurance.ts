// Insurance Providers in Bangladesh

export const insuranceProvidersData = [
  // Government/Public Insurance
  {
    id: 'ssk',
    nameEn: 'Shasthyo Surokhsha Karmasuchi (SSK)',
    nameBn: 'স্বাস্থ্য সুরক্ষা কর্মসূচি',
    type: 'government' as const,
    website: 'https://www.ssk.gov.bd',
    phone: '16263',
    isActive: true,
  },

  // Private Insurance Companies
  {
    id: 'green-delta',
    nameEn: 'Green Delta Insurance',
    nameBn: 'গ্রিন ডেল্টা ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.green-delta.com',
    phone: '09612-016016',
    isActive: true,
  },
  {
    id: 'metlife',
    nameEn: 'MetLife Bangladesh',
    nameBn: 'মেটলাইফ বাংলাদেশ',
    type: 'health' as const,
    website: 'https://www.metlife.com.bd',
    phone: '09612-016016',
    isActive: true,
  },
  {
    id: 'guardian-life',
    nameEn: 'Guardian Life Insurance',
    nameBn: 'গার্ডিয়ান লাইফ ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.guardianlife.com.bd',
    phone: '09612-345345',
    isActive: true,
  },
  {
    id: 'pragati-life',
    nameEn: 'Pragati Life Insurance',
    nameBn: 'প্রগতি লাইফ ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.pragatilife.com',
    phone: '02-8411055',
    isActive: true,
  },
  {
    id: 'delta-life',
    nameEn: 'Delta Life Insurance',
    nameBn: 'ডেল্টা লাইফ ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.deltalife.org',
    phone: '02-9887888',
    isActive: true,
  },
  {
    id: 'reliance',
    nameEn: 'Reliance Insurance',
    nameBn: 'রিলায়েন্স ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.relianceinsurance.com.bd',
    phone: '02-9852233',
    isActive: true,
  },
  {
    id: 'prime-insurance',
    nameEn: 'Prime Insurance',
    nameBn: 'প্রাইম ইন্স্যুরেন্স',
    type: 'health' as const,
    website: 'https://www.primeinsurancebd.com',
    phone: '02-9881234',
    isActive: true,
  },

  // Corporate Health Plans
  {
    id: 'brac-health',
    nameEn: 'BRAC Health Programme',
    nameBn: 'ব্র্যাক হেলথ প্রোগ্রাম',
    type: 'corporate' as const,
    website: 'https://www.brac.net',
    phone: '02-9881265',
    isActive: true,
  },
  {
    id: 'grameenphone-health',
    nameEn: 'Grameenphone Employee Health',
    nameBn: 'গ্রামীণফোন এমপ্লয়ি হেলথ',
    type: 'corporate' as const,
    isActive: true,
  },
];

// Doctor-Insurance mappings (sample data)
export const doctorInsuranceData = [
  // Prof. Dr. Afzalur Rahman accepts multiple insurances
  { id: 'di-1', doctorId: 'dr-afzalur-rahman', insuranceProviderId: 'green-delta', panelNumber: 'GD-C-12345' },
  { id: 'di-2', doctorId: 'dr-afzalur-rahman', insuranceProviderId: 'metlife', panelNumber: 'ML-P-67890' },
  
  // Prof. Dr. Harisul Hoque
  { id: 'di-3', doctorId: 'dr-harisul-hoque', insuranceProviderId: 'green-delta', panelNumber: 'GD-C-12346' },
  { id: 'di-4', doctorId: 'dr-harisul-hoque', insuranceProviderId: 'guardian-life', panelNumber: 'GL-C-45678' },
  
  // Prof. Dr. Quazi Deen
  { id: 'di-5', doctorId: 'dr-quazi-deen', insuranceProviderId: 'green-delta', panelNumber: 'GD-N-12347' },
  { id: 'di-6', doctorId: 'dr-quazi-deen', insuranceProviderId: 'pragati-life', panelNumber: 'PL-N-78901' },
  
  // Prof. Dr. Mamun Al Mahtab
  { id: 'di-7', doctorId: 'dr-mamun-al-mahtab', insuranceProviderId: 'metlife', panelNumber: 'ML-G-34567' },
  { id: 'di-8', doctorId: 'dr-mamun-al-mahtab', insuranceProviderId: 'delta-life', panelNumber: 'DL-G-89012' },
  
  // Prof. Dr. Kohinoor Begum (Evercare doctors often accept many insurances)
  { id: 'di-9', doctorId: 'dr-kohinoor-begum', insuranceProviderId: 'green-delta', panelNumber: 'GD-O-12348' },
  { id: 'di-10', doctorId: 'dr-kohinoor-begum', insuranceProviderId: 'metlife', panelNumber: 'ML-O-67891' },
  { id: 'di-11', doctorId: 'dr-kohinoor-begum', insuranceProviderId: 'guardian-life', panelNumber: 'GL-O-23456' },
  
  // Prof. Dr. Harun Ur Rashid
  { id: 'di-12', doctorId: 'dr-harun-ur-rashid', insuranceProviderId: 'ssk', panelNumber: 'SSK-K-00001' },
  { id: 'di-13', doctorId: 'dr-harun-ur-rashid', insuranceProviderId: 'green-delta', panelNumber: 'GD-K-12349' },
  
  // Dr. Farhana Rahman
  { id: 'di-14', doctorId: 'dr-farhana-rahman', insuranceProviderId: 'pragati-life', panelNumber: 'PL-P-45678' },
  { id: 'di-15', doctorId: 'dr-farhana-rahman', insuranceProviderId: 'reliance', panelNumber: 'RL-P-90123' },
  
  // More doctor-insurance mappings
  { id: 'di-16', doctorId: 'dr-ak-azad-khan', insuranceProviderId: 'ssk', panelNumber: 'SSK-E-00001' },
  { id: 'di-17', doctorId: 'dr-ak-azad-khan', insuranceProviderId: 'green-delta', panelNumber: 'GD-E-12350' },
  
  { id: 'di-18', doctorId: 'dr-sarwar-alam', insuranceProviderId: 'green-delta', panelNumber: 'GD-O-12351' },
  { id: 'di-19', doctorId: 'dr-sarwar-alam', insuranceProviderId: 'metlife', panelNumber: 'ML-O-67892' },
  
  { id: 'di-20', doctorId: 'dr-sonia-khan', insuranceProviderId: 'metlife', panelNumber: 'ML-PS-67893' },
  { id: 'di-21', doctorId: 'dr-sonia-khan', insuranceProviderId: 'guardian-life', panelNumber: 'GL-PS-23457' },
  { id: 'di-22', doctorId: 'dr-sonia-khan', insuranceProviderId: 'brac-health', panelNumber: 'BR-PS-00001' },
  
  { id: 'di-23', doctorId: 'dr-nusrat-jahan-derma', insuranceProviderId: 'green-delta', panelNumber: 'GD-D-12352' },
  { id: 'di-24', doctorId: 'dr-nusrat-jahan-derma', insuranceProviderId: 'metlife', panelNumber: 'ML-D-67894' },
  
  { id: 'di-25', doctorId: 'dr-sharmin-hossain-endo', insuranceProviderId: 'ssk', panelNumber: 'SSK-E-00002' },
  { id: 'di-26', doctorId: 'dr-sharmin-hossain-endo', insuranceProviderId: 'green-delta', panelNumber: 'GD-E-12353' },
  
  { id: 'di-27', doctorId: 'dr-zahirul-islam-nephro', insuranceProviderId: 'green-delta', panelNumber: 'GD-N-12354' },
  { id: 'di-28', doctorId: 'dr-zahirul-islam-nephro', insuranceProviderId: 'metlife', panelNumber: 'ML-N-67895' },
  
  { id: 'di-29', doctorId: 'dr-nurul-islam-ctg', insuranceProviderId: 'green-delta', panelNumber: 'GD-C-12355' },
  { id: 'di-30', doctorId: 'dr-nurul-islam-ctg', insuranceProviderId: 'pragati-life', panelNumber: 'PL-C-78902' },
];

