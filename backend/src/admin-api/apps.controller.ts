import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminApiService } from './admin-api.service';
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';

@Controller('api/admin/apps')
@UseGuards(AuthGuard)
export class AppsController {
  constructor(private readonly adminService: AdminApiService) {}

  @Get()
  async listApps(@Req() req: AuthenticatedRequest) {
    return this.adminService.listApps(req.user.id);
  }

  @Post()
  async createApp(
    @Req() req: AuthenticatedRequest,
    @Body('name') name: string,
    @Body('scheme') scheme?: string,
  ) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('App name is required');
    }
    return this.adminService.createApp(name, req.user.id, scheme);
  }
}
