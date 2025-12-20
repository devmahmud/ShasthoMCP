#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
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
  // New queries
  findDoctorsBySymptoms,
  findDoctorsByFeeRange,
  findEmergencyHospitals,
  listInsuranceProviders,
  findDoctorsByInsurance,
  getDoctorInsuranceNetworks,
  getTopRatedDoctors,
} from './db/queries.js';

// ============================================
// Helper Functions
// ============================================

const formatDoctor = (doctor: any) => {
  const qualifications =
    typeof doctor.qualifications === 'string'
      ? JSON.parse(doctor.qualifications)
      : doctor.qualifications;

  const languages =
    typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : doctor.languages;

  const subSpecialties = doctor.subSpecialties
    ? typeof doctor.subSpecialties === 'string'
      ? JSON.parse(doctor.subSpecialties)
      : doctor.subSpecialties
    : [];

  return {
    id: doctor.id,
    name: {
      english: doctor.nameEn,
      bengali: doctor.nameBn,
    },
    bmdcRegistration: doctor.bmdcRegNo,
    qualifications,
    specialty: doctor.primarySpecialty?.nameEn || doctor.primarySpecialtyId,
    subSpecialties,
    designation: doctor.designation,
    experienceYears: doctor.experienceYears,
    gender: doctor.gender,
    languages,
    consultationFee: {
      min: doctor.consultationFeeMin,
      max: doctor.consultationFeeMax,
    },
    telemedicineAvailable: doctor.telemedicineAvailable,
    bio: doctor.bio,
    contact: {
      phone: doctor.phone,
      email: doctor.email,
    },
  };
};

const getDayName = (dayOfWeek: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

// ============================================
// MCP Server Setup
// ============================================

const server = new Server(
  {
    name: 'doctor-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================
// Tool Definitions
// ============================================

const tools = [
  {
    name: 'search_doctors',
    description: 'Search doctors by name (English or Bengali). Use this to find a specific doctor.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: "Doctor's name to search for (partial match supported)",
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_doctor_details',
    description:
      'Get complete details of a doctor including their chamber schedules, qualifications, insurance networks, and contact information.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        doctor_id: {
          type: 'string',
          description: 'The unique ID of the doctor',
        },
      },
      required: ['doctor_id'],
    },
  },
  {
    name: 'find_doctors_by_specialty',
    description:
      'Find doctors by their medical specialty (e.g., Cardiology, Neurology, Gynecology). Optionally filter by division.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        specialty: {
          type: 'string',
          description: "Medical specialty name (e.g., 'Cardiology', 'Medicine', 'Pediatrics')",
        },
        division: {
          type: 'string',
          description: "Optional: Division name to filter (e.g., 'Dhaka', 'Chittagong')",
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
      },
      required: ['specialty'],
    },
  },
  {
    name: 'find_doctors_by_location',
    description: 'Find doctors available in a specific division or district of Bangladesh.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        division: {
          type: 'string',
          description: "Division name (e.g., 'Dhaka', 'Chittagong', 'Sylhet')",
        },
        district: {
          type: 'string',
          description: 'Optional: District name for more specific search',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
      },
      required: ['division'],
    },
  },
  {
    name: 'find_doctors_by_hospital',
    description: 'Find all doctors who practice at a specific hospital or clinic.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        hospital_name: {
          type: 'string',
          description: 'Hospital or clinic name (partial match supported)',
        },
      },
      required: ['hospital_name'],
    },
  },
  {
    name: 'find_doctors_available_today',
    description: 'Find doctors who are available today (based on current day of week).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        specialty: {
          type: 'string',
          description: 'Optional: Filter by specialty',
        },
        division: {
          type: 'string',
          description: 'Optional: Filter by division',
        },
      },
    },
  },
  {
    name: 'get_chamber_schedule',
    description:
      'Get the complete weekly chamber schedule for a specific doctor, including all hospitals and timings.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        doctor_id: {
          type: 'string',
          description: 'The unique ID of the doctor',
        },
      },
      required: ['doctor_id'],
    },
  },
  {
    name: 'list_specialties',
    description: 'List all available medical specialties in the directory.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'list_divisions',
    description: 'List all divisions and districts of Bangladesh covered in the directory.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'list_hospitals',
    description: 'List hospitals and clinics. Can filter by division and type.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        division: {
          type: 'string',
          description: 'Optional: Filter by division name',
        },
        type: {
          type: 'string',
          enum: ['government', 'private', 'clinic', 'diagnostic'],
          description: 'Optional: Filter by hospital type',
        },
      },
    },
  },
  // ============================================
  // NEW TOOLS
  // ============================================
  {
    name: 'find_doctors_by_symptoms',
    description:
      'Find doctors based on symptoms or health conditions. Describe your symptoms and get matched with appropriate specialists. Works with both English and Bengali.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symptoms: {
          type: 'string',
          description:
            "Describe your symptoms or health condition (e.g., 'chest pain', 'headache', 'বুকে ব্যথা')",
        },
        division: {
          type: 'string',
          description: 'Optional: Preferred division for doctors',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of doctors to return (default: 10)',
        },
      },
      required: ['symptoms'],
    },
  },
  {
    name: 'find_doctors_by_fee',
    description: 'Find doctors within a specific consultation fee range.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        min_fee: {
          type: 'number',
          description: 'Minimum consultation fee in Taka',
        },
        max_fee: {
          type: 'number',
          description: 'Maximum consultation fee in Taka',
        },
        specialty: {
          type: 'string',
          description: 'Optional: Filter by specialty',
        },
        division: {
          type: 'string',
          description: 'Optional: Filter by division',
        },
        limit: {
          type: 'number',
          description: 'Maximum results (default: 20)',
        },
      },
    },
  },
  {
    name: 'find_emergency_hospitals',
    description:
      'Find hospitals with 24/7 emergency services. Use this for urgent medical needs or to find nearby emergency facilities.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        division: {
          type: 'string',
          description: 'Optional: Filter by division',
        },
        district: {
          type: 'string',
          description: 'Optional: Filter by district',
        },
      },
    },
  },
  {
    name: 'list_insurance_providers',
    description: 'List all health insurance providers supported in the directory.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'find_doctors_by_insurance',
    description: 'Find doctors who accept a specific health insurance provider.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        insurance_provider: {
          type: 'string',
          description: "Insurance provider name or ID (e.g., 'Green Delta', 'MetLife')",
        },
        specialty: {
          type: 'string',
          description: 'Optional: Filter by specialty',
        },
        limit: {
          type: 'number',
          description: 'Maximum results (default: 20)',
        },
      },
      required: ['insurance_provider'],
    },
  },
  {
    name: 'get_top_rated_doctors',
    description: 'Get highly rated doctors. Can filter by specialty and division.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        specialty: {
          type: 'string',
          description: 'Optional: Filter by specialty',
        },
        division: {
          type: 'string',
          description: 'Optional: Filter by division',
        },
        limit: {
          type: 'number',
          description: 'Maximum results (default: 10)',
        },
      },
    },
  },
];

