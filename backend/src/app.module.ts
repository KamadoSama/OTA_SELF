import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpoUpdatesModule } from './expo-updates/expo-updates.module';
import { AdminApiModule } from './admin-api/admin-api.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { OtaPublishModule } from './ota-publish/ota-publish.module';
import { PrismaModule } from './prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes in milliseconds
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ExpoUpdatesModule,
    AdminApiModule,
    StorageModule,
    AuthModule,
    ApiKeysModule,
    OtaPublishModule,
    SubscriptionModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
