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

    this.logger.log(`CLI Upload by ${req.customer.email} for app: ${appName}`);
    
    // We pass the customerId to validate app ownership and create if necessary
    const updateId = await this.adminService.processUpdateZip(
      file.buffer,
      appName,
      channelName,
      req.customer.id, 
    );

    return {
      success: true,
      message: 'Update processed successfully',
      updateId,
    };
  }
}
