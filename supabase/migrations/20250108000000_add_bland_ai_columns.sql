-- Add Bland.ai specific columns to goals table
-- These columns support Bland.ai integration while preserving existing form data

ALTER TABLE "public"."goals" 
ADD COLUMN "call_id" TEXT,
ADD COLUMN "batch_id" TEXT,
ADD COLUMN "bland_voice" TEXT,
ADD COLUMN "bland_language" TEXT,
ADD COLUMN "last_call_status" TEXT,
ADD COLUMN "last_call_duration" INTEGER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "goals_call_id_idx" ON "public"."goals" ("call_id");
CREATE INDEX IF NOT EXISTS "goals_batch_id_idx" ON "public"."goals" ("batch_id");