// ============================================
// Tool Handlers
// ============================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_doctors': {
        const { query, limit = 20 } = args as { query: string; limit?: number };
        const results = await searchDoctors(query, limit);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No doctors found matching "${query}". Try a different search term.`,
              },
            ],
          };
        }

        const formatted = results.map(formatDoctor);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  count: formatted.length,
                  doctors: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_doctor_details': {
        const { doctor_id } = args as { doctor_id: string };
        const doctor = await getDoctorById(doctor_id);

        if (!doctor) {
          return {
            content: [
              {
                type: 'text',
                text: `Doctor with ID "${doctor_id}" not found.`,
              },
            ],
          };
        }

        const formatted = formatDoctor(doctor);
        const schedules = doctor.chamberSchedules.map((s: any) => ({
          day: getDayName(s.dayOfWeek),
          hospital: {
            name: s.hospital.nameEn,
            type: s.hospital.type,
            area: s.hospital.area,
            address: s.hospital.address,
            division: s.hospital.division?.nameEn,
          },
          timing: `${s.startTime} - ${s.endTime}`,
          fee: s.consultationFee,
          appointmentRequired: s.appointmentRequired,
          serialSystem: s.serialSystem,
        }));

        // Get insurance networks
        const insuranceNetworks = doctor.insuranceNetworks?.map((n: any) => ({
          provider: n.insuranceProvider.nameEn,
          panelNumber: n.panelNumber,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  ...formatted,
                  chamberSchedules: schedules,
                  insuranceNetworks: insuranceNetworks || [],
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_doctors_by_specialty': {
        const {
          specialty,
          division,
          limit = 20,
        } = args as {
          specialty: string;
          division?: string;
          limit?: number;
        };

        const specialtyObj = await getSpecialtyByName(specialty);
        if (!specialtyObj) {
          const allSpecialties = await listSpecialties();
          return {
            content: [
              {
                type: 'text',
                text: `Specialty "${specialty}" not found. Available specialties:\n${allSpecialties
                  .map((s) => `- ${s.nameEn} (${s.nameBn})`)
                  .join('\n')}`,
              },
            ],
          };
        }

        let divisionId: string | undefined;
        if (division) {
          const divisionObj = await getDivisionByName(division);
          divisionId = divisionObj?.id;
        }

        const results = await findDoctorsBySpecialty(specialtyObj.id, divisionId, limit);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No doctors found for specialty "${specialty}"${
                  division ? ` in ${division}` : ''
                }.`,
              },
            ],
          };
        }

        const formatted = results.map((doc) => ({
          ...formatDoctor(doc),
          chambers: doc.chamberSchedules.map((s: any) => ({
            hospital: s.hospital.nameEn,
            area: s.hospital.area,
            division: s.hospital.division?.nameEn,
          })),
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  specialty: specialtyObj.nameEn,
                  count: formatted.length,
                  doctors: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_doctors_by_location': {
        const {
          division,
          district,
          limit = 20,
        } = args as {
          division: string;
          district?: string;
          limit?: number;
        };

        const divisionObj = await getDivisionByName(division);
        if (!divisionObj) {
          const allDivisions = await listDivisions();
          return {
            content: [
              {
                type: 'text',
                text: `Division "${division}" not found. Available divisions:\n${allDivisions
                  .map((d) => `- ${d.nameEn} (${d.nameBn})`)
                  .join('\n')}`,
              },
            ],
          };
        }

        let districtId: string | undefined;
        if (district) {
          const districtObj = divisionObj.districts.find(
            (d) =>
              d.nameEn.toLowerCase().includes(district.toLowerCase()) ||
              d.nameBn?.includes(district)
          );
          districtId = districtObj?.id;
        }

        const results = await findDoctorsByLocation(divisionObj.id, districtId, limit);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No doctors found in ${division}${district ? `, ${district}` : ''}.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  location: {
                    division: divisionObj.nameEn,
                    district: district || 'All districts',
                  },
                  count: results.length,
                  doctors: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_doctors_by_hospital': {
        const { hospital_name } = args as { hospital_name: string };
        const results = await findDoctorsByHospital(hospital_name);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No hospital found matching "${hospital_name}".`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'find_doctors_available_today': {
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
          return {
            content: [
              {
                type: 'text',
                text: `No doctors available today (${dayName})${
                  specialty ? ` for ${specialty}` : ''
                }${division ? ` in ${division}` : ''}.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  today: dayName,
                  date: today.toISOString().split('T')[0],
                  count: results.length,
                  doctors: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_chamber_schedule': {
        const { doctor_id } = args as { doctor_id: string };
        const doctor = await getDoctorById(doctor_id);

        if (!doctor) {
          return {
            content: [
              {
                type: 'text',
                text: `Doctor with ID "${doctor_id}" not found.`,
              },
            ],
          };
        }

        const schedules = await getChamberSchedule(doctor_id);

        if (schedules.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No chamber schedules found for ${doctor.nameEn}.`,
              },
            ],
          };
        }

        const byDay = schedules.reduce((acc: any, s) => {
          if (!acc[s.day]) acc[s.day] = [];
          acc[s.day].push(s);
          return acc;
        }, {});

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  doctor: {
                    name: doctor.nameEn,
                    nameBn: doctor.nameBn,
                    specialty: doctor.primarySpecialty?.nameEn,
                  },
                  weeklySchedule: byDay,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'list_specialties': {
        const results = await listSpecialties();

        const byCategory = results.reduce((acc: any, s) => {
          if (!acc[s.category]) acc[s.category] = [];
          acc[s.category].push({
            id: s.id,
            nameEn: s.nameEn,
            nameBn: s.nameBn,
            description: s.description,
          });
          return acc;
        }, {});

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  totalSpecialties: results.length,
                  byCategory,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'list_divisions': {
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

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  totalDivisions: formatted.length,
                  divisions: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'list_hospitals': {
        const { division, type } = args as { division?: string; type?: string };

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

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  count: formatted.length,
                  hospitals: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // ============================================
      // NEW TOOL HANDLERS
      // ============================================

      case 'find_doctors_by_symptoms': {
        const { symptoms, division, limit = 10 } = args as {
          symptoms: string;
          division?: string;
          limit?: number;
        };

        let divisionId: string | undefined;
        if (division) {
          const divisionObj = await getDivisionByName(division);
          divisionId = divisionObj?.id;
        }

        const result = await findDoctorsBySymptoms(symptoms, divisionId, limit);

        // Build response message
        let response: any = {
          query: symptoms,
          matchedSymptoms: result.matchedSymptoms,
          urgency: result.urgency,
          suggestedSpecialties: result.suggestedSpecialties,
        };

        if (result.advice) {
          response.importantAdvice = result.advice;
        }

        if (result.urgency === 'urgent' || result.urgency === 'emergency') {
          response.warning = '⚠️ Your symptoms may require urgent medical attention. Please seek care promptly.';
        }

        response.doctorCount = result.doctors.length;
        response.doctors = result.doctors;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case 'find_doctors_by_fee': {
        const { min_fee, max_fee, specialty, division, limit = 20 } = args as {
          min_fee?: number;
          max_fee?: number;
          specialty?: string;
          division?: string;
          limit?: number;
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
          return {
            content: [
              {
                type: 'text',
                text: `No doctors found with fee range ${min_fee || 0} - ${max_fee || 'any'} Taka.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  feeRange: {
                    min: min_fee || 'any',
                    max: max_fee || 'any',
                  },
                  count: results.length,
                  doctors: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_emergency_hospitals': {
        const { division, district } = args as { division?: string; district?: string };

        let divisionId: string | undefined;
        let districtId: string | undefined;

        if (division) {
          const divisionObj = await getDivisionByName(division);
          divisionId = divisionObj?.id;

          if (district && divisionObj) {
            const districtObj = divisionObj.districts.find(
              (d) =>
                d.nameEn.toLowerCase().includes(district.toLowerCase()) ||
                d.nameBn?.includes(district)
            );
            districtId = districtObj?.id;
          }
        }

        const results = await findEmergencyHospitals(divisionId, districtId);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No emergency hospitals found for the specified location.',
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: '🚨 Emergency Hospitals with 24/7 services',
                  location: division || 'All Bangladesh',
                  count: results.length,
                  hospitals: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'list_insurance_providers': {
        const results = await listInsuranceProviders();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  count: results.length,
                  providers: results.map((p) => ({
                    id: p.id,
                    nameEn: p.nameEn,
                    nameBn: p.nameBn,
                    type: p.type,
                    phone: p.phone,
                    website: p.website,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_doctors_by_insurance': {
        const { insurance_provider, specialty, limit = 20 } = args as {
          insurance_provider: string;
          specialty?: string;
          limit?: number;
        };

        // Try to find the insurance provider
        const providers = await listInsuranceProviders();
        const provider = providers.find(
          (p) =>
            p.id.toLowerCase() === insurance_provider.toLowerCase() ||
            p.nameEn.toLowerCase().includes(insurance_provider.toLowerCase())
        );

        if (!provider) {
          return {
            content: [
              {
                type: 'text',
                text: `Insurance provider "${insurance_provider}" not found. Available providers:\n${providers
                  .map((p) => `- ${p.nameEn} (${p.id})`)
                  .join('\n')}`,
              },
            ],
          };
        }

        let specialtyId: string | undefined;
        if (specialty) {
          const specialtyObj = await getSpecialtyByName(specialty);
          specialtyId = specialtyObj?.id;
        }

        const results = await findDoctorsByInsurance(provider.id, specialtyId, limit);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No doctors found accepting ${provider.nameEn} insurance${
                  specialty ? ` for ${specialty}` : ''
                }.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  insuranceProvider: provider.nameEn,
                  count: results.length,
                  doctors: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_top_rated_doctors': {
        const { specialty, division, limit = 10 } = args as {
          specialty?: string;
          division?: string;
          limit?: number;
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
          return {
            content: [
              {
                type: 'text',
                text: 'No highly-rated doctors found for the specified criteria. Note: Rating data may be limited.',
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: '⭐ Top Rated Doctors',
                  count: results.length,
                  doctors: results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================
// Resource Definitions
// ============================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'doctors://specialties',
        name: 'Medical Specialties',
        description: 'List of all medical specialties available in the directory',
        mimeType: 'application/json',
      },
      {
        uri: 'doctors://divisions',
        name: 'Bangladesh Divisions',
        description: 'List of all divisions and districts in Bangladesh',
        mimeType: 'application/json',
      },
      {
        uri: 'doctors://hospitals',
        name: 'Hospitals & Clinics',
        description: 'List of all hospitals and clinics in the directory',
        mimeType: 'application/json',
      },
      {
        uri: 'doctors://insurance',
        name: 'Insurance Providers',
        description: 'List of supported health insurance providers',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'doctors://specialties': {
      const results = await listSpecialties();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'doctors://divisions': {
      const results = await listDivisions();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'doctors://hospitals': {
      const results = await listHospitals();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'doctors://insurance': {
      const results = await listInsuranceProviders();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ============================================
// Start Server
// ============================================

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🏥 Bangladeshi Doctors Directory MCP Server running on stdio');
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
