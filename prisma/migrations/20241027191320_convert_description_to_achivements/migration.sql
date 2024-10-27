/*
  Warnings:

  - You are about to drop the column `description` on the `experiences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "description",
ADD COLUMN     "achievements" TEXT[];
