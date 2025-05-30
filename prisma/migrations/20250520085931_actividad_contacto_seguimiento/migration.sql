/*
  Warnings:

  - You are about to drop the column `askForInformationNote` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `askforinformation` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `followUp` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `followUpNote` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityContacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PartnerContacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_countryId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityContacts" DROP CONSTRAINT "_ActivityContacts_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityContacts" DROP CONSTRAINT "_ActivityContacts_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToPartner" DROP CONSTRAINT "_ActivityToPartner_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToPartner" DROP CONSTRAINT "_ActivityToPartner_B_fkey";

-- DropForeignKey
ALTER TABLE "_PartnerContacts" DROP CONSTRAINT "_PartnerContacts_A_fkey";

-- DropForeignKey
ALTER TABLE "_PartnerContacts" DROP CONSTRAINT "_PartnerContacts_B_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "askForInformationNote",
DROP COLUMN "askforinformation",
DROP COLUMN "followUp",
DROP COLUMN "followUpNote",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "sourceId" TEXT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "sourceId" TEXT;

-- DropTable
DROP TABLE "Partner";

-- DropTable
DROP TABLE "_ActivityContacts";

-- DropTable
DROP TABLE "_ActivityToPartner";

-- DropTable
DROP TABLE "_PartnerContacts";

-- CreateTable
CREATE TABLE "ActivityContactStatus" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL,
    "followUp" BOOLEAN,
    "followUpNote" TEXT,
    "askforinformation" BOOLEAN,
    "askForInformationNote" TEXT,

    CONSTRAINT "ActivityContactStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityContact" (
    "activityId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "attended" BOOLEAN,

    CONSTRAINT "ActivityContact_pkey" PRIMARY KEY ("activityId","contactId")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityContactStatus_activityId_contactId_key" ON "ActivityContactStatus"("activityId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_name_key" ON "Source"("name");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityContactStatus" ADD CONSTRAINT "ActivityContactStatus_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityContactStatus" ADD CONSTRAINT "ActivityContactStatus_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityContact" ADD CONSTRAINT "ActivityContact_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityContact" ADD CONSTRAINT "ActivityContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
