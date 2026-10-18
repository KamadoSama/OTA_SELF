import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../api-keys/api-keys.service';

export interface ApiKeyAuthenticatedRequest extends Request {
  customer: {
    id: string;
    email: string;
  };
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<ApiKeyAuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'API Key missing or invalid format (Bearer expected).',
      );
    }

    const rawKey = authHeader.split(' ')[1];

    if (!rawKey) {
      throw new UnauthorizedException('API Key missing.');
    }

    const customer = await this.apiKeysService.authenticateKey(rawKey);

    if (!customer) {
      throw new UnauthorizedException('Invalid or revoked API Key.');
    }

    request.customer = {
      id: customer.id,
      email: customer.email,
    };

    return true;
  }
}
