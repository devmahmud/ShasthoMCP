import {
  searchDoctors,
  getDoctorById,
  findDoctorsBySpecialty,
  findDoctorsByLocation,
  findDoctorsByHospital,
  findDoctorsAvailableToday,
  getChamberSchedule,
  listSpecialties,
  getSpecialtyByName,
  listHospitals,
  listDivisions,
  getDivisionByName,
  findDoctorsBySymptoms,
  findDoctorsByFeeRange,
  findEmergencyHospitals,
  listInsuranceProviders,
  findDoctorsByInsurance,
  getTopRatedDoctors,
} from '../db/queries.js';
import {
  formatDoctor,
  formatSchedule,
  formatInsuranceNetwork,
  createTextResponse,
  createErrorResponse,
} from '../formatters.js';
import { getDayName, type DoctorWithRelations } from '../types.js';
import { toolSchemas, validate, type ToolSchemaName } from '../validation.js';
import type { ToolName } from './definitions.js';

type ToolArgs = Record<string, unknown>;

export async function handleToolCall(
  name: ToolName | string,
  args: ToolArgs
): Promise<{ content: { type: string; text: string }[]; isError?: boolean }> {
  // Validate input if schema exists
  if (name in toolSchemas) {
    const schema = toolSchemas[name as ToolSchemaName];
    const validation = validate(schema, args);
    if (!validation.success) {
      return createErrorResponse(`Invalid input: ${validation.error}`, true);
    }
    args = validation.data as ToolArgs;
  }

  switch (name) {
    case 'search_doctors':
      return handleSearchDoctors(args);
    case 'get_doctor_details':
      return handleGetDoctorDetails(args);
    case 'find_doctors_by_specialty':
      return handleFindDoctorsBySpecialty(args);
    case 'find_doctors_by_location':
      return handleFindDoctorsByLocation(args);
    case 'find_doctors_by_hospital':
      return handleFindDoctorsByHospital(args);
    case 'find_doctors_available_today':
      return handleFindDoctorsAvailableToday(args);
    case 'get_chamber_schedule':
      return handleGetChamberSchedule(args);
    case 'list_specialties':
      return handleListSpecialties();
    case 'list_divisions':
      return handleListDivisions();
    case 'list_hospitals':
      return handleListHospitals(args);
    case 'find_doctors_by_symptoms':
      return handleFindDoctorsBySymptoms(args);
    case 'find_doctors_by_fee':
      return handleFindDoctorsByFee(args);
    case 'find_emergency_hospitals':
      return handleFindEmergencyHospitals(args);
    case 'list_insurance_providers':
      return handleListInsuranceProviders();
    case 'find_doctors_by_insurance':
      return handleFindDoctorsByInsurance(args);
    case 'get_top_rated_doctors':
      return handleGetTopRatedDoctors(args);
    default:
      return createErrorResponse(`Unknown tool: ${name}`, true);
  }
}

// ============================================
// Individual Handlers
// ============================================

async function handleSearchDoctors(args: ToolArgs) {
  const { query, limit = 20, offset = 0 } = args as { query: string; limit: number; offset: number };
  const results = await searchDoctors(query, limit, offset);

  if (results.length === 0 && offset === 0) {
    return createErrorResponse(`No doctors found matching "${query}". Try a different search term.`);
  }

  return createTextResponse({
    count: results.length,
    pagination: {
      limit,
      offset,
      hasMore: results.length === limit,
    },
    doctors: results.map(formatDoctor),
  });
}

async function handleGetDoctorDetails(args: ToolArgs) {
  const { doctor_id } = args as { doctor_id: string };
  const doctor = await getDoctorById(doctor_id);

  if (!doctor) {
    return createErrorResponse(`Doctor with ID "${doctor_id}" not found.`);
  }

  const formatted = formatDoctor(doctor as DoctorWithRelations);
  const schedules = doctor.chamberSchedules.map((s) => formatSchedule(s));
  const insuranceNetworks = doctor.insuranceNetworks?.map((n) => formatInsuranceNetwork(n));

  return createTextResponse({
    ...formatted,
    chamberSchedules: schedules,
    insuranceNetworks: insuranceNetworks || [],
  });
}

