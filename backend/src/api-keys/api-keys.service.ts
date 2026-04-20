import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes, createHash } from 'crypto';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class ApiKeysService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
  ) {}

  async generateApiKey(customerId: string) {
    await this.subscriptionService.checkCanCreateApiKey(customerId);

    const rawKey = `zo_${randomBytes(24).toString('hex')}`; // zenota api key
    const prefix = rawKey.slice(0, 11); // "zo_..." (3 chars + 8 chars)
    
    const hashedKey = createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        key: hashedKey,
        prefix,
        customerId,
      },
      select: {
        id: true,
        prefix: true,
        createdAt: true,
        lastUsedAt: true,
      }
    });

    return {
      apiKey,
      rawKey // We only return it once!
    };
  }

  async listCustomerApiKeys(customerId: string) {
    return this.prisma.apiKey.findMany({
      where: { customerId },
      select: {
        id: true,
        prefix: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteApiKey(customerId: string, apiKeyId: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id: apiKeyId, customerId }
    });

    if (!key) throw new NotFoundException('API Key not found or belongs to another user.');

    await this.prisma.apiKey.delete({
      where: { id: apiKeyId }
    });

    return { success: true };
  }

  // Used by the CLI publish endpoint to authenticate the publisher
  async authenticateKey(rawKey: string) {
    const hashedKey = createHash('sha256').update(rawKey).digest('hex');
    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: hashedKey },
      include: { customer: true }
    });

    if (!keyRecord) return null;

    // Update last used asynchronously
    this.prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() }
    }).catch(console.error);

    return keyRecord.customer;
  }
}
