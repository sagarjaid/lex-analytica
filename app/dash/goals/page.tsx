"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  Tags,
  User,
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
import { Clock, Trash2, Phone, Calendar } from "lucide-react";
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
  schedule: {
    timezone: string;
    hours: number[];
    minutes: number[];
    wdays: number[];
  };
}

interface CallLog {
  id: string;
  call_id: string;
  status: string;
  created_at: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [callLogs, setCallLogs] = useState<Record<string, CallLog[]>>({});
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

      if (error) throw error;
      setGoals(data || []);

      // Fetch call logs for each goal
      const logs: Record<string, CallLog[]> = {};
      for (const goal of data || []) {
        const { data: logData } = await supabase
          .from("call_logs")
          .select("*")
          .eq("goal_id", goal.id)
          .order("created_at", { ascending: false })
          .limit(5);
        logs[goal.id] = logData || [];
      }
      setCallLogs(logs);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalStatus = async (goalId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("goals")
        .update({ is_active: !currentStatus })
        .eq("id", goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error("Error toggling goal status:", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      // Delete the cron job first
      const goal = goals.find((g) => g.id === goalId);
      if (goal?.cron_job_id) {
        await fetch(`https://api.cron-job.org/jobs/${goal.cron_job_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`,
          },
        });
      }

      // Then delete the goal
      const { error } = await supabase.from("goals").delete().eq("id", goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const formatSchedule = (schedule: Goal["schedule"]) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdays = schedule.wdays.map((d) => days[d]).join(", ");
    const hours = schedule.hours
      .map((h) => h.toString().padStart(2, "0"))
      .join(", ");
    const minutes = schedule.minutes
      .map((m) => m.toString().padStart(2, "0"))
      .join(", ");
    return `Every ${weekdays} at ${hours}:${minutes} (${schedule.timezone})`;
  };

  return (
    <main className="flex flex-col items-center pt-6 px-6 pb-24">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl  font-extrabold">Goals</h1>

          <span className="lg:block hidden">
            <ThemeToggle />
          </span>
        </div>

        <p className="mb-6 md:mb-8 text-gray-700 text-sm">
          Add new goals, review active goals and more
        </p>

        <div className="grid gap-6">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <div className="flex-1 border border-gray-200 rounded-xl shadow p-4 flex flex-col items-start gap-2 md:gap-3 hover:shadow-lg transition">
                <div className="bg-gray-100 rounded-full  ">
                  <Plus className="w-6 h-6 text-gray-700" />
                </div>
                <h2 className="text-md  font-bold">Add New Goal</h2>
                <p className="text-gray-600 text-xs md:text-xs">
                  Create a Goal, AI will call on your mobile number to remind
                  your goal
                </p>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {goal.title}
                      <Badge variant={goal.is_active ? "default" : "secondary"}>
                        {goal.is_active ? "Active" : "Paused"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {goal.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={goal.is_active}
                        onCheckedChange={() =>
                          toggleGoalStatus(goal.id, goal.is_active)
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {goal.is_active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Call History</DialogTitle>
                          <DialogDescription>
                            Recent calls for this goal
                          </DialogDescription>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Call ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {callLogs[goal.id]?.map((log) => (
                              <TableRow key={log.id}>
                                <TableCell>
                                  {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{log.status}</Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {log.call_id}
                                </TableCell>
                              </TableRow>
                            ))}
                            {(!callLogs[goal.id] ||
                              callLogs[goal.id].length === 0) && (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="text-center text-muted-foreground"
                                >
                                  No calls yet
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatSchedule(goal.schedule)}</span>
                </div>
              </CardContent>
            </Card>
          ))}

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
  );
}
