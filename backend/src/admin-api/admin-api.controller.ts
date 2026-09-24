import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminApiService } from './admin-api.service';

import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';
import { Req, UseGuards } from '@nestjs/common';

@Controller('api/admin/updates')
@UseGuards(AuthGuard)
export class AdminApiController {
  private logger = new Logger(AdminApiController.name);

  constructor(private readonly adminService: AdminApiService) {}

  @Get('analytics/history')
  async getAnalyticsHistory(
    @Req() req: AuthenticatedRequest,
    @Query('days') days?: string,
    @Query('app') appName?: string,
  ) {
    const d = days ? parseInt(days, 10) : 14;
    return this.adminService.getAnalyticsHistory(req.user.id, d, appName);
  }

  @Get()
  async listUpdates(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('app') appName?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.adminService.listUpdates(req.user.id, p, l, search, sortBy, sortOrder, appName);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUpdate(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body('app') appName: string,
    @Body('channel') channelName: string,
    @Body('runtimeVersion') runtimeVersion?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.zip')) {
      throw new BadRequestException(
        'Only .zip files (Expo exports) are allowed',
      );
    }

    this.logger.log(`Dashboard upload by ${req.user.email} for ${file.originalname}`);
    const updateId = await this.adminService.processUpdateZip(
      file.buffer,
      appName || 'MyExpoApp',
      channelName || 'production',
      req.user.id,
      runtimeVersion,
    );

    return {
      message: 'Update processed successfully',
      updateId,
    };
  }

  @Delete(':id')
  async deleteUpdate(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const deleted = await this.adminService.deleteUpdate(id, req.user.id);
    if (!deleted) {
      throw new NotFoundException(`Update ${id} not found or access denied`);
    }
    return { success: true, deletedId: id };
  }

  @Post(':id/rollback')
  async toggleUpdateRollback(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.adminService.toggleUpdateRollback(id, req.user.id);
  }

  @Post('rollback-channel')
  async rollbackChannel(
    @Req() req: AuthenticatedRequest,
    @Body('appName') appName: string,
    @Body('channelName') channelName: string,
  ) {
    if (!appName || !channelName) {
      throw new BadRequestException('appName and channelName are required');
    }
    return this.adminService.rollbackChannel(appName, channelName, req.user.id);
  }
}
