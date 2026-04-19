import { PrismaClient, SubscriptionTier } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'tahoarthur@gmail.com';
  const password = '12345678';

  console.log('🌱 Seeding database...');

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Customer already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        email,
        passwordHash,
        subscriptionTier: SubscriptionTier.PRO,
      },
    });
    console.log(`👤 Customer created: ${customer.email}`);

    // Create a default app for the customer
    const app = await prisma.app.create({
      data: {
        name: 'my-mobile-app',
        customerId: customer.id,
      },
    });
    console.log(`📱 App created: ${app.name}`);

    // Create initial invoices
    await prisma.invoice.createMany({
      data: [
        { customerId: customer.id, amount: 49.0, status: 'PAID', date: new Date('2026-04-18') },
        { customerId: customer.id, amount: 49.0, status: 'PAID', date: new Date('2026-03-18') },
      ]
    });
    console.log(`🧾 Initial invoices created`);
  }

  console.log('🏁 Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
