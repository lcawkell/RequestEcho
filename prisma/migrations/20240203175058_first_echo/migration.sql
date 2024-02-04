/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "Echo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "args" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Echo_pkey" PRIMARY KEY ("id")
);
