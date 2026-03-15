import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`Admin ${email} logged in`);
    return { id: admin.id, email: admin.email };
  }

  async getMe(email: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, email: true, createdAt: true },
    });
    return admin;
  }
}
