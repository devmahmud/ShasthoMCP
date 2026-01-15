import { pgTable, text, integer, boolean, timestamp, real, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// Divisions & Districts
// ============================================
export const divisions = pgTable('divisions', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameBn: text('name_bn').notNull(),
});

export const districts = pgTable('districts', {
  id: text('id').primaryKey(),
  divisionId: text('division_id')
    .notNull()
    .references(() => divisions.id),
  nameEn: text('name_en').notNull(),
  nameBn: text('name_bn').notNull(),
});

// ============================================
// Specialties
// ============================================
export const specialties = pgTable('specialties', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameBn: text('name_bn').notNull(),
  category: text('category').notNull(), // Medicine, Surgery, etc.
  description: text('description'),
});

// ============================================
// Insurance Providers
// ============================================
export const insuranceProviders = pgTable('insurance_providers', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameBn: text('name_bn'),
  type: text('type', {
    enum: ['health', 'corporate', 'government'],
  }).notNull(),
  website: text('website'),
  phone: text('phone'),
  isActive: boolean('is_active').default(true),
});

// ============================================
// Hospitals & Clinics
// ============================================
export const hospitals = pgTable(
  'hospitals',
  {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull(),
    nameBn: text('name_bn'),
    type: text('type', {
      enum: ['government', 'private', 'clinic', 'diagnostic'],
    }).notNull(),
    divisionId: text('division_id').references(() => divisions.id),
    districtId: text('district_id').references(() => districts.id),
    area: text('area'),
    address: text('address'),
    phone: text('phone'),
    website: text('website'),
    // Emergency features
    hasEmergency: boolean('has_emergency').default(false),
    is24Hours: boolean('is_24_hours').default(false),
    emergencyPhone: text('emergency_phone'),
    hasAmbulance: boolean('has_ambulance').default(false),
    // Additional info
    bedCount: integer('bed_count'),
    establishedYear: integer('established_year'),
  },
  (table) => [
    index('hospitals_division_idx').on(table.divisionId),
    index('hospitals_district_idx').on(table.districtId),
    index('hospitals_type_idx').on(table.type),
    index('hospitals_emergency_idx').on(table.hasEmergency),
  ]
);

// ============================================
// Doctors
// ============================================
export const doctors = pgTable(
  'doctors',
  {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull(),
    nameBn: text('name_bn'),
    bmdcRegNo: text('bmdc_reg_no').unique(),
    qualifications: text('qualifications').notNull(), // JSON array stored as text
    primarySpecialtyId: text('primary_specialty_id')
      .notNull()
      .references(() => specialties.id),
    subSpecialties: text('sub_specialties'), // JSON array stored as text
    designation: text('designation'),
    experienceYears: integer('experience_years'),
    gender: text('gender', { enum: ['male', 'female'] }).notNull(),
    languages: text('languages').notNull().default('["Bengali", "English"]'), // JSON array
    consultationFeeMin: integer('consultation_fee_min'),
    consultationFeeMax: integer('consultation_fee_max'),
    telemedicineAvailable: boolean('telemedicine_available').default(false),
    profileImageUrl: text('profile_image_url'),
    bio: text('bio'),
    phone: text('phone'),
    email: text('email'),
    createdAt: timestamp('created_at').defaultNow(),
    // Aggregated ratings (updated by trigger or app logic)
    avgRating: real('avg_rating'),
    totalReviews: integer('total_reviews').default(0),
  },
  (table) => [
    index('doctors_specialty_idx').on(table.primarySpecialtyId),
    index('doctors_rating_idx').on(table.avgRating),
    index('doctors_fee_idx').on(table.consultationFeeMin, table.consultationFeeMax),
  ]
);

// ============================================
// Doctor-Insurance Junction
// ============================================
export const doctorInsurance = pgTable(
  'doctor_insurance',
  {
    id: text('id').primaryKey(),
    doctorId: text('doctor_id')
      .notNull()
      .references(() => doctors.id),
    insuranceProviderId: text('insurance_provider_id')
      .notNull()
      .references(() => insuranceProviders.id),
    panelNumber: text('panel_number'), // Doctor's panel/network number
    isActive: boolean('is_active').default(true),
  },
  (table) => [
    index('doctor_insurance_doctor_idx').on(table.doctorId),
    index('doctor_insurance_provider_idx').on(table.insuranceProviderId),
  ]
);

