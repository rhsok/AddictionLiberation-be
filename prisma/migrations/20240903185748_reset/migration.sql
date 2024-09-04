/*
  Warnings:

  - You are about to drop the column `position` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "position",
ADD COLUMN     "order" INTEGER;
