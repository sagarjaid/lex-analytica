-- Add expires_at column to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Create an index for better performance on expires_at
CREATE INDEX IF NOT EXISTS idx_goals_expires_at ON public.goals(expires_at);

-- Add a function to automatically update status to 'expired' when expires_at is reached
CREATE OR REPLACE FUNCTION check_goal_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- If expires_at is set and has passed, mark the goal as expired
    IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= NOW() THEN
        NEW.status = 'expired';
        NEW.is_active = false;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically check expiration on insert/update
DROP TRIGGER IF EXISTS trigger_check_goal_expiration ON public.goals;
CREATE TRIGGER trigger_check_goal_expiration
    BEFORE INSERT OR UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION check_goal_expiration(); 