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

  @Get('setup/status')
  async getSetupStatus() {
    const needsSetup = await this.authService.needsSetup();
    console.log('Checking setup status... ');
    console.log(needsSetup);
    return { needsSetup };
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; plan?: 'FREE' | 'PRO' },
  ) {
    const result = await this.authService.register(body.email, body.password, body.plan || 'FREE');
    return { success: true, ...result };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.login(body.email, body.password);
    return { success: true, ...result };
  }

  @Post('google')
  async googleAuth(
    @Body() body: { email: string; name: string; googleId: string; plan?: 'FREE' | 'PRO' },
  ) {
    const result = await this.authService.googleAuth(body.email, body.name, body.plan || 'FREE');
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

  @Post('preferences')
  @UseGuards(AuthGuard)
  async updatePreferences(@Req() req: AuthenticatedRequest, @Body() body: any) {
    const email = req.user.email;
    return this.authService.updatePreferences(email, body);
  }
}
