/*
  Warnings:

  - You are about to drop the column `descrition` on the `post_types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post_types" DROP COLUMN "descrition",
ADD COLUMN     "description" TEXT;
