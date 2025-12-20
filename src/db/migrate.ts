import { pool } from './connection.js';

console.log('🔄 Running migrations...');

const client = await pool.connect();

try {
  // Drop existing tables in reverse dependency order
  console.log('🗑️  Dropping existing tables...');
  await client.query(`
    DROP TABLE IF EXISTS doctor_reviews CASCADE;
    DROP TABLE IF EXISTS doctor_insurance CASCADE;
    DROP TABLE IF EXISTS chamber_schedules CASCADE;
    DROP TABLE IF EXISTS doctors CASCADE;
    DROP TABLE IF EXISTS hospitals CASCADE;
    DROP TABLE IF EXISTS insurance_providers CASCADE;
    DROP TABLE IF EXISTS districts CASCADE;
    DROP TABLE IF EXISTS divisions CASCADE;
    DROP TABLE IF EXISTS specialties CASCADE;
  `);
  console.log('   ✓ Dropped existing tables');

  console.log('📝 Creating tables...');
  await client.query(`
    -- ============================================
    -- Core Tables
    -- ============================================
    
    CREATE TABLE divisions (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_bn TEXT NOT NULL
    );

    CREATE TABLE districts (
      id TEXT PRIMARY KEY,
      division_id TEXT NOT NULL REFERENCES divisions(id),
      name_en TEXT NOT NULL,
      name_bn TEXT NOT NULL
    );

    CREATE TABLE specialties (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_bn TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT
    );

    -- ============================================
    -- Insurance Providers
    -- ============================================
    
    CREATE TABLE insurance_providers (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_bn TEXT,
      type TEXT NOT NULL CHECK (type IN ('health', 'corporate', 'government')),
      website TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );

    -- ============================================
    -- Hospitals with Emergency Support
    -- ============================================
    
    CREATE TABLE hospitals (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_bn TEXT,
      type TEXT NOT NULL CHECK (type IN ('government', 'private', 'clinic', 'diagnostic')),
      division_id TEXT REFERENCES divisions(id),
      district_id TEXT REFERENCES districts(id),
      area TEXT,
      address TEXT,
      phone TEXT,
      website TEXT,
      -- Emergency features
      has_emergency BOOLEAN DEFAULT FALSE,
      is_24_hours BOOLEAN DEFAULT FALSE,
      emergency_phone TEXT,
      has_ambulance BOOLEAN DEFAULT FALSE,
      -- Additional info
      bed_count INTEGER,
      established_year INTEGER
    );

    -- ============================================
    -- Doctors with Ratings
    -- ============================================
    
    CREATE TABLE doctors (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_bn TEXT,
      bmdc_reg_no TEXT UNIQUE,
      qualifications TEXT NOT NULL,
      primary_specialty_id TEXT NOT NULL REFERENCES specialties(id),
      sub_specialties TEXT,
      designation TEXT,
      experience_years INTEGER,
      gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
      languages TEXT NOT NULL DEFAULT '["Bengali", "English"]',
      consultation_fee_min INTEGER,
      consultation_fee_max INTEGER,
      telemedicine_available BOOLEAN DEFAULT FALSE,
      profile_image_url TEXT,
      bio TEXT,
      phone TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      -- Rating aggregates
      avg_rating REAL,
      total_reviews INTEGER DEFAULT 0
    );

    -- ============================================
    -- Doctor-Insurance Junction
    -- ============================================
    
    CREATE TABLE doctor_insurance (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL REFERENCES doctors(id),
      insurance_provider_id TEXT NOT NULL REFERENCES insurance_providers(id),
      panel_number TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );

    -- ============================================
    -- Doctor Reviews
    -- ============================================
    
    CREATE TABLE doctor_reviews (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL REFERENCES doctors(id),
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      patient_name TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      is_approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ============================================
    -- Chamber Schedules
    -- ============================================
    
    CREATE TABLE chamber_schedules (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL REFERENCES doctors(id),
      hospital_id TEXT NOT NULL REFERENCES hospitals(id),
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      consultation_fee INTEGER,
      appointment_required BOOLEAN DEFAULT FALSE,
      serial_system TEXT DEFAULT 'spot' CHECK (serial_system IN ('online', 'spot', 'both')),
      max_patients INTEGER,
      is_active BOOLEAN DEFAULT TRUE
    );

    -- ============================================
    -- Indexes for Performance
    -- ============================================
    
    -- Doctor indexes
    CREATE INDEX idx_doctors_specialty ON doctors(primary_specialty_id);
    CREATE INDEX idx_doctors_name ON doctors(name_en);
    CREATE INDEX idx_doctors_fee ON doctors(consultation_fee_min, consultation_fee_max);
    CREATE INDEX idx_doctors_rating ON doctors(avg_rating);
    
    -- Hospital indexes
    CREATE INDEX idx_hospitals_division ON hospitals(division_id);
    CREATE INDEX idx_hospitals_district ON hospitals(district_id);
    CREATE INDEX idx_hospitals_emergency ON hospitals(has_emergency);
    CREATE INDEX idx_hospitals_24h ON hospitals(is_24_hours);
    
    -- Chamber schedule indexes
    CREATE INDEX idx_chamber_doctor ON chamber_schedules(doctor_id);
    CREATE INDEX idx_chamber_hospital ON chamber_schedules(hospital_id);
    CREATE INDEX idx_chamber_day ON chamber_schedules(day_of_week);
    
    -- Insurance indexes
    CREATE INDEX idx_doctor_insurance_doctor ON doctor_insurance(doctor_id);
    CREATE INDEX idx_doctor_insurance_provider ON doctor_insurance(insurance_provider_id);
    
    -- Review indexes
    CREATE INDEX idx_reviews_doctor ON doctor_reviews(doctor_id);
    CREATE INDEX idx_reviews_rating ON doctor_reviews(rating);
  `);

  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  throw error;
} finally {
  client.release();
  await pool.end();
}
