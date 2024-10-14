/*
  Warnings:

  - Added the required column `institution_link` to the `educations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "educations" ADD COLUMN     "institution_link" TEXT NOT NULL;
