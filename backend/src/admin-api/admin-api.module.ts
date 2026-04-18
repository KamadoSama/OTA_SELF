import { Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';
import { AdminApiService } from './admin-api.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AdminApiController],
  providers: [AdminApiService],
  exports: [AdminApiService],
})
export class AdminApiModule {}
