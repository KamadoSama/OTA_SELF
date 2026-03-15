import { Module } from '@nestjs/common';
import { AdminApiController } from './admin-api.controller';
import { AdminApiService } from './admin-api.service';
import { StorageModule } from '../storage/storage.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [StorageModule],
  controllers: [AdminApiController],
  providers: [AdminApiService, PrismaService],
})
export class AdminApiModule {}
