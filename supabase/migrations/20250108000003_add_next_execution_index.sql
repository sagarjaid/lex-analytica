-- Add index for next_execution_at column for better performance
-- This will help with queries that check for goals without next execution dates

CREATE INDEX IF NOT EXISTS idx_goals_next_execution_at ON public.goals(next_execution_at);
CREATE INDEX IF NOT EXISTS idx_goals_is_active_next_execution ON public.goals(is_active, next_execution_at);

-- Add comment to document the purpose
COMMENT ON INDEX idx_goals_next_execution_at IS 'Index for efficient queries on next_execution_at field';
COMMENT ON INDEX idx_goals_is_active_next_execution IS 'Composite index for active goals with next execution date';
