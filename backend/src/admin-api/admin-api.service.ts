import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AdminApiService {
  private logger = new Logger(AdminApiService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService
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

  async listUpdates() {
    return this.prisma.update.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        channel: {
          include: { app: true },
        },
        assets: {
          where: { isLaunchAsset: true },
          take: 1,
        },
      },
    });
  }

  async deleteUpdate(id: string) {
    const existing = await this.prisma.update.findUnique({ where: { id } });
    if (!existing) return null;
    await this.prisma.update.delete({ where: { id } });
    return true;
  }

  async processUpdateZip(zipBuffer: Buffer, appName: string, channelName: string): Promise<string> {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-update-'));
    
    try {
      const zip = new AdmZip(zipBuffer);
      zip.extractAllTo(tempDir, true);

      // Check for metadata.json
      const metadataPath = path.join(tempDir, 'metadata.json');
      if (!fs.existsSync(metadataPath)) {
        throw new BadRequestException('metadata.json not found in the root of the zip file. Make sure you compress the contents of the dist folder, not the dist folder itself.');
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      // Validate metadata version
      if (metadata.version !== 0) {
        throw new BadRequestException('Unsupported Expo export metadata version');
      }

      // Upsert App and Channel 
      // Note: in a real app, projectId might come from a header or JWT
      const app = await this.prisma.app.upsert({
        where: { name: appName },
        update: {},
        create: { name: appName }
      });

      const channel = await this.prisma.channel.upsert({
        where: { appId_name: { appId: app.id, name: channelName } },
        update: {},
        create: { appId: app.id, name: channelName }
      });

      // Expo metadata.json uses `bundle` (not `bundleUrl`) and `runtimeVersion`
      const runtimeVersion = metadata.runtimeVersion ?? '1.0.0';
      const platforms = Object.keys(metadata.fileMetadata);

      // Create one Update per platform
      for (const platform of platforms) {
        const platformData = metadata.fileMetadata[platform];

        // 'bundle' is the correct field name in Expo's metadata.json
        const bundleRelPath: string | undefined = platformData.bundle;
        if (!bundleRelPath) {
          throw new BadRequestException(`Missing 'bundle' field in metadata.json for platform: ${platform}`);
        }

        const update = await this.prisma.update.create({
          data: {
            channelId: channel.id,
            runtimeVersion,
            platform,
            metadata: metadata,
          }
        });

        // Upload Launch Asset (JS bundle)
        const bundlePath = path.join(tempDir, bundleRelPath);
        const bundleHash = this.calculateHash(bundlePath);

        await this.storage.uploadFile(bundlePath, bundleRelPath, 'application/javascript');

        await this.prisma.asset.create({
          data: {
            updateId: update.id,
            hash: bundleHash,
            key: bundleRelPath,
            contentType: 'application/javascript',
            fileExtension: '.js',
            isLaunchAsset: true
          }
        });

        // Upload other assets (images, fonts, etc.)
        for (const asset of (platformData.assets ?? [])) {
          const assetPath = path.join(tempDir, asset.path);
          if (!fs.existsSync(assetPath)) continue;

          const assetHash = this.calculateHash(assetPath);

          await this.storage.uploadFile(assetPath, asset.path, 'application/octet-stream');

          // Avoid duplicates across platforms by checking hash
          const existingAsset = await this.prisma.asset.findFirst({
            where: { updateId: update.id, hash: assetHash }
          });

          if (!existingAsset) {
            await this.prisma.asset.create({
              data: {
                updateId: update.id,
                hash: assetHash,
                key: asset.path,
                contentType: 'application/octet-stream',
                fileExtension: asset.ext ? `.${asset.ext}` : null,
                isLaunchAsset: false
              }
            });
          }
        }

        this.logger.log(`Successfully processed update ${update.id} for platform ${platform}`);
      }

      return platforms[0];

    } catch (error) {
      this.logger.error('Failed to process zip', error);
      throw new BadRequestException('Failed to process the uploaded file: ' + error.message);
    } finally {
      // Cleanup temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
