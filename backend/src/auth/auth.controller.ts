import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, AuthenticatedRequest } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.register(body.email, body.password);
    return { success: true, ...result };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.login(body.email, body.password);
    return { success: true, ...result };
  }

  @Post('logout')
  logout() {
    // With JWT, logout is handled client-side by deleting the token
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    const email = req.user.email;
    const customer = await this.authService.getMe(email);
    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }
    return customer;
  }
}
