-- CreateEnum
CREATE TYPE "JobTitle" AS ENUM ('CEO', 'CIO', 'CFO', 'CTO', 'CISO', 'COO', 'ARCHITECT', 'STO', 'IT_MANAGEMENT', 'INFORMATION_SECURITY', 'INFRAESTRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('TO_BE_QUALIFIED', 'INTERESTED', 'INTERESTED_IN_OTHER_SOLUTIONS', 'NOT_INTERESTED', 'RESEND_INFORMATION', 'NO_CURRENT_NEED_CONTACT_IN_THE_FUTURE', 'MEETING_CLOSED', 'INFORMATION_REQUEST');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WEBINAR', 'TRADESHOW', 'PHYSICAL_EVENT', 'LINKEDIN_CAMPAIGN', 'GOOGLE_CAMPAIGN', 'PAID_MEDIA_BRANDED_CONTENT', 'WEBSITE_FORM', 'WEBSITE_REFERRAL', 'WEBINAR_WITH_VENDOR', 'TRADESHOW_WITH_VENDOR', 'PHYSICAL_EVENT_WITH_VENDOR', 'VENDOR_REFERRAL', 'BDR', 'DIGITAL_SALES');

-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('DIRECTOR_COMERCIAL', 'DIRECTOR_MARKETING', 'ANALISTA_COMERCIAL', 'ANALISTA_MARKETING', 'DIGITAL_SALES');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TO_DO', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'OPEN', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'MXN');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'RISKY', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PROSPECT', 'CLIENT', 'PARTNER');

-- CreateEnum
CREATE TYPE "CompanyTemperature" AS ENUM ('COLD', 'WARM');

-- CreateEnum
CREATE TYPE "CompanySector" AS ENUM ('AGRICULTURE_AND_FARMING', 'CONSTRUCTION_AND_INFRASTRUCTURE', 'CONSUMER_AND_RETAIL', 'DEFENSE_AND_SECURITY', 'DESIGN_AND_CREATIVE', 'EDUCATION', 'ENERGY_AND_ENVIRONMENT', 'EVENTS_AND_HOSPITALITY', 'FINANCE_AND_INSURANCE', 'HEALTH_AND_WELLNESS', 'INDUSTRY_AND_MANUFACTURING', 'INFORMATION_TECHNOLOGY_AND_SERVICES', 'LOGISTICS_AND_TRANSPORTATION', 'MEDIA_AND_ENTERTAINMENT', 'NON_PROFITS_AND_PHILANTHROPY', 'OTHER_MATERIALS_AND_PRODUCTION', 'PHARMACEUTICALS', 'PROFESSIONAL_SERVICES_AND_CONSULTING', 'PUBLIC_SECTOR_AND_GOVERNMENT', 'REAL_ESTATE', 'TECHNOLOGY_AND_TELECOMMUNICATIONS');

-- CreateEnum
CREATE TYPE "AreaEnum" AS ENUM ('CYBERSECURITY', 'ADVISORY', 'SECURE_FILE_TRANSFER_B2B', 'SECURE_CLOUD', 'SECURE_DATA', 'COMERCIAL');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'TO_DO',
    "dueDate" TIMESTAMP(3),
    "activityId" TEXT,
    "playerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cityId" TEXT,
    "countryId" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "role" "PlayerRole" NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" "CompanySector" DEFAULT 'OTHER_MATERIALS_AND_PRODUCTION',
    "size" INTEGER NOT NULL,
    "website" TEXT,
    "revenue" DOUBLE PRECISION,
    "countryId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "industry" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactId" TEXT,
    "companyId" TEXT,
    "activityId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "value" DOUBLE PRECISION DEFAULT 0,
    "countryId" TEXT,
    "cityId" TEXT,
    "accountManagerId" TEXT,
    "areaId" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT,
    "phone2" TEXT,
    "countryId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "jobTitle" "JobTitle" NOT NULL,
    "companyId" TEXT,
    "type" "ContactType" NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'INTERESTED',
    "attendees" INTEGER,
    "followUp" BOOLEAN,
    "followUpNote" TEXT,
    "askforinformation" BOOLEAN,
    "askForInformationNote" TEXT,
    "targetContacts" INTEGER,
    "costId" TEXT,
    "endtime" TIMESTAMP(6),
    "name" TEXT,
    "areaId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountManager" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "countryId" TEXT,
    "cityId" TEXT,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "AccountManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" "AreaEnum" NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LeadPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PartnerContacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityContacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityToPartner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_sector_idx" ON "Company"("sector");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccountManager_firstName_lastName_areaId_key" ON "AccountManager"("firstName", "lastName", "areaId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LeadPlayers_AB_unique" ON "_LeadPlayers"("A", "B");

-- CreateIndex
CREATE INDEX "_LeadPlayers_B_index" ON "_LeadPlayers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PartnerContacts_AB_unique" ON "_PartnerContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_PartnerContacts_B_index" ON "_PartnerContacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityContacts_AB_unique" ON "_ActivityContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityContacts_B_index" ON "_ActivityContacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityPlayers_AB_unique" ON "_ActivityPlayers"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityPlayers_B_index" ON "_ActivityPlayers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToPartner_AB_unique" ON "_ActivityToPartner"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToPartner_B_index" ON "_ActivityToPartner"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "AccountManager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_costId_fkey" FOREIGN KEY ("costId") REFERENCES "Cost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountManager" ADD CONSTRAINT "AccountManager_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountManager" ADD CONSTRAINT "AccountManager_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountManager" ADD CONSTRAINT "AccountManager_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadPlayers" ADD CONSTRAINT "_LeadPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadPlayers" ADD CONSTRAINT "_LeadPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartnerContacts" ADD CONSTRAINT "_PartnerContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartnerContacts" ADD CONSTRAINT "_PartnerContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityContacts" ADD CONSTRAINT "_ActivityContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityContacts" ADD CONSTRAINT "_ActivityContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityPlayers" ADD CONSTRAINT "_ActivityPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityPlayers" ADD CONSTRAINT "_ActivityPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToPartner" ADD CONSTRAINT "_ActivityToPartner_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToPartner" ADD CONSTRAINT "_ActivityToPartner_B_fkey" FOREIGN KEY ("B") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
