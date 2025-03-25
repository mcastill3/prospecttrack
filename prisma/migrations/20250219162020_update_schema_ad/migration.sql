/*
  Warnings:

  - The primary key for the `_CampaignContacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_CampaignPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_CampaignToPartner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_EventContacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_EventPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_EventToPartner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_LeadPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CampaignContacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_CampaignPlayers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_CampaignToPartner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_EventContacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_EventPlayers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_EventToPartner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_LeadPlayers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AdCategory" AS ENUM ('GENERAL', 'OFFER', 'EVENT', 'NEWS');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY');

-- AlterTable
ALTER TABLE "_CampaignContacts" DROP CONSTRAINT "_CampaignContacts_AB_pkey";

-- AlterTable
ALTER TABLE "_CampaignPlayers" DROP CONSTRAINT "_CampaignPlayers_AB_pkey";

-- AlterTable
ALTER TABLE "_CampaignToPartner" DROP CONSTRAINT "_CampaignToPartner_AB_pkey";

-- AlterTable
ALTER TABLE "_EventContacts" DROP CONSTRAINT "_EventContacts_AB_pkey";

-- AlterTable
ALTER TABLE "_EventPlayers" DROP CONSTRAINT "_EventPlayers_AB_pkey";

-- AlterTable
ALTER TABLE "_EventToPartner" DROP CONSTRAINT "_EventToPartner_AB_pkey";

-- AlterTable
ALTER TABLE "_LeadPlayers" DROP CONSTRAINT "_LeadPlayers_AB_pkey";

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdReaction" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignContacts_AB_unique" ON "_CampaignContacts"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignPlayers_AB_unique" ON "_CampaignPlayers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToPartner_AB_unique" ON "_CampaignToPartner"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventContacts_AB_unique" ON "_EventContacts"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventPlayers_AB_unique" ON "_EventPlayers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToPartner_AB_unique" ON "_EventToPartner"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_LeadPlayers_AB_unique" ON "_LeadPlayers"("A", "B");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdReaction" ADD CONSTRAINT "AdReaction_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdReaction" ADD CONSTRAINT "AdReaction_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
