import { Module, Global } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionCronService } from './subscription-cron.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionCronService, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
