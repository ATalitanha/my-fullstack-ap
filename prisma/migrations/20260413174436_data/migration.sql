/*
  Warnings:

  - You are about to drop the column `body` on the `DataRepo` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `DataRepo` table. All the data in the column will be lost.
  - Added the required column `formula` to the `DataRepo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `DataRepo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataRepo" DROP COLUMN "body",
DROP COLUMN "title",
ADD COLUMN     "formula" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
