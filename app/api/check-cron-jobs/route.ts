import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    // Get all active goals with cron_job_id
    const { data: activeGoals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('is_active', true)
      .not('cron_job_id', 'is', null);

    if (goalsError) {
      console.error('Error fetching active goals:', goalsError);
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }

    if (!activeGoals || activeGoals.length === 0) {
      return NextResponse.json({ message: 'No active goals found' });
    }

    const updatedGoals: string[] = [];
    const failedGoals: string[] = [];

    // Check each goal's cron job status
    for (const goal of activeGoals) {
      try {
        console.log(`Processing goal: ${goal.title} (${goal.id}) - Type: ${goal.schedule_type}, Active: ${goal.is_active}, Next Exec: ${goal.next_execution_at}, Expires: ${goal.expires_at}`);
        
        // Skip if no cron_job_id
        if (!goal.cron_job_id) {
          console.log(`Skipping ${goal.title} - no cron_job_id`);
          continue;
        }
        
        // For one-time goals, pause if they have expired or if their execution time has passed
        if (goal.schedule_type === 'onetime' && 
            ((goal.expires_at && new Date(goal.expires_at) < new Date()) || 
             (goal.next_execution_at && new Date(goal.next_execution_at) < new Date()))) {
          console.log(`PAUSING one-time goal ${goal.title} - execution time passed or expired`);
          
          // Update the goal in database FIRST
          const { error: updateError } = await supabase
            .from('goals')
            .update({ 
              is_active: false,
              status: 'paused',
              next_execution_at: null
            })
            .eq('id', goal.id);

          if (updateError) {
            console.error(`Failed to update goal ${goal.id}:`, updateError);
            failedGoals.push(goal.id);
          } else {
            console.log(`✅ SUCCESSFULLY PAUSED: ${goal.title}`);
            updatedGoals.push(goal.id);
          }

          // Then try to pause the cron job (but don't fail if this doesn't work)
          try {
            const pauseResponse = await fetch(`https://api.cron-job.org/jobs/${goal.cron_job_id}`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`,
              },
              body: JSON.stringify({
                job: {
                  enabled: false,
                },
              }),
            });
            console.log(`Cron job pause response for ${goal.title}:`, pauseResponse.status);
          } catch (error) {
            console.error(`Cron job pause failed for ${goal.title}:`, error);
          }
        } else {
          // For other goals, try to get next execution from API
          try {
            const response = await fetch(`https://api.cron-job.org/jobs/${goal.cron_job_id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`,
              },
            });

            if (response.ok) {
              const cronJobData = await response.json();
              const job = cronJobData.jobDetails || cronJobData.job;
              
              if (job) {
                const nextExecutionTime = job.nextExecution || job.nextRunTime;
                if (nextExecutionTime && nextExecutionTime > 0) {
                  const nextExecutionAt = new Date(nextExecutionTime * 1000);
                  if (!goal.next_execution_at || new Date(goal.next_execution_at).getTime() !== nextExecutionAt.getTime()) {
                    const { error: updateError } = await supabase
                      .from('goals')
                      .update({ next_execution_at: nextExecutionAt.toISOString() })
                      .eq('id', goal.id);

                    if (updateError) {
                      console.error(`Failed to update next_execution_at for goal ${goal.id}:`, updateError);
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching cron job data for ${goal.title}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error processing goal ${goal.id}:`, error);
        failedGoals.push(goal.id);
      }
    }

    return NextResponse.json({
      message: 'Cron job check completed',
      updatedGoals,
      failedGoals,
      totalChecked: activeGoals.length
    });

  } catch (error) {
    console.error('Error in check-cron-jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
