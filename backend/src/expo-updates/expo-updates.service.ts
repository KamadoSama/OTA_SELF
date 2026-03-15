import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ExpoUpdatesService {
  private logger = new Logger(ExpoUpdatesService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async getLatestManifest(runtimeVersion: string, platform: string, channelName: string) {
    // 1. Find the specific channel and get the latest update that matches runtimeVersion & platform
    const latestUpdate = await this.prisma.update.findFirst({
      where: {
        runtimeVersion: runtimeVersion,
        platform: platform,
        channel: {
          name: channelName,
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assets: true,
      }
    });

    if (!latestUpdate) {
      return null;
    }

    // 2. Separate launch asset (JS bundle) from other assets (images, fonts)
    const launchAsset = latestUpdate.assets.find(a => a.isLaunchAsset);
    const otherAssets = latestUpdate.assets.filter(a => !a.isLaunchAsset);

    if (!launchAsset) {
      this.logger.error(`Update ${latestUpdate.id} has no launch asset!`);
      return null;
    }

    // 3. Format into the Expo Protocol standard manifest
    const manifest = {
      id: latestUpdate.id,
      createdAt: latestUpdate.createdAt.toISOString(),
      runtimeVersion: latestUpdate.runtimeVersion,
      launchAsset: {
        hash: launchAsset.hash,
        key: launchAsset.key,
        contentType: launchAsset.contentType,
        url: this.storageService.getPublicUrl(`${launchAsset.key}`),
        fileExtension: launchAsset.fileExtension || '.js',
      },
      assets: otherAssets.map(asset => ({
        hash: asset.hash,
        key: asset.key,
        contentType: asset.contentType,
        url: this.storageService.getPublicUrl(`${asset.key}`),
        fileExtension: asset.fileExtension,
      })),
      metadata: latestUpdate.metadata || {},
      extra: {
        expoClient: {
          // You can include custom app variables here
          // e.g., projectId: 'your-project-id'
        }
      }
    };

    return {
      manifest,
      // signature mechanism omitted for simplicity here, but required if you enforce it in expo app
      signature: 'TODO: Implement RS256 signature if needed'
    };
  }
}
