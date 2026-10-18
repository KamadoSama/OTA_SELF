import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';

@Controller('api/api-keys')
@UseGuards(AuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.apiKeysService.listCustomerApiKeys(req.user.id);
  }

  @Post()
  async generate(@Req() req: AuthenticatedRequest) {
    return this.apiKeysService.generateApiKey(req.user.id);
  }

  @Delete(':id')
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.apiKeysService.deleteApiKey(req.user.id, id);
  }
}
