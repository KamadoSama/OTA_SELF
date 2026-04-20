import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  constructor(private prisma: PrismaService) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionChecks() {
    this.logger.log('Running daily subscription and trial checks...');
    
    const now = new Date();

    // 1. Find users whose trial has expired and who haven't added a card
    const expiredTrials = await this.prisma.customer.findMany({
      where: {
        subscriptionTier: SubscriptionTier.PRO,
        trialEndsAt: {
          lt: now,
        },
        cardLast4: null,
      },
    });

    if (expiredTrials.length > 0) {
      this.logger.log(`Found ${expiredTrials.length} expired trials without payment method.`);
      
      // We could automatically downgrade them here, 
      // but for now, we just log it as the backend already blocks their actions.
      // for (const customer of expiredTrials) {
      //   await this.prisma.customer.update({
      //     where: { id: customer.id },
      //     data: { subscriptionTier: SubscriptionTier.FREE }
      //   });
      //   this.logger.log(`Customer ${customer.email} downgraded to FREE due to expired trial.`);
      // }
    }

    // 2. Find users whose trial is expiring in 3 days (for notifications)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const expiringSoon = await this.prisma.customer.findMany({
      where: {
        subscriptionTier: SubscriptionTier.PRO,
        trialEndsAt: {
          gte: now,
          lte: threeDaysFromNow,
        },
        cardLast4: null,
      },
    });

    if (expiringSoon.length > 0) {
      this.logger.log(`${expiringSoon.length} trials expiring in the next 3 days. Send reminders.`);
      // TODO: Integration with an email service (SendGrid, Mailchimp, etc.)
    }
  }
}
