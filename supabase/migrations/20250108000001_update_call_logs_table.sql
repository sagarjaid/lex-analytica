-- Update call_logs table to capture more Bland.ai webhook data
-- Drop call_details column and add new columns for comprehensive call tracking

-- Drop the call_details column
ALTER TABLE "public"."call_logs" DROP COLUMN IF EXISTS "call_details";

-- Add new columns for comprehensive call data
ALTER TABLE "public"."call_logs" 
ADD COLUMN "completed" BOOLEAN,
ADD COLUMN "started_at" TIMESTAMP WITH TIME ZONE,
ADD COLUMN "end_at" TIMESTAMP WITH TIME ZONE,
ADD COLUMN "corrected_duration" INTEGER,
ADD COLUMN "transcript" TEXT,
ADD COLUMN "disposition_tag" TEXT,
ADD COLUMN "answered_by" TEXT,
ADD COLUMN "call_ended_by" TEXT,
ADD COLUMN "call_cost" DECIMAL(10,4),
ADD COLUMN "call_summary" TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "call_logs_completed_idx" ON "public"."call_logs" ("completed");
CREATE INDEX IF NOT EXISTS "call_logs_disposition_tag_idx" ON "public"."call_logs" ("disposition_tag");
CREATE INDEX IF NOT EXISTS "call_logs_started_at_idx" ON "public"."call_logs" ("started_at");
