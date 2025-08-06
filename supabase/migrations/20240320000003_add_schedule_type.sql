-- Add schedule_type column to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS schedule_type TEXT DEFAULT 'recurring';

-- Add check constraint for schedule_type values
ALTER TABLE public.goals 
ADD CONSTRAINT goals_schedule_type_check 
CHECK (schedule_type IN ('onetime', 'recurring'));

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_goals_schedule_type ON public.goals(schedule_type); 