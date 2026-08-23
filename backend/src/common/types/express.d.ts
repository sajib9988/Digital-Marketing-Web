import type { AuthTokenPayload } from './auth-token-payload';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
