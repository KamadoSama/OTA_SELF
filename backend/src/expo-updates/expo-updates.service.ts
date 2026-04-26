import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';
import { createHmac } from 'crypto';

@Injectable()
export class ExpoUpdatesService {
  private logger = new Logger(ExpoUpdatesService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private shouldSignAssetRequests(): boolean {
    return Boolean(process.env.OTA_ASSET_HMAC_SECRET);
  }

  private encodeAssetKey(assetKey: string): string {
    return Buffer.from(assetKey, 'utf8').toString('base64url');
  }

  private createAssetAuthorizationHeader(
    assetKey: string,
    expiresAtSeconds: number,
  ): string {
    const secret = process.env.OTA_ASSET_HMAC_SECRET;
    if (!secret) {
      throw new Error(
        'OTA_ASSET_HMAC_SECRET is required to sign asset requests',
      );
    }

    const payload = `${assetKey}:${expiresAtSeconds}`;
    const signature = createHmac('sha256', secret)
      .update(payload)
      .digest('base64url');
    return `OTA-HMAC-SHA256 ${expiresAtSeconds}-${signature}`;
  }

  async getLatestManifest(
    runtimeVersion: string,
    platform: string,
    channelName: string,
    appId: string,
    baseUrl?: string,
  ) {
    // 1. Find the specific channel and get the latest update that matches runtimeVersion & platform
    const latestUpdate = await this.prisma.update.findFirst({
      where: {
        runtimeVersion: runtimeVersion,
        platform: platform,
        channel: {
          name: channelName,
          app: {
            name: appId, // appId from URL param → App.name in DB
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assets: true,
      },
    });

    if (!latestUpdate) {
      return null;
    }

    // 2. Separate launch asset (JS bundle) from other assets (images, fonts)
    const launchAsset = latestUpdate.assets.find((a) => a.isLaunchAsset);
    const otherAssets = latestUpdate.assets.filter((a) => !a.isLaunchAsset);

    if (!launchAsset) {
      this.logger.error(`Update ${latestUpdate.id} has no launch asset!`);
      return null;
    }

    // 3. Format into the Expo Protocol standard manifest
    const shouldSignAssets = this.shouldSignAssetRequests() && Boolean(baseUrl);
    const assetBaseUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}` : undefined;
    const expiresAtSeconds = Math.floor(Date.now() / 1000) + 15 * 60;
    const assetRequestHeaders: Record<string, Record<string, string>> = {};

    const getAssetUrl = (assetKey: string): string => {
      if (!shouldSignAssets || !assetBaseUrl) {
        return this.storageService.getPublicUrl(`${assetKey}`);
      }
      return `${assetBaseUrl}/api/assets/${this.encodeAssetKey(assetKey)}`;
    };

    const registerAssetHeaders = (assetKey: string) => {
      if (!shouldSignAssets) return;
      assetRequestHeaders[assetKey] = {
        authorization: this.createAssetAuthorizationHeader(
          assetKey,
          expiresAtSeconds,
        ),
      };
    };

    registerAssetHeaders(launchAsset.key);
    for (const asset of otherAssets) registerAssetHeaders(asset.key);

    const manifest = {
      id: latestUpdate.id,
      createdAt: latestUpdate.createdAt.toISOString(),
      runtimeVersion: latestUpdate.runtimeVersion,
      launchAsset: {
        hash: launchAsset.hash,
        key: launchAsset.key,
        contentType: launchAsset.contentType,
        url: getAssetUrl(launchAsset.key),
        fileExtension: launchAsset.fileExtension || '.js',
      },
      assets: otherAssets.map((asset) => ({
        hash: asset.hash,
        key: asset.key,
        contentType: asset.contentType,
        url: getAssetUrl(asset.key),
        fileExtension: asset.fileExtension,
      })),
      metadata: latestUpdate.metadata || {},
      extra: {
        expoClient: {
          // You can include custom app variables here
          // e.g., projectId: 'your-project-id'
        },
      },
    };

    return {
      manifest,
      extensions: {
        assetRequestHeaders,
      },
      // signature mechanism omitted for simplicity here, but required if you enforce it in expo app
      signature: 'TODO: Implement RS256 signature if needed',
    };
  }

  async incrementDownloadCount(updateId: string) {
    this.prisma.update
      .update({
        where: { id: updateId },
        data: { downloadCount: { increment: 1 } },
      })
      .catch((err) =>
        this.logger.error(
          `Failed to increment download count for update ${updateId}: ${err.message}`,
        ),
      );
  }
}
