/*
  Warnings:

  - You are about to drop the column `address` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CampaignToPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToPartner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkUserId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Player` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `sex` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('DIRECTOR_COMERCIAL', 'DIRECTOR_MARKETING', 'ANALISTA_COMERCIAL', 'ANALISTA_MARKETING');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "CampaignPlayer" DROP CONSTRAINT "CampaignPlayer_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignPlayer" DROP CONSTRAINT "CampaignPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_companyId_fkey";

-- DropForeignKey
ALTER TABLE "EventPlayer" DROP CONSTRAINT "EventPlayer_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventPlayer" DROP CONSTRAINT "EventPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_playerId_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToPartner" DROP CONSTRAINT "_CampaignToPartner_A_fkey";

-- DropForeignKey
ALTER TABLE "_CampaignToPartner" DROP CONSTRAINT "_CampaignToPartner_B_fkey";

-- DropForeignKey
ALTER TABLE "_EventToPartner" DROP CONSTRAINT "_EventToPartner_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToPartner" DROP CONSTRAINT "_EventToPartner_B_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "address",
DROP COLUMN "country",
ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "countryId" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "PlayerRole" NOT NULL;

-- DropTable
DROP TABLE "Campaign";

-- DropTable
DROP TABLE "CampaignPlayer";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventPlayer";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "Partner";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "_CampaignToPartner";

-- DropTable
DROP TABLE "_EventToPartner";

-- DropEnum
DROP TYPE "CampaignStatus";

-- DropEnum
DROP TYPE "CampaignType";

-- DropEnum
DROP TYPE "ContactType";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "LeadStatus";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserSex";

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkUserId_key" ON "Admin"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_clerkUserId_key" ON "Player"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
