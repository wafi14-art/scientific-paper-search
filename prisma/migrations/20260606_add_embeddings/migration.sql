-- Manual migration for Sprint 5 embedding support
-- Add embedding status and metadata to the Paper model

CREATE TYPE IF NOT EXISTS "EmbeddingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

ALTER TABLE "papers"
  ADD COLUMN IF NOT EXISTS "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "embeddingModel" text,
  ADD COLUMN IF NOT EXISTS "embeddingDimensions" integer;

ALTER TABLE "paper_embeddings"
  ADD COLUMN IF NOT EXISTS "modelName" text NOT NULL DEFAULT 'text-embedding-004',
  ADD COLUMN IF NOT EXISTS "dimensions" integer NOT NULL DEFAULT 768;