async function handleFindDoctorsBySpecialty(args: ToolArgs) {
  const { specialty, division, limit = 20 } = args as {
    specialty: string;
    division?: string;
    limit: number;
  };
  const specialtyObj = await getSpecialtyByName(specialty);
  if (!specialtyObj) {
    const allSpecialties = await listSpecialties();
    return createErrorResponse(
      `Specialty "${specialty}" not found. Available specialties:\n${allSpecialties
        .map((s) => `- ${s.nameEn} (${s.nameBn})`)
        .join('\n')}`
    );
  }

  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const results = await findDoctorsBySpecialty(specialtyObj.id, divisionId, limit);

  if (results.length === 0) {
    return createErrorResponse(
      `No doctors found for specialty "${specialty}"${division ? ` in ${division}` : ''}.`
    );
  }

  return createTextResponse({
    specialty: specialtyObj.nameEn,
    count: results.length,
    doctors: results.map((doc) => ({
      ...formatDoctor(doc),
      chambers: doc.chamberSchedules.map((s) => ({
        hospital: s.hospital.nameEn,
        area: s.hospital.area,
        division: s.hospital.division?.nameEn,
      })),
    })),
  });
}

async function handleFindDoctorsByLocation(args: ToolArgs) {
  const { division, district, limit = 20 } = args as {
    division: string;
    district?: string;
    limit: number;
  };
  const divisionObj = await getDivisionByName(division);
  if (!divisionObj) {
    const allDivisions = await listDivisions();
    return createErrorResponse(
      `Division "${division}" not found. Available divisions:\n${allDivisions
        .map((d) => `- ${d.nameEn} (${d.nameBn})`)
        .join('\n')}`
    );
  }

  let districtId: string | undefined;
  if (district) {
    const districtObj = divisionObj.districts.find(
      (d) =>
        d.nameEn.toLowerCase().includes(district.toLowerCase()) || d.nameBn?.includes(district)
    );
    districtId = districtObj?.id;
  }

  const results = await findDoctorsByLocation(divisionObj.id, districtId, limit);

  if (results.length === 0) {
    return createErrorResponse(`No doctors found in ${division}${district ? `, ${district}` : ''}.`);
  }

  return createTextResponse({
    location: {
      division: divisionObj.nameEn,
      district: district || 'All districts',
    },
    count: results.length,
    doctors: results,
  });
}

async function handleFindDoctorsByHospital(args: ToolArgs) {
  const { hospital_name } = args as { hospital_name: string };
  const results = await findDoctorsByHospital(hospital_name);

  if (results.length === 0) {
    return createErrorResponse(`No hospital found matching "${hospital_name}".`);
  }

  return createTextResponse(results);
}

async function handleFindDoctorsAvailableToday(args: ToolArgs) {
  const { specialty, division } = args as { specialty?: string; division?: string };
  let specialtyId: string | undefined;
  if (specialty) {
    const specialtyObj = await getSpecialtyByName(specialty);
    specialtyId = specialtyObj?.id;
  }

  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const today = new Date();
  const dayName = getDayName(today.getDay());
  const results = await findDoctorsAvailableToday(specialtyId, divisionId);

  if (results.length === 0) {
    return createErrorResponse(
      `No doctors available today (${dayName})${specialty ? ` for ${specialty}` : ''}${
        division ? ` in ${division}` : ''
      }.`
    );
  }

  return createTextResponse({
    today: dayName,
    date: today.toISOString().split('T')[0],
    count: results.length,
    doctors: results,
  });
}

