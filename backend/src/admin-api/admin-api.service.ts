import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';

type ExpoExportAssetDescriptor = {
  path: string;
  ext?: string;
};

type ExpoExportPlatformMetadata = {
  bundle: string;
  assets?: ExpoExportAssetDescriptor[];
};

type ExpoExportMetadata = {
  version: number;
  runtimeVersion?: string;
  fileMetadata: Record<string, ExpoExportPlatformMetadata>;
};

import { SubscriptionService } from '../subscription/subscription.service';

// Les clés d'objets OTA contiennent le hash du contenu (bundle index-<hash>.hbc, assets/<md5>) :
// elles ne changent jamais, un CDN ou proxy peut donc les garder en cache indéfiniment.
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

@Injectable()
export class AdminApiService {
  private logger = new Logger(AdminApiService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private subscriptionService: SubscriptionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private calculateHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private parseExpoMetadata(raw: unknown): ExpoExportMetadata {
    if (!this.isRecord(raw)) {
      throw new BadRequestException('Invalid metadata.json');
    }

    const version = raw.version;
    if (typeof version !== 'number') {
      throw new BadRequestException('Invalid metadata.json: missing version');
    }

    const runtimeVersion = raw.runtimeVersion;
    if (runtimeVersion !== undefined && typeof runtimeVersion !== 'string') {
      throw new BadRequestException(
        'Invalid metadata.json: invalid runtimeVersion',
      );
    }

    const fileMetadataRaw = raw.fileMetadata;
    if (!this.isRecord(fileMetadataRaw)) {
      throw new BadRequestException(
        'Invalid metadata.json: missing fileMetadata',
      );
    }

    const fileMetadata: Record<string, ExpoExportPlatformMetadata> = {};
    for (const [platform, platformRaw] of Object.entries(fileMetadataRaw)) {
      if (!this.isRecord(platformRaw)) {
        throw new BadRequestException(
          `Invalid metadata.json: invalid fileMetadata for ${platform}`,
        );
      }

      const bundle = platformRaw.bundle;
      if (typeof bundle !== 'string' || !bundle) {
        throw new BadRequestException(
          `Invalid metadata.json: missing bundle for ${platform}`,
        );
      }

      const assetsRaw = platformRaw.assets;
      let assets: ExpoExportAssetDescriptor[] | undefined;
      if (assetsRaw !== undefined) {
        if (!Array.isArray(assetsRaw)) {
          throw new BadRequestException(
            `Invalid metadata.json: invalid assets for ${platform}`,
          );
        }

        assets = assetsRaw.map((a) => {
          if (!this.isRecord(a)) {
            throw new BadRequestException(
              `Invalid metadata.json: invalid asset for ${platform}`,
            );
          }
          if (typeof a.path !== 'string' || !a.path) {
            throw new BadRequestException(
              `Invalid metadata.json: asset missing path for ${platform}`,
            );
          }
          if (a.ext !== undefined && typeof a.ext !== 'string') {
            throw new BadRequestException(
              `Invalid metadata.json: asset ext invalid for ${platform}`,
            );
          }
          return { path: a.path, ext: a.ext };
        });
      }

      fileMetadata[platform] = { bundle, assets };
    }

    return {
      version,
      runtimeVersion,
      fileMetadata,
    };
  }

  async listApps(customerId: string) {
    const apps = await this.prisma.app.findMany({
      where: { customerId },
      include: {
        channels: {
          include: {
            updates: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                _count: {
                  select: { installations: true },
                },
              },
            },
            _count: {
              select: { updates: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apps.map((app) => {
      let totalUpdates = 0;
      let latestUpdate: any = null;
      const channelNames = app.channels.map((c) => c.name);

      for (const channel of app.channels) {
        totalUpdates += channel._count.updates;
        const channelLatest = channel.updates[0];
        if (channelLatest) {
          if (
            !latestUpdate ||
            new Date(channelLatest.createdAt) > new Date(latestUpdate.createdAt)
          ) {
            latestUpdate = channelLatest;
          }
        }
      }

      return {
        id: app.id,
        name: app.name,
        scheme: app.scheme,
        createdAt: app.createdAt,
        channelsCount: app.channels.length,
        channels: channelNames,
        updatesCount: totalUpdates,
        latestUpdate: latestUpdate
          ? {
              id: latestUpdate.id,
              runtimeVersion: latestUpdate.runtimeVersion,
              platform: latestUpdate.platform,
              rolloutPercentage: latestUpdate.rolloutPercentage,
              isRollback: latestUpdate.isRollback,
              createdAt: latestUpdate.createdAt,
              installationsCount: latestUpdate._count?.installations ?? 0,
            }
          : null,
      };
    });
  }

  async createApp(name: string, customerId: string, scheme?: string) {
    const trimmed = name.trim();
    const existing = await this.prisma.app.findUnique({
      where: { name: trimmed },
    });
    if (existing) {
      throw new BadRequestException(
        `An application named '${trimmed}' already exists.`,
      );
    }

    await this.subscriptionService.checkCanCreateApp(customerId);

    const app = await this.prisma.app.create({
      data: {
        name: trimmed,
        scheme,
        customerId,
        channels: {
          create: [{ name: 'production' }, { name: 'staging' }],
        },
      },
      include: {
        channels: true,
      },
    });

    return app;
  }

  async listUpdates(
    customerId?: string,
    page = 1,
    limit = 10,
    search?: string,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    appName?: string,
  ) {
    const skip = (page - 1) * limit;
    const baseWhere: any = {};
    if (customerId) {
      baseWhere.channel = { app: { customerId } };
    }
    if (appName && appName.trim() !== '') {
      baseWhere.channel = {
        app: {
          name: appName.trim(),
          ...(customerId ? { customerId } : {}),
        },
      };
    }

    let where: any = { ...baseWhere };

    if (search && search.trim() !== '') {
      const term = search.trim();
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { runtimeVersion: { contains: term, mode: 'insensitive' } },
              { platform: { contains: term, mode: 'insensitive' } },
              { channel: { name: { contains: term, mode: 'insensitive' } } },
              {
                channel: {
                  app: { name: { contains: term, mode: 'insensitive' } },
                },
              },
            ],
          },
        ],
      };
    }

    let orderBy: any = { createdAt: sortOrder };
    if (sortBy === 'app') {
      orderBy = { channel: { app: { name: sortOrder } } };
    } else if (sortBy === 'channel') {
      orderBy = { channel: { name: sortOrder } };
    } else if (sortBy === 'runtimeVersion') {
      orderBy = { runtimeVersion: sortOrder };
    } else if (sortBy === 'platform') {
      orderBy = { platform: sortOrder };
    } else if (sortBy === 'downloadCount') {
      orderBy = { downloadCount: sortOrder };
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    }

    const [data, total] = await Promise.all([
      this.prisma.update.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          channel: {
            include: { app: true },
          },
          assets: {
            where: { isLaunchAsset: true },
            take: 1,
          },
          _count: {
            select: { installations: true },
          },
        },
      }),
      this.prisma.update.count({ where }),
    ]);

