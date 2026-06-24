-- Add resultCount + averageSimilarityScore to search_histories
-- (Assumes previous table name mapping: @@map("search_histories"))

ALTER TABLE "search_histories"
  ADD COLUMN IF NOT EXISTS "resultCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "averageSimilarityScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

