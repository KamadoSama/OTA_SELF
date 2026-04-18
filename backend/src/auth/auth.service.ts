import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
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

  async login(email: string, password: string) {
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
      access_token: token,
    };
  }

  async register(email: string, password: string) {
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await this.prisma.customer.create({
      data: {
        email,
        passwordHash,
      },
    });

    const payload = { sub: customer.id, email: customer.email };
    const token = this.jwtService.sign(payload);

    return {
      id: customer.id,
      email: customer.email,
      access_token: token,
    };
  }

  async getMe(email: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
      select: { id: true, email: true, subscriptionTier: true, createdAt: true },
    });
    return customer;
  }
}
