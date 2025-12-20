#!/usr/bin/env tsx
/**
 * Data Validation Script
 * Run: npx tsx src/db/validate-data.ts
 * 
 * Validates data integrity before seeding:
 * - Checks for missing references (doctor → specialty, hospital → district, etc.)
 * - Checks for duplicate IDs
 * - Reports any issues found
 */

import { divisionsData, districtsData } from './data/districts.js';
import { hospitalsData } from './data/hospitals.js';
import { doctorsData } from './data/doctors.js';
import { chamberSchedulesData } from './data/schedules.js';

// Color helpers for console output
const colors = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
};

// Specialties that should exist
const validSpecialties = [
  'medicine', 'cardiology', 'neurology', 'gastroenterology', 'pulmonology',
  'nephrology', 'endocrinology', 'rheumatology', 'dermatology', 'psychiatry',
  'pediatrics', 'gynecology', 'general-surgery', 'orthopedics', 'cardiac-surgery',
  'neurosurgery', 'urology', 'ent', 'ophthalmology', 'oncology', 'hematology',
  'physical-medicine', 'dentistry', 'plastic-surgery'
];

let errors: string[] = [];
let warnings: string[] = [];

function checkDuplicateIds<T extends { id: string }>(items: T[], name: string) {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      errors.push(`Duplicate ${name} ID: ${item.id}`);
    }
    ids.add(item.id);
  }
}

function validateDistricts() {
  console.log(colors.blue('\n📍 Validating Districts...'));
  
  const divisionIds = new Set(divisionsData.map(d => d.id));
  
  for (const district of districtsData) {
    if (!divisionIds.has(district.divisionId)) {
      errors.push(`District "${district.nameEn}" references unknown division: ${district.divisionId}`);
    }
  }
  
  checkDuplicateIds(districtsData, 'district');
  console.log(`   Checked ${districtsData.length} districts`);
}

function validateHospitals() {
  console.log(colors.blue('\n🏥 Validating Hospitals...'));
  
  const divisionIds = new Set(divisionsData.map(d => d.id));
  const districtIds = new Set(districtsData.map(d => d.id));
  
  for (const hospital of hospitalsData) {
    if (hospital.divisionId && !divisionIds.has(hospital.divisionId)) {
      errors.push(`Hospital "${hospital.nameEn}" references unknown division: ${hospital.divisionId}`);
    }
    if (hospital.districtId && !districtIds.has(hospital.districtId)) {
      errors.push(`Hospital "${hospital.nameEn}" references unknown district: ${hospital.districtId}`);
    }
    if (!hospital.phone) {
      warnings.push(`Hospital "${hospital.nameEn}" has no phone number`);
    }
  }
  
  checkDuplicateIds(hospitalsData, 'hospital');
  console.log(`   Checked ${hospitalsData.length} hospitals`);
}

function validateDoctors() {
  console.log(colors.blue('\n👨‍⚕️ Validating Doctors...'));
  
  for (const doctor of doctorsData) {
    if (!validSpecialties.includes(doctor.primarySpecialtyId)) {
      errors.push(`Doctor "${doctor.nameEn}" has unknown specialty: ${doctor.primarySpecialtyId}`);
    }
    if (!doctor.bmdcRegNo) {
      warnings.push(`Doctor "${doctor.nameEn}" has no BMDC registration number`);
    }
    if (doctor.qualifications.length === 0) {
      errors.push(`Doctor "${doctor.nameEn}" has no qualifications`);
    }
    if (!doctor.experienceYears) {
      warnings.push(`Doctor "${doctor.nameEn}" has no experience years set`);
    }
  }
  
  checkDuplicateIds(doctorsData, 'doctor');
  console.log(`   Checked ${doctorsData.length} doctors`);
}

