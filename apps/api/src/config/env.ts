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
  FRONTEND_APP_URL: z.string().url().default('http://localhost:3000'),
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
  BETTER_AUTH_URL: z.string().url().default('http://localhost:4001'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters long'),
  AUTH_COOKIE_DOMAIN: z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() === '' ? undefined : value,
    z
      .string()
      .trim()
      .regex(
        /^\.?[a-zA-Z0-9.-]+$/,
        'AUTH_COOKIE_DOMAIN must be a hostname such as example.com or .example.com',
      )
      .optional(),
  ),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
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

const googleClientId = env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = env.GOOGLE_CLIENT_SECRET?.trim();

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error(
    'Google OAuth configuration is incomplete. Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or leave both unset.',
  );
}

export const googleAuthConfig =
  googleClientId && googleClientSecret
    ? {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }
    : null;

export const allowedWebOrigins = env.WEB_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
