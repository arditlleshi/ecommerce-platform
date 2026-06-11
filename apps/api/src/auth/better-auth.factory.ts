import type { Pool } from 'pg';
import { allowedWebOrigins, env, googleAuthConfig } from '../config/env';

export type BetterAuthSessionResult = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
};

export interface BetterAuthInstance {
  api: {
    getSession(input: {
      headers: Headers;
    }): Promise<BetterAuthSessionResult | null>;
  };
  handler: (request: Request) => Promise<Response>;
}

export async function createBetterAuth(
  pool: Pool,
): Promise<BetterAuthInstance> {
  const { betterAuth } = await import('better-auth');

  return betterAuth({
    database: pool,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: Array.from(
      new Set([env.FRONTEND_APP_URL, ...allowedWebOrigins]),
    ),
    account: {
      encryptOAuthTokens: true,
    },
    advanced: env.AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: env.AUTH_COOKIE_DOMAIN,
          },
        }
      : undefined,
    socialProviders: googleAuthConfig
      ? {
          google: googleAuthConfig,
        }
      : undefined,
  });
}
