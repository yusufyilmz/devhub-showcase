-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('PENDING', 'APPROVED');

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "state" "ReviewState" NOT NULL DEFAULT 'PENDING',
    "referral_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_referral_id_key" ON "reviews"("referral_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "referrals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
