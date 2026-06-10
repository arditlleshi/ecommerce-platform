import type { Request } from 'express';
import type { AuthService } from './auth.service';

type AuthSessionResult = Awaited<ReturnType<AuthService['getSession']>>;
type NonNullableSession = NonNullable<AuthSessionResult>;

export type AuthenticatedUser = NonNullableSession['user'];
export type AuthenticatedSession = NonNullableSession['session'];

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  session: AuthenticatedSession;
}
