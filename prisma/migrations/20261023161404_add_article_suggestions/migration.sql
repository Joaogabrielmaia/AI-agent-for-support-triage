-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DISCARDED');

-- CreateTable
CREATE TABLE "ArticleSuggestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" TEXT[],
    "occurrences" INTEGER NOT NULL,
    "draft" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "ArticleSuggestion_pkey" PRIMARY KEY ("id")
);