// ============================================
// Doctor Reviews/Ratings
// ============================================
export const doctorReviews = pgTable(
  'doctor_reviews',
  {
    id: text('id').primaryKey(),
    doctorId: text('doctor_id')
      .notNull()
      .references(() => doctors.id),
    rating: integer('rating').notNull(), // 1-5 stars
    reviewText: text('review_text'),
    patientName: text('patient_name'), // Optional, can be anonymous
    isVerified: boolean('is_verified').default(false),
    isApproved: boolean('is_approved').default(false), // Moderation
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('reviews_doctor_idx').on(table.doctorId),
    index('reviews_approved_idx').on(table.isApproved),
  ]
);

// ============================================
// Chamber Schedules (Doctor's visiting hours)
// ============================================
export const chamberSchedules = pgTable(
  'chamber_schedules',
  {
    id: text('id').primaryKey(),
    doctorId: text('doctor_id')
      .notNull()
      .references(() => doctors.id),
    hospitalId: text('hospital_id')
      .notNull()
      .references(() => hospitals.id),
    dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday, 6=Saturday
    startTime: text('start_time').notNull(), // "09:00"
    endTime: text('end_time').notNull(), // "14:00"
    consultationFee: integer('consultation_fee'),
    appointmentRequired: boolean('appointment_required').default(false),
    serialSystem: text('serial_system', {
      enum: ['online', 'spot', 'both'],
    }).default('spot'),
    maxPatients: integer('max_patients'),
    isActive: boolean('is_active').default(true),
  },
  (table) => [
    index('schedules_doctor_idx').on(table.doctorId),
    index('schedules_hospital_idx').on(table.hospitalId),
    index('schedules_day_idx').on(table.dayOfWeek),
    index('schedules_active_day_idx').on(table.isActive, table.dayOfWeek),
  ]
);

// ============================================
// Relations
// ============================================
export const divisionsRelations = relations(divisions, ({ many }) => ({
  districts: many(districts),
  hospitals: many(hospitals),
}));

export const districtsRelations = relations(districts, ({ one, many }) => ({
  division: one(divisions, {
    fields: [districts.divisionId],
    references: [divisions.id],
  }),
  hospitals: many(hospitals),
}));

export const specialtiesRelations = relations(specialties, ({ many }) => ({
  doctors: many(doctors),
}));

export const insuranceProvidersRelations = relations(insuranceProviders, ({ many }) => ({
  doctorInsurance: many(doctorInsurance),
}));

export const hospitalsRelations = relations(hospitals, ({ one, many }) => ({
  division: one(divisions, {
    fields: [hospitals.divisionId],
    references: [divisions.id],
  }),
  district: one(districts, {
    fields: [hospitals.districtId],
    references: [districts.id],
  }),
  chamberSchedules: many(chamberSchedules),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  primarySpecialty: one(specialties, {
    fields: [doctors.primarySpecialtyId],
    references: [specialties.id],
  }),
  chamberSchedules: many(chamberSchedules),
  reviews: many(doctorReviews),
  insuranceNetworks: many(doctorInsurance),
}));

export const doctorInsuranceRelations = relations(doctorInsurance, ({ one }) => ({
  doctor: one(doctors, {
    fields: [doctorInsurance.doctorId],
    references: [doctors.id],
  }),
  insuranceProvider: one(insuranceProviders, {
    fields: [doctorInsurance.insuranceProviderId],
    references: [insuranceProviders.id],
  }),
}));

export const doctorReviewsRelations = relations(doctorReviews, ({ one }) => ({
  doctor: one(doctors, {
    fields: [doctorReviews.doctorId],
    references: [doctors.id],
  }),
}));

export const chamberSchedulesRelations = relations(chamberSchedules, ({ one }) => ({
  doctor: one(doctors, {
    fields: [chamberSchedules.doctorId],
    references: [doctors.id],
  }),
  hospital: one(hospitals, {
    fields: [chamberSchedules.hospitalId],
    references: [hospitals.id],
  }),
}));

// ============================================
// Type exports
// ============================================
export type Division = typeof divisions.$inferSelect;
export type District = typeof districts.$inferSelect;
export type Specialty = typeof specialties.$inferSelect;
export type InsuranceProvider = typeof insuranceProviders.$inferSelect;
export type Hospital = typeof hospitals.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type DoctorInsurance = typeof doctorInsurance.$inferSelect;
export type DoctorReview = typeof doctorReviews.$inferSelect;
export type ChamberSchedule = typeof chamberSchedules.$inferSelect;
