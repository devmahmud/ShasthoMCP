import { db, pool } from './connection.js';
import {
  divisions,
  districts,
  specialties,
  hospitals,
  doctors,
  chamberSchedules,
  insuranceProviders,
  doctorInsurance,
} from './schema.js';

import { divisionsData, districtsData } from './data/districts.js';
import { hospitalsData } from './data/hospitals.js';
import { doctorsData } from './data/doctors.js';
import { chamberSchedulesData } from './data/schedules.js';
import { insuranceProvidersData, doctorInsuranceData } from './data/insurance.js';
import { specialtiesData } from './data/specialties.js';

// ============================================
// Main Seed Function
// ============================================
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await db.delete(doctorInsurance);
    await db.delete(chamberSchedules);
    await db.delete(doctors);
    await db.delete(hospitals);
    await db.delete(districts);
    await db.delete(divisions);
    await db.delete(specialties);
    await db.delete(insuranceProviders);
    console.log('   ✓ Cleared existing data\n');

    // Insert Divisions
    console.log('📍 Inserting divisions...');
    await db.insert(divisions).values(divisionsData);
    console.log(`   ✓ Inserted ${divisionsData.length} divisions\n`);

    // Insert Districts
    console.log('📍 Inserting districts...');
    await db.insert(districts).values(districtsData);
    console.log(`   ✓ Inserted ${districtsData.length} districts\n`);

    // Insert Specialties
    console.log('🏥 Inserting specialties...');
    await db.insert(specialties).values(specialtiesData);
    console.log(`   ✓ Inserted ${specialtiesData.length} specialties\n`);

    // Insert Insurance Providers
    console.log('🏦 Inserting insurance providers...');
    await db.insert(insuranceProviders).values(insuranceProvidersData);
    console.log(`   ✓ Inserted ${insuranceProvidersData.length} insurance providers\n`);

    // Insert Hospitals
    console.log('🏥 Inserting hospitals...');
    await db.insert(hospitals).values(hospitalsData);
    console.log(`   ✓ Inserted ${hospitalsData.length} hospitals\n`);

    // Insert Doctors
    console.log('👨‍⚕️ Inserting doctors...');
    const doctorsToInsert = doctorsData.map((doc) => ({
      ...doc,
      qualifications: JSON.stringify(doc.qualifications),
      subSpecialties: doc.subSpecialties ? JSON.stringify(doc.subSpecialties) : null,
      languages: JSON.stringify(doc.languages),
    }));
    await db.insert(doctors).values(doctorsToInsert);
    console.log(`   ✓ Inserted ${doctorsData.length} doctors\n`);

    // Insert Chamber Schedules
    console.log('📅 Inserting chamber schedules...');
    await db.insert(chamberSchedules).values(chamberSchedulesData);
    console.log(`   ✓ Inserted ${chamberSchedulesData.length} chamber schedules\n`);

    // Insert Doctor-Insurance relationships
    console.log('🔗 Inserting doctor-insurance relationships...');
    await db.insert(doctorInsurance).values(doctorInsuranceData);
    console.log(`   ✓ Inserted ${doctorInsuranceData.length} doctor-insurance relationships\n`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${divisionsData.length} divisions`);
    console.log(`   • ${districtsData.length} districts`);
    console.log(`   • ${specialtiesData.length} specialties`);
    console.log(`   • ${insuranceProvidersData.length} insurance providers`);
    console.log(`   • ${hospitalsData.length} hospitals`);
    console.log(`   • ${doctorsData.length} doctors`);
    console.log(`   • ${chamberSchedulesData.length} chamber schedules`);
    console.log(`   • ${doctorInsuranceData.length} doctor-insurance links`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seed
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
