import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';
import { createHmac, createHash } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class ExpoUpdatesService {
  private logger = new Logger(ExpoUpdatesService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async isUpdateRolledBack(id?: string): Promise<boolean> {
    if (!id) return false;
    const u = await this.prisma.update.findUnique({
      where: { id },
      select: { isRollback: true },
    });
    return Boolean(u?.isRollback);
  }

  async getLatestManifest(
    runtimeVersion: string,
    platform: string,
    channelName: string,
    appId: string,
    baseUrl?: string,
    clientIdentifier?: string,
    currentUpdateId?: string,
  ) {
    // 1. Find the latest eligible (non-rollback) updates for this runtime & platform
    const eligibleUpdates = await this.prisma.update.findMany({
      where: {
        runtimeVersion: runtimeVersion,
        platform: platform,
        isRollback: false,
        channel: {
          name: channelName,
          app: {
            OR: [
              { name: appId },
              { id: appId },
            ],
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        assets: true,
        channel: {
          include: {
            app: true,
          },
        },
      },
    });

    if (currentUpdateId) {
      const currentRunning = await this.prisma.update.findUnique({
        where: { id: currentUpdateId },
      });
      if (currentRunning && currentRunning.isRollback) {
        this.logger.log(`Client is running update ${currentUpdateId} which has been marked as rolled back!`);
        // If the top eligible update was created BEFORE or AT the same time as currentRunning:
        // Expo updates client will refuse to downgrade unless the manifest timestamp is newer!
        if (eligibleUpdates.length > 0 && eligibleUpdates[0].createdAt <= currentRunning.createdAt) {
          const sourceUpdate = eligibleUpdates[0];
          this.logger.log(
            `Active update ${sourceUpdate.id} has createdAt <= rolled-back update ${currentRunning.id}. Auto re-publishing to ensure device applies rollback.`,
          );
          const prevMeta = (sourceUpdate.metadata as Record<string, any>) || {};
          const commitInfo = prevMeta.gitCommit ? ` [commit ${prevMeta.gitCommit.slice(0, 7)}]` : '';
          const rollbackMsg = `Rollback: reverted to previous release${commitInfo}`;

          const rePublished = await this.prisma.update.create({
            data: {
              channelId: sourceUpdate.channelId,
              platform: sourceUpdate.platform,
              runtimeVersion: sourceUpdate.runtimeVersion,
              rolloutPercentage: 100,
              isRollback: false,
              metadata: {
                ...prevMeta,
                message: rollbackMsg,
                isRollbackRepublish: true,
                rolledBackFromId: currentRunning.id,
                republishedFromId: sourceUpdate.id,
              },
              assets: {
                create: sourceUpdate.assets.map((asset) => ({
                  hash: asset.hash,
                  key: asset.key,
                  contentType: asset.contentType,
                  fileExtension: asset.fileExtension,
                  isLaunchAsset: asset.isLaunchAsset,
                })),
              },
            },
            include: {
              assets: true,
              channel: { include: { app: true } },
            },
          });
          eligibleUpdates.unshift(rePublished);
          await (this.cacheManager as any).reset?.();
        }
      }
    }

    if (!eligibleUpdates || eligibleUpdates.length === 0) {
      return null;
    }

    // 2. Progressive rollout logic:
    let latestUpdate = eligibleUpdates[0];
    const rollout = (latestUpdate as any).rolloutPercentage ?? 100;

    if (rollout < 100 && clientIdentifier) {
      let hashVal = 0;
      const seed = `${clientIdentifier}:${latestUpdate.id}`;
      for (let i = 0; i < seed.length; i++) {
        hashVal = (hashVal * 31 + seed.charCodeAt(i)) >>> 0;
      }
      const deviceBucket = hashVal % 100;

      // If device is outside the rollout cohort, fallback to previous stable update (100% rollout)
      if (deviceBucket >= rollout) {
        const stableFallback = eligibleUpdates.slice(1).find((u: any) => (u.rolloutPercentage ?? 100) >= 100);
        if (stableFallback) {
          latestUpdate = stableFallback;
        }
      }
    }

    const cacheKey = `manifest:${appId}:${latestUpdate.id}:${baseUrl || 'default'}`;
    const cachedManifest = await this.cacheManager.get<any>(cacheKey);

    if (cachedManifest) {
      return cachedManifest;
    }

    // 3. Separate launch asset (JS bundle) from other assets (images, fonts)
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

    const getEffectiveKey = (assetKey: string): string => {
      if (platform === 'ios') {
        return assetKey.split('/').pop() || assetKey;
      }
      return assetKey;
    };

    const getAssetUrl = (assetKey: string): string => {
      if (!shouldSignAssets || !assetBaseUrl) {
        return this.storageService.getPublicUrl(`${assetKey}`);
      }
      return `${assetBaseUrl}/api/assets/${this.encodeAssetKey(assetKey)}`;
    };

    const registerAssetHeaders = (assetKey: string) => {
      if (!shouldSignAssets) return;
      const effectiveKey = getEffectiveKey(assetKey);
      assetRequestHeaders[effectiveKey] = {
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
        key: getEffectiveKey(launchAsset.key),
        contentType: launchAsset.contentType,
        url: getAssetUrl(launchAsset.key),
        fileExtension: launchAsset.fileExtension || '.js',
      },
      assets: otherAssets.map((asset) => {
        const obj: any = {
          hash: asset.hash,
          key: getEffectiveKey(asset.key),
          contentType: asset.contentType,
          url: getAssetUrl(asset.key),
        };
        if (asset.fileExtension) {
          obj.fileExtension = asset.fileExtension;
        }
        return obj;
      }),
      metadata: {},
      extra: {
        expoClient: {
          name: appId,
          slug: appId,
          scheme: (latestUpdate.channel as any).app.scheme || appId.toLowerCase(),
          version: (latestUpdate.metadata as any)?.version ?? (latestUpdate.metadata as any)?.expoClient?.version ?? undefined,
          runtimeVersion: latestUpdate.runtimeVersion,
          platform: platform,
        },
      },
    };


    const response = {
      manifest,
      extensions: {
        assetRequestHeaders,
      },
      signature: 'TODO: Implement RS256 signature if needed',
    };

    // Store in cache for future requests
    await this.cacheManager.set(cacheKey, response);

    return response;
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

  async recordDeviceInstallation(
    updateId: string,
    clientIdentifier: string,
    platform: string,
  ) {
    try {
      const deviceIdHash = createHash('sha256')
        .update(clientIdentifier)
        .digest('hex');

      await this.prisma.deviceInstallation.upsert({
        where: {
          deviceId_updateId: {
            deviceId: deviceIdHash,
            updateId,
          },
        },
        create: {
          deviceId: deviceIdHash,
          updateId,
          platform: platform.toLowerCase(),
          installedAt: new Date(),
          lastSeenAt: new Date(),
        },
        update: {
          lastSeenAt: new Date(),
        },
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to record device installation for update ${updateId}: ${err.message}`,
      );
    }
  }
}
