import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth.service';
import type { AuthenticatedRequest } from '../auth.types';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const session = await this.authService.getSession(request.headers);

    if (!session) {
      throw new UnauthorizedException('Authentication required.');
    }

    request.user = session.user;
    request.session = session.session;
    response.setHeader('Cache-Control', 'no-store');

    return true;
  }
}
