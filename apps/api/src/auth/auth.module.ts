import { Module } from '@nestjs/common';
import type { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.constants';
import { AuthController } from './auth.controller';
import { BETTER_AUTH } from './auth.constants';
import { createBetterAuth } from './better-auth.factory';
import { AuthService } from './auth.service';
import { AuthSessionGuard } from './guards/auth-session.guard';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: BETTER_AUTH,
      inject: [DATABASE_POOL],
      useFactory: async (pool: Pool) => createBetterAuth(pool),
    },
    AuthService,
    AuthSessionGuard,
  ],
  exports: [AuthService, AuthSessionGuard, BETTER_AUTH],
})
export class AuthModule {}
