import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async needsSetup() {
    const count = await this.prisma.customer.count();
    return count === 0;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: customer.id, email: customer.email };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Customer ${email} logged in`);
    return {
      id: customer.id,
      email: customer.email,
      tier: customer.subscriptionTier,
      preferences: customer.preferences,
      access_token: token,
    };
  }

  async register(
    email: string,
    password: string,
    tier: 'FREE' | 'PRO' = 'FREE',
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const existing = await this.prisma.customer.findUnique({
      where: { email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const trialEndsAt =
      tier === 'PRO' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

    const customer = await this.prisma.customer.create({
      data: {
        email,
        passwordHash,
        subscriptionTier: tier,
        trialEndsAt,
        subscriptionStartDate: tier === 'PRO' ? new Date() : null,
      },
    });

    const payload = { sub: customer.id, email: customer.email };
    const token = this.jwtService.sign(payload);

    return {
      id: customer.id,
      email: customer.email,
      tier: customer.subscriptionTier,
      preferences: customer.preferences,
      access_token: token,
    };
  }

  async getMe(email: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        createdAt: true,
        preferences: true,
      },
    });
    return customer;
  }

  async googleAuth(email: string, name: string, tier: 'FREE' | 'PRO' = 'FREE') {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    let customer = await this.prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      const trialEndsAt =
        tier === 'PRO' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

      customer = await this.prisma.customer.create({
        data: {
          email,
          passwordHash,
          subscriptionTier: tier,
          trialEndsAt,
          subscriptionStartDate: tier === 'PRO' ? new Date() : null,
        },
      });
      this.logger.log(
        `New Google customer created: ${email} with tier ${tier}`,
      );
    }

    const payload = { sub: customer.id, email: customer.email };
    const token = this.jwtService.sign(payload);

    return {
      id: customer.id,
      email: customer.email,
      tier: customer.subscriptionTier,
      preferences: customer.preferences,
      access_token: token,
    };
  }

  async updatePreferences(email: string, preferences: any) {
    const customer = await this.prisma.customer.update({
      where: { email },
      data: { preferences },
    });
    return customer.preferences;
  }

  async forgotPassword(email: string, baseUrl: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      // Return generic success to avoid email enumeration
      return {
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { resetTokenHash, resetTokenExpiresAt },
    });

    const cleanBase = (baseUrl || process.env.FRONTEND_URL || 'http://localhost:3002').replace(/\/$/, '');
    const resetUrl = `${cleanBase}/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordResetEmail(customer.email, resetUrl);

    return {
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const customer = await this.prisma.customer.findFirst({
      where: {
        resetTokenHash,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!customer) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    this.logger.log(`Password reset completed for ${customer.email}`);
    return { success: true };
  }
}