function validateSchedules() {
  console.log(colors.blue('\n📅 Validating Chamber Schedules...'));
  
  const doctorIds = new Set(doctorsData.map(d => d.id));
  const hospitalIds = new Set(hospitalsData.map(h => h.id));
  
  for (const schedule of chamberSchedulesData) {
    if (!doctorIds.has(schedule.doctorId)) {
      errors.push(`Schedule "${schedule.id}" references unknown doctor: ${schedule.doctorId}`);
    }
    if (!hospitalIds.has(schedule.hospitalId)) {
      errors.push(`Schedule "${schedule.id}" references unknown hospital: ${schedule.hospitalId}`);
    }
    if (schedule.dayOfWeek < 0 || schedule.dayOfWeek > 6) {
      errors.push(`Schedule "${schedule.id}" has invalid dayOfWeek: ${schedule.dayOfWeek}`);
    }
  }
  
  checkDuplicateIds(chamberSchedulesData, 'schedule');
  console.log(`   Checked ${chamberSchedulesData.length} schedules`);
}

function printSummary() {
  console.log(colors.blue('\n═══════════════════════════════════════════════════'));
  console.log(colors.blue('📊 DATA SUMMARY'));
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  console.log(`   Divisions:  ${divisionsData.length}`);
  console.log(`   Districts:  ${districtsData.length}`);
  console.log(`   Hospitals:  ${hospitalsData.length}`);
  console.log(`   Doctors:    ${doctorsData.length}`);
  console.log(`   Schedules:  ${chamberSchedulesData.length}`);
  
  // Check doctors without schedules
  const doctorsWithSchedules = new Set(chamberSchedulesData.map(s => s.doctorId));
  const doctorsWithoutSchedules = doctorsData.filter(d => !doctorsWithSchedules.has(d.id));
  
  if (doctorsWithoutSchedules.length > 0) {
    console.log(colors.yellow(`\n⚠️  ${doctorsWithoutSchedules.length} doctors have no chamber schedules:`));
    doctorsWithoutSchedules.forEach(d => {
      console.log(colors.yellow(`   - ${d.nameEn}`));
    });
  }
  
  // Division coverage
  console.log('\n📍 Division Coverage:');
  const hospitalsByDivision = new Map<string, number>();
  hospitalsData.forEach(h => {
    if (h.divisionId) {
      hospitalsByDivision.set(h.divisionId, (hospitalsByDivision.get(h.divisionId) || 0) + 1);
    }
  });
  
  divisionsData.forEach(div => {
    const count = hospitalsByDivision.get(div.id) || 0;
    const status = count > 0 ? colors.green(`✓ ${count} hospitals`) : colors.red('✗ No hospitals');
    console.log(`   ${div.nameEn.padEnd(15)} ${status}`);
  });
  
  // Specialty coverage
  console.log('\n🏥 Specialty Coverage:');
  const doctorsBySpecialty = new Map<string, number>();
  doctorsData.forEach(d => {
    doctorsBySpecialty.set(d.primarySpecialtyId, (doctorsBySpecialty.get(d.primarySpecialtyId) || 0) + 1);
  });
  
  validSpecialties.forEach(spec => {
    const count = doctorsBySpecialty.get(spec) || 0;
    const status = count > 0 ? colors.green(`✓ ${count} doctors`) : colors.yellow(`⚠ No doctors`);
    console.log(`   ${spec.padEnd(20)} ${status}`);
  });
}

function main() {
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  console.log(colors.blue('🔍 DOCTOR MCP DATA VALIDATION'));
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  
  validateDistricts();
  validateHospitals();
  validateDoctors();
  validateSchedules();
  printSummary();
  
  console.log(colors.blue('\n═══════════════════════════════════════════════════'));
  console.log(colors.blue('📋 VALIDATION RESULTS'));
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log(colors.green('\n✅ All data is valid! Ready to seed.'));
  } else {
    if (errors.length > 0) {
      console.log(colors.red(`\n❌ ${errors.length} ERRORS found:`));
      errors.forEach(e => console.log(colors.red(`   • ${e}`)));
    }
    
    if (warnings.length > 0) {
      console.log(colors.yellow(`\n⚠️  ${warnings.length} WARNINGS:`));
      warnings.slice(0, 10).forEach(w => console.log(colors.yellow(`   • ${w}`)));
      if (warnings.length > 10) {
        console.log(colors.yellow(`   ... and ${warnings.length - 10} more`));
      }
    }
  }
  
  console.log('');
  
  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();

