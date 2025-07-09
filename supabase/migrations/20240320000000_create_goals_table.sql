-- Create the goals table
CREATE TABLE
    public.goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        cron_job_id TEXT,
        phone_number TEXT NOT NULL,
        schedule JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT (now () AT TIME ZONE 'UTC'),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT (now () AT TIME ZONE 'UTC')
    );

-- Create a trigger to update updated_at
CREATE TRIGGER update_goals_updated_at BEFORE
UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at ();

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own goals" ON public.goals FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Users can insert their own goals" ON public.goals FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid () = user_id);