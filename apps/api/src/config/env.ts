import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4001),
  WEB_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (value) =>
        value.startsWith('postgresql://') || value.startsWith('postgres://'),
      'DATABASE_URL must be a PostgreSQL connection string',
    )
    .default(
      'postgresql://postgres:postgres@localhost:5432/ecommerce_platform',
    ),
  DATABASE_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),
});

const envFiles = [
  '.env.local',
  '.env',
  resolve('..', '..', '.env.local'),
  resolve('..', '..', '.env'),
];

for (const envFile of envFiles) {
  const filePath = resolve(process.cwd(), envFile);
  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: false, quiet: true });
  }
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid API environment configuration: ${JSON.stringify(
      parsedEnv.error.flatten().fieldErrors,
    )}`,
  );
}

export const env = parsedEnv.data;

export const allowedWebOrigins = env.WEB_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
