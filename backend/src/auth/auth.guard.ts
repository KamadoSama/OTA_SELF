import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    subscriptionTier: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    console.log("================================")
    // console.log(request);
    // console.log(request.headers);
    
    const token = this.extractTokenFromHeader(request);
    // console.log("====================token====================")
    // console.log(token);
    if (!token) {
      throw new UnauthorizedException('Please log in.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload.');
      }

      const customer = await this.prisma.customer.findUnique({
        where: { id: payload.sub },
      });

      if (!customer) {
        throw new UnauthorizedException('Customer account not found.');
      }

      request.user = {
        id: customer.id,
        email: customer.email,
        subscriptionTier: customer.subscriptionTier,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
