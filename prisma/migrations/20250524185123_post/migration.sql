-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "relase_year" INTEGER NOT NULL,
    "relase_month" INTEGER NOT NULL,
    "relase_day" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);
