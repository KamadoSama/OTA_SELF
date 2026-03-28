import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Request, Response } from 'express';
import { StorageService } from './storage.service';

@Controller('api/assets')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  private decodeAssetKey(encodedKey: string): string {
    try {
      return Buffer.from(encodedKey, 'base64url').toString('utf8');
    } catch {
      throw new BadRequestException('Invalid asset key encoding');
    }
  }

  private verifyAuthorization(
    assetKey: string,
    authorizationHeader: string | undefined,
  ) {
    const secret = process.env.OTA_ASSET_HMAC_SECRET;
    if (!secret) return;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [scheme, token] = authorizationHeader.split(' ', 2);
    if (scheme !== 'OTA-HMAC-SHA256' || !token) {
      throw new UnauthorizedException('Invalid authorization scheme');
    }

    const dashIndex = token.indexOf('-');
    if (dashIndex === -1) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const expiresRaw = token.slice(0, dashIndex);
    const signature = token.slice(dashIndex + 1);
    const expiresAtSeconds = Number(expiresRaw);
    if (!Number.isFinite(expiresAtSeconds)) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (expiresAtSeconds < nowSeconds - 30) {
      throw new UnauthorizedException('Authorization token expired');
    }

    const payload = `${assetKey}:${expiresAtSeconds}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      throw new UnauthorizedException('Invalid authorization signature');
    }
  }

  @Get(':encodedKey')
  async getAsset(
    @Req() req: Request,
    @Res() res: Response,
    @Param('encodedKey') encodedKey: string,
  ) {
    const assetKey = this.decodeAssetKey(encodedKey);
    if (!assetKey) {
      throw new BadRequestException('Missing asset key');
    }

    this.verifyAuthorization(assetKey, req.headers.authorization);

    try {
      const stat = await this.storage.statObject(assetKey);
      const dataStream = await this.storage.getObjectStream(assetKey);

      const metaData = stat.metaData as Record<string, string> | undefined;
      const contentType =
        metaData?.['content-type'] ||
        metaData?.['Content-Type'] ||
        'application/octet-stream';
      res.setHeader('content-type', contentType);
      if (typeof stat.size === 'number') {
        res.setHeader('content-length', String(stat.size));
      }
      res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store');

      dataStream.on('error', () => {
        if (!res.headersSent) {
          res.status(404).send('Not found');
        } else {
          res.end();
        }
      });

      return dataStream.pipe(res);
    } catch {
      throw new NotFoundException('Asset not found');
    }
  }
}
