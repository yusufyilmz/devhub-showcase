/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `companies` table. All the data in the column will be lost.
  - Added the required column `role` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "logoUrl",
ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);
