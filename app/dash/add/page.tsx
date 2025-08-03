/** @format */

"use client";

import { Suspense, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";

import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

import Link from "next/link";
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

interface JobSchedule {
  timezone: string;
  expiresAt: number;
  hours: number[];
  mdays: number[];
  minutes: number[];
  months: number[];
  wdays: number[];
}

const phpTimezones = [
  // Africa
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Asmara",
  "Africa/Asmera",
  "Africa/Bamako",
  "Africa/Bangui",
  "Africa/Banjul",
  "Africa/Bissau",
  "Africa/Blantyre",
  "Africa/Brazzaville",
  "Africa/Bujumbura",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Ceuta",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Dar_es_Salaam",
  "Africa/Djibouti",
  "Africa/Douala",
  "Africa/El_Aaiun",
  "Africa/Freetown",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Johannesburg",
  "Africa/Juba",
  "Africa/Kampala",
  "Africa/Khartoum",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Lagos",
  "Africa/Libreville",
  "Africa/Lome",
  "Africa/Luanda",
  "Africa/Lubumbashi",
  "Africa/Lusaka",
  "Africa/Malabo",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Ndjamena",
  "Africa/Niamey",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Sao_Tome",
  "Africa/Timbuktu",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Windhoek",
  // America
  "America/Adak",
  "America/Anchorage",
  "America/Anguilla",
  "America/Antigua",
  "America/Araguaina",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca",
  "America/Argentina/ComodRivadavia",
  "America/Argentina/Cordoba",
  "America/Argentina/Jujuy",
  "America/Argentina/La_Rioja",
  "America/Argentina/Mendoza",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Salta",
  "America/Argentina/San_Juan",
  "America/Argentina/San_Luis",
  "America/Argentina/Tucuman",
  "America/Argentina/Ushuaia",
  "America/Aruba",
  "America/Asuncion",
  "America/Atikokan",
  "America/Atka",
  "America/Bahia",
  "America/Bahia_Banderas",
  "America/Barbados",
  "America/Belem",
  "America/Belize",
  "America/Blanc-Sablon",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Boise",
  "America/Cambridge_Bay",
  "America/Campo_Grande",
  "America/Cancun",
  "America/Caracas",
  "America/Cayenne",
  "America/Cayman",
  "America/Chicago",
  "America/Chihuahua",
  "America/Coral_Harbour",
  "America/Costa_Rica",
  "America/Creston",
  "America/Cuiaba",
  "America/Curacao",
  "America/Danmarkshavn",
  "America/Dawson",
  "America/Dawson_Creek",
  "America/Denver",
  "America/Detroit",
  "America/Dominica",
  "America/Edmonton",
  "America/Eirunepe",
  "America/El_Salvador",
  "America/Ensenada",
  "America/Fort_Nelson",
  "America/Fortaleza",
  "America/Glace_Bay",
  "America/Godthab",
  "America/Goose_Bay",
  "America/Grand_Turk",
  "America/Grenada",
  "America/Guadeloupe",
  "America/Guatemala",
  "America/Guayaquil",
  "America/Guyana",
  "America/Halifax",
  "America/Havana",
  "America/Hermosillo",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Inuvik",
  "America/Iqaluit",
  "America/Jamaica",
  "America/Jujuy",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Knox_IN",
  "America/Kralendijk",
  "America/La_Paz",
  "America/Lima",
  "America/Los_Angeles",
  "America/Louisville",
  "America/Lower_Princes",
  "America/Maceio",
  "America/Managua",
  "America/Manaus",
  "America/Marigot",
  "America/Martinique",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Mendoza",
  "America/Menominee",
  "America/Merida",
  "America/Metlakatla",
  "America/Mexico_City",
  "America/Miquelon",
  "America/Moncton",
  "America/Monterrey",
  "America/Montevideo",
  "America/Montreal",
  "America/Montserrat",
  "America/Nassau",
  "America/New_York",
  "America/Nipigon",
  "America/Nome",
  "America/Noronha",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Ojinaga",
  "America/Panama",
  "America/Pangnirtung",
  "America/Paramaribo",
  "America/Phoenix",
  "America/Port-au-Prince",
  "America/Port_of_Spain",
  "America/Porto_Acre",
  "America/Porto_Velho",
  "America/Puerto_Rico",
  "America/Punta_Arenas",
  "America/Rainy_River",
  "America/Rankin_Inlet",
  "America/Recife",
  "America/Regina",
  "America/Resolute",
  "America/Rio_Branco",
  "America/Rosario",
  "America/Santa_Isabel",
  "America/Santarem",
  "America/Santiago",
  "America/Santo_Domingo",
  "America/Sao_Paulo",
  "America/Scoresbysund",
  "America/Shiprock",
  "America/Sitka",
  "America/St_Barthelemy",
  "America/St_Johns",
  "America/St_Kitts",
  "America/St_Lucia",
  "America/St_Thomas",
  "America/St_Vincent",
  "America/Swift_Current",
  "America/Tegucigalpa",
  "America/Thule",
  "America/Thunder_Bay",
  "America/Tijuana",
  "America/Toronto",
  "America/Tortola",
  "America/Vancouver",
  "America/Whitehorse",
  "America/Winnipeg",
  "America/Yakutat",
  "America/Yellowknife",
  // Antarctica
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/DumontDUrville",
  "Antarctica/Macquarie",
  "Antarctica/Mawson",
  "Antarctica/McMurdo",
  "Antarctica/Palmer",
  "Antarctica/Rothera",
  "Antarctica/South_Pole",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  // Arctic
  "Arctic/Longyearbyen",
  // Asia
  "Asia/Aden",
  "Asia/Almaty",
  "Asia/Amman",
  "Asia/Anadyr",
  "Asia/Aqtau",
  "Asia/Aqtobe",
  "Asia/Ashgabat",
  "Asia/Ashkhabad",
  "Asia/Atyrau",
  "Asia/Baghdad",
  "Asia/Bahrain",
  "Asia/Baku",
  "Asia/Bangkok",
  "Asia/Barnaul",
  "Asia/Beirut",
  "Asia/Bishkek",
  "Asia/Brunei",
  "Asia/Calcutta",
  "Asia/Chita",
  "Asia/Choibalsan",
  "Asia/Chongqing",
  "Asia/Chungking",
  "Asia/Colombo",
  "Asia/Dacca",
  "Asia/Damascus",
  "Asia/Dhaka",
  "Asia/Dili",
  "Asia/Dubai",
  "Asia/Dushanbe",
  "Asia/Famagusta",
  "Asia/Gaza",
  "Asia/Harbin",
  "Asia/Hebron",
  "Asia/Ho_Chi_Minh",
  "Asia/Hong_Kong",
  "Asia/Hovd",
  "Asia/Irkutsk",
  "Asia/Istanbul",
  "Asia/Jakarta",
  "Asia/Jayapura",
  "Asia/Jerusalem",
  "Asia/Kabul",
  "Asia/Kamchatka",
  "Asia/Karachi",
  "Asia/Kashgar",
  "Asia/Kathmandu",
  "Asia/Katmandu",
  "Asia/Khandyga",
  "Asia/Kolkata",
  "Asia/Krasnoyarsk",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Asia/Kuwait",
  "Asia/Macao",
  "Asia/Macau",
  "Asia/Magadan",
  "Asia/Makassar",
  "Asia/Manila",
  "Asia/Muscat",
  "Asia/Nicosia",
  "Asia/Novokuznetsk",
  "Asia/Novosibirsk",
  "Asia/Omsk",
  "Asia/Oral",
  "Asia/Phnom_Penh",
  "Asia/Pontianak",
  "Asia/Pyongyang",
  "Asia/Qatar",
  "Asia/Qostanay",
  "Asia/Qyzylorda",
  "Asia/Rangoon",
  "Asia/Riyadh",
  "Asia/Saigon",
  "Asia/Sakhalin",
  "Asia/Samarkand",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Srednekolymsk",
  "Asia/Taipei",
  "Asia/Tashkent",
  "Asia/Tbilisi",
  "Asia/Tehran",
  "Asia/Tel_Aviv",
  "Asia/Thimbu",
  "Asia/Thimphu",
  "Asia/Tokyo",
  "Asia/Tomsk",
  "Asia/Ujung_Pandang",
  "Asia/Ulaanbaatar",
  "Asia/Ulan_Bator",
  "Asia/Urumqi",
  "Asia/Ust-Nera",
  "Asia/Vientiane",
  "Asia/Vladivostok",
  "Asia/Yakutsk",
  "Asia/Yangon",
  "Asia/Yekaterinburg",
  "Asia/Yerevan",
  // Atlantic
  "Atlantic/Azores",
  "Atlantic/Bermuda",
  "Atlantic/Canary",
  "Atlantic/Cape_Verde",
  "Atlantic/Faeroe",
  "Atlantic/Faroe",
  "Atlantic/Jan_Mayen",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
  "Atlantic/South_Georgia",
  "Atlantic/St_Helena",
  "Atlantic/Stanley",
  // Australia
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Broken_Hill",
  "Australia/Currie",
  "Australia/Darwin",
  "Australia/Eucla",
  "Australia/Hobart",
  "Australia/Lindeman",
  "Australia/Lord_Howe",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Sydney",
  // Europe
  "Europe/Amsterdam",
  "Europe/Andorra",
  "Europe/Astrakhan",
  "Europe/Athens",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Bratislava",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Busingen",
  "Europe/Chisinau",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Gibraltar",
  "Europe/Guernsey",
  "Europe/Helsinki",
  "Europe/Isle_of_Man",
  "Europe/Istanbul",
  "Europe/Jersey",
  "Europe/Kaliningrad",
  "Europe/Kiev",
  "Europe/Kirov",
  "Europe/Lisbon",
  "Europe/Ljubljana",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Malta",
  "Europe/Mariehamn",
  "Europe/Minsk",
  "Europe/Monaco",
  "Europe/Moscow",
  "Europe/Nicosia",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Podgorica",
  "Europe/Prague",
  "Europe/Riga",
  "Europe/Rome",
  "Europe/Samara",
  "Europe/San_Marino",
  "Europe/Sarajevo",
  "Europe/Saratov",
  "Europe/Simferopol",
  "Europe/Skopje",
  "Europe/Sofia",
  "Europe/Stockholm",
  "Europe/Tallinn",
  "Europe/Tirane",
  "Europe/Ulyanovsk",
  "Europe/Uzhgorod",
  "Europe/Vaduz",
  "Europe/Vatican",
  "Europe/Vienna",
  "Europe/Vilnius",
  "Europe/Volgograd",
  "Europe/Warsaw",
  "Europe/Zagreb",
  "Europe/Zaporozhye",
  "Europe/Zurich",
  // Indian
  "Indian/Antananarivo",
  "Indian/Chagos",
  "Indian/Christmas",
  "Indian/Cocos",
  "Indian/Comoro",
  "Indian/Kerguelen",
  "Indian/Mahe",
  "Indian/Maldives",
  "Indian/Mauritius",
  "Indian/Mayotte",
  "Indian/Reunion",
  // Pacific
  "Pacific/Apia",
  "Pacific/Auckland",
  "Pacific/Bougainville",
  "Pacific/Chatham",
  "Pacific/Chuuk",
  "Pacific/Easter",
  "Pacific/Efate",
  "Pacific/Enderbury",
  "Pacific/Fakaofo",
  "Pacific/Fiji",
  "Pacific/Funafuti",
  "Pacific/Galapagos",
  "Pacific/Gambier",
  "Pacific/Guadalcanal",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "Pacific/Johnston",
  "Pacific/Kanton",
  "Pacific/Kiritimati",
  "Pacific/Kosrae",
  "Pacific/Kwajalein",
  "Pacific/Majuro",
  "Pacific/Marquesas",
  "Pacific/Midway",
  "Pacific/Nauru",
  "Pacific/Niue",
  "Pacific/Norfolk",
  "Pacific/Noumea",
  "Pacific/Pago_Pago",
  "Pacific/Palau",
  "Pacific/Pitcairn",
  "Pacific/Pohnpei",
  "Pacific/Ponape",
  "Pacific/Port_Moresby",
  "Pacific/Rarotonga",
  "Pacific/Saipan",
  "Pacific/Samoa",
  "Pacific/Tahiti",
  "Pacific/Tarawa",
  "Pacific/Tongatapu",
  "Pacific/Truk",
  "Pacific/Wake",
  "Pacific/Wallis",
  // UTC
  "UTC",
];

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
  const [yearlyDay, setYearlyDay] = useState<number>(1);
  const [schedule, setSchedule] = useState<JobSchedule>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    expiresAt: 0,
    hours: [],
    mdays: [],
    minutes: [],
    months: [],
    wdays: [],
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
      )}`;
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

  const handleToggle = (value: boolean) => {
    setIsActive(value);
  };

  const handleClick = async () => {
    let finalSchedule: JobSchedule;

    if (jobType === "onetime") {
      const [hour, minute] = oneTimeTime.split(":").map(Number);
      const executionDate = new Date(`${oneTimeDate}T${oneTimeTime}`);
      const day = executionDate.getDate();
      const month = executionDate.getMonth() + 1;

      finalSchedule = {
        ...schedule,
        hours: [hour],
        minutes: [minute],
        mdays: [day],
        months: [month],
        wdays: [-1],
      };
    } else {
      finalSchedule =
        recurringType === "simple"
          ? generateScheduleFromSimple()
          : {
              ...schedule,
              expiresAt: formatDateTimeToNumber(expirationDate, expirationTime),
            };
    }

    const postData = {
      phoneNumber: `+${phoneNumber}`,
      task: `${persona}.${context}`,
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
        url: "https://nevermissai.com/api/blondai",
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

    try {
      const response = await axios.put(url, jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });
      console.log("Job scheduled successfully:", response.data);
      alert("Goal created successfully!");
    } catch (error) {
      console.error("Error scheduling job:", error);
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

  useEffect(() => {
    if (!userChangedTimezone) {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSchedule((prev) => ({ ...prev, timezone: browserTz }));
    }
  }, [userChangedTimezone]);

  return (
    <>
      <div className="flex flex-col items-center pt-6 px-6 pb-24 w-full">
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
                  <Select
                    value={schedule.timezone}
                    onValueChange={handleTimezoneChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phpTimezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                              Execution Preview
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
