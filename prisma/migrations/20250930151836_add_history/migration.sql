-- CreateTable
CREATE TABLE "HistoryItem" (
    "id" TEXT NOT NULL,
    "expr" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoryItem_pkey" PRIMARY KEY ("id")
);
