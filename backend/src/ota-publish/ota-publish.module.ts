import { Module } from '@nestjs/common';
import { OtaPublishController } from './ota-publish.controller';
import { AdminApiModule } from '../admin-api/admin-api.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [AdminApiModule, ApiKeysModule],
  controllers: [OtaPublishController],
})
export class OtaPublishModule {}