    const formattedData = data.map((u) => ({
      ...u,
      installationsCount: u._count?.installations ?? 0,
    }));

    return {
      data: formattedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAnalyticsHistory(customerId?: string, days = 14, appName?: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const where: any = {
      installedAt: { gte: startDate },
    };
    if (customerId) {
      where.update = {
        channel: {
          app: {
            customerId,
            ...(appName && appName.trim() !== ''
              ? { name: appName.trim() }
              : {}),
          },
        },
      };
    } else if (appName && appName.trim() !== '') {
      where.update = {
        channel: {
          app: {
            name: appName.trim(),
          },
        },
      };
    }

    const installations = await this.prisma.deviceInstallation.findMany({
      where,
      select: {
        installedAt: true,
        platform: true,
      },
      orderBy: { installedAt: 'asc' },
    });

    // Group by date (YYYY-MM-DD)
    const map = new Map<
      string,
      { date: string; total: number; ios: number; android: number }
    >();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map.set(key, { date: key, total: 0, ios: 0, android: 0 });
    }

    for (const inst of installations) {
      const key = inst.installedAt.toISOString().split('T')[0];
      const entry = map.get(key);
      if (entry) {
        entry.total++;
        if (inst.platform.toLowerCase() === 'ios') {
          entry.ios++;
        } else {
          entry.android++;
        }
      }
    }

    const totalUniqueDevices = await this.prisma.deviceInstallation.groupBy({
      by: ['deviceId'],
      where: customerId
        ? {
            update: {
              channel: {
                app: {
                  customerId,
                  ...(appName && appName.trim() !== ''
                    ? { name: appName.trim() }
                    : {}),
                },
              },
            },
          }
        : appName && appName.trim() !== ''
          ? { update: { channel: { app: { name: appName.trim() } } } }
          : {},
    });

    return {
      history: Array.from(map.values()),
      totalUniqueDevices: totalUniqueDevices.length,
    };
  }

