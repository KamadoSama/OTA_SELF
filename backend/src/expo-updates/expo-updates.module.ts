import { Module } from '@nestjs/common';
import { ExpoUpdatesController } from './expo-updates.controller';
import { ExpoUpdatesService } from './expo-updates.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ExpoUpdatesController],
  providers: [ExpoUpdatesService],
})
export class ExpoUpdatesModule {}
