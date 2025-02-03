/*
  Warnings:

  - You are about to drop the `Audio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Audio";

-- CreateTable
CREATE TABLE "Audios" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "filePath" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audios_pkey" PRIMARY KEY ("id")
);