  async deleteUpdate(id: string, customerId?: string) {
    const where: any = { id };
    if (customerId) {
      where.channel = { app: { customerId } };
    }

    const existing = await this.prisma.update.findFirst({ where });
    if (!existing) return null;
    await this.prisma.update.delete({ where: { id } });
    return true;
  }

  async processUpdateZip(
    zipBuffer: Buffer,
    appName: string,
    channelName: string,
    customerId?: string,
    overrideRuntimeVersion?: string,
    appVersion?: string,
    rolloutPercentage?: number,
  ): Promise<string> {
    // 1. Check subscription limits first
    if (customerId) {
      await this.subscriptionService.checkCanDeploy(customerId);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-update-'));

    try {
      const zip = new AdmZip(zipBuffer);
      zip.extractAllTo(tempDir, true);

      const metadataPath = path.join(tempDir, 'metadata.json');
      if (!fs.existsSync(metadataPath)) {
        throw new BadRequestException(
          'metadata.json not found in the root of the zip file.',
        );
      }

      const metadataRaw: unknown = JSON.parse(
        fs.readFileSync(metadataPath, 'utf8'),
      );
      const metadata = this.parseExpoMetadata(metadataRaw);

      if (metadata.version !== 0) {
        throw new BadRequestException(
          'Unsupported Expo export metadata version',
        );
      }

      let app = await this.prisma.app.findUnique({ where: { name: appName } });
      if (app) {
        if (customerId && app.customerId !== customerId) {
          throw new BadRequestException(
            `App name '${appName}' is already taken.`,
          );
        }
      } else {
        if (!customerId) {
          throw new BadRequestException('customerId is required for new apps.');
        }

        // 2. Check app limit for new apps
        await this.subscriptionService.checkCanCreateApp(customerId);

        app = await this.prisma.app.create({
          data: { name: appName, customerId: customerId },
        });
      }

      const channel = await this.prisma.channel.upsert({
        where: { appId_name: { appId: app.id, name: channelName } },
        update: {},
        create: { appId: app.id, name: channelName },
      });

      const runtimeVersion =
        metadata.runtimeVersion ?? overrideRuntimeVersion ?? '1.0.0';
      const platforms = Object.keys(metadata.fileMetadata);

      for (const platform of platforms) {
        const platformData = metadata.fileMetadata[platform];
        const bundleRelPath = platformData.bundle;

        const updateMetadata = { ...metadata };
        if (appVersion) {
          (updateMetadata as any).version = appVersion; // Inject appVersion here so service can read it
        }

        const safeRollout =
          rolloutPercentage !== undefined && !isNaN(Number(rolloutPercentage))
            ? Math.max(0, Math.min(100, Math.round(Number(rolloutPercentage))))
            : 100;

        const update = await this.prisma.update.create({
          data: {
            channelId: channel.id,
            runtimeVersion,
            platform,
            metadata: updateMetadata as any,
            rolloutPercentage: safeRollout,
            isRollback: false,
          },
        });

        // Conserver uniquement les 3 dernières mises à jour pour cette plateforme/canal
        const oldUpdates = await this.prisma.update.findMany({
          where: {
            channelId: channel.id,
            runtimeVersion,
            platform,
          },
          orderBy: { createdAt: 'desc' },
          skip: 3,
        });

        for (const oldUpdate of oldUpdates) {
          await this.prisma.update.delete({ where: { id: oldUpdate.id } });
          this.logger.log(
            `Suppression de l'ancienne mise à jour ${oldUpdate.id} pour ne garder que les 3 plus récentes.`,
          );
        }

        const bundlePath = path.join(tempDir, bundleRelPath);
        const bundleHash = this.calculateHash(bundlePath);

        await this.storage.uploadFile(
          bundlePath,
          bundleRelPath,
          'application/javascript',
          IMMUTABLE_CACHE_CONTROL,
        );

        await this.prisma.asset.create({
          data: {
            updateId: update.id,
            hash: bundleHash,
            key: bundleRelPath,
            contentType: 'application/javascript',
            fileExtension: '.js',
            isLaunchAsset: true,
          },
        });

        // 3. Upload assets in parallel for better performance
        if (platformData.assets && platformData.assets.length > 0) {
          await Promise.all(
            platformData.assets.map(async (asset) => {
              const assetPath = path.join(tempDir, asset.path);
              if (!fs.existsSync(assetPath)) return;

              const assetHash = this.calculateHash(assetPath);

              await this.storage.uploadFile(
                assetPath,
                asset.path,
                'application/octet-stream',
                IMMUTABLE_CACHE_CONTROL,
              );

              const existingAsset = await this.prisma.asset.findFirst({
                where: { updateId: update.id, hash: assetHash },
              });

              if (!existingAsset) {
                await this.prisma.asset.create({
                  data: {
                    updateId: update.id,
                    hash: assetHash,
                    key: asset.path,
                    contentType: 'application/octet-stream',
                    fileExtension: asset.ext ? `.${asset.ext}` : null,
                    isLaunchAsset: false,
                  },
                });
              }
            }),
          );
        }
      }

      // Invalidate manifest cache for all affected platforms
      const runtimeVersionForCache =
        metadata.runtimeVersion ?? overrideRuntimeVersion ?? '1.0.0';
      for (const platform of platforms) {
        const cacheKey = `manifest:${appName}:${runtimeVersionForCache}:${platform}:${channelName}`;
        await (this.cacheManager as any).del(cacheKey);
        this.logger.log(`Invalidated cache for ${cacheKey}`);
      }

      return platforms[0];
    } catch (error: any) {
      this.logger.error('Failed to process zip', error);
      throw new BadRequestException(
        'Failed to process the uploaded file: ' + error.message,
      );
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  async rollbackChannel(
    appName: string,
    channelName: string,
    customerId?: string,
  ) {
    const app = await this.prisma.app.findUnique({
      where: { name: appName },
      include: {
        channels: {
          where: { name: channelName },
        },
      },
    });

    if (!app) {
      throw new NotFoundException(`Application '${appName}' not found.`);
    }

    if (customerId && app.customerId !== customerId) {
      throw new BadRequestException('Unauthorized to manage this application.');
    }

    const channel = app.channels[0];
    if (!channel) {
      throw new NotFoundException(
        `Channel '${channelName}' not found for app '${appName}'.`,
      );
    }

    // Find the latest active (non-rollback) update
    const activeUpdate = await this.prisma.update.findFirst({
      where: {
        channelId: channel.id,
        isRollback: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeUpdate) {
      throw new BadRequestException(
        `No active update to rollback on channel '${channelName}'.`,
      );
    }

    // Mark it as rolled back
    await this.prisma.update.update({
      where: { id: activeUpdate.id },
      data: { isRollback: true },
    });

    // Re-publish previous update with a fresh timestamp and new UUID so mobile Expo clients
    // recognize it as a newer update than the rolled-back version and apply it immediately.
    const rePublished =
      await this.republishPreviousUpdateAsRollback(activeUpdate);

    // Invalidate manifest cache
    await (this.cacheManager as any).reset?.();

    this.logger.log(
      `Rollback completed on ${appName}/${channelName}. Rolled back ${activeUpdate.id}. Now active: ${rePublished?.id || 'embedded build'}`,
    );

    const rePublishedMessage =
      (rePublished?.metadata as any)?.message || 'previous release';

    return {
      success: true,
      rolledBackUpdateId: activeUpdate.id,
      nowActiveUpdateId: rePublished?.id || null,
      message: rePublished
        ? `Successfully rolled back. Previous release '${rePublishedMessage}' re-published with fresh timestamp to update all mobile devices.`
        : `Successfully rolled back. No previous release found; devices will revert to embedded build.`,
    };
  }

  private async republishPreviousUpdateAsRollback(rolledBackUpdate: {
    id: string;
    channelId: string;
    platform: string;
    runtimeVersion: string;
  }) {
    // Find the latest healthy update for the same channel, platform, and runtimeVersion
    const previousUpdate = await this.prisma.update.findFirst({
      where: {
        channelId: rolledBackUpdate.channelId,
        platform: rolledBackUpdate.platform,
        runtimeVersion: rolledBackUpdate.runtimeVersion,
        isRollback: false,
        id: { not: rolledBackUpdate.id },
      },
      orderBy: { createdAt: 'desc' },
      include: { assets: true },
    });

    if (!previousUpdate || previousUpdate.assets.length === 0) {
      this.logger.log(
        `No previous healthy update found on channel ${rolledBackUpdate.channelId} for runtime ${rolledBackUpdate.runtimeVersion} and platform ${rolledBackUpdate.platform}. Devices will revert to embedded build.`,
      );
      return null;
    }

    const prevMeta = (previousUpdate.metadata as Record<string, any>) || {};
    const commitInfo = prevMeta.gitCommit
      ? ` [commit ${prevMeta.gitCommit.slice(0, 7)}]`
      : '';
    const originMsg = prevMeta.message ? ` ("${prevMeta.message}")` : '';
    const rollbackMsg = `Rollback: reverted to previous release${commitInfo}${originMsg}`;

    const newUpdate = await this.prisma.update.create({
      data: {
        channelId: previousUpdate.channelId,
        platform: previousUpdate.platform,
        runtimeVersion: previousUpdate.runtimeVersion,
        rolloutPercentage: 100,
        isRollback: false,
        metadata: {
          ...prevMeta,
          message: rollbackMsg,
          isRollbackRepublish: true,
          rolledBackFromId: rolledBackUpdate.id,
          republishedFromId: previousUpdate.id,
        },
        assets: {
          create: previousUpdate.assets.map((asset) => ({
            hash: asset.hash,
            key: asset.key,
            contentType: asset.contentType,
            fileExtension: asset.fileExtension,
            isLaunchAsset: asset.isLaunchAsset,
          })),
        },
      },
      include: { assets: true },
    });

    this.logger.log(
      `Re-published update ${previousUpdate.id} as ${newUpdate.id} with timestamp ${newUpdate.createdAt.toISOString()} to force mobile Expo client downgrade.`,
    );

    return newUpdate;
  }

  async toggleUpdateRollback(updateId: string, customerId: string) {
    const update = await this.prisma.update.findUnique({
      where: { id: updateId },
      include: {
        channel: {
          include: { app: true },
        },
      },
    });

    if (!update) {
      throw new NotFoundException(`Update '${updateId}' not found.`);
    }

    if (update.channel.app.customerId !== customerId) {
      throw new BadRequestException('Unauthorized to modify this update.');
    }

    const newRollbackState = !update.isRollback;

    const updated = await this.prisma.update.update({
      where: { id: updateId },
      data: { isRollback: newRollbackState },
    });

    let rePublishedUpdate: any = null;

    if (newRollbackState === true) {
      rePublishedUpdate = await this.republishPreviousUpdateAsRollback(update);
    }

    // Invalidate manifest cache so Expo clients immediately get the updated active release
    await (this.cacheManager as any).reset?.();

    this.logger.log(
      `Update ${updateId} rollback toggled to ${newRollbackState} on ${update.channel.app.name}/${update.channel.name} by customer ${customerId}`,
    );

    const rePubMessage =
      rePublishedUpdate?.metadata?.message ||
      'reverting to previous stable build';

    return {
      success: true,
      updateId: updated.id,
      isRollback: updated.isRollback,
      rePublishedUpdateId: rePublishedUpdate?.id || null,
      appName: update.channel.app.name,
      channelName: update.channel.name,
      message: updated.isRollback
        ? rePublishedUpdate
          ? `Rollback appliqué avec succès. La version précédente (${rePubMessage}) a été republiée immédiatement pour forcer la mise à jour des appareils.`
          : `Rollback appliqué avec succès. Aucun déploiement antérieur : les appareils reviendront à la version native embarquée.`
        : `Version restaurée avec succès. Elle est de nouveau active.`,
    };
  }
}
