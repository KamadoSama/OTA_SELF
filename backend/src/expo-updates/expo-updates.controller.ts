import { Controller, Get, Req, Res, Param, Headers, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ExpoUpdatesService } from './expo-updates.service';

@Controller('api/manifest')
export class ExpoUpdatesController {
  private logger = new Logger(ExpoUpdatesController.name);

  constructor(private readonly expoService: ExpoUpdatesService) {}

  // URL: GET /api/manifest/:appId
  // e.g. https://ton-serveur.com/api/manifest/mon-app-id
  @Get(':appId')
  async getManifest(
    @Req() req: Request,
    @Res() res: Response,
    @Param('appId') appId: string,
    @Headers('expo-runtime-version') expoRuntimeVersion: string,
    @Headers('expo-platform') expoPlatform: string,
    @Headers('expo-channel-name') expoChannelName: string,
  ) {
    try {
      this.logger.log(`Received update request — appId: ${appId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${expoChannelName || 'production'}`);

      if (!expoRuntimeVersion || !expoPlatform) {
        return res.status(400).json({
          error: 'Missing required headers: expo-runtime-version or expo-platform',
        });
      }

      const resolvedChannel = (!expoChannelName || expoChannelName === 'default')
        ? 'production'
        : expoChannelName;

      const manifestResponse = await this.expoService.getLatestManifest(
        expoRuntimeVersion,
        expoPlatform,
        resolvedChannel,
        appId,
      );

      if (!manifestResponse) {
        throw new NotFoundException('No update found for this runtime version and platform');
      }

      res.setHeader('expo-protocol-version', '1');
      res.setHeader('expo-sfv-version', '0');

      return res.status(200).json(manifestResponse.manifest);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ error: error.message });
      }
      this.logger.error('Error serving manifest', error);
      throw new InternalServerErrorException('Failed to retrieve update manifest');
    }
  }
}
