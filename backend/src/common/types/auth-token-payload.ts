import type { UserRole } from '../../../generated/prisma/enums';

export type TokenPurpose = 'access' | 'refresh' | 'otp-challenge';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  purpose: TokenPurpose;
};
