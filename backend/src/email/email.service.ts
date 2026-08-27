import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly fromAddress?: string;

  constructor() {
    const {
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
      GMAIL_USER,
      GMAIL_FROM,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
    } = process.env;

    if (GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN && GMAIL_USER) {
      // Gmail via OAuth2 — no app password to manage/rotate, standard
      // nodemailer + Gmail API pattern.
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: GMAIL_USER,
          clientId: GMAIL_CLIENT_ID,
          clientSecret: GMAIL_CLIENT_SECRET,
          refreshToken: GMAIL_REFRESH_TOKEN,
        },
      });
      this.fromAddress = GMAIL_FROM || GMAIL_USER;
    } else if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      this.fromAddress = SMTP_FROM || SMTP_USER;
    } else {
      this.transporter = null;
    }
  }

  async sendOtp(email: string, code: string): Promise<void> {
    const subject = 'Your admin sign-in code';
    const text = `Your sign-in code is ${code}. It expires in 5 minutes.`;

    if (!this.transporter) {
      // No email provider configured — fall back to logging so local
      // dev/testing isn't blocked on having real email credentials.
      this.logger.warn(
        `No email provider configured — OTP for ${email}: ${code} (dev fallback)`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: this.fromAddress,
      to: email,
      subject,
      text,
    });
  }
}
