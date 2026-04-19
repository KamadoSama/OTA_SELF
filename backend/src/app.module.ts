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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ExpoUpdatesModule,
    AdminApiModule,
    StorageModule,
    AuthModule,
    ApiKeysModule,
    OtaPublishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
