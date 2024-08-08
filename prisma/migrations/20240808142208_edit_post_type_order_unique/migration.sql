/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `post_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "post_types_order_key" ON "post_types"("order");
