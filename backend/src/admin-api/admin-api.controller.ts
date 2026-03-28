import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminApiService } from './admin-api.service';

@Controller('api/admin/updates')
export class AdminApiController {
  private logger = new Logger(AdminApiController.name);

  constructor(private readonly adminService: AdminApiService) {}

  @Get()
  async listUpdates() {
    return this.adminService.listUpdates();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUpdate(
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

    this.logger.log(`Received upload request for ${file.originalname}`);
    const updateId = await this.adminService.processUpdateZip(
      file.buffer,
      appName || 'MyExpoApp',
      channelName || 'production',
    );

    return {
      message: 'Update processed successfully',
      updateId,
    };
  }

  @Delete(':id')
  async deleteUpdate(@Param('id') id: string) {
    const deleted = await this.adminService.deleteUpdate(id);
    if (!deleted) {
      throw new NotFoundException(`Update ${id} not found`);
    }
    return { success: true, deletedId: id };
  }
}
