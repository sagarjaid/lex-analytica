"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  LayoutDashboard,
  Tags,
  Plus,
  RefreshCw,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

/** @format */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Clock, Trash2, Phone, Calendar, ChevronUp, ChevronDown, ChevronRight, User, Target, CalendarDays, Repeat, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Goal {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  cron_job_id: string | null;
  status: string;
  execution_count: number;
  last_executed_at: string | null;
  next_execution_at: string | null;
  persona: string;
  context: string;
  language: string;
  voice: string;
  schedule_type: string;
  expires_at: string | null;
  schedule: {
    timezone: string;
    hours: number[];
    minutes: number[];
    wdays: number[];
    mdays?: number[];
    months?: number[];
  };
}

interface CallLog {
  id: string;
  call_id: string;
  status: string;
  created_at: string;
  goal_title: string;
  phone_number: string;
  execution_time: string | null;
  duration_seconds: number | null;
  error_message: string | null;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [callLogs, setCallLogs] = useState<Record<string, CallLog[]>>({});
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching goals:", error);
        return;
      }

      setGoals(data || []);

      // Fetch call logs for each goal
      const callLogsData: Record<string, CallLog[]> = {};
      for (const goal of data || []) {
        const { data: logs, error: logsError } = await supabase
          .from("call_logs")
          .select("*")
          .eq("goal_id", goal.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (!logsError) {
          callLogsData[goal.id] = logs || [];
        }
      }
      setCallLogs(callLogsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalStatus = async (goalId: string, currentStatus: boolean) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) {
        console.error("Goal not found");
        return;
      }

      const newStatus = !currentStatus;
      console.log(`Toggling goal ${goal.title} from ${currentStatus} to ${newStatus}`);

      // Update cron job first
      if (goal.cron_job_id) {
        try {
          console.log(`Updating cron job ${goal.cron_job_id} to enabled: ${newStatus}`);
          
          const response = await fetch(`https://api.cron-job.org/jobs/${goal.cron_job_id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`,
            },
            body: JSON.stringify({
              job: {
                enabled: newStatus,
              },
            }),
          });

          console.log("Cron job response status:", response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Cron job update failed:", response.status, errorText);
            alert(`Failed to update cron job: ${response.status} - ${errorText}`);
            return;
          }

          const responseData = await response.json();
          console.log("Cron job update response:", responseData);
        } catch (error) {
          console.error("Error updating cron job:", error);
          alert(`Failed to update cron job: ${error}`);
          return;
        }
      } else {
        console.warn("No cron_job_id found for goal:", goal.title);
      }

      // Update database after successful cron job update
      const { error: dbError } = await supabase
        .from("goals")
        .update({ is_active: newStatus })
        .eq("id", goalId);

      if (dbError) {
        console.error("Error updating goal status in database:", dbError);
        alert("Database update failed. Cron job was updated but local status may be inconsistent.");
        return;
      }

      console.log("Successfully updated both cron job and database");
      await fetchGoals();
    } catch (error) {
      console.error("Error in toggleGoalStatus:", error);
      alert(`Error: ${error}`);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      const goal = goals.find(g => g.id === goalId);
      
      // Delete cron job if it exists
      if (goal?.cron_job_id) {
        try {
          await fetch(`https://api.cron-job.org/jobs/${goal.cron_job_id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`,
            },
          });
        } catch (error) {
          console.error("Error deleting cron job:", error);
        }
      }

      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId);

      if (error) {
        console.error("Error deleting goal:", error);
        return;
      }

      await fetchGoals();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const formatSchedule = (schedule: Goal["schedule"]) => {
    const hours = (schedule.hours || [])
      .filter((h) => h !== null && h !== undefined)
      .map((h) => h.toString().padStart(2, "0"))
      .join(", ");

    const minutes = (schedule.minutes || [])
      .filter((m) => m !== null && m !== undefined)
      .map((m) => m.toString().padStart(2, "0"))
      .join(", ");

    return `${hours}:${minutes}`;
  };

  const getExecutionPreview = (goal: Goal) => {
    const { schedule, schedule_type } = goal;
    
    if (schedule_type === 'onetime') {
      // For one-time goals, show the specific date and time
      const hours = schedule.hours?.[0];
      const minutes = schedule.minutes?.[0];
      const mdays = schedule.mdays?.[0];
      const months = schedule.months?.[0];
      
      if (hours !== undefined && minutes !== undefined && mdays && months) {
        const year = new Date().getFullYear();
        const date = new Date(year, months - 1, mdays, hours, minutes);
        return `Onetime on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    } else {
      // For recurring goals, show the recurring pattern
      const hours = schedule.hours?.[0];
      const minutes = schedule.minutes?.[0];
      const wdays = schedule.wdays || [];
      
      if (hours !== undefined && minutes !== undefined) {
        const timeStr = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (wdays.length === 7 || wdays.includes(-1)) {
          return `Job will repeat every day at ${timeStr}`;
        } else if (wdays.length === 1) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const dayName = days[wdays[0]] || "Unknown";
          return `Job will repeat every ${dayName} at ${timeStr}`;
        } else if (wdays.length > 1) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const dayNames = wdays.map(d => days[d]).filter(Boolean);
          return `Job will repeat on ${dayNames.join(", ")} at ${timeStr}`;
        }
      }
    }
    
    // Fallback
    return `Job will run at ${formatSchedule(schedule)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'created':
        return <Badge variant="secondary">Created</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'paused':
        return <Badge variant="outline">Paused</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCallStatusBadge = (status: string) => {
    switch (status) {
      case 'initiated':
        return <Badge variant="secondary">Initiated</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'no_answer':
        return <Badge variant="outline">No Answer</Badge>;
      case 'busy':
        return <Badge variant="outline">Busy</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExpirationInfo = (goal: Goal) => {
    if (!goal.expires_at) return null;
    
    const now = new Date();
    const expiration = new Date(goal.expires_at);
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) {
      return {
        text: "Expired",
        color: "text-red-600",
        icon: <AlertTriangle className="h-3 w-3 text-red-500" />
      };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return {
        text: `Expires in ${days}d ${hours}h`,
        color: days <= 1 ? "text-orange-600" : "text-gray-600",
        icon: <Clock className="h-3 w-3 text-gray-500" />
      };
    } else if (hours > 0) {
      return {
        text: `Expires in ${hours}h`,
        color: "text-orange-600",
        icon: <Clock className="h-3 w-3 text-orange-500" />
      };
    } else {
      return {
        text: "Expires soon",
        color: "text-red-600",
        icon: <AlertTriangle className="h-3 w-3 text-red-500" />
      };
    }
  };

  if (loading) {
    return (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Header user={null} router={null} />
        </Suspense>
        <main className="flex flex-col items-center pt-6 px-6 pb-24 w-full">
          <div className="w-full max-w-2xl md:max-w-4xl">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading goals...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Header user={null} router={null} />
      </Suspense> */}
      <main className="flex flex-col items-center pt-6 px-6 pb-24 w-full">
        <div className="w-full max-w-2xl md:max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-extrabold">Goals</h1>
            <span className="lg:block hidden">
              <ThemeToggle />
            </span>
          </div>

          <p className="mb-6 md:mb-8 text-gray-700 text-sm">
            Add new goals, review active goals and more
          </p>

          <div className="space-y-4">
            {/* Add New Goal Card - Only show when there are existing goals */}
            {goals.length > 0 && (
              <Link
                href="/dash/add"
                className="flex-1 border border-gray-200 rounded-xl shadow p-4 flex items-start gap-3 md:gap-4 hover:shadow-lg transition"
              >
                <div className="bg-gray-100 mt-1 rounded-full  ">
                    <Plus className="w-6 h-6 text-gray-700" />
                  </div>
                <div className="flex flex-col gap-1">
                  
                
                  <h2 className="text-lg font-semibold text-gray-900">Add New Goal</h2>
                    <p className="text-gray-600 text-xs">
                   Create a Goal, AI will call on your mobile number to remind your
                   goal
                 </p>
                 </div>
              </Link>
            )}

            {/* Goals List */}
            {goals.length > 0 && (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-all duration-200">
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                                                  <div className="flex-1">
                                                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>

                          </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(goal.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedGoals.has(goal.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          
                        
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                  <div className="space-y-1">
                            <div className="font-medium text-xs text-gray-900">{getExecutionPreview(goal)}</div>
                            <div className="text-xs text-gray-600 flex items-center gap-1">
                              {goal.schedule_type === 'onetime' ? (
                                <CalendarDays className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Repeat className="h-3 w-3 text-green-500" />
                              )}
                              {goal.execution_count || 0} executions
                            </div>
                          </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={goal.is_active}
                            onCheckedChange={() => toggleGoalStatus(goal.id, goal.is_active)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {goal.is_active ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedGoals.has(goal.id) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 text-sm">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">AI Configuration</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-900 text-sm">Persona</span>
                                  <p className="text-gray-600 text-xs">{goal.persona}</p>
                                </div>
                                <div>
                                  <span className="text-gray-900 text-sm">Context</span>
                                  <p className="text-gray-600 text-xs">{goal.context}</p>
                                </div>
                                <div>
                                  <span className="text-gray-900 text-sm">Language</span>
                                  <p className="text-gray-600 text-xs">{goal.language}</p>
                                </div>
                                <div>
                                  <span className="text-gray-900 text-sm">Voice</span>
                                  <p className="text-gray-600 text-xs">{goal.voice}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Execution Details</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-900 text-sm">Total Executions</span>
                                  <p className="text-gray-600 text-xs">{goal.execution_count || 0}</p>
                                </div>
                                {goal.last_executed_at && (
                                  <div>
                                    <span className="text-gray-900 text-sm">Last Executed</span>
                                    <p className="text-gray-600 text-xs">
                                      {new Date(goal.last_executed_at).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                                {goal.next_execution_at && (
                                  <div>
                                    <span className="text-gray-900 text-sm">Next Execution</span>
                                    <p className="text-gray-600 text-xs">
                                      {new Date(goal.next_execution_at).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-900 text-sm">Created</span>
                                  <p className="text-gray-600 text-xs">
                                    {new Date(goal.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                {goal.expires_at && (
                                  <div>
                                    <span className="text-gray-900 text-sm">Expires</span>
                                    <p className="text-gray-600 text-xs">
                                      {new Date(goal.expires_at).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {goals.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground text-center text-sm mb-4">
                    Create your first goal to start receiving AI-powered phone
                    call reminders and never miss on your dreams!
                  </p>
                  <Button onClick={() => router.push("/dash/add")}>
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
