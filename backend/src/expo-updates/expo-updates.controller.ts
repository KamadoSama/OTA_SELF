import { Controller, Get, Req, Res, Headers, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ExpoUpdatesService } from './expo-updates.service';

@Controller('api/manifest')
export class ExpoUpdatesController {
  private logger = new Logger(ExpoUpdatesController.name);

  constructor(private readonly expoService: ExpoUpdatesService) {}

  @Get()
  async getManifest(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('expo-runtime-version') expoRuntimeVersion: string,
    @Headers('expo-platform') expoPlatform: string,
    @Headers('expo-channel-name') expoChannelName: string,
    @Headers('expo-project-id') expoProjectId: string,
    @Headers('expo-expected-receipt-signature') expectedSignature: string,
  ) {
    try {
      this.logger.log(`Received update request — projectId: ${expoProjectId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${expoChannelName || 'default'}`);

      if (!expoRuntimeVersion || !expoPlatform) {
        return res.status(400).json({
          error: 'Missing required headers: expo-runtime-version or expo-platform',
        });
      }

      if (!expoProjectId) {
        return res.status(400).json({
          error: 'Missing required header: expo-project-id',
        });
      }

      const resolvedChannel = (!expoChannelName || expoChannelName === 'default')
        ? 'production'
        : expoChannelName;

      const manifestResponse = await this.expoService.getLatestManifest(
        expoRuntimeVersion,
        expoPlatform,
        resolvedChannel,
        expoProjectId,
      );

      if (!manifestResponse) {
        throw new NotFoundException('No update found for this runtime version and platform');
      }

      // Expo requires the protocol version and the signature
      res.setHeader('expo-protocol-version', '1');
      res.setHeader('expo-sfv-version', '0');
      
      // In a real production environment, you need to sign the multi-part dict with a private key
      // and send it via expo-signature header. We will simulate a non-signed standard response here 
      // or implement the basic protocol required if keys are provided.
      // res.setHeader('expo-signature', manifestResponse.signature);

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
