import pino from 'pino';

// Create pino logger that writes to stderr (required for MCP servers)
// stdout is reserved for MCP protocol communication
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino/file',
    options: { destination: 2 }, // 2 = stderr
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Helper to log tool execution with timing
export async function logToolExecution<T>(
  toolName: string,
  args: Record<string, unknown>,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  logger.debug({ tool: toolName, args }, `Executing tool: ${toolName}`);

  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.debug({ tool: toolName, duration: `${duration}ms` }, `Tool completed: ${toolName}`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      {
        tool: toolName,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : String(error),
      },
      `Tool failed: ${toolName}`
    );
    throw error;
  }
}
