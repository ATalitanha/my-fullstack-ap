/*
  Warnings:

  - You are about to drop the `DataRepo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."DataRepo";

-- CreateTable
CREATE TABLE "Formula" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Formula_pkey" PRIMARY KEY ("id")
);
