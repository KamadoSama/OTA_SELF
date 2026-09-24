import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(
      pool as unknown as ConstructorParameters<typeof PrismaPg>[0],
    );
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    try {
      await this.$executeRawUnsafe(`
        ALTER TABLE "Update" ADD COLUMN IF NOT EXISTS "rolloutPercentage" INTEGER DEFAULT 100;
        ALTER TABLE "Update" ADD COLUMN IF NOT EXISTS "isRollback" BOOLEAN DEFAULT false;
        CREATE TABLE IF NOT EXISTS "DeviceInstallation" (
          "id" TEXT PRIMARY KEY,
          "deviceId" TEXT NOT NULL,
          "updateId" TEXT NOT NULL REFERENCES "Update"("id") ON DELETE CASCADE,
          "platform" TEXT NOT NULL,
          "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "DeviceInstallation_deviceId_updateId_key" ON "DeviceInstallation"("deviceId", "updateId");
        CREATE INDEX IF NOT EXISTS "DeviceInstallation_updateId_installedAt_idx" ON "DeviceInstallation"("updateId", "installedAt");
      `);
    } catch (e) {
      console.warn('Auto schema self-healing warning:', e);
    }
  }
}
