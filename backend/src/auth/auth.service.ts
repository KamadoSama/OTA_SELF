import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async needsSetup() {
    const count = await this.prisma.customer.count();
    return count === 0;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const customer = await this.prisma.customer.findUnique({ where: { email } });
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

  async register(email: string, password: string, tier: 'FREE' | 'PRO' = 'FREE') {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    
    const trialEndsAt = tier === 'PRO' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

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
      select: { id: true, email: true, subscriptionTier: true, createdAt: true, preferences: true },
    });
    return customer;
  }

  async googleAuth(email: string, name: string, tier: 'FREE' | 'PRO' = 'FREE') {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    let customer = await this.prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      const trialEndsAt = tier === 'PRO' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

      customer = await this.prisma.customer.create({
        data: {
          email,
          passwordHash,
          subscriptionTier: tier,
          trialEndsAt,
          subscriptionStartDate: tier === 'PRO' ? new Date() : null,
        },
      });
      this.logger.log(`New Google customer created: ${email} with tier ${tier}`);
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
}
