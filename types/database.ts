export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cron_job_id?: string;
  phone_number: string;
  schedule: JobSchedule;
  is_active: boolean;
  status: 'created' | 'active' | 'paused' | 'completed' | 'failed' | 'expired';
  persona?: string;
  context?: string;
  language?: string;
  voice?: string;
  execution_count?: number;
  last_executed_at?: string;
  next_execution_at?: string;
  schedule_type: 'onetime' | 'recurring';
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobSchedule {
  timezone: string;
  expiresAt: number;
  hours: number[];
  mdays: number[];
  minutes: number[];
  months: number[];
  wdays: number[];
}

export interface CallLog {
  id: string;
  goal_id: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'no_answer' | 'busy' | 'cancelled';
  goal_title?: string;
  phone_number?: string;
  execution_time?: string;
  duration_seconds?: number;
  error_message?: string;
  call_details?: any;
  created_at: string;
  updated_at: string;
} 