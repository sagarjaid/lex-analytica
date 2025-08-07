-- Change duration columns from INTEGER to DECIMAL to match Bland.ai format
-- This migration renames duration_seconds to duration_minutes and changes type to DECIMAL(10,2)

-- Rename and change type for call_logs table
ALTER TABLE call_logs RENAME COLUMN duration_seconds TO duration_minutes;
ALTER TABLE call_logs ALTER COLUMN duration_minutes TYPE DECIMAL(10,2);

-- Change type for goals table (keep same column name)
ALTER TABLE goals ALTER COLUMN last_call_duration TYPE DECIMAL(10,2);

-- Add comment to document the change
COMMENT ON COLUMN call_logs.duration_minutes IS 'Call duration in minutes (DECIMAL format from Bland.ai)';
COMMENT ON COLUMN goals.last_call_duration IS 'Last call duration in minutes (DECIMAL format from Bland.ai)';
