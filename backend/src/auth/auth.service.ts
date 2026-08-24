import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { comparePassword, hashPassword } from '../common/utils/password.util';
import { compareOtp, generateOtp, hashOtp } from '../common/utils/otp.util';
import type { AuthTokenPayload } from '../common/types/auth-token-payload';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { VerifyOtpDto } from './dto/verify-otp.dto';
import type { RefreshDto } from './dto/refresh.dto';
import type { ResendOtpDto } from './dto/resend-otp.dto';

export const ACCESS_TOKEN_TTL_SECONDS = 30 * 60; // 30 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;
const CHALLENGE_TOKEN_TTL_SECONDS = OTP_TTL_SECONDS;

type OtpAttemptState = { count: number; resetAt: number };

@Injectable()
export class AuthService {
  // Brute-force guard for OTP verification. In-memory by design — an OTP's
  // whole validity window is 5 minutes, so this naturally clears itself and
  // doesn't need to survive a restart. A multi-instance deployment would
  // need a shared store (e.g. Redis) instead.
  private readonly otpAttempts = new Map<string, OtpAttemptState>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hashPassword(dto.password),
        role: 'USER',
      },
    });

    return { success: true };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await comparePassword(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.issueAndSendOtp(user.id, user.email);

    const challengeToken = this.signToken(
      { sub: user.id, email: user.email, name: user.name, role: user.role },
      'otp-challenge',
      CHALLENGE_TOKEN_TTL_SECONDS,
    );

    return { challengeToken };
  }

  async resendOtp(dto: ResendOtpDto) {
    const { sub: userId } = this.verifyChallengeToken(dto.challengeToken);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const issuedAt = user.verificationCodeExpiresAt
      ? user.verificationCodeExpiresAt.getTime() - OTP_TTL_SECONDS * 1000
      : 0;
    const secondsSinceIssued = (Date.now() - issuedAt) / 1000;

    if (secondsSinceIssued < OTP_RESEND_COOLDOWN_SECONDS) {
      throw new BadRequestException(
        `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceIssued)}s before requesting another code`,
      );
    }

    await this.issueAndSendOtp(user.id, user.email);
    return { success: true };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { sub: userId } = this.verifyChallengeToken(dto.challengeToken);

    const attempt = this.otpAttempts.get(userId);
    if (attempt && attempt.count >= OTP_MAX_ATTEMPTS && attempt.resetAt > Date.now()) {
      throw new ForbiddenException(
        'Too many incorrect attempts. Request a new code.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.verificationCode || !user.verificationCodeExpiresAt) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    if (user.verificationCodeExpiresAt.getTime() < Date.now()) {
      this.otpAttempts.delete(userId);
      throw new UnauthorizedException('Code expired — request a new one');
    }

    if (!compareOtp(dto.code, user.verificationCode)) {
      const next: OtpAttemptState = {
        count: (attempt?.count ?? 0) + 1,
        resetAt: attempt?.resetAt ?? Date.now() + OTP_TTL_SECONDS * 1000,
      };
      this.otpAttempts.set(userId, next);
      throw new UnauthorizedException('Incorrect code');
    }

    this.otpAttempts.delete(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationCode: null, verificationCodeExpiresAt: null },
    });

    return this.issueSessionTokens(user);
  }

  async refresh(dto: RefreshDto) {
    let payload: AuthTokenPayload;
    try {
      payload = this.jwtService.verify<AuthTokenPayload>(dto.refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    if (payload.purpose !== 'refresh') {
      throw new UnauthorizedException('Wrong token type');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const accessToken = this.signToken(
      { sub: user.id, email: user.email, name: user.name, role: user.role },
      'access',
      ACCESS_TOKEN_TTL_SECONDS,
    );

    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    return user;
  }

  private async issueAndSendOtp(userId: string, email: string) {
    const code = generateOtp();
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: hashOtp(code),
        verificationCodeExpiresAt: new Date(Date.now() + OTP_TTL_SECONDS * 1000),
      },
    });
    await this.emailService.sendOtp(email, code);
  }

  private issueSessionTokens(user: {
    id: string;
    email: string;
    name: string;
    role: AuthTokenPayload['role'];
  }) {
    const base = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return {
      accessToken: this.signToken(base, 'access', ACCESS_TOKEN_TTL_SECONDS),
      refreshToken: this.signToken(base, 'refresh', REFRESH_TOKEN_TTL_SECONDS),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  private signToken(
    base: Omit<AuthTokenPayload, 'purpose'>,
    purpose: AuthTokenPayload['purpose'],
    expiresInSeconds: number,
  ) {
    const payload: AuthTokenPayload = { ...base, purpose };
    return this.jwtService.sign(payload, { expiresIn: expiresInSeconds });
  }

  private verifyChallengeToken(token: string): AuthTokenPayload {
    let payload: AuthTokenPayload;
    try {
      payload = this.jwtService.verify<AuthTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Login session expired — start again');
    }
    if (payload.purpose !== 'otp-challenge') {
      throw new UnauthorizedException('Wrong token type');
    }
    return payload;
  }
}
