/** @format */

"use client";

import { Suspense, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Switch } from "@/components/ui/switch";

import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

import TimezoneSelect from "react-timezone-select";

import Link from "next/link";

import { timezones as phpTimezones } from "./timezone";
import { LayoutDashboard, Target, Tags, Plus, RefreshCw } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { Goal } from "@/types";
import { CronBuilder } from "@/components/cronBuilder";

interface JobSchedule {
  timezone: string;
  expiresAt: number;
  hours: number[];
  mdays: number[];
  minutes: number[];
  months: number[];
  wdays: number[];
}







export default function Dashboard() {
  const supabase = createClient();

  const text = {
    heading: {
      addYoutubeChannel: "Add YouTube Channel",
    },
    label: {
      channelUrl: {
        name: "Channel URL",
        required: true,
        toolTip: "Please enter your youtube channel url",
        maxLength: 300,
      },
      language: {
        name: "Language",
        required: true,
        toolTip: "Please select youtube channel language",
        maxLength: 300,
      },
      voices: {
        name: "AI Voice",
        required: true,
        toolTip: "Please select preferred voice tone for AI",
        maxLength: 100,
      },
      persona: {
        name: "AI Persona",
        required: true,
        toolTip: "Enter which persona you want the AI to take",
        maxLength: 100,
      },
      context: {
        name: "Reminder context",
        required: true,
        toolTip:
          "Enter what exactly AI should remind you, what AI should say, etc...",
        maxLength: 100,
      },
      PhoneNumber: {
        name: "Phone Number",
        required: true,
        toolTip: "AI will call you on this number",
        maxLength: 100,
      },
      status: {
        name: "Goal Status",
        required: true,
        toolTip: "Run or pause the goal",
        maxLength: 100,
      },
    },
  };

  const languages = ["English", "Spanish", "Chinese", "Hindi"];
  const aiVoices = ["Male", "Female"];

  const [user, setUser] = useState<User | null>(null);
  const [goalName, setGoalName] = useState<string>("");
  const [aiVoice, setAIVoice] = useState(aiVoices[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [persona, setPersona] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string>("918898720799");

  // Scheduler states
  const [jobType, setJobType] = useState<"onetime" | "recurring">("onetime");
  const [cronExpression, setCronExpression] = useState("");
  const [nextExecutions, setNextExecutions] = useState<string[]>([]);
  const [cronValid, setCronValid] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  // Map browser timezone names to cron-job.org timezone names
  const mapBrowserTimezone = (browserTz: string): string => {
    const timezoneMap: Record<string, string> = {
      // Asia - Legacy mappings
      "Asia/Calcutta": "Asia/Kolkata",
      "Asia/Chongqing": "Asia/Shanghai",
      "Asia/Chungking": "Asia/Shanghai",
      "Asia/Harbin": "Asia/Shanghai",
      "Asia/Kashgar": "Asia/Urumqi",
      "Asia/Ujung_Pandang": "Asia/Makassar",
      "Asia/Saigon": "Asia/Ho_Chi_Minh",
      "Asia/Rangoon": "Asia/Yangon",
      "Asia/Katmandu": "Asia/Kathmandu",
      "Asia/Thimbu": "Asia/Thimphu",
      "Asia/Tel_Aviv": "Asia/Jerusalem",
      "Asia/Ashkhabad": "Asia/Ashgabat",
      "Asia/Dacca": "Asia/Dhaka",
      "Asia/Macao": "Asia/Macau",
      "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
      "Asia/Istanbul": "Europe/Istanbul",
      
      // Europe - Legacy mappings
      "Europe/Kiev": "Europe/Kyiv",
      "Europe/Nicosia": "Asia/Nicosia",
      "Europe/Uzhgorod": "Europe/Uzhgorod",
      "Europe/Zaporozhye": "Europe/Zaporozhye",
      "Europe/Tiraspol": "Europe/Chisinau",
      "Europe/Belfast": "Europe/London",
      
      // America - Legacy mappings
      "America/Godthab": "America/Nuuk",
      "America/Atka": "America/Adak",
      "America/Ensenada": "America/Tijuana",
      "America/Louisville": "America/Kentucky/Louisville",
      "America/Knox_IN": "America/Indiana/Knox",
      "America/Indianapolis": "America/Indiana/Indianapolis",
      "America/Fort_Wayne": "America/Indiana/Indianapolis",
      "America/Mendoza": "America/Argentina/Mendoza",
      "America/Rosario": "America/Argentina/Cordoba",
      "America/Santa_Isabel": "America/Tijuana",
      "America/Porto_Acre": "America/Rio_Branco",
      "America/Rainy_River": "America/Winnipeg",
      "America/Shiprock": "America/Denver",
      "America/Thunder_Bay": "America/Toronto",
      "America/Virgin": "America/St_Thomas",
      "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
      "America/Catamarca": "America/Argentina/Catamarca",
      "America/Cordoba": "America/Argentina/Cordoba",
      "America/Jujuy": "America/Argentina/Jujuy",
      "America/Montreal": "America/Toronto",
      "America/Nipigon": "America/Toronto",
      "America/Pangnirtung": "America/Iqaluit",
      "America/Coral_Harbour": "America/Atikokan",
      
      // Antarctica - Legacy mappings
      "Antarctica/South_Pole": "Antarctica/McMurdo",
      
      // Atlantic - Legacy mappings
      "Atlantic/Faeroe": "Atlantic/Faroe",
      "Atlantic/Jan_Mayen": "Atlantic/Jan_Mayen",
      
      // Australia - Legacy mappings
      "Australia/Currie": "Australia/Hobart",
      "Australia/ACT": "Australia/Sydney",
      "Australia/Canberra": "Australia/Sydney",
      "Australia/LHI": "Australia/Lord_Howe",
      "Australia/North": "Australia/Darwin",
      "Australia/NSW": "Australia/Sydney",
      "Australia/Queensland": "Australia/Brisbane",
      "Australia/South": "Australia/Adelaide",
      "Australia/Tasmania": "Australia/Hobart",
      "Australia/Victoria": "Australia/Melbourne",
      "Australia/West": "Australia/Perth",
      "Australia/Yancowinna": "Australia/Broken_Hill",
      
      // Pacific - Legacy mappings
      "Pacific/Johnston": "Pacific/Honolulu",
      "Pacific/Ponape": "Pacific/Pohnpei",
      "Pacific/Samoa": "Pacific/Apia",
      "Pacific/Truk": "Pacific/Chuuk",
      "Pacific/Enderbury": "Pacific/Kanton",
      "Pacific/Yap": "Pacific/Chuuk",
      
      // Africa - Legacy mappings
      "Africa/Asmera": "Africa/Asmara",
      "Africa/Timbuktu": "Africa/Bamako",
      
      // Brazil - Legacy mappings
      "Brazil/Acre": "America/Rio_Branco",
      "Brazil/DeNoronha": "America/Noronha",
      "Brazil/East": "America/Sao_Paulo",
      "Brazil/West": "America/Manaus",
      
      // Canada - Legacy mappings
      "Canada/Atlantic": "America/Halifax",
      "Canada/Central": "America/Winnipeg",
      "Canada/Eastern": "America/Toronto",
      "Canada/Mountain": "America/Edmonton",
      "Canada/Newfoundland": "America/St_Johns",
      "Canada/Pacific": "America/Vancouver",
      "Canada/Saskatchewan": "America/Regina",
      "Canada/Yukon": "America/Whitehorse",
      
      // US - Legacy mappings
      "US/Alaska": "America/Anchorage",
      "US/Aleutian": "America/Adak",
      "US/Arizona": "America/Phoenix",
      "US/Central": "America/Chicago",
      "US/East-Indiana": "America/Indiana/Indianapolis",
      "US/Eastern": "America/New_York",
      "US/Hawaii": "Pacific/Honolulu",
      "US/Indiana-Starke": "America/Indiana/Knox",
      "US/Michigan": "America/Detroit",
      "US/Mountain": "America/Denver",
      "US/Pacific": "America/Los_Angeles",
      "US/Samoa": "Pacific/Pago_Pago",
      
      // Other legacy mappings
      "CET": "Europe/Paris",
      "CST6CDT": "America/Chicago",
      "EET": "Europe/Athens",
      "EST": "America/New_York",
      "EST5EDT": "America/New_York",
      "MST": "America/Denver",
      "MST7MDT": "America/Denver",
      "PST8PDT": "America/Los_Angeles",
      "WET": "Europe/London",
      "WE": "Europe/London",
      "W-SU": "Europe/Moscow",
      "GMT": "UTC",
      "GMT+0": "UTC",
      "GMT-0": "UTC",
      "GMT0": "UTC",
      "Greenwich": "UTC",
      "Universal": "UTC",
      "Zulu": "UTC",
      "Hongkong": "Asia/Hong_Kong",
      "Iceland": "Atlantic/Reykjavik",
      "Iran": "Asia/Tehran",
      "Israel": "Asia/Jerusalem",
      "Jamaica": "America/Jamaica",
      "Japan": "Asia/Tokyo",
      "Kwajalein": "Pacific/Kwajalein",
      "Libya": "Africa/Tripoli",
      "MET": "Europe/Berlin",
      "Navajo": "America/Denver",
      "NZ": "Pacific/Auckland",
      "NZ-CHAT": "Pacific/Chatham",
      "Poland": "Europe/Warsaw",
      "Portugal": "Europe/Lisbon",
      "PRC": "Asia/Shanghai",
      "ROC": "Asia/Taipei",
      "ROK": "Asia/Seoul",
      "Singapore": "Asia/Singapore",
      "Turkey": "Europe/Istanbul",
      "UCT": "UTC",
      "Factory": "UTC",
      "GB": "Europe/London",
      "GB-Eire": "Europe/London",
      "Eire": "Europe/Dublin",
    };
    
    return timezoneMap[browserTz] || browserTz;
  };

  const [schedule, setSchedule] = useState<JobSchedule>(() => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const mappedTz = mapBrowserTimezone(browserTz);
    const supportedTz = phpTimezones.find(tz => tz === mappedTz);
    const defaultTz = supportedTz || "UTC";
    
    return {
      timezone: defaultTz,
      expiresAt: 0,
      hours: [],
      mdays: [],
      minutes: [],
      months: [],
      wdays: [],
    };
  });
  const [userChangedTimezone, setUserChangedTimezone] = useState(false);



  // CronBuilder integration
  const handleCronBuilderChange = (data: {
    cronExpression: string;
    nextExecutions: string[];
    isValid: boolean;
    scheduleType: "onetime" | "recurring";
    scheduleExpires?: {
      day: string;
      month: string;
      year: string;
      hour: string;
      minute: string;
    };
    scheduleExpiresEnabled: boolean;
  }) => {
    console.log("CronBuilder data received:", data);
    setCronExpression(data.cronExpression);
    setNextExecutions(data.nextExecutions);
    setCronValid(data.isValid);
    setJobType(data.scheduleType);
    
    // Handle expiration data
    if (data.scheduleExpiresEnabled && data.scheduleExpires) {
      const { day, month, year, hour, minute } = data.scheduleExpires;
      // Convert month name to number (1-12)
      const monthMap: Record<string, string> = {
        "January": "01", "February": "02", "March": "03", "April": "04",
        "May": "05", "June": "06", "July": "07", "August": "08",
        "September": "09", "October": "10", "November": "11", "December": "12"
      };
      const monthNum = monthMap[month] || "01";
      const formattedDate = `${year}-${monthNum}-${day.padStart(2, '0')}`;
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      
      setExpirationDate(formattedDate);
      setExpirationTime(formattedTime);
      
      console.log("Expiration data received:", {
        original: data.scheduleExpires,
        formatted: { date: formattedDate, time: formattedTime }
      });
    } else {
      setExpirationDate("");
      setExpirationTime("");
      console.log("No expiration data or expiration disabled");
    }
  };

  // Disable create button if form is incomplete or cron is invalid
  const isCronValid = cronValid && cronExpression && goalName.trim() && persona.trim() && context.trim();
  
  // Debug logging
  console.log("Current cron state:", {
    cronExpression,
    nextExecutions,
    cronValid,
    jobType,
    isCronValid
  });









  const getTimezoneDisplayName = (timezone: string): string => {
    return timezone;
  };



  const getTimezoneOffset = (timezone: string): string => {
    try {
      // Use date-fns-tz for accurate, dynamic timezone offset calculation
      const now = new Date();
      const utcTime = formatInTimeZone(now, 'UTC', 'yyyy-MM-dd HH:mm:ss');
      const targetTime = formatInTimeZone(now, timezone, 'yyyy-MM-dd HH:mm:ss');
      
      // Parse the times and calculate difference
      const utcDate = new Date(utcTime + 'Z'); // Add Z to make it UTC
      const targetDate = new Date(targetTime + 'Z'); // Add Z to make it UTC
      
      const diffMs = targetDate.getTime() - utcDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const sign = diffHours >= 0 ? "+" : "-";
      const hours = Math.abs(diffHours).toString().padStart(2, "0");
      const minutes = Math.abs(diffMinutes).toString().padStart(2, "0");
      
      return `${sign}${hours}:${minutes}`;
    } catch (error) {
      // Fallback to hardcoded map for edge cases
      const offsetMap: Record<string, string> = {
        "Asia/Kolkata": "+05:30",
        "Asia/Calcutta": "+05:30",
        "Asia/Dhaka": "+06:00",
        "Asia/Karachi": "+05:00",
        "Asia/Tashkent": "+05:00",
        "Asia/Almaty": "+06:00",
        "Asia/Novosibirsk": "+07:00",
        "Asia/Krasnoyarsk": "+07:00",
        "Asia/Irkutsk": "+08:00",
        "Asia/Yakutsk": "+09:00",
        "Asia/Vladivostok": "+10:00",
        "Asia/Magadan": "+11:00",
        "Asia/Kamchatka": "+12:00",
        "Asia/Tokyo": "+09:00",
        "Asia/Seoul": "+09:00",
        "Asia/Shanghai": "+08:00",
        "Asia/Hong_Kong": "+08:00",
        "Asia/Singapore": "+08:00",
        "Asia/Bangkok": "+07:00",
        "Asia/Ho_Chi_Minh": "+07:00",
        "Asia/Jakarta": "+07:00",
        "Asia/Manila": "+08:00",
        "Asia/Dubai": "+04:00",
        "Asia/Riyadh": "+03:00",
        "Asia/Tehran": "+03:30",
        "Asia/Jerusalem": "+02:00",
        "Europe/London": "+00:00",
        "Europe/Paris": "+01:00",
        "Europe/Berlin": "+01:00",
        "Europe/Rome": "+01:00",
        "Europe/Moscow": "+03:00",
        "Europe/Kyiv": "+02:00",
        "America/New_York": "-05:00",
        "America/Chicago": "-06:00",
        "America/Denver": "-07:00",
        "America/Los_Angeles": "-08:00",
        "America/Toronto": "-05:00",
        "America/Vancouver": "-08:00",
        "America/Sao_Paulo": "-03:00",
        "America/Argentina/Buenos_Aires": "-03:00",
        "Australia/Sydney": "+10:00",
        "Australia/Melbourne": "+10:00",
        "Australia/Perth": "+08:00",
        "Pacific/Auckland": "+12:00",
        "Pacific/Honolulu": "-10:00",
        "UTC": "+00:00",
      };
      
      return offsetMap[timezone] || "?";
    }
  };

  const handleToggle = (value: boolean) => {
    setIsActive(value);
  };

  const handleClick = async () => {
    if (!user) {
      alert("Please login to create a goal");
      return;
    }

    if (!goalName.trim() || !persona.trim() || !context.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!cronValid || !cronExpression.trim()) {
      alert("Please configure a valid schedule using the CronBuilder");
      return;
    }

    try {
      // Generate goal ID on frontend first
      const goalId = uuidv4();
      
      console.log("Generated goal ID:", goalId);
      console.log("Goal ID type:", typeof goalId);
      console.log("Cron validation data:", {
        cronValid,
        cronExpression,
        jobType,
        nextExecutions
      });
      
      let finalSchedule: JobSchedule;
      let expiresAt: Date | null = null;
      let nextExecutionAt: Date | null = null;

      // Use CronBuilder data for scheduling
      if (jobType === "onetime") {
        // For one-time jobs, parse the cron expression to get execution time
        const cronParts = cronExpression.split(" ");
        console.log("One-time cron parts:", cronParts);
        if (cronParts.length === 5) {
          const [minute, hour, day, month] = cronParts;
          const currentYear = new Date().getFullYear();
          const executionDate = new Date(currentYear, Number(month) - 1, Number(day), Number(hour), Number(minute));

        // For one-time jobs, set expiration to 2 days after execution time
        expiresAt = new Date(executionDate.getTime() + 2 * 24 * 60 * 60 * 1000);
          nextExecutionAt = executionDate;
        
                 // Convert expiresAt to YYYYMMDDhhmmss format as required by cron-job.org API
         const expiresAtFormatted = expiresAt.getFullYear() * 10000000000 + 
           (expiresAt.getMonth() + 1) * 100000000 + 
           expiresAt.getDate() * 1000000 + 
           expiresAt.getHours() * 10000 + 
           expiresAt.getMinutes() * 100 + 
           expiresAt.getSeconds();
         
         finalSchedule = {
           ...schedule,
           hours: [Number(hour)],
           minutes: [Number(minute)],
           mdays: [Number(day)],
           months: [Number(month)],
           wdays: [-1],
           expiresAt: expiresAtFormatted, // Use YYYYMMDDhhmmss format
         };
         
         // Debug logging to verify the format
         console.log("Original expiresAt Date:", expiresAt);
         console.log("Formatted expiresAt (YYYYMMDDhhmmss):", expiresAtFormatted);
         console.log("Final schedule being sent:", finalSchedule);
      } else {
          throw new Error("Invalid one-time cron expression format");
        }
      } else {
        // For recurring jobs, use the cron expression directly
        // Parse the cron expression to extract schedule components
        const cronParts = cronExpression.split(" ");
        console.log("Recurring cron parts:", cronParts);
        if (cronParts.length === 5) {
          const [minute, hour, day, month, dayOfWeek] = cronParts;
          
          // Parse the cron expression to extract specific values
          const hours = hour === "*" ? [-1] : hour.split(",").map(h => Number(h));
          const minutes = minute === "*" ? [-1] : minute.split(",").map(m => Number(m));
          const mdays = day === "*" ? [-1] : day.split(",").map(d => Number(d));
          const months = month === "*" ? [-1] : month.split(",").map(m => Number(m));
          const wdays = dayOfWeek === "*" ? [-1] : dayOfWeek.split(",").map(w => Number(w));
          
          finalSchedule = {
                ...schedule,
            hours,
            minutes,
            mdays,
            months,
            wdays,
            expiresAt: 0, // No expiration for recurring jobs by default
          };
          
                    // Set expiration if specified by the user
        if (expirationDate && expirationTime) {
          expiresAt = new Date(`${expirationDate}T${expirationTime}`);
          
          // Convert expiresAt to YYYYMMDDhhmmss format as required by cron-job.org API
          const expiresAtFormatted = expiresAt.getFullYear() * 10000000000 + 
            (expiresAt.getMonth() + 1) * 100000000 + 
            expiresAt.getDate() * 1000000 + 
            expiresAt.getHours() * 10000 + 
            expiresAt.getMinutes() * 100 + 
            expiresAt.getSeconds();
          
          finalSchedule.expiresAt = expiresAtFormatted;
          
          console.log("Recurring job expiration set:", {
            originalDate: `${expirationDate}T${expirationTime}`,
            parsedDate: expiresAt,
            formattedExpiresAt: expiresAtFormatted
          });
        } else {
          // For recurring jobs without expiration, set to 0 (no expiration)
          finalSchedule.expiresAt = 0;
          console.log("Recurring job: no expiration set");
        }
        } else {
          throw new Error("Invalid recurring cron expression format");
        }
      }

      if (!finalSchedule) {
        throw new Error("Failed to create schedule from cron expression");
      }
      
      // Debug logging for the final schedule
      console.log("Final schedule being sent to cron-job.org:", {
        schedule: finalSchedule,
        cronExpression,
        jobType,
        expirationDate,
        expirationTime
      });

      // Create the cron job first with the generated goal ID
      const postData = {
        goal_id: goalId,
        phoneNumber: `+${phoneNumber}`,
        task: `${persona}. ${context}`,
        language: language,
        voice: aiVoice,
      };

      const url = "https://api.cron-job.org/jobs";
      const auth = `Bearer ${process.env.NEXT_PUBLIC_CORN_AUTH}`;

      const jobData = {
        job: {
          enabled: isActive,
          title: goalName,
          saveResponses: true,
          url: "https://nevermissai.com/api/ai",
          auth: {
            enable: false,
            user: "",
            password: "",
          },
          notification: {
            onFailure: false,
            onSuccess: false,
            onDisable: true,
          },
          extendedData: {
            headers: ['Content-Type: application/json'] as string[],
            body: JSON.stringify(postData),
          },
          type: 0,
          requestTimeout: 30,
          redirectSuccess: false,
          folderId: 0,
          schedule: finalSchedule,
          requestMethod: 1,
        },
      };

      const response = await axios.put(url, jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });

      if (!response.data || !response.data.jobId) {
        throw new Error("Failed to create cron job");
      }

      const cronJobId = response.data.jobId.toString();
      
      if (!cronJobId || cronJobId.trim() === '') {
        throw new Error("Invalid cron job ID received");
      }
      
      console.log("Cron job created successfully with ID:", cronJobId);
      console.log("Goal ID to be used:", goalId);

      // Now create the goal in the database with both IDs
      const goalData: any = {
        id: goalId, // Use the pre-generated ID
        user_id: user.id,
        title: goalName,
        description: `${persona}: ${context}`,
        phone_number: `+${phoneNumber}`,
        schedule: finalSchedule,
        schedule_type: jobType,
        is_active: isActive,
        status: isActive ? 'created' : 'paused',
        persona: persona,
        context: context,
        language: language,
        voice: aiVoice,
        expires_at: expiresAt,
        cron_job_id: cronJobId, // Set the cron job ID directly
        next_execution_at: jobType === "onetime" ? nextExecutionAt : undefined,
      };
      
      // Remove any undefined or null values that might cause issues
      Object.keys(goalData).forEach(key => {
        if (goalData[key] === undefined || goalData[key] === null) {
          delete goalData[key];
        }
      });
      
      console.log("Goal data to be inserted:", goalData);

      const { data: goal, error: goalError } = await supabase
        .from("goals")
        .insert(goalData)
        .select()
        .single();

      if (goalError) {
        console.error("Error creating goal:", goalError);
        console.error("Goal data that failed:", goalData);
        alert("Error creating goal in database. Please try again.");
        return;
      }

      console.log("Goal and job created successfully:", response.data);
      alert("Goal created successfully!");
      
      // Redirect to goals page
      window.location.href = "/dash/goals";
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Something went wrong, please try again after some time.");
    }
  };

  const handleTimezoneChange = (value: string) => {
    setUserChangedTimezone(true);
    setSchedule((prev) => ({ ...prev, timezone: value }));
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setPhoneNumber(user?.phone || "918898720799");
    };

    getUser();
  }, [supabase]);



  return (
    <>
      <div className="flex flex-col items-center pt-6 px-6 pb-24 w-full w-full">
        <div className="w-full max-w-2xl md:max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl  font-extrabold">Add Goal</h1>
            <span className="lg:block hidden">
              <ThemeToggle />
            </span>
          </div>

          <p className="mb-6 md:mb-8 text-gray-700 text-xs md:text-base">
            Create goal and get reminded in specific time intervals
          </p>
          {/* Add Goal + */}

          <div className="flex flex-col justify-start items-start text-sm  xs:text-lg sdm:text-xl gap-6 md:text-2xl pb-24">
            {/* Basic Goal Information */}
            <Card className="w-full">
              {/* <CardHeader>
                <CardTitle>Setup Goal</CardTitle>
                <CardDescription>Set up your goal details</CardDescription>
              </CardHeader> */}

              <CardContent className="space-y-4 pt-4">
                <Label className="text-base font-medium">Setup your goal</Label>

                <div className="flex text-md w-full flex-col gap-2">
                  <div className="flex gap-1.5">
                    <div className="text-sm">Goal Name</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Enter a name for your goal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Input
                    type="text"
                    className="placeholder:text-xs"
                    placeholder="Gym reminder"
                    maxLength={100}
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.voices.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.voices.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Select
                    value={aiVoice}
                    onValueChange={(value) => setAIVoice(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiVoices.map((el, i) => (
                        <SelectItem key={i} value={el}>
                          {el}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.language.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.language.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={language}
                    onValueChange={(value) => setLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((el, i) => (
                        <SelectItem key={i} value={el}>
                          {el}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.PhoneNumber.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.PhoneNumber.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <PhoneInput
                    country={"in"}
                    value={phoneNumber || ""}
                    disabled={true}
                    inputStyle={{
                      fontFamily: "Bricolage Grotesque",
                      padding: "8px 14px 8px 60px",
                      color: "#0D0A09",
                      width: "100%",
                      border: "1px solid #E7E5E4",
                      borderRadius: "6px",
                      fontSize: "14px",
                      lineHeight: "19px",
                    }}
                    inputProps={{
                      required: true,
                      onFocus: (e: {
                        target: {
                          style: { border: string; boxShadow: string };
                        };
                      }) => {
                        (e.target.style.border = " 1px solid #000000"),
                          (e.target.style.boxShadow = "none");
                      },
                      onBlur: (e: {
                        target: { style: { border: string } };
                      }) => {
                        e.target.style.border = "1px solid #E7E5E4";
                      },
                    }}
                  />
                </div>

                <div className="flex text-md w-full flex-col gap-2">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.persona.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.persona.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    type="text"
                    placeholder="Act as gym coach"
                    className="placeholder:text-xs"
                    maxLength={100}
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    required
                  />
                </div>

                <div className="flex text-md w-full flex-col gap-2">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.context.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.context.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Remind me to go to the gym, ask about my last workout, today's plan, motivate me if required and wish a great day ahead"
                    className="placeholder:text-xs h-32"
                  />
                </div>
              </CardContent>

              <CardContent className="space-y-6">
                {/* Timezone Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Timezone
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    Browser: {Intl.DateTimeFormat().resolvedOptions().timeZone}, Current: {schedule.timezone}, UTC: {getTimezoneOffset(schedule.timezone)}
                    {getTimezoneOffset(schedule.timezone) === "?" && (
                      <span className="text-orange-600 ml-1">(Timezone not in fallback list)</span>
                    )}
                  </div>
                  <div className="relative">
                    <style>{`
                      .css-13cymwt-control {
                        height: 40px !important;
                        min-height: 40px !important;
                        font-size: 14px !important;
                        border-radius: 6px !important;
                        border: 1px solid #d1d5db !important;
                        box-shadow: none !important;
                      }
                      .css-hlgwow {
                        font-size: 14px !important;
                        padding: 8px 12px !important;
                        height: 38px !important;
                        line-height: 1.2 !important;
                      }
                      .css-1dimb5e-singleValue {
                        font-size: 14px !important;
                        font-weight: normal !important;
                        line-height: 1.2 !important;
                      }
                      .css-19bb58m input {
                        font-size: 14px !important;
                        line-height: 1.2 !important;
                      }
                      .css-1wy0on6 {
                        height: 38px !important;
                      }
                      .css-1u9des2-indicatorSeparator {
                        height: 20px !important;
                        margin: 8px 0 !important;
                      }
                      /* Dropdown menu styling */
                      .css-1nmdiq5-menu {
                        font-size: 14px !important;
                        border: 1px solid #d1d5db !important;
                        border-radius: 6px !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                      }
                      .css-1n6sfyn-menu {
                        font-size: 14px !important;
                        padding: 4px 0 !important;
                      }
                      .css-10wo9uf-option {
                        font-size: 14px !important;
                        padding: 8px 12px !important;
                        line-height: 1.2 !important;
                        min-height: 36px !important;
                      }
                      .css-tr4s17-option {
                        font-size: 14px !important;
                        padding: 8px 12px !important;
                        line-height: 1.2 !important;
                        min-height: 36px !important;
                      }
                      /* Focus and hover states */
                      .css-13cymwt-control:hover {
                        border-color: #9ca3af !important;
                      }
                      .css-13cymwt-control:focus-within {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 1px #3b82f6 !important;
                      }
                    `}</style>
                    <TimezoneSelect
                      value={{ value: schedule.timezone, label: schedule.timezone }}
                      onChange={(tz) => handleTimezoneChange(tz.value)}
                      timezones={{
                        ...phpTimezones.reduce((acc, tz) => {
                          acc[tz] = tz;
                          return acc;
                        }, {} as Record<string, string>)
                      }}
                      placeholder="Select timezone..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* CronBuilder Component */}
                <CronBuilder 
                  onCronChange={handleCronBuilderChange} 
                  timezone={schedule.timezone}
                />

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-1.5">
                    <div className="text-sm">{text.label.status.name}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{text.label.status.toolTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex gap-1.5">
                    <Switch checked={isActive} onCheckedChange={handleToggle} />
                    <div className="text-sm">
                      {isActive ? "Active" : "Pause"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleClick}
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={!isCronValid}
            >
              Create Goal
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
