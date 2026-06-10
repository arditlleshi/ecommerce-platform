import { Pool } from 'pg';
import { env } from '../config/env.js';
import { createBetterAuth } from './better-auth.factory.js';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});

export const auth = await createBetterAuth(pool);
