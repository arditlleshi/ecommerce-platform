import { Inject, Injectable } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'node:http';
import type { ServerResponse } from 'node:http';
import type { IncomingMessage } from 'node:http';
import { BETTER_AUTH } from './auth.constants';
import type { BetterAuthInstance } from './better-auth.factory';
import { googleAuthConfig } from '../config/env';

@Injectable()
export class AuthService {
  constructor(
    @Inject(BETTER_AUTH)
    private readonly auth: BetterAuthInstance,
  ) {}

  async handleAuthRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const { toNodeHandler } = await import('better-auth/node');
    const handler = toNodeHandler(this.auth);

    await handler(request, response);
  }

  async getSession(headers: IncomingHttpHeaders) {
    const { fromNodeHeaders } = await import('better-auth/node');

    return this.auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }

  isGoogleSignInEnabled(): boolean {
    return googleAuthConfig !== null;
  }
}
