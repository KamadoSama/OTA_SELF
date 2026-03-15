import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as never);
  const prisma = new PrismaClient({ adapter } as never);

  const email = process.env.ADMIN_EMAIL ?? 'admin@ota.local';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';

  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      console.log(`✅ Admin already exists: ${email}`);
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.adminUser.create({ data: { email, passwordHash } });
    console.log(`🌱 Admin created: ${admin.email}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
