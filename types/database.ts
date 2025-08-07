// Specific status types for different entities
export type GoalStatus = 'created' | 'active' | 'paused' | 'completed' | 'failed' | 'expired';
// Bland AI can send various status values, so we keep it flexible
export type CallStatus = string;
// CallStatus: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'busy' | 'cancelled';

export interface JobSchedule {
  timezone: string;
  expiresAt: number;
  hours: number[];
  mdays: number[];
  minutes: number[];
  months: number[];
  wdays: number[];
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cron_job_id?: string;
  phone_number: string;
  schedule: JobSchedule;
  is_active: boolean;
  status: GoalStatus;
  persona?: string;
  context?: string;
  language?: string;
  voice?: string;
  execution_count?: number;
  last_executed_at?: string;
  next_execution_at?: string;
  schedule_type: 'onetime' | 'recurring';
  expires_at?: string;
  // Bland.ai specific fields
  call_id?: string;
  batch_id?: string;
  bland_voice?: string;
  bland_language?: string;
  last_call_status?: CallStatus;
  last_call_duration?: number; // DECIMAL(10,2) in database
  created_at: string;
  updated_at: string;
}





export interface CallLog {
  id: string;
  goal_id: string;
  user_id: string;
  call_id: string;
  status: CallStatus;
  goal_title?: string;
  phone_number?: string;
  execution_time?: string;
  duration_minutes?: number; // DECIMAL(10,2) in database
  error_message?: string;
  completed?: boolean;
  started_at?: string;
  end_at?: string;
  corrected_duration?: number;
  transcript?: string;
  disposition_tag?: string;
  answered_by?: string;
  call_ended_by?: string;
  call_cost?: number;
  call_summary?: string;
  created_at: string;
  updated_at: string;
} 