async function handleGetChamberSchedule(args: ToolArgs) {
  const { doctor_id } = args as { doctor_id: string };
  const doctor = await getDoctorById(doctor_id);

  if (!doctor) {
    return createErrorResponse(`Doctor with ID "${doctor_id}" not found.`);
  }

  const schedules = await getChamberSchedule(doctor_id);

  if (schedules.length === 0) {
    return createErrorResponse(`No chamber schedules found for ${doctor.nameEn}.`);
  }

  const byDay = schedules.reduce(
    (acc, s) => {
      if (!acc[s.day]) acc[s.day] = [];
      acc[s.day].push(s);
      return acc;
    },
    {} as Record<string, typeof schedules>
  );

  return createTextResponse({
    doctor: {
      name: doctor.nameEn,
      nameBn: doctor.nameBn,
      specialty: doctor.primarySpecialty?.nameEn,
    },
    weeklySchedule: byDay,
  });
}

async function handleListSpecialties() {
  const results = await listSpecialties();

  type SpecialtyInfo = {
    id: string;
    nameEn: string;
    nameBn: string;
    description: string | null;
  };
  const byCategory = results.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push({
        id: s.id,
        nameEn: s.nameEn,
        nameBn: s.nameBn,
        description: s.description,
      });
      return acc;
    },
    {} as Record<string, SpecialtyInfo[]>
  );

  return createTextResponse({
    totalSpecialties: results.length,
    byCategory,
  });
}

async function handleListDivisions() {
  const results = await listDivisions();

  const formatted = results.map((d) => ({
    id: d.id,
    nameEn: d.nameEn,
    nameBn: d.nameBn,
    districts: d.districts.map((dist) => ({
      id: dist.id,
      nameEn: dist.nameEn,
      nameBn: dist.nameBn,
    })),
  }));

  return createTextResponse({
    totalDivisions: formatted.length,
    divisions: formatted,
  });
}

async function handleListHospitals(args: ToolArgs) {
  const { division, type } = args as {
    division?: string;
    type?: 'government' | 'private' | 'clinic' | 'diagnostic';
  };
  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const results = await listHospitals(divisionId, type);

  const formatted = results.map((h) => ({
    id: h.id,
    nameEn: h.nameEn,
    nameBn: h.nameBn,
    type: h.type,
    division: h.division?.nameEn,
    district: h.district?.nameEn,
    area: h.area,
    address: h.address,
    phone: h.phone,
    website: h.website,
  }));

  return createTextResponse({
    count: formatted.length,
    hospitals: formatted,
  });
}

async function handleFindDoctorsBySymptoms(args: ToolArgs) {
  const { symptoms, division, limit = 10 } = args as {
    symptoms: string;
    division?: string;
    limit: number;
  };
  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const result = await findDoctorsBySymptoms(symptoms, divisionId, limit);

  interface SymptomResponse {
    query: string;
    matchedSymptoms: string[];
    urgency: string;
    suggestedSpecialties: typeof result.suggestedSpecialties;
    importantAdvice?: string;
    warning?: string;
    doctorCount: number;
    doctors: typeof result.doctors;
  }

  const response: SymptomResponse = {
    query: symptoms,
    matchedSymptoms: result.matchedSymptoms || [],
    urgency: result.urgency,
    suggestedSpecialties: result.suggestedSpecialties,
    doctorCount: result.doctors.length,
    doctors: result.doctors,
  };

  if (result.advice) {
    response.importantAdvice = result.advice;
  }

  if (result.urgency === 'urgent' || result.urgency === 'emergency') {
    response.warning =
      '⚠️ Your symptoms may require urgent medical attention. Please seek care promptly.';
  }

  return createTextResponse(response);
}

