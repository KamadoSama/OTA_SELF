import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PrismaService } from '../prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AdminApiService {
  private logger = new Logger(AdminApiService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService
  ) {}

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

      // Create Update transaction
      const update = await this.prisma.update.create({
        data: {
          channelId: channel.id,
          runtimeVersion: metadata.fileMetadata[Object.keys(metadata.fileMetadata)[0]].bundleUrl.includes('ios') ? '1.0.0' : '1.0.0', // simplified
          platform: 'ios', // we will do one for each in a real implementation
          metadata: metadata,
        }
      });

      // Process and upload Launch Asset (the JS bundle)
      // Expo metadata.json has fileMetadata which contains bundle and assets
      const platforms = Object.keys(metadata.fileMetadata);
      for (const platform of platforms) {
        const platformData = metadata.fileMetadata[platform];
        const bundlePath = path.join(tempDir, platformData.bundleUrl);
        const bundleHash = path.basename(platformData.bundleUrl, '.js');
        
        await this.storage.uploadFile(bundlePath, platformData.bundleUrl, 'application/javascript');

        await this.prisma.asset.create({
          data: {
            updateId: update.id,
            hash: bundleHash,
            key: platformData.bundleUrl,
            contentType: 'application/javascript',
            fileExtension: '.js',
            isLaunchAsset: true
          }
        });

        // Process other assets (images, fonts, etc)
        for (const asset of platformData.assets) {
          const assetPath = path.join(tempDir, asset.path);
          if (fs.existsSync(assetPath)) {
            // Usually ext is empty and it uses the hash file directly
            await this.storage.uploadFile(assetPath, asset.path, 'application/octet-stream');
            
            // Only add once across platforms if hash matches
            const existingAsset = await this.prisma.asset.findFirst({ where: { updateId: update.id, hash: asset.hash } });
            if (!existingAsset) {
                await this.prisma.asset.create({
                data: {
                    updateId: update.id,
                    hash: asset.ext ? `${asset.hash}.${asset.ext}` : asset.hash,
                    key: asset.path,
                    contentType: 'application/octet-stream', // Could lookup by ext
                    fileExtension: asset.ext ? `.${asset.ext}` : null,
                    isLaunchAsset: false
                }
                });
            }
          }
        }
      }

      this.logger.log(`Successfully processed update ${update.id}`);
      return update.id;

    } catch (error) {
      this.logger.error('Failed to process zip', error);
      throw new BadRequestException('Failed to process the uploaded file: ' + error.message);
    } finally {
      // Cleanup temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
