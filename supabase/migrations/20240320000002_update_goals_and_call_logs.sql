-- Add missing columns to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'created',
ADD COLUMN IF NOT EXISTS persona TEXT,
ADD COLUMN IF NOT EXISTS context TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS voice TEXT DEFAULT 'Male',
ADD COLUMN IF NOT EXISTS execution_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_executed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_execution_at TIMESTAMP WITH TIME ZONE;

-- Add missing columns to call_logs table
ALTER TABLE public.call_logs 
ADD COLUMN IF NOT EXISTS goal_title TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS execution_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS call_details JSONB;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id_status ON public.goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_call_logs_goal_id_status ON public.call_logs(goal_id, status);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON public.call_logs(created_at DESC);

-- Add check constraints for status values
ALTER TABLE public.goals 
ADD CONSTRAINT goals_status_check 
CHECK (status IN ('created', 'active', 'paused', 'completed', 'failed', 'expired'));

ALTER TABLE public.call_logs 
ADD CONSTRAINT call_logs_status_check 
CHECK (status IN ('initiated', 'in_progress', 'completed', 'failed', 'no_answer', 'busy', 'cancelled')); 