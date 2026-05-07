/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Formula` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Formula" DROP COLUMN "createdAt",
ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Formula" ADD CONSTRAINT "Formula_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
