import { createClient } from "@/lib/supabase/server";
import { Goal } from "@/types";

/**
 * Check and update expired goals
 * This function can be called periodically to mark goals as expired
 */
export async function checkAndUpdateExpiredGoals() {
  const supabase = createClient();
  
  try {
    // Get all active goals that have expired
    const { data: expiredGoals, error } = await supabase
      .from("goals")
      .select("*")
      .eq("is_active", true)
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString());

    if (error) {
      console.error("Error fetching expired goals:", error);
      return;
    }

    if (!expiredGoals || expiredGoals.length === 0) {
      console.log("No expired goals found");
      return;
    }

    // Update expired goals
    const goalIds = expiredGoals.map(goal => goal.id);
    const { error: updateError } = await supabase
      .from("goals")
      .update({ 
        status: 'expired', 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .in("id", goalIds);

    if (updateError) {
      console.error("Error updating expired goals:", updateError);
      return;
    }

    console.log(`Updated ${expiredGoals.length} expired goals`);
    
    // Optionally, disable the cron jobs on cron-job.org
    for (const goal of expiredGoals) {
      if (goal.cron_job_id) {
        try {
          await disableCronJob(goal.cron_job_id);
        } catch (error) {
          console.error(`Failed to disable cron job ${goal.cron_job_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error in checkAndUpdateExpiredGoals:", error);
  }
}

/**
 * Disable a cron job on cron-job.org
 */
async function disableCronJob(jobId: string) {
  const url = `https://api.cron-job.org/jobs/${jobId}`;
  const auth = `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
    body: JSON.stringify({
      job: {
        enabled: false
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to disable cron job: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get goals that are about to expire (within the next 24 hours)
 */
export async function getGoalsExpiringSoon(): Promise<Goal[]> {
  const supabase = createClient();
  
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const { data: expiringGoals, error } = await supabase
    .from("goals")
    .select("*")
    .eq("is_active", true)
    .not("expires_at", "is", null)
    .gte("expires_at", now.toISOString())
    .lte("expires_at", tomorrow.toISOString());

  if (error) {
    console.error("Error fetching expiring goals:", error);
    return [];
  }

  return expiringGoals || [];
}

/**
 * Format expiration date for display
 */
export function formatExpirationDate(expiresAt: string): string {
  const date = new Date(expiresAt);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Check if a goal is expired
 */
export function isGoalExpired(goal: Goal): boolean {
  if (!goal.expires_at) return false;
  return new Date(goal.expires_at) <= new Date();
}

/**
 * Get time until expiration
 */
export function getTimeUntilExpiration(expiresAt: string): string {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diff = expiration.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
} 

/**
 * Maps Bland AI status values to our internal status categories
 * Bland AI can send various status values, so we categorize them
 */
export function mapBlandAIStatus(blandStatus: string): 'success' | 'failure' | 'in_progress' | 'unknown' {
  const successStatuses = ['completed', 'successful', 'answered', 'human'];
  const failureStatuses = ['failed', 'no_answer', 'busy', 'cancelled', 'timeout', 'voicemail', 'machine'];
  const inProgressStatuses = ['initiated', 'in_progress', 'ringing'];
  
  if (successStatuses.includes(blandStatus.toLowerCase())) {
    return 'success';
  } else if (failureStatuses.includes(blandStatus.toLowerCase())) {
    return 'failure';
  } else if (inProgressStatuses.includes(blandStatus.toLowerCase())) {
    return 'in_progress';
  } else {
    return 'unknown';
  }
} 