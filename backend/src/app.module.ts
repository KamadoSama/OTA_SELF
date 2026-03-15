import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpoUpdatesModule } from './expo-updates/expo-updates.module';
import { AdminApiModule } from './admin-api/admin-api.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExpoUpdatesModule,
    AdminApiModule,
    StorageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
