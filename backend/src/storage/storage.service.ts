import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private logger = new Logger(StorageService.name);
  private bucketName = 'expo-updates';
  
  constructor() {
    console.log('User:', process.env.MINIO_ROOT_USER);
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });
  }

  async onModuleInit() {
    try {

      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        
        // Make bucket public for reading
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        this.logger.log(`Created MinIO bucket "${this.bucketName}" and set to public read`);
      } else {
        this.logger.log(`MinIO bucket "${this.bucketName}" already exists`);
      }
    } catch (error) {
      this.logger.error('Error initializing MinIO bucket', error);
    }
  }

  async uploadFile(filePath: string, destFileName: string, contentType: string): Promise<string> {
    const metaData = {
      'Content-Type': contentType,
    };
    
    await this.minioClient.fPutObject(this.bucketName, destFileName, filePath, metaData);
    return `http://localhost:9000/${this.bucketName}/${destFileName}`;
  }

  getPublicUrl(objectName: string): string {
    return `http://localhost:9000/${this.bucketName}/${objectName}`;
  }
}
