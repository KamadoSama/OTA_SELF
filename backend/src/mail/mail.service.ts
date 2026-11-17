import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private getTransporter(): nodemailer.Transporter | null {
    const host = process.env.SMTP_HOST;
    if (!host) {
      return null;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      (process.env.SMTP_SECURE === undefined && port === 465);

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `SMTP_HOST is not configured. Password reset link for ${email}: ${resetUrl}`,
      );
      return;
    }

    const from =
      process.env.SMTP_FROM ||
      process.env.SMTP_USER ||
      'ZenOTA <noreply@zenota.local>';

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Reset your ZenOTA password',
      text: `You requested a password reset for your ZenOTA account.\n\nOpen this link within 1 hour to set a new password:\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#050505; color:#ffffff; padding:32px; border-radius:8px; max-width:520px; margin:0 auto;">
          <h2 style="margin:0 0 12px; font-size:20px;">Reset your ZenOTA password</h2>
          <p style="margin:0 0 24px; color:#a1a1aa; font-size:14px; line-height:1.6;">
            You requested a password reset for your ZenOTA account. Click the button below within 1 hour to choose a new password.
          </p>
          <a href="${resetUrl}" style="display:inline-block; background:#ffffff; color:#000000; font-weight:700; font-size:14px; padding:12px 24px; border-radius:6px; text-decoration:none;">
            Reset Password
          </a>
          <p style="margin:24px 0 0; color:#71717a; font-size:12px; line-height:1.5;">
            If the button doesn't work, copy and paste this URL into your browser:<br />
            <span style="color:#d4d4d8; word-break:break-all;">${resetUrl}</span>
          </p>
        </div>
      `,
    });

    this.logger.log(`Password reset email sent to ${email}`);
  }
}
