import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthTokenPayload } from '../common/types/auth-token-payload';
import {
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_MAX_AGE_MS,
  AuthService,
} from './auth.service';
import { LoginDto } from './dto/login.dto';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(dto);
    res.cookie(ADMIN_TOKEN_COOKIE, token, {
      ...cookieOptions,
      maxAge: ADMIN_TOKEN_MAX_AGE_MS,
    });
    return { user };
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ADMIN_TOKEN_COOKIE, cookieOptions);
    return { success: true };
  }

  @Get('me')
  me(@CurrentUser() currentUser: AuthTokenPayload) {
    return this.authService.me(currentUser.sub);
  }
}
