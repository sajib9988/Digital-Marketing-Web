import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { AuthTokenPayload } from '../types/auth-token-payload';

// Applied globally (see app.module.ts APP_GUARD provider). Stateless Bearer
// auth — expects `Authorization: Bearer <token>`, set by the Admin app from
// its own accessToken cookie. This API never sets or reads cookies itself.
// Routes marked with @Public() (currently just POST /auth/login) skip this.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const payload = this.jwtService.verify<AuthTokenPayload>(token);
      if (payload.purpose !== 'access') {
        throw new UnauthorizedException('Wrong token type');
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Session expired or invalid');
    }
  }
}

function extractBearerToken(header: string | undefined): string | undefined {
  if (!header?.startsWith('Bearer ')) {
    return undefined;
  }
  return header.slice('Bearer '.length);
}
