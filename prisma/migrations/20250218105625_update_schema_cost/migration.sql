/*
  Warnings:

  - You are about to drop the column `cost` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "cost",
ADD COLUMN     "costId" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "cost",
ADD COLUMN     "costId" TEXT;

-- CreateTable
CREATE TABLE "Cost" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_costId_fkey" FOREIGN KEY ("costId") REFERENCES "Cost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_costId_fkey" FOREIGN KEY ("costId") REFERENCES "Cost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
