/*
  Warnings:

  - The values [DIRECTOR_COMERCIAL,DIRECTOR_MARKETING,ANALISTA_COMERCIAL,ANALISTA_MARKETING,DIGITAL_SALES] on the enum `PlayerRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlayerRole_new" AS ENUM ('Director Comercial', 'Director Marketing', 'Analista Comercial', 'Analista Marketing', 'Digital Sales');
ALTER TABLE "Player" ALTER COLUMN "role" TYPE "PlayerRole_new" USING ("role"::text::"PlayerRole_new");
ALTER TYPE "PlayerRole" RENAME TO "PlayerRole_old";
ALTER TYPE "PlayerRole_new" RENAME TO "PlayerRole";
DROP TYPE "PlayerRole_old";
COMMIT;
