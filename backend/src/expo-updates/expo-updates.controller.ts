import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ExpoUpdatesService } from './expo-updates.service';

@Controller('api/update/manifest')
export class ExpoUpdatesController {
  private logger = new Logger(ExpoUpdatesController.name);

  constructor(private readonly expoService: ExpoUpdatesService) { }

  @Get(':appId')
  async getManifest(
    @Req() req: Request,
    @Res() res: Response,
    @Param('appId') appId: string,
    @Headers('expo-runtime-version') expoRuntimeVersion: string,
    @Headers('expo-platform') expoPlatform: string,
    @Headers('expo-channel-name') expoChannelName: string,
    @Headers('expo-project-id') expoProjectId: string,
    @Headers('expo-current-update-id') currentUpdateId: string,
    @Headers('expo-embedded-update-id') embeddedUpdateId: string,
    @Headers('expo-client-id') expoClientId?: string,
    @Headers('expo-device-id') expoDeviceId?: string,
  ) {
    try {
      this.logger.log(
        `Received update request — appId: ${appId}, projectId: ${expoProjectId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${expoChannelName || 'production'}`,
      );

      if (!expoRuntimeVersion || !expoPlatform) {
        return res.status(400).json({
          error:
            'Missing required headers: expo-runtime-version or expo-platform',
        });
      }

      // If appId is generic (like "app"), try to use expo-project-id header
      const targetAppId =
        appId === 'app' && expoProjectId ? expoProjectId : appId;

      const resolvedChannel =
        !expoChannelName || expoChannelName === 'default'
          ? 'production'
          : expoChannelName;

      const forwardedProto =
        typeof req.headers['x-forwarded-proto'] === 'string'
          ? req.headers['x-forwarded-proto'].split(',')[0]?.trim()
          : undefined;
      const protocol = forwardedProto || req.protocol;
      const host = req.get('host');
      const baseUrl = host ? `${protocol}://${host}` : undefined;

      const clientIdentifier = expoClientId || expoDeviceId || (req.ip as string) || 'anon-client';

      const manifestResponse = await this.expoService.getLatestManifest(
        expoRuntimeVersion,
        expoPlatform,
        resolvedChannel,
        targetAppId,
        baseUrl,
        clientIdentifier,
      );

      if (!manifestResponse) {
        this.logger.warn(
          `No update found — appId: ${targetAppId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${resolvedChannel}`,
        );
        throw new NotFoundException(
          'No update found for this runtime version and platform',
        );
      }

      const { manifest, extensions } = manifestResponse;

      // Protocol 1: If the client already has this update, return 204 No Content
      if (currentUpdateId === manifest.id || embeddedUpdateId === manifest.id) {
        this.logger.log(`Client already up-to-date: ${manifest.id} app name ${appId}`);
        void this.expoService.recordDeviceInstallation(manifest.id, clientIdentifier, expoPlatform);
        return res.status(204).send();
      }

      // Increment download count and record unique device installation
      await this.expoService.incrementDownloadCount(manifest.id);
      void this.expoService.recordDeviceInstallation(manifest.id, clientIdentifier, expoPlatform);

      // Création de la boundary sans caractères spéciaux problématiques
      const boundary = `ExpoManifestBoundary${Math.random().toString(36).slice(2)}`;

      // 1. On construit TOUT le corps multipart en une seule string avec les \r\n stricts
      const multipartBody =
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="manifest"\r\n` +
        `Content-Type: application/json; charset=utf-8\r\n\r\n` +
        JSON.stringify(manifest) +
        `\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="extensions"\r\n` +
        `Content-Type: application/json; charset=utf-8\r\n\r\n` +
        JSON.stringify(extensions ?? {}) +
        `\r\n` +
        `--${boundary}--\r\n`;

      // 2. Conversion en Buffer UTF-8 pour garantir la bonne taille
      const bodyBuffer = Buffer.from(multipartBody, 'utf8');

      // 3. Configuration stricte des headers Expo
      res.setHeader('expo-protocol-version', '1');
      res.setHeader('expo-sfv-version', '0');
      res.setHeader('expo-manifest-filters', '[]');
      res.setHeader('cache-control', 'private, no-cache, no-store');

      // Nettoyage et forçage du Content-Type et Content-Length
      res.removeHeader('content-type');
      res.setHeader('Content-Type', `multipart/mixed; boundary=${boundary}`);
      res.setHeader('Content-Length', bodyBuffer.length.toString());

      // 4. Envoi de la réponse d'un seul coup
      res.status(200).end(bodyBuffer);

      // 5. Retour vide pour empêcher NestJS de modifier la réponse Express
      return;

    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ error: error.message });
      }
      this.logger.error('Error serving manifest', error);
      throw new InternalServerErrorException(
        'Failed to retrieve update manifest',
      );
    }
  }
}