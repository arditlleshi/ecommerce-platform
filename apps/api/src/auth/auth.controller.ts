import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  authStatusResponseSchema,
  type AuthStatusResponse,
  currentUserResponseSchema,
  type CurrentUserResponse,
} from '@repo/schemas/auth';
import { AuthSessionGuard } from './guards/auth-session.guard';
import type { AuthenticatedRequest } from './auth.types';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth/status')
  getAuthStatus(): AuthStatusResponse {
    return authStatusResponseSchema.parse({
      success: true,
      data: {
        providers: {
          google: {
            enabled: this.authService.isGoogleSignInEnabled(),
          },
        },
      },
    });
  }

  @Get('me')
  @UseGuards(AuthSessionGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest): CurrentUserResponse {
    return currentUserResponseSchema.parse({
      success: true,
      data: {
        user: {
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
          image: request.user.image ?? null,
          emailVerified: request.user.emailVerified,
          createdAt: request.user.createdAt.toISOString(),
          updatedAt: request.user.updatedAt.toISOString(),
        },
        session: {
          id: request.session.id,
          expiresAt: request.session.expiresAt.toISOString(),
        },
      },
    });
  }
}