async function handleFindDoctorsByFee(args: ToolArgs) {
  const { min_fee, max_fee, specialty, division, limit = 20 } = args as {
    min_fee?: number;
    max_fee?: number;
    specialty?: string;
    division?: string;
    limit: number;
  };
  let specialtyId: string | undefined;
  if (specialty) {
    const specialtyObj = await getSpecialtyByName(specialty);
    specialtyId = specialtyObj?.id;
  }

  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const results = await findDoctorsByFeeRange(min_fee, max_fee, specialtyId, divisionId, limit);

  if (results.length === 0) {
    return createErrorResponse(
      `No doctors found with fee range ${min_fee || 0} - ${max_fee || 'any'} Taka.`
    );
  }

  return createTextResponse({
    feeRange: {
      min: min_fee || 'any',
      max: max_fee || 'any',
    },
    count: results.length,
    doctors: results,
  });
}

async function handleFindEmergencyHospitals(args: ToolArgs) {
  const { division, district } = args as { division?: string; district?: string };
  let divisionId: string | undefined;
  let districtId: string | undefined;

  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;

    if (district && divisionObj) {
      const districtObj = divisionObj.districts.find(
        (d) =>
          d.nameEn.toLowerCase().includes(district.toLowerCase()) || d.nameBn?.includes(district)
      );
      districtId = districtObj?.id;
    }
  }

  const results = await findEmergencyHospitals(divisionId, districtId);

  if (results.length === 0) {
    return createErrorResponse('No emergency hospitals found for the specified location.');
  }

  return createTextResponse({
    message: '🚨 Emergency Hospitals with 24/7 services',
    location: division || 'All Bangladesh',
    count: results.length,
    hospitals: results,
  });
}

async function handleListInsuranceProviders() {
  const results = await listInsuranceProviders();

  return createTextResponse({
    count: results.length,
    providers: results.map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameBn: p.nameBn,
      type: p.type,
      phone: p.phone,
      website: p.website,
    })),
  });
}

async function handleFindDoctorsByInsurance(args: ToolArgs) {
  const { insurance_provider, specialty, limit = 20 } = args as {
    insurance_provider: string;
    specialty?: string;
    limit: number;
  };
  const providers = await listInsuranceProviders();
  const provider = providers.find(
    (p) =>
      p.id.toLowerCase() === insurance_provider.toLowerCase() ||
      p.nameEn.toLowerCase().includes(insurance_provider.toLowerCase())
  );

  if (!provider) {
    return createErrorResponse(
      `Insurance provider "${insurance_provider}" not found. Available providers:\n${providers
        .map((p) => `- ${p.nameEn} (${p.id})`)
        .join('\n')}`
    );
  }

  let specialtyId: string | undefined;
  if (specialty) {
    const specialtyObj = await getSpecialtyByName(specialty);
    specialtyId = specialtyObj?.id;
  }

  const results = await findDoctorsByInsurance(provider.id, specialtyId, limit);

  if (results.length === 0) {
    return createErrorResponse(
      `No doctors found accepting ${provider.nameEn} insurance${specialty ? ` for ${specialty}` : ''}.`
    );
  }

  return createTextResponse({
    insuranceProvider: provider.nameEn,
    count: results.length,
    doctors: results,
  });
}

async function handleGetTopRatedDoctors(args: ToolArgs) {
  const { specialty, division, limit = 10 } = args as {
    specialty?: string;
    division?: string;
    limit: number;
  };
  let specialtyId: string | undefined;
  if (specialty) {
    const specialtyObj = await getSpecialtyByName(specialty);
    specialtyId = specialtyObj?.id;
  }

  let divisionId: string | undefined;
  if (division) {
    const divisionObj = await getDivisionByName(division);
    divisionId = divisionObj?.id;
  }

  const results = await getTopRatedDoctors(specialtyId, divisionId, limit);

  if (results.length === 0) {
    return createErrorResponse(
      'No highly-rated doctors found for the specified criteria. Note: Rating data may be limited.'
    );
  }

  return createTextResponse({
    message: '⭐ Top Rated Doctors',
    count: results.length,
    doctors: results,
  });
}
