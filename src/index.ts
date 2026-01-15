#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  listSpecialties,
  listHospitals,
  listDivisions,
  listInsuranceProviders,
} from './db/queries.js';
import { pool } from './db/connection.js';
import { handleToolCall } from './tools/handlers.js';
import { logger, logToolExecution } from './logger.js';

// ============================================
// MCP Server Setup
// ============================================

const server = new McpServer(
  {
    name: 'shastho-mcp',
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
// Tool Registrations
// ============================================

server.registerTool('search_doctors', {
  description: 'Search doctors by name (English or Bengali). Use this to find a specific doctor.',
  inputSchema: z.object({
    query: z.string().describe("Doctor's name to search for (partial match supported)"),
    limit: z.number().optional().describe('Maximum number of results (default: 20, max: 100)'),
    offset: z.number().optional().describe('Number of results to skip for pagination (default: 0)'),
  }),
}, async (args, extra) => {
  return logToolExecution('search_doctors', args, async () => {
    const result = await handleToolCall('search_doctors', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('get_doctor_details', {
  description: 'Get complete details of a doctor including their chamber schedules, qualifications, insurance networks, and contact information.',
  inputSchema: z.object({
    doctor_id: z.string().describe('The unique ID of the doctor'),
  }),
}, async (args, extra) => {
  return logToolExecution('get_doctor_details', args, async () => {
    const result = await handleToolCall('get_doctor_details', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_specialty', {
  description: 'Find doctors by their medical specialty (e.g., Cardiology, Neurology, Gynecology). Optionally filter by division.',
  inputSchema: z.object({
    specialty: z.string().describe("Medical specialty name (e.g., 'Cardiology', 'Medicine', 'Pediatrics')"),
    division: z.string().optional().describe("Optional: Division name to filter (e.g., 'Dhaka', 'Chittagong')"),
    limit: z.number().optional().describe('Maximum number of results (default: 20)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_specialty', args, async () => {
    const result = await handleToolCall('find_doctors_by_specialty', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_location', {
  description: 'Find doctors available in a specific division or district of Bangladesh.',
  inputSchema: z.object({
    division: z.string().describe("Division name (e.g., 'Dhaka', 'Chittagong', 'Sylhet')"),
    district: z.string().optional().describe('Optional: District name for more specific search'),
    limit: z.number().optional().describe('Maximum number of results (default: 20)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_location', args, async () => {
    const result = await handleToolCall('find_doctors_by_location', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_hospital', {
  description: 'Find all doctors who practice at a specific hospital or clinic.',
  inputSchema: z.object({
    hospital_name: z.string().describe('Hospital or clinic name (partial match supported)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_hospital', args, async () => {
    const result = await handleToolCall('find_doctors_by_hospital', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_available_today', {
  description: 'Find doctors who are available today (based on current day of week).',
  inputSchema: z.object({
    specialty: z.string().optional().describe('Optional: Filter by specialty'),
    division: z.string().optional().describe('Optional: Filter by division'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_available_today', args, async () => {
    const result = await handleToolCall('find_doctors_available_today', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('get_chamber_schedule', {
  description: 'Get the complete weekly chamber schedule for a specific doctor, including all hospitals and timings.',
  inputSchema: z.object({
    doctor_id: z.string().describe('The unique ID of the doctor'),
  }),
}, async (args, extra) => {
  return logToolExecution('get_chamber_schedule', args, async () => {
    const result = await handleToolCall('get_chamber_schedule', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('list_specialties', {
  description: 'List all available medical specialties in the directory.',
}, async (extra) => {
  return logToolExecution('list_specialties', {}, async () => {
    const result = await handleToolCall('list_specialties', {});
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('list_divisions', {
  description: 'List all divisions and districts of Bangladesh covered in the directory.',
}, async (extra) => {
  return logToolExecution('list_divisions', {}, async () => {
    const result = await handleToolCall('list_divisions', {});
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('list_hospitals', {
  description: 'List hospitals and clinics. Can filter by division and type.',
  inputSchema: z.object({
    division: z.string().optional().describe('Optional: Filter by division name'),
    type: z.enum(['government', 'private', 'clinic', 'diagnostic']).optional().describe('Optional: Filter by hospital type'),
  }),
}, async (args, extra) => {
  return logToolExecution('list_hospitals', args, async () => {
    const result = await handleToolCall('list_hospitals', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_symptoms', {
  description: 'Find doctors based on symptoms or health conditions. Describe your symptoms and get matched with appropriate specialists. Works with both English and Bengali.',
  inputSchema: z.object({
    symptoms: z.string().describe("Describe your symptoms or health condition (e.g., 'chest pain', 'headache', 'বুকে ব্যথা')"),
    division: z.string().optional().describe('Optional: Preferred division for doctors'),
    limit: z.number().optional().describe('Maximum number of doctors to return (default: 10)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_symptoms', args, async () => {
    const result = await handleToolCall('find_doctors_by_symptoms', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_fee', {
  description: 'Find doctors within a specific consultation fee range.',
  inputSchema: z.object({
    min_fee: z.number().optional().describe('Minimum consultation fee in Taka'),
    max_fee: z.number().optional().describe('Maximum consultation fee in Taka'),
    specialty: z.string().optional().describe('Optional: Filter by specialty'),
    division: z.string().optional().describe('Optional: Filter by division'),
    limit: z.number().optional().describe('Maximum results (default: 20)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_fee', args, async () => {
    const result = await handleToolCall('find_doctors_by_fee', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_emergency_hospitals', {
  description: 'Find hospitals with 24/7 emergency services. Use this for urgent medical needs or to find nearby emergency facilities.',
  inputSchema: z.object({
    division: z.string().optional().describe('Optional: Filter by division'),
    district: z.string().optional().describe('Optional: Filter by district'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_emergency_hospitals', args, async () => {
    const result = await handleToolCall('find_emergency_hospitals', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('list_insurance_providers', {
  description: 'List all health insurance providers supported in the directory.',
}, async (extra) => {
  return logToolExecution('list_insurance_providers', {}, async () => {
    const result = await handleToolCall('list_insurance_providers', {});
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('find_doctors_by_insurance', {
  description: 'Find doctors who accept a specific health insurance provider.',
  inputSchema: z.object({
    insurance_provider: z.string().describe("Insurance provider name or ID (e.g., 'Green Delta', 'MetLife')"),
    specialty: z.string().optional().describe('Optional: Filter by specialty'),
    limit: z.number().optional().describe('Maximum results (default: 20)'),
  }),
}, async (args, extra) => {
  return logToolExecution('find_doctors_by_insurance', args, async () => {
    const result = await handleToolCall('find_doctors_by_insurance', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

server.registerTool('get_top_rated_doctors', {
  description: 'Get highly rated doctors. Can filter by specialty and division.',
  inputSchema: z.object({
    specialty: z.string().optional().describe('Optional: Filter by specialty'),
    division: z.string().optional().describe('Optional: Filter by division'),
    limit: z.number().optional().describe('Maximum results (default: 10)'),
  }),
}, async (args, extra) => {
  return logToolExecution('get_top_rated_doctors', args, async () => {
    const result = await handleToolCall('get_top_rated_doctors', args);
    return { content: result.content.map(c => ({ type: 'text' as const, text: c.text })) };
  });
});

// ============================================
// Resource Registrations
// ============================================

server.registerResource('specialties', 'doctors://specialties', {
  description: 'List of all medical specialties available in the directory',
  mimeType: 'application/json',
}, async (uri, extra) => {
  const results = await listSpecialties();
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
});

server.registerResource('divisions', 'doctors://divisions', {
  description: 'List of all divisions and districts in Bangladesh',
  mimeType: 'application/json',
}, async (uri, extra) => {
  const results = await listDivisions();
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
});

server.registerResource('hospitals', 'doctors://hospitals', {
  description: 'List of all hospitals and clinics in the directory',
  mimeType: 'application/json',
}, async (uri, extra) => {
  const results = await listHospitals();
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
});

server.registerResource('insurance', 'doctors://insurance', {
  description: 'List of supported health insurance providers',
  mimeType: 'application/json',
}, async (uri, extra) => {
  const results = await listInsuranceProviders();
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
});

// ============================================
// Graceful Shutdown
// ============================================

const shutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received');
  try {
    await server.close();
    await pool.end();
    logger.info('Server and database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      'Error during shutdown'
    );
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({ error: error.message, stack: error.stack }, 'Uncaught exception');
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason: String(reason) }, 'Unhandled rejection');
});

// ============================================
// Start Server
// ============================================

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info({ name: 'shastho-mcp', version: '1.0.0' }, 'MCP Server started');
};

main().catch((error) => {
  logger.fatal({ error: error instanceof Error ? error.message : String(error) }, 'Fatal error');
  process.exit(1);
});
