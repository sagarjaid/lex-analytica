/** @format */

"use client";

import { Suspense, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

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
import { Clock, Globe, Repeat, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CronExpressionParser } from "cron-parser";
import { DateTime } from "luxon";
import { formatInTimeZone } from 'date-fns-tz';
import { Goal } from "@/types";

interface JobSchedule {
  timezone: string;
  expiresAt: number;
  hours: number[];
  mdays: number[];
  minutes: number[];
  months: number[];
  wdays: number[];
}



const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

// Helper to convert schedule arrays to crontab fields
function toCrontabField(arr: number[], min: number, max: number): string {
  if (arr.includes(-1) || arr.length === max - min + 1) return "*";
  return arr.sort((a, b) => a - b).join(",");
}

function getCrontabExpression(schedule: JobSchedule): string {
  const min = toCrontabField(schedule.minutes, 0, 59);
  const hour = toCrontabField(schedule.hours, 0, 23);
  const mday = toCrontabField(schedule.mdays, 1, 31);
  const month = toCrontabField(schedule.months, 1, 12);
  const wday = toCrontabField(schedule.wdays, 0, 6);
  return `${min} ${hour} ${mday} ${month} ${wday}`;
}

function getNextExecutions(cronExp: string, timezone: string): string[] {
  try {
    const cronInterval = CronExpressionParser.parse(cronExp, { tz: timezone });
    const executions = [];
    for (let i = 0; i < 5; i++) {
      executions.push(cronInterval.next().toString());
    }
    return executions;
  } catch {
    /* ignore parse errors, show raw string */
  }
  return ["Invalid cron expression"];
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
  const [recurringType, setRecurringType] = useState<"simple" | "advanced">(
    "simple"
  );
  const [oneTimeDate, setOneTimeDate] = useState("");
  const [oneTimeTime, setOneTimeTime] = useState("");
  const [simpleInterval, setSimpleInterval] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const [simpleTime, setSimpleTime] = useState("09:00");
  const [weeklyDay, setWeeklyDay] = useState<number>(1);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [yearlyMonth, setYearlyMonth] = useState<number>(1);
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

  const [yearlyDay, setYearlyDay] = useState<number>(1);
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
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [userChangedTimezone, setUserChangedTimezone] = useState(false);

  const generateScheduleFromSimple = (): JobSchedule => {
    const [hour, minute] = simpleTime.split(":").map(Number);

    switch (simpleInterval) {
      case "daily":
        return {
          ...schedule,
          hours: [hour],
          minutes: [minute],
          mdays: [-1],
          months: [-1],
          wdays: [-1],
        };
      case "weekly":
        return {
          ...schedule,
          hours: [hour],
          minutes: [minute],
          mdays: [-1],
          months: [-1],
          wdays: [weeklyDay],
        };
      case "monthly":
        return {
          ...schedule,
          hours: [hour],
          minutes: [minute],
          mdays: [monthlyDay],
          months: [-1],
          wdays: [-1],
        };
      case "yearly":
        return {
          ...schedule,
          hours: [hour],
          minutes: [minute],
          mdays: [yearlyDay],
          months: [yearlyMonth],
          wdays: [-1],
        };
      default:
        return schedule;
    }
  };

  // Compute crontab and next executions for recurring jobs (memoized)
  const { cronExp, nextExecutions } = useMemo(() => {
    if (jobType === "recurring") {
      const effectiveSchedule =
        recurringType === "simple" ? generateScheduleFromSimple() : schedule;
      const cronExp = getCrontabExpression(effectiveSchedule);
      const nextExecutions = getNextExecutions(
        cronExp,
        effectiveSchedule.timezone
      );
      return { cronExp, nextExecutions };
    }
    return { cronExp: "", nextExecutions: [] };
  }, [
    jobType,
    recurringType,
    schedule,
    simpleTime,
    simpleInterval,
    weeklyDay,
    monthlyDay,
    yearlyDay,
    yearlyMonth,
  ]);

  // Disable create button if cron is invalid
  const isCronValid = !(
    jobType === "recurring" && nextExecutions[0] === "Invalid cron expression"
  );

  const handleScheduleChange = (
    field: keyof Omit<JobSchedule, "timezone" | "expiresAt">,
    value: number | number[]
  ) => {
    setSchedule((prev) => {
      const currentValue = prev[field];
      if (!Array.isArray(currentValue)) return prev;

      // If the value is -1 (Every X), clear the array and set only -1
      if (value === -1) {
        return { ...prev, [field]: [-1] };
      }
      // If we're setting a specific value and the array currently has -1, remove -1
      if (currentValue.includes(-1)) {
        return { ...prev, [field]: [] };
      }
      return { ...prev, [field]: value };
    });
  };

  const toggleArrayValue = (
    field: keyof Omit<JobSchedule, "timezone" | "expiresAt">,
    value: number
  ) => {
    setSchedule((prev) => {
      const currentArray = prev[field];
      if (!Array.isArray(currentArray)) return prev;

      // If clicking a specific value while "Every X" is active, remove "Every X" and add the value
      if (currentArray.includes(-1)) {
        return { ...prev, [field]: [value] };
      }

      // If clicking a value that's already selected, remove it
      if (currentArray.includes(value)) {
        const newArray = currentArray.filter((v) => v !== value);
        // If array becomes empty, set it to "Every X"
        return { ...prev, [field]: newArray.length === 0 ? [-1] : newArray };
      }

      // Add the new value and sort
      const newArray = [...currentArray, value].sort((a, b) => a - b);
      return { ...prev, [field]: newArray };
    });
  };

  // Add helper functions to check if a field is in "Every X" mode
  const isEveryMode = (
    field: keyof Omit<JobSchedule, "timezone" | "expiresAt">
  ): boolean => {
    const value = schedule[field];
    return Array.isArray(value) && value.includes(-1);
  };

  // Add helper function to get display value for checkboxes
  const getCheckboxValue = (
    field: keyof Omit<JobSchedule, "timezone" | "expiresAt">,
    value: number
  ): boolean => {
    const array = schedule[field];
    return (
      Array.isArray(array) && (array.includes(-1) || array.includes(value))
    );
  };

  const formatDateTimeToNumber = (date: string, time: string): number => {
    if (!date || !time) return 0;
    const dateTime = new Date(`${date}T${time}`);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hour = String(dateTime.getHours()).padStart(2, "0");
    const minute = String(dateTime.getMinutes()).padStart(2, "0");
    const second = String(dateTime.getSeconds()).padStart(2, "0");

    return Number.parseInt(`${year}${month}${day}${hour}${minute}${second}`);
  };

  const getSchedulePreview = (): string => {
    if (jobType === "onetime") {
      if (!oneTimeDate || !oneTimeTime) return "Please select date and time";
      const date = new Date(`${oneTimeDate}T${oneTimeTime}`);
      return `Job will run once on ${date.toLocaleDateString()} at ${date.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )} and expire on the same day`;
    }

    if (recurringType === "simple") {
      if (!simpleTime) return "Please select time";

      const [hour, minute] = simpleTime.split(":").map(Number);
      const timeStr = new Date(2000, 0, 1, hour, minute).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      );
      let dayName: string | undefined;
      let suffix: string;
      let monthName: string | undefined;
      let daySuffix: string;

      switch (simpleInterval) {
        case "daily":
          return `Job will repeat every day at ${timeStr}`;
        case "weekly":
          dayName =
            weekDays.find((d) => d.value === weeklyDay)?.label || "Unknown";
          return `Job will repeat every ${dayName} at ${timeStr}`;
        case "monthly":
          suffix = getOrdinalSuffix(monthlyDay);
          return `Job will repeat every ${monthlyDay}${suffix} of the month at ${timeStr}`;
        case "yearly":
          monthName =
            months.find((m) => m.value === yearlyMonth)?.label || "Unknown";
          daySuffix = getOrdinalSuffix(yearlyDay);
          return `Job will repeat every ${monthName} ${yearlyDay}${daySuffix} at ${timeStr}`;
        default:
          return "Please configure schedule";
      }
    }

    // Advanced mode preview logic
    const { hours, minutes, mdays, months: schedMonths, wdays } = schedule;

    if (hours.length === 0 || minutes.length === 0) {
      return "Please select at least one hour and minute";
    }

    let preview = "Job will repeat ";

    // Frequency description
    const isEveryDay =
      mdays.includes(-1) ||
      (mdays.length === 31 && mdays.every((d, i) => d === i + 1));
    const isEveryMonth =
      schedMonths.includes(-1) ||
      (schedMonths.length === 12 && schedMonths.every((m, i) => m === i + 1));
    const isEveryWeekday = wdays.includes(-1) || wdays.length === 7;

    if (isEveryDay && isEveryMonth && isEveryWeekday) {
      preview += "every day";
    } else if (wdays.length > 0 && !wdays.includes(-1)) {
      const dayNames = wdays
        .map((d) => weekDays.find((wd) => wd.value === d)?.label)
        .filter(Boolean);
      if (dayNames.length === 1) {
        preview += `every ${dayNames[0]}`;
      } else if (dayNames.length === 7) {
        preview += "every day";
      } else {
        preview += `on ${dayNames.slice(0, -1).join(", ")} and ${
          dayNames[dayNames.length - 1]
        }`;
      }
    } else if (mdays.length > 0 && !mdays.includes(-1)) {
      if (mdays.length === 1) {
        const suffix = getOrdinalSuffix(mdays[0]);
        preview += `on the ${mdays[0]}${suffix} of each month`;
      } else {
        const dayList = mdays
          .map((d) => `${d}${getOrdinalSuffix(d)}`)
          .join(", ");
        preview += `on the ${dayList} of each month`;
      }
    } else {
      preview += "based on custom schedule";
    }

    // Time description
    if (hours.length === 1 && minutes.length === 1) {
      const timeStr = new Date(
        2000,
        0,
        1,
        hours[0],
        minutes[0]
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      preview += ` at ${timeStr}`;
    } else if (hours.includes(-1) && minutes.includes(-1)) {
      preview += " every minute";
    } else if (hours.includes(-1)) {
      if (minutes.length === 1) {
        preview += ` at ${minutes[0]} minutes past every hour`;
      } else {
        preview += ` at minutes ${minutes.join(", ")} of every hour`;
      }
    } else if (minutes.includes(-1)) {
      if (hours.length === 1) {
        preview += ` every minute during hour ${hours[0]}`;
      } else {
        preview += ` every minute during hours ${hours.join(", ")}`;
      }
    } else {
      const times = hours
        .flatMap((h) =>
          minutes.map((m) =>
            new Date(2000, 0, 1, h, m).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          )
        )
        .slice(0, 3); // Show max 3 times

      if (hours.length * minutes.length <= 3) {
        preview += ` at ${times.join(", ")}`;
      } else {
        preview += ` at ${times.join(", ")} and ${
          hours.length * minutes.length - 3
        } more times`;
      }
    }

    // Month restriction
    if (
      schedMonths.length > 0 &&
      !schedMonths.includes(-1) &&
      schedMonths.length < 12
    ) {
      const monthNames = schedMonths
        .map((m) => months.find((month) => month.value === m)?.label)
        .filter(Boolean);
      if (monthNames.length === 1) {
        preview += ` in ${monthNames[0]}`;
      } else {
        preview += ` in ${monthNames.slice(0, -1).join(", ")} and ${
          monthNames[monthNames.length - 1]
        }`;
      }
    }

    // Add expiration if set
    if (expirationDate && expirationTime) {
      const expirationDateTime = new Date(
        `${expirationDate}T${expirationTime}`
      );
      preview += ` until ${expirationDateTime.toLocaleDateString()} at ${expirationDateTime.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
    }

    return preview;
  };

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

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

    try {
      let finalSchedule: JobSchedule;
      let expiresAt: Date | null = null;

      if (jobType === "onetime") {
        const [hour, minute] = oneTimeTime.split(":").map(Number);
        const executionDate = new Date(`${oneTimeDate}T${oneTimeTime}`);
        const day = executionDate.getDate();
        const month = executionDate.getMonth() + 1;

        // For one-time jobs, set expiration to 6 hours after execution time
        // This ensures the job expires after execution or if it fails to execute
        expiresAt = new Date(executionDate.getTime() + 6 * 60 * 60 * 1000);

        // Calculate expiration time for cron-job.org (6 hours after execution)
        const expirationDateTime = new Date(executionDate.getTime() + 6 * 60 * 60 * 1000);
        const expirationDateStr = expirationDateTime.toISOString().slice(0, 10); // YYYY-MM-DD
        const expirationTimeStr = expirationDateTime.toTimeString().slice(0, 5); // HH:MM
        
        finalSchedule = {
          ...schedule,
          hours: [hour],
          minutes: [minute],
          mdays: [day],
          months: [month],
          wdays: [-1],
          expiresAt: formatDateTimeToNumber(expirationDateStr, expirationTimeStr), // Set to 6 hours after execution for cron-job.org
        };
      } else {
        finalSchedule =
          recurringType === "simple"
            ? generateScheduleFromSimple()
            : {
                ...schedule,
                expiresAt: formatDateTimeToNumber(expirationDate, expirationTime),
              };
        
        // For recurring jobs, set expiration if specified by the user
        // This allows users to set a custom expiration date/time for recurring jobs
        if (expirationDate && expirationTime) {
          expiresAt = new Date(`${expirationDate}T${expirationTime}`);
        }
      }

      // First, create the goal in the database
      const { data: goal, error: goalError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: goalName,
          description: `${persona}: ${context}`,
          phone_number: `+${phoneNumber}`,
          schedule: finalSchedule,
          schedule_type: jobType,
          is_active: isActive,
          status: isActive ? 'active' : 'paused',
          persona: persona,
          context: context,
          language: language,
          voice: aiVoice,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (goalError) {
        console.error("Error creating goal:", goalError);
        alert("Error creating goal in database. Please try again.");
        return;
      }

      // Create the cron job
      const postData = {
        goal_id: goal.id,
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
            headers: [] as string[],
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

      if (response.data && response.data.jobId) {
        // Update the goal with the cron job ID
        const { error: updateError } = await supabase
          .from("goals")
          .update({ cron_job_id: response.data.jobId.toString() })
          .eq("id", goal.id);

        if (updateError) {
          console.error("Error updating goal with cron job ID:", updateError);
        }
      }

      console.log("Goal and job created successfully:", response.data);
      alert("Goal created successfully!");
      
      // Redirect to goals page
      window.location.href = "/dash/goals";
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Error creating goal. Please try again.");
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

                {/* Job Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Schedule Type</Label>
                  <RadioGroup
                    value={jobType}
                    onValueChange={(value: "onetime" | "recurring") =>
                      setJobType(value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="onetime" id="onetime" />
                      <Label
                        htmlFor="onetime"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        One-time execution
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label
                        htmlFor="recurring"
                        className="flex items-center gap-2"
                      >
                        <Repeat className="w-4 h-4" />
                        Recurring schedule
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* One-time Job Configuration */}
                {jobType === "onetime" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        One-time Execution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-green-800 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800 mb-1 text-sm">
                              Execution & Expiration Preview
                            </h4>
                            <p className="text-green-800 text-xs">
                              {getSchedulePreview()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oneTimeDate">Date</Label>
                          <Input
                            id="oneTimeDate"
                            type="date"
                            value={oneTimeDate}
                            onChange={(e) => setOneTimeDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="oneTimeTime">Time</Label>
                          <Input
                            id="oneTimeTime"
                            type="time"
                            value={oneTimeTime}
                            onChange={(e) => setOneTimeTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recurring Job Configuration */}
                {jobType === "recurring" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Recurring Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-blue-800 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm text-blue-800 mb-1">
                              Schedule Preview
                            </h4>
                            <p className="text-blue-800 text-xs">
                              {getSchedulePreview()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Crontab and next executions block (for both simple and advanced) */}
                      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="mb-2 text-base">
                          <strong>Cron Jab Expression:</strong>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <pre
                              className={`border border-gray-300 ${
                                isCronValid ? "bg-green-200" : "bg-red-200"
                              } p-2 rounded select-all`}
                            >
                              {cronExp}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 px-2 py-1 text-xs rounded hover:bg-gray-200"
                              onClick={() => {
                                navigator.clipboard.writeText(cronExp);
                                // Optionally show a toast or alert here
                              }}
                              title="Copy to clipboard"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        <div>
                          <strong className="text-base">
                            Next 5 Executions:
                          </strong>
                          <ul className="list-disc flex flex-col gap-2 ml-3 mt-2 text-xs">
                            {nextExecutions.map((exec, idx) => {
                              // Try to parse as Date, fallback to string if invalid
                              let formatted = exec;
                              try {
                                const dt = DateTime.fromJSDate(
                                  new Date(exec)
                                ).setZone(schedule.timezone);
                                if (dt.isValid) {
                                  formatted =
                                    dt.toFormat(
                                      "cccc, dd LLL yyyy HH:mm ZZZZ"
                                    ) + ` (${schedule.timezone})`;
                                }
                              } catch {
                                /* ignore parse errors, show raw string */
                              }
                              return <li key={idx}>{formatted}</li>;
                            })}
                          </ul>
                        </div>
                      </div>
                      <Tabs
                        value={recurringType}
                        onValueChange={(value: "simple" | "advanced") =>
                          setRecurringType(value)
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="simple">Simple</TabsTrigger>
                          <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        <TabsContent value="simple" className="space-y-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Repeat Interval</Label>
                              <Select
                                value={simpleInterval}
                                onValueChange={(
                                  value:
                                    | "daily"
                                    | "weekly"
                                    | "monthly"
                                    | "yearly"
                                ) => setSimpleInterval(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">
                                    Monthly
                                  </SelectItem>
                                  <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="simpleTime">Time</Label>
                              <Input
                                id="simpleTime"
                                type="time"
                                value={simpleTime}
                                onChange={(e) => setSimpleTime(e.target.value)}
                              />
                            </div>

                            {simpleInterval === "weekly" && (
                              <div className="space-y-2">
                                <Label>Day of Week</Label>
                                <Select
                                  value={weeklyDay.toString()}
                                  onValueChange={(value) =>
                                    setWeeklyDay(Number.parseInt(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {weekDays.map((day) => (
                                      <SelectItem
                                        key={day.value}
                                        value={day.value.toString()}
                                      >
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {simpleInterval === "monthly" && (
                              <div className="space-y-2">
                                <Label htmlFor="monthlyDay">Day of Month</Label>
                                <Input
                                  id="monthlyDay"
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={monthlyDay}
                                  onChange={(e) =>
                                    setMonthlyDay(
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            )}

                            {simpleInterval === "yearly" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Month</Label>
                                  <Select
                                    value={yearlyMonth.toString()}
                                    onValueChange={(value) =>
                                      setYearlyMonth(Number.parseInt(value))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem
                                          key={month.value}
                                          value={month.value.toString()}
                                        >
                                          {month.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="yearlyDay">Day</Label>
                                  <Input
                                    id="yearlyDay"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={yearlyDay}
                                    onChange={(e) =>
                                      setYearlyDay(
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-6">
                          {/* Minutes */}
                          <div className="space-y-3">
                            <Label>Minutes (0-59)</Label>
                            <div className="grid grid-cols-12 gap-2">
                              {Array.from({ length: 60 }, (_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-1"
                                >
                                  <Checkbox
                                    id={`minute-${i}`}
                                    checked={getCheckboxValue("minutes", i)}
                                    disabled={isEveryMode("minutes")}
                                    onCheckedChange={() =>
                                      toggleArrayValue("minutes", i)
                                    }
                                  />
                                  <Label
                                    htmlFor={`minute-${i}`}
                                    className="text-xs"
                                  >
                                    {i}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={
                                isEveryMode("minutes") ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleScheduleChange(
                                  "minutes",
                                  isEveryMode("minutes") ? [] : [-1]
                                )
                              }
                            >
                              {isEveryMode("minutes")
                                ? "Every Minute Selected"
                                : "Every Minute"}
                            </Button>
                          </div>

                          {/* Hours */}
                          <div className="space-y-3">
                            <Label>Hours (0-23)</Label>
                            <div className="grid grid-cols-12 gap-2">
                              {Array.from({ length: 24 }, (_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-1"
                                >
                                  <Checkbox
                                    id={`hour-${i}`}
                                    checked={getCheckboxValue("hours", i)}
                                    disabled={isEveryMode("hours")}
                                    onCheckedChange={() =>
                                      toggleArrayValue("hours", i)
                                    }
                                  />
                                  <Label
                                    htmlFor={`hour-${i}`}
                                    className="text-xs"
                                  >
                                    {i}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={
                                isEveryMode("hours") ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleScheduleChange(
                                  "hours",
                                  isEveryMode("hours") ? [] : [-1]
                                )
                              }
                            >
                              {isEveryMode("hours")
                                ? "Every Hour Selected"
                                : "Every Hour"}
                            </Button>
                          </div>

                          {/* Days of Month */}
                          <div className="space-y-3">
                            <Label>Days of Month (1-31)</Label>
                            <div className="grid grid-cols-12 gap-2">
                              {Array.from({ length: 31 }, (_, i) => (
                                <div
                                  key={i + 1}
                                  className="flex items-center space-x-1"
                                >
                                  <Checkbox
                                    id={`mday-${i + 1}`}
                                    checked={getCheckboxValue("mdays", i + 1)}
                                    disabled={isEveryMode("mdays")}
                                    onCheckedChange={() =>
                                      toggleArrayValue("mdays", i + 1)
                                    }
                                  />
                                  <Label
                                    htmlFor={`mday-${i + 1}`}
                                    className="text-xs"
                                  >
                                    {i + 1}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={
                                isEveryMode("mdays") ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleScheduleChange(
                                  "mdays",
                                  isEveryMode("mdays") ? [] : [-1]
                                )
                              }
                            >
                              {isEveryMode("mdays")
                                ? "Every Day Selected"
                                : "Every Day"}
                            </Button>
                          </div>

                          {/* Months */}
                          <div className="space-y-3">
                            <Label>Months</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {months.map((month) => (
                                <div
                                  key={month.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`month-${month.value}`}
                                    checked={getCheckboxValue(
                                      "months",
                                      month.value
                                    )}
                                    disabled={isEveryMode("months")}
                                    onCheckedChange={() =>
                                      toggleArrayValue("months", month.value)
                                    }
                                  />
                                  <Label
                                    htmlFor={`month-${month.value}`}
                                    className="text-sm"
                                  >
                                    {month.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={
                                isEveryMode("months") ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleScheduleChange(
                                  "months",
                                  isEveryMode("months") ? [] : [-1]
                                )
                              }
                            >
                              {isEveryMode("months")
                                ? "Every Month Selected"
                                : "Every Month"}
                            </Button>
                          </div>

                          {/* Days of Week */}
                          <div className="space-y-3">
                            <Label>Days of Week</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {weekDays.map((day) => (
                                <div
                                  key={day.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`wday-${day.value}`}
                                    checked={getCheckboxValue(
                                      "wdays",
                                      day.value
                                    )}
                                    disabled={isEveryMode("wdays")}
                                    onCheckedChange={() =>
                                      toggleArrayValue("wdays", day.value)
                                    }
                                  />
                                  <Label
                                    htmlFor={`wday-${day.value}`}
                                    className="text-sm"
                                  >
                                    {day.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={
                                isEveryMode("wdays") ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleScheduleChange(
                                  "wdays",
                                  isEveryMode("wdays") ? [] : [-1]
                                )
                              }
                            >
                              {isEveryMode("wdays")
                                ? "Every Day Selected"
                                : "Every Day"}
                            </Button>
                          </div>

                          {/* Expiration */}
                          <div className="space-y-3">
                            <Label>Job Expiration (Optional)</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expirationDate">
                                  Expiration Date
                                </Label>
                                <Input
                                  id="expirationDate"
                                  type="date"
                                  value={expirationDate}
                                  onChange={(e) =>
                                    setExpirationDate(e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="expirationTime">
                                  Expiration Time
                                </Label>
                                <Input
                                  id="expirationTime"
                                  type="time"
                                  value={expirationTime}
                                  onChange={(e) =>
                                    setExpirationTime(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

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
