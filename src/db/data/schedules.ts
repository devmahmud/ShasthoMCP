// Chamber schedules for doctors at various hospitals

export const chamberSchedulesData = [
  // ============================================
  // CARDIOLOGY
  // ============================================
  // Prof. Dr. Afzalur Rahman
  { id: 'cs-1', doctorId: 'dr-afzalur-rahman', hospitalId: 'nicvd', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 30 },
  { id: 'cs-2', doctorId: 'dr-afzalur-rahman', hospitalId: 'nicvd', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 30 },
  { id: 'cs-3', doctorId: 'dr-afzalur-rahman', hospitalId: 'square', dayOfWeek: 1, startTime: '17:00', endTime: '20:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-4', doctorId: 'dr-afzalur-rahman', hospitalId: 'square', dayOfWeek: 3, startTime: '17:00', endTime: '20:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Harisul Hoque
  { id: 'cs-5', doctorId: 'dr-harisul-hoque', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-6', doctorId: 'dr-harisul-hoque', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-7', doctorId: 'dr-harisul-hoque', hospitalId: 'united', dayOfWeek: 4, startTime: '18:00', endTime: '21:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // Prof. Dr. Abdul Wadud
  { id: 'cs-101', doctorId: 'dr-abdul-wadud', hospitalId: 'national-heart', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-102', doctorId: 'dr-abdul-wadud', hospitalId: 'national-heart', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-103', doctorId: 'dr-abdul-wadud', hospitalId: 'evercare', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Syed Ali Ahsan
  { id: 'cs-104', doctorId: 'dr-syed-ali-ahsan', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-105', doctorId: 'dr-syed-ali-ahsan', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // NEUROLOGY
  // ============================================
  // Prof. Dr. Quazi Deen
  { id: 'cs-8', doctorId: 'dr-quazi-deen', hospitalId: 'nins', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-9', doctorId: 'dr-quazi-deen', hospitalId: 'nins', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-10', doctorId: 'dr-quazi-deen', hospitalId: 'labaid-dhanmondi', dayOfWeek: 1, startTime: '16:00', endTime: '19:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Badrul Alam
  { id: 'cs-106', doctorId: 'dr-md-badrul-alam', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '14:00', endTime: '17:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-107', doctorId: 'dr-md-badrul-alam', hospitalId: 'square', dayOfWeek: 3, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Dr. Rajib Nayan
  { id: 'cs-108', doctorId: 'dr-rajib-nayan', hospitalId: 'nins', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-109', doctorId: 'dr-rajib-nayan', hospitalId: 'nins', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },

  // ============================================
  // GASTROENTEROLOGY / HEPATOLOGY
  // ============================================
  // Prof. Dr. Mamun Al Mahtab
  { id: 'cs-11', doctorId: 'dr-mamun-al-mahtab', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '10:00', endTime: '14:00', consultationFee: 1500, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-12', doctorId: 'dr-mamun-al-mahtab', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '10:00', endTime: '14:00', consultationFee: 1500, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-13', doctorId: 'dr-mamun-al-mahtab', hospitalId: 'popular-dhanmondi', dayOfWeek: 6, startTime: '11:00', endTime: '14:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // Prof. Dr. Salimur Rahman
  { id: 'cs-110', doctorId: 'dr-salimur-rahman', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-111', doctorId: 'dr-salimur-rahman', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // GYNECOLOGY
  // ============================================
  // Prof. Dr. Rowshan Ara
  { id: 'cs-14', doctorId: 'dr-rowshan-ara', hospitalId: 'dmch', dayOfWeek: 0, startTime: '08:00', endTime: '12:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },
  { id: 'cs-15', doctorId: 'dr-rowshan-ara', hospitalId: 'dmch', dayOfWeek: 2, startTime: '08:00', endTime: '12:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },
  { id: 'cs-16', doctorId: 'dr-rowshan-ara', hospitalId: 'ibn-sina-dhanmondi', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // Prof. Dr. Kohinoor Begum
  { id: 'cs-17', doctorId: 'dr-kohinoor-begum', hospitalId: 'evercare', dayOfWeek: 1, startTime: '10:00', endTime: '14:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },
  { id: 'cs-18', doctorId: 'dr-kohinoor-begum', hospitalId: 'evercare', dayOfWeek: 3, startTime: '10:00', endTime: '14:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // Prof. Dr. Firoza Begum
  { id: 'cs-112', doctorId: 'dr-firoza-begum', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-113', doctorId: 'dr-firoza-begum', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },

  // Prof. Dr. Sultana Razia
  { id: 'cs-114', doctorId: 'dr-sultana-razia', hospitalId: 'square', dayOfWeek: 1, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },
  { id: 'cs-115', doctorId: 'dr-sultana-razia', hospitalId: 'square', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // ============================================
  // NEPHROLOGY
  // ============================================
  // Prof. Dr. Harun Ur Rashid
  { id: 'cs-19', doctorId: 'dr-harun-ur-rashid', hospitalId: 'kidney-foundation', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-20', doctorId: 'dr-harun-ur-rashid', hospitalId: 'kidney-foundation', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-21', doctorId: 'dr-harun-ur-rashid', hospitalId: 'kidney-foundation', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },

  // Prof. Dr. Nurul Huda
  { id: 'cs-116', doctorId: 'dr-nurul-huda', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-117', doctorId: 'dr-nurul-huda', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // ============================================
  // ORTHOPEDICS
  // ============================================
  // Prof. Dr. Shah Alam
  { id: 'cs-22', doctorId: 'dr-shah-alam', hospitalId: 'nitor', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-23', doctorId: 'dr-shah-alam', hospitalId: 'square', dayOfWeek: 3, startTime: '16:00', endTime: '19:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Dr. Rezaul Karim
  { id: 'cs-118', doctorId: 'dr-rezaul-karim-ortho', hospitalId: 'nitor', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-119', doctorId: 'dr-rezaul-karim-ortho', hospitalId: 'nitor', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // PEDIATRICS
  // ============================================
  // Prof. Dr. Md. Shahidullah
  { id: 'cs-120', doctorId: 'dr-md-shahidullah', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-121', doctorId: 'dr-md-shahidullah', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },

  // Dr. Farhana Rahman
  { id: 'cs-24', doctorId: 'dr-farhana-rahman', hospitalId: 'labaid-dhanmondi', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-25', doctorId: 'dr-farhana-rahman', hospitalId: 'labaid-dhanmondi', dayOfWeek: 1, startTime: '10:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-26', doctorId: 'dr-farhana-rahman', hospitalId: 'labaid-dhanmondi', dayOfWeek: 3, startTime: '10:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // ============================================
  // PSYCHIATRY
  // ============================================
  // Prof. Dr. Mohammad Waziul Alam
  { id: 'cs-27', doctorId: 'dr-mohammad-waziul-alam', hospitalId: 'nimh', dayOfWeek: 1, startTime: '14:00', endTime: '18:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-28', doctorId: 'dr-mohammad-waziul-alam', hospitalId: 'nimh', dayOfWeek: 4, startTime: '14:00', endTime: '18:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // ============================================
  // MEDICINE
  // ============================================
  // Prof. Dr. Khan Abul Kalam
  { id: 'cs-122', doctorId: 'dr-khan-abul-kalam', hospitalId: 'dmch', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },
  { id: 'cs-123', doctorId: 'dr-khan-abul-kalam', hospitalId: 'dmch', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },

  // Dr. Ahmedul Kabir
  { id: 'cs-124', doctorId: 'dr-ahmedul-kabir', hospitalId: 'suhrawardy', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-125', doctorId: 'dr-ahmedul-kabir', hospitalId: 'suhrawardy', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },

  // ============================================
  // DERMATOLOGY
  // ============================================
  // Prof. Dr. J.C. Saha
  { id: 'cs-126', doctorId: 'dr-jc-saha', hospitalId: 'dmch', dayOfWeek: 0, startTime: '10:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-127', doctorId: 'dr-jc-saha', hospitalId: 'dmch', dayOfWeek: 2, startTime: '10:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // Dr. Safia Sultana
  { id: 'cs-128', doctorId: 'dr-safia-sultana', hospitalId: 'square', dayOfWeek: 1, startTime: '16:00', endTime: '19:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },
  { id: 'cs-129', doctorId: 'dr-safia-sultana', hospitalId: 'square', dayOfWeek: 4, startTime: '16:00', endTime: '19:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // ============================================
  // ENDOCRINOLOGY
  // ============================================
  // Prof. Dr. A.K. Azad Khan
  { id: 'cs-35', doctorId: 'dr-ak-azad-khan', hospitalId: 'birdem', dayOfWeek: 0, startTime: '09:00', endTime: '12:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-36', doctorId: 'dr-ak-azad-khan', hospitalId: 'birdem', dayOfWeek: 3, startTime: '09:00', endTime: '12:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Md. Faruque Pathan
  { id: 'cs-130', doctorId: 'dr-md-faruque', hospitalId: 'birdem', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-131', doctorId: 'dr-md-faruque', hospitalId: 'birdem', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },

  // ============================================
  // PULMONOLOGY
  // ============================================
  // Prof. Dr. Asif Mujtaba
  { id: 'cs-132', doctorId: 'dr-asif-mujtaba', hospitalId: 'nidch', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-133', doctorId: 'dr-asif-mujtaba', hospitalId: 'nidch', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // SURGERY
  // ============================================
  // Prof. Dr. Nasir Uddin
  { id: 'cs-134', doctorId: 'dr-nasir-uddin', hospitalId: 'dmch', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-135', doctorId: 'dr-nasir-uddin', hospitalId: 'dmch', dayOfWeek: 3, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },

  // ============================================
  // ENT
  // ============================================
  // Prof. Dr. Mujibur Rahman
  { id: 'cs-136', doctorId: 'dr-mujibur-rahman-ent', hospitalId: 'dmch', dayOfWeek: 1, startTime: '09:00', endTime: '12:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-137', doctorId: 'dr-mujibur-rahman-ent', hospitalId: 'dmch', dayOfWeek: 4, startTime: '09:00', endTime: '12:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // OPHTHALMOLOGY
  // ============================================
  // Prof. Dr. Golam Mustafa
  { id: 'cs-138', doctorId: 'dr-golam-mustafa-eye', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '10:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-139', doctorId: 'dr-golam-mustafa-eye', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '10:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // ============================================
  // UROLOGY
  // ============================================
  // Prof. Dr. Zafor Iqbal
  { id: 'cs-140', doctorId: 'dr-zafor-iqbal', hospitalId: 'dmch', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-141', doctorId: 'dr-zafor-iqbal', hospitalId: 'dmch', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // ============================================
  // ONCOLOGY
  // ============================================
  // Prof. Dr. Sarwar Alam
  { id: 'cs-142', doctorId: 'dr-sarwar-alam', hospitalId: 'nich', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-143', doctorId: 'dr-sarwar-alam', hospitalId: 'nich', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },

  // ============================================
  // NEUROSURGERY
  // ============================================
  // Prof. Dr. Kanak Barua
  { id: 'cs-144', doctorId: 'dr-kanak-barua', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-145', doctorId: 'dr-kanak-barua', hospitalId: 'bsmmu', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // ============================================
  // CARDIAC SURGERY
  // ============================================
  // Prof. Dr. Asit Baran
  { id: 'cs-146', doctorId: 'dr-asit-baran', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '12:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-147', doctorId: 'dr-asit-baran', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '09:00', endTime: '12:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // ============================================
  // REGIONAL - CHITTAGONG
  // ============================================
  { id: 'cs-29', doctorId: 'dr-md-liaquat-ali', hospitalId: 'cmch', dayOfWeek: 0, startTime: '09:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },
  { id: 'cs-30', doctorId: 'dr-md-liaquat-ali', hospitalId: 'cmch', dayOfWeek: 2, startTime: '09:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 50 },
  { id: 'cs-31', doctorId: 'dr-md-liaquat-ali', hospitalId: 'max-chittagong', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // ============================================
  // REGIONAL - SYLHET
  // ============================================
  { id: 'cs-32', doctorId: 'dr-abdul-alim', hospitalId: 'osmani', dayOfWeek: 0, startTime: '09:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-33', doctorId: 'dr-abdul-alim', hospitalId: 'osmani', dayOfWeek: 2, startTime: '09:00', endTime: '14:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-34', doctorId: 'dr-abdul-alim', hospitalId: 'mount-adora', dayOfWeek: 4, startTime: '18:00', endTime: '21:00', consultationFee: 1000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // ============================================
  // HEMATOLOGY (New)
  // ============================================
  { id: 'cs-150', doctorId: 'dr-masuda-begum', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-151', doctorId: 'dr-masuda-begum', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-152', doctorId: 'dr-salahuddin-shah', hospitalId: 'dmch', dayOfWeek: 1, startTime: '10:00', endTime: '14:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-153', doctorId: 'dr-salahuddin-shah', hospitalId: 'dmch', dayOfWeek: 4, startTime: '10:00', endTime: '14:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // ============================================
  // DENTISTRY (New)
  // ============================================
  { id: 'cs-160', doctorId: 'dr-humayun-kabir-dental', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-161', doctorId: 'dr-humayun-kabir-dental', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-162', doctorId: 'dr-nahid-sultana-dental', hospitalId: 'square', dayOfWeek: 1, startTime: '10:00', endTime: '14:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-163', doctorId: 'dr-nahid-sultana-dental', hospitalId: 'square', dayOfWeek: 4, startTime: '10:00', endTime: '14:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-164', doctorId: 'dr-kamrul-ahsan-dental', hospitalId: 'labaid-dhanmondi', dayOfWeek: 0, startTime: '16:00', endTime: '20:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 25 },
  { id: 'cs-165', doctorId: 'dr-kamrul-ahsan-dental', hospitalId: 'labaid-dhanmondi', dayOfWeek: 2, startTime: '16:00', endTime: '20:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 25 },
  { id: 'cs-166', doctorId: 'dr-kamrul-ahsan-dental', hospitalId: 'labaid-dhanmondi', dayOfWeek: 5, startTime: '16:00', endTime: '20:00', consultationFee: 800, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 25 },

  // ============================================
  // PLASTIC SURGERY (New)
  // ============================================
  { id: 'cs-170', doctorId: 'dr-samanta-lal-sen', hospitalId: 'dmch', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-171', doctorId: 'dr-samanta-lal-sen', hospitalId: 'dmch', dayOfWeek: 3, startTime: '10:00', endTime: '14:00', consultationFee: 2000, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },
  { id: 'cs-172', doctorId: 'dr-shafquat-hussain-khundkar', hospitalId: 'dmch', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-173', doctorId: 'dr-shafquat-hussain-khundkar', hospitalId: 'dmch', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // ============================================
  // MISSING SCHEDULES FOR EXISTING DOCTORS
  // ============================================
  // Prof. Dr. Fatema Begum (Cardiology)
  { id: 'cs-180', doctorId: 'dr-fatema-begum-cardio', hospitalId: 'nicvd', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-181', doctorId: 'dr-fatema-begum-cardio', hospitalId: 'nicvd', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },

  // Prof. Dr. Hasan Zahidur Rahman (Neurology)
  { id: 'cs-182', doctorId: 'dr-hasan-zahidur', hospitalId: 'dmch', dayOfWeek: 0, startTime: '14:00', endTime: '17:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-183', doctorId: 'dr-hasan-zahidur', hospitalId: 'dmch', dayOfWeek: 3, startTime: '14:00', endTime: '17:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // Prof. Dr. Faruque Ahmed (Gastro)
  { id: 'cs-184', doctorId: 'dr-faruque-ahmed', hospitalId: 'bsmmu', dayOfWeek: 2, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-185', doctorId: 'dr-faruque-ahmed', hospitalId: 'popular-dhanmondi', dayOfWeek: 5, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Kazi Shamim (Orthopedics)
  { id: 'cs-186', doctorId: 'dr-kazi-shamim', hospitalId: 'nitor', dayOfWeek: 0, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },
  { id: 'cs-187', doctorId: 'dr-kazi-shamim', hospitalId: 'nitor', dayOfWeek: 3, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 35 },

  // Prof. Dr. Armana Ahmed (Pediatrics)
  { id: 'cs-188', doctorId: 'dr-armana-ahmed', hospitalId: 'dmch', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 40 },
  { id: 'cs-189', doctorId: 'dr-armana-ahmed', hospitalId: 'evercare', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 20 },

  // Prof. Dr. Belayat Hossain (ENT)
  { id: 'cs-190', doctorId: 'dr-belayat-hossain', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-191', doctorId: 'dr-belayat-hossain', hospitalId: 'united', dayOfWeek: 3, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. M.H. Rashid (Psychiatry)
  { id: 'cs-192', doctorId: 'dr-mh-rashid', hospitalId: 'nimh', dayOfWeek: 0, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-193', doctorId: 'dr-mh-rashid', hospitalId: 'nimh', dayOfWeek: 3, startTime: '10:00', endTime: '14:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // Prof. Dr. Zahid Hassan (Surgery)
  { id: 'cs-194', doctorId: 'dr-zahid-hasan-surgery', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-195', doctorId: 'dr-zahid-hasan-surgery', hospitalId: 'bsmmu', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },

  // Prof. Dr. Deen Mohd. Noorul Huq (Ophthalmology)
  { id: 'cs-196', doctorId: 'dr-deen-mohd-noorul', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '09:00', endTime: '12:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 25 },
  { id: 'cs-197', doctorId: 'dr-deen-mohd-noorul', hospitalId: 'square', dayOfWeek: 3, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. ATA Ur Rahman (Urology)
  { id: 'cs-198', doctorId: 'dr-ata-ur-rahman', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1200, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 25 },
  { id: 'cs-199', doctorId: 'dr-ata-ur-rahman', hospitalId: 'united', dayOfWeek: 4, startTime: '17:00', endTime: '20:00', consultationFee: 1500, appointmentRequired: true, serialSystem: 'online' as const, maxPatients: 15 },

  // Prof. Dr. Minhaj Rahim (Rheumatology)
  { id: 'cs-200', doctorId: 'dr-minhaj-rahim', hospitalId: 'bsmmu', dayOfWeek: 0, startTime: '14:00', endTime: '17:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },
  { id: 'cs-201', doctorId: 'dr-minhaj-rahim', hospitalId: 'bsmmu', dayOfWeek: 3, startTime: '14:00', endTime: '17:00', consultationFee: 1200, appointmentRequired: true, serialSystem: 'both' as const, maxPatients: 20 },

  // Prof. Dr. Badrunnesa Ahmed (Physical Medicine)
  { id: 'cs-202', doctorId: 'dr-badrunnesa-ahmed', hospitalId: 'bsmmu', dayOfWeek: 1, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
  { id: 'cs-203', doctorId: 'dr-badrunnesa-ahmed', hospitalId: 'bsmmu', dayOfWeek: 4, startTime: '09:00', endTime: '13:00', consultationFee: 1000, appointmentRequired: false, serialSystem: 'spot' as const, maxPatients: 30 },
];

