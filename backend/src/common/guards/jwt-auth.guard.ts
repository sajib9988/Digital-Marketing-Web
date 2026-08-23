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

// Applied globally (see app.module.ts APP_GUARD provider). Reads the admin
// session cookie set by AuthService.login and verifies it against JWT_SECRET.
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
    const token = request.cookies?.admin_token as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      request.user = this.jwtService.verify<AuthTokenPayload>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Session expired or invalid');
    }
  }
}
