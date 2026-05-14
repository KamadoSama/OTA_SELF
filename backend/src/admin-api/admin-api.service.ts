import { Injectable, Logger, BadRequestException, Inject } from '@nestjs/common';
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

  async listUpdates(customerId?: string, page = 2, limit = 5) {
    const skip = (page - 1) * limit;
    const where = customerId ? { channel: { app: { customerId } } } : {};

    const [data, total] = await Promise.all([
      this.prisma.update.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
        },
      }),
      this.prisma.update.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
          throw new BadRequestException(`App name '${appName}' is already taken.`);
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

      const runtimeVersion = metadata.runtimeVersion ?? overrideRuntimeVersion ?? '1.0.0';
      const platforms = Object.keys(metadata.fileMetadata);

      for (const platform of platforms) {
        const platformData = metadata.fileMetadata[platform];
        const bundleRelPath = platformData.bundle;
        
        const updateMetadata = { ...metadata };
        if (appVersion) {
            (updateMetadata as any).version = appVersion; // Inject appVersion here so service can read it
        }

        const update = await this.prisma.update.create({
          data: {
            channelId: channel.id,
            runtimeVersion,
            platform,
            metadata: updateMetadata as any,
          },
        });

        const bundlePath = path.join(tempDir, bundleRelPath);
        const bundleHash = this.calculateHash(bundlePath);

        await this.storage.uploadFile(
          bundlePath,
          bundleRelPath,
          'application/javascript',
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
          await Promise.all(platformData.assets.map(async (asset) => {
            const assetPath = path.join(tempDir, asset.path);
            if (!fs.existsSync(assetPath)) return;

            const assetHash = this.calculateHash(assetPath);

            await this.storage.uploadFile(
              assetPath,
              asset.path,
              'application/octet-stream',
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
          }));
        }
      }

      // Invalidate manifest cache for all affected platforms
      const runtimeVersionForCache = metadata.runtimeVersion ?? overrideRuntimeVersion ?? '1.0.0';
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
}
