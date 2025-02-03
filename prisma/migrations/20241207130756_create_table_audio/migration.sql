-- CreateTable
CREATE TABLE "Audio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "filePath" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);
