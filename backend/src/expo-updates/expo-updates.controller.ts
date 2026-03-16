import { Controller, Get, Req, Res, Param, Headers, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ExpoUpdatesService } from './expo-updates.service';

@Controller('api/manifest')
export class ExpoUpdatesController {
  private logger = new Logger(ExpoUpdatesController.name);

  constructor(private readonly expoService: ExpoUpdatesService) {}

  @Get(':appId')
  async getManifest(
    @Req() req: Request,
    @Res() res: Response,
    @Param('appId') appId: string,
    @Headers('expo-runtime-version') expoRuntimeVersion: string,
    @Headers('expo-platform') expoPlatform: string,
    @Headers('expo-channel-name') expoChannelName: string,
    @Headers('expo-project-id') expoProjectId: string,
  ) {
    try {
      this.logger.log(`Received update request — appId: ${appId}, projectId: ${expoProjectId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${expoChannelName || 'production'}`);

      if (!expoRuntimeVersion || !expoPlatform) {
        return res.status(400).json({
          error: 'Missing required headers: expo-runtime-version or expo-platform',
        });
      }

      // If appId is generic (like "app"), try to use expo-project-id header
      const targetAppId = (appId === 'app' && expoProjectId) ? expoProjectId : appId;

      const resolvedChannel = (!expoChannelName || expoChannelName === 'default')
        ? 'production'
        : expoChannelName;

      const manifestResponse = await this.expoService.getLatestManifest(
        expoRuntimeVersion,
        expoPlatform,
        resolvedChannel,
        targetAppId,
      );

      if (!manifestResponse) {
        throw new NotFoundException('No update found for this runtime version and platform');
      }

      const { manifest } = manifestResponse;
      const boundary = `---${Date.now()}---`;

      // Set Required Protocol Headers
      res.setHeader('expo-protocol-version', '1');
      res.setHeader('expo-sfv-version', '0');
      res.setHeader('expo-manifest-filters', '[]');
      res.setHeader('cache-control', 'private, no-cache, no-store');
      res.setHeader('content-type', `multipart/mixed; boundary=${boundary}`);

      // Construct Multipart Body
      let body = '';
      
      // Part 1: Manifest
      body += `--${boundary}\r\n`;
      body += `Content-Type: application/json\r\n`;
      body += `Content-Disposition: inline; name="manifest"\r\n\r\n`;
      body += JSON.stringify(manifest);
      body += `\r\n--${boundary}--\r\n`;

      return res.send(body);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ error: error.message });
      }
      this.logger.error('Error serving manifest', error);
      throw new InternalServerErrorException('Failed to retrieve update manifest');
    }
  }
}
