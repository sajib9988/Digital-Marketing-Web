import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    this.transporter =
      SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS
        ? nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          })
        : null;
  }

  async sendOtp(email: string, code: string): Promise<void> {
    const subject = 'Your admin sign-in code';
    const text = `Your sign-in code is ${code}. It expires in 5 minutes.`;

    if (!this.transporter) {
      // No SMTP configured — fall back to logging so local dev/testing
      // isn't blocked on having real email credentials.
      this.logger.warn(
        `SMTP not configured — OTP for ${email}: ${code} (dev fallback)`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: email,
      subject,
      text,
    });
  }
}
