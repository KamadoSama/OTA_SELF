import { Controller, Post, Get, Body, Res, Req, UnauthorizedException, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

const SESSION_COOKIE = 'Q6aoDC6QOYwfc7WjrBuhE3AJBmbj5Drz08tBnLPxA7hsL2BL';

@Controller('api/admin/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.authService.login(body.email, body.password);

    res.cookie(SESSION_COOKIE, admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      path: '/',
    });

    return { success: true, email: admin.email };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    return { success: true };
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const email = req.cookies?.[SESSION_COOKIE];
    if (!email) {
      throw new UnauthorizedException('Not authenticated');
    }
    const admin = await this.authService.getMe(email);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return admin;
  }
}
