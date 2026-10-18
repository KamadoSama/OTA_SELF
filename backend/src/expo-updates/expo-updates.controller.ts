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
    @Headers('expo-current-update-id') currentUpdateId: string,
    @Headers('expo-embedded-update-id') embeddedUpdateId: string,
    @Headers('eas-client-id') easClientId?: string,
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

      const clientIdentifier =
        easClientId ||
        expoClientId ||
        expoDeviceId ||
        (req.ip as string) ||
        'anon-client';

      const manifestResponse = await this.expoService.getLatestManifest(
        expoRuntimeVersion,
        expoPlatform,
        resolvedChannel,
        targetAppId,
        baseUrl,
        clientIdentifier,
        currentUpdateId,
      );

      if (!manifestResponse) {
        if (
          currentUpdateId &&
          (await this.expoService.isUpdateRolledBack(currentUpdateId))
        ) {
          this.logger.log(
            `Client running rolled back update ${currentUpdateId} and no other OTA release is active. Sending rollBackToEmbedded directive.`,
          );
          const boundary = `ExpoManifestBoundary${Math.random().toString(36).slice(2)}`;
          const directive = {
            type: 'rollBackToEmbedded',
            parameters: {
              commitTime: new Date().toISOString(),
            },
          };

          const multipartBody =
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="directive"\r\n` +
            `Content-Type: application/json; charset=utf-8\r\n\r\n` +
            JSON.stringify(directive) +
            `\r\n` +
            `--${boundary}--\r\n`;

          const bodyBuffer = Buffer.from(multipartBody, 'utf8');

          res.setHeader('expo-protocol-version', '1');
          res.setHeader('expo-sfv-version', '0');
          res.setHeader('cache-control', 'private, no-cache, no-store');
          res.setHeader(
            'Content-Type',
            `multipart/mixed; boundary=${boundary}`,
          );
          res.setHeader('Content-Length', bodyBuffer.length.toString());
          return res.status(200).end(bodyBuffer);
        }

        this.logger.warn(
          `No update found — appId: ${targetAppId}, runtime: ${expoRuntimeVersion}, platform: ${expoPlatform}, channel: ${resolvedChannel}`,
        );
        throw new NotFoundException(
          'No update found for this runtime version and platform',
        );
      }

      const { manifest, extensions } = manifestResponse;

      // Protocol 1: If the client already has this update, return 204 No Content
      // iOS peut envoyer les UUID en majuscules : comparaison insensible à la casse
      const latestId = manifest.id.toLowerCase();
      if (
        currentUpdateId?.toLowerCase() === latestId ||
        embeddedUpdateId?.toLowerCase() === latestId
      ) {
        this.logger.log(
          `Client already up-to-date: ${manifest.id} app name ${appId}`,
        );
        void this.expoService.recordDeviceInstallation(
          manifest.id,
          clientIdentifier,
          expoPlatform,
        );
        return res.status(204).send();
      }

      // Anti-doublon : l'app peut demander la même mise à jour plusieurs fois au lancement
      // (checkAutomatically + fetchUpdateAsync()). Seule la première requête reçoit le manifest,
      // les suivantes reçoivent 204 pour éviter des téléchargements parallèles des mêmes fichiers.
      if (
        easClientId &&
        !(await this.expoService.claimManifestDelivery(
          easClientId,
          manifest.id,
        ))
      ) {
        this.logger.log(
          `Duplicate manifest request suppressed: ${manifest.id} — app: ${targetAppId}, client: ${easClientId}`,
        );
        return res.status(204).send();
      }

      // Diagnostic bande passante : quel ID le téléphone dit-il exécuter quand on lui renvoie le manifest ?
      this.logger.log(
        `Serving manifest ${manifest.id} — app: ${targetAppId}, platform: ${expoPlatform}, current: ${currentUpdateId || 'none'}, embedded: ${embeddedUpdateId || 'none'}, client: ${easClientId || 'none'}`,
      );

      // Increment download count and record unique device installation
      this.expoService.incrementDownloadCount(manifest.id);
      void this.expoService.recordDeviceInstallation(
        manifest.id,
        clientIdentifier,
        expoPlatform,
      );

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
