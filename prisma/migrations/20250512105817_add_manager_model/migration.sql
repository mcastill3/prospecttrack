-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_firstName_lastName_areaId_key" ON "Manager"("firstName", "lastName", "areaId");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
