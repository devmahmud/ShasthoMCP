// ============================================
// MCP Tool Definitions
// ============================================

export const tools = [
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
          description: 'Maximum number of results (default: 20, max: 100)',
        },
        offset: {
          type: 'number',
          description: 'Number of results to skip for pagination (default: 0)',
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
  // Advanced Tools
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

export type ToolName = (typeof tools)[number]['name'];
