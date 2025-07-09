-- Create the call_logs table
CREATE TABLE
    public.call_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        goal_id UUID REFERENCES public.goals (id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
        call_id TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT (now () AT TIME ZONE 'UTC'),
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT (now () AT TIME ZONE 'UTC')
    );

-- Create a trigger to update updated_at
CREATE TRIGGER update_call_logs_updated_at BEFORE
UPDATE ON public.call_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at ();

-- Enable Row Level Security
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own call logs" ON public.call_logs FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "System can insert call logs" ON public.call_logs FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "System can update call logs" ON public.call_logs FOR
UPDATE USING (true);