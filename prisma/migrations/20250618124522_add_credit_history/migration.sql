/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "CreditHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CreditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditHistory_userId_idx" ON "CreditHistory"("userId");

-- AddForeignKey
ALTER TABLE "CreditHistory" ADD CONSTRAINT "CreditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
