import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const { Pool } = pg;

// Database configuration from environment variables with defaults
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'mahmud',
  password: process.env.DB_PASSWORD || 'admin@12345',
  database: process.env.DB_NAME || 'doctors_db',
};

const pool = new Pool(dbConfig);

export const db = drizzle(pool, { schema });

export { pool };
