import { Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';
import { AdminApiService } from './admin-api.service';
import { StorageModule } from '../storage/storage.module';

import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [AdminApiController],
  providers: [AdminApiService, AuthGuard],
  exports: [AdminApiService],
})
export class AdminApiModule {}
