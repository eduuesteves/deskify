/*
  Warnings:

  - You are about to drop the column `company_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Companies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "company_id",
DROP COLUMN "create_at",
DROP COLUMN "photo",
DROP COLUMN "role";

-- DropTable
DROP TABLE "Companies";
