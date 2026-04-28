-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "cardBrand" TEXT,
ADD COLUMN     "cardExpMonth" INTEGER,
ADD COLUMN     "cardExpYear" INTEGER,
ADD COLUMN     "cardLast4" TEXT,
ADD COLUMN     "preferences" JSONB DEFAULT '{"notifEmail": true, "notifUsage": true, "devMode": false}',
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3),
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);
