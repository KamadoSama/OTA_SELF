import {
  Injectable,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  PLAN_LIMITS,
  TRIAL_DURATION_DAYS,
  PRO_PRICE,
} from './subscription.config';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  private logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  private isSelfHosted(): boolean {
    return process.env.SELF_HOSTED !== 'false';
  }

  async getCustomerData(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        subscriptionTier: true,
        trialEndsAt: true,
        cardLast4: true,
        subscriptionStartDate: true,
        cardBrand: true,
        cardExpMonth: true,
        cardExpYear: true,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async checkSubscriptionStatus(customerId: string) {
    if (this.isSelfHosted()) return;
    const customer = await this.getCustomerData(customerId);

    if (
      customer.subscriptionTier === SubscriptionTier.PRO &&
      customer.trialEndsAt
    ) {
      const now = new Date();
      if (customer.trialEndsAt < now && !customer.cardLast4) {
        throw new ForbiddenException(
          'Your Pro trial has expired. Please add a payment method to continue using Pro features.',
        );
      }
    }
  }

  async checkCanCreateApp(customerId: string) {
    if (this.isSelfHosted()) return true;
    await this.checkSubscriptionStatus(customerId);
    const customer = await this.getCustomerData(customerId);
    const tier = customer.subscriptionTier;
    const limit = PLAN_LIMITS[tier].maxApps;

    if (limit === -1) return true;

    const count = await this.prisma.app.count({ where: { customerId } });
    if (count >= limit) {
      throw new ForbiddenException(
        `You have reached the limit of ${limit} app(s) for the ${tier} tier. Upgrade to PRO for unlimited apps.`,
      );
    }
    return true;
  }

  async checkCanDeploy(customerId: string) {
    if (this.isSelfHosted()) return true;
    await this.checkSubscriptionStatus(customerId);
    const customer = await this.getCustomerData(customerId);
    const tier = customer.subscriptionTier;
    const limit = PLAN_LIMITS[tier].maxDeploymentsPerDay;

    if (limit === -1) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.prisma.update.count({
      where: {
        channel: { app: { customerId } },
        createdAt: { gte: today },
      },
    });

    if (count >= limit) {
      throw new ForbiddenException(
        `You have reached the limit of ${limit} deployment(s) per day for the ${tier} tier. Upgrade to PRO for unlimited deployments.`,
      );
    }
    return true;
  }

  async checkCanCreateApiKey(customerId: string) {
    if (this.isSelfHosted()) return true;
    await this.checkSubscriptionStatus(customerId);
    const customer = await this.getCustomerData(customerId);
    const tier = customer.subscriptionTier;
    const limit = PLAN_LIMITS[tier].maxApiKeys;

    if (limit === -1) return true;

    const count = await this.prisma.apiKey.count({ where: { customerId } });
    if (count >= limit) {
      throw new ForbiddenException(
        `You have reached the limit of ${limit} API key(s) for the ${tier} tier. Upgrade to PRO for unlimited keys.`,
      );
    }
    return true;
  }

  async getUsageStats(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        _count: {
          select: { apps: true, apiKeys: true },
        },
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deploymentsToday = await this.prisma.update.count({
      where: {
        channel: { app: { customerId } },
        createdAt: { gte: today },
      },
    });

    const updates = await this.prisma.update.findMany({
      where: { channel: { app: { customerId } } },
      select: { downloadCount: true },
    });

    const totalDownloads = updates.reduce(
      (acc, curr) => acc + curr.downloadCount,
      0,
    );
    const tier = this.isSelfHosted()
      ? SubscriptionTier.PRO
      : customer.subscriptionTier;
    const limits = this.isSelfHosted()
      ? {
          maxApps: -1,
          maxDeploymentsPerDay: -1,
          maxApiKeys: -1,
          maxDownloadsPerMonth: -1,
        }
      : PLAN_LIMITS[tier];

    return {
      isSelfHosted: this.isSelfHosted(),
      tier,
      monthlyDownloads: totalDownloads,
      downloadLimit: limits.maxDownloadsPerMonth,
      activeApps: customer._count.apps,
      appsLimit: limits.maxApps === -1 ? 'Unlimited' : limits.maxApps,
      deploymentsToday,
      deploymentsLimit:
        limits.maxDeploymentsPerDay === -1
          ? 'Unlimited'
          : limits.maxDeploymentsPerDay,
      activeApiKeys: customer._count.apiKeys,
      apiKeysLimit: limits.maxApiKeys === -1 ? 'Unlimited' : limits.maxApiKeys,
      storageUsed: '0.5 GB',
      storageLimit: tier === 'PRO' ? '10 GB' : '1 GB',
      nextBillingDate:
        customer.trialEndsAt ||
        (customer.subscriptionStartDate
          ? new Date(
              customer.subscriptionStartDate.getTime() +
                30 * 24 * 60 * 60 * 1000,
            )
          : null),
      cardLast4: customer.cardLast4,
      cardBrand: customer.cardBrand,
      cardExpMonth: customer.cardExpMonth,
      cardExpYear: customer.cardExpYear,
      trialEndsAt: customer.trialEndsAt,
    };
  }

  async upgradeToPro(
    customerId: string,
    paymentInfo: {
      last4: string;
      brand: string;
      expMonth: number;
      expYear: number;
    },
  ) {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        subscriptionTier: SubscriptionTier.PRO,
        subscriptionStartDate: new Date(),
        trialEndsAt: trialEndsAt,
        cardLast4: paymentInfo.last4,
        cardBrand: paymentInfo.brand,
        cardExpMonth: paymentInfo.expMonth,
        cardExpYear: paymentInfo.expYear,
      },
    });

    const invoice = await this.prisma.invoice.create({
      data: {
        customerId,
        amount: 0,
        status: 'PAID',
        date: new Date(),
      },
    });

    this.logger.log(`Customer ${customerId} upgraded to PRO (Trial)`);
    return { customer, invoiceId: invoice.id };
  }

  async downgradeToFree(customerId: string) {
    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStartDate: null,
        trialEndsAt: null,
      },
    });

    this.logger.log(`Customer ${customerId} downgraded to FREE`);
    return customer;
  }

  async deleteAccount(customerId: string) {
    await this.prisma.customer.delete({
      where: { id: customerId },
    });
    this.logger.log(`Customer ${customerId} deleted their account`);
    return { success: true };
  }

  async getInvoices(customerId: string) {
    return this.prisma.invoice.findMany({
      where: { customerId },
      orderBy: { date: 'desc' },
    });
  }
}
