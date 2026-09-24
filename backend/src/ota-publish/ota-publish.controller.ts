import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Body,
  BadRequestException,
  Logger,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminApiService } from '../admin-api/admin-api.service';
import { ApiKeyGuard, ApiKeyAuthenticatedRequest } from './api-key.guard';

@Controller('api/cli/publish')
export class OtaPublishController {
  private logger = new Logger(OtaPublishController.name);

  constructor(private readonly adminService: AdminApiService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  async publishUpdate(
    @Req() req: ApiKeyAuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body('app') appName: string,
    @Body('channel') channelName: string,
    @Body('runtimeVersion') runtimeVersion?: string,
    @Body('appVersion') appVersion?: string,
    @Body('rollout') rollout?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.zip')) {
      throw new BadRequestException(
        'Only .zip files (Expo exports) are allowed',
      );
    }

    if (!appName || !channelName) {
      throw new BadRequestException(
        'appName and channelName are required',
      );
    }

    const rolloutNum = rollout !== undefined ? parseInt(rollout, 10) : 100;
    this.logger.log(`CLI Upload by ${req.customer.email} for app: ${appName} (channel: ${channelName}, rollout: ${rolloutNum}%)`);
    
    // We pass the customerId to validate app ownership and create if necessary
    const updateId = await this.adminService.processUpdateZip(
      file.buffer,
      appName,
      channelName,
      req.customer.id, 
      runtimeVersion,
      appVersion,
      rolloutNum,
    );

    return {
      success: true,
      message: 'Update processed successfully',
      updateId,
      rolloutPercentage: rolloutNum,
    };
  }

  @Post('rollback')
  @UseGuards(ApiKeyGuard)
  async rollbackUpdate(
    @Req() req: ApiKeyAuthenticatedRequest,
    @Body('app') appName: string,
    @Body('channel') channelName: string,
  ) {
    if (!appName || !channelName) {
      throw new BadRequestException('appName and channelName are required for rollback');
    }

    this.logger.log(`CLI Rollback by ${req.customer.email} on ${appName}/${channelName}`);
    const result = await this.adminService.rollbackChannel(
      appName,
      channelName,
      req.customer.id,
    );

    return result;
  }
}
