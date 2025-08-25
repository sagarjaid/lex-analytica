"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/corn-select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Calendar, RotateCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import * as parser from "cron-parser"

interface CronFields {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
]

interface CronBuilderProps {
  onCronChange?: (data: {
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
  }) => void;
  timezone?: string;
}

export function CronBuilder({ onCronChange, timezone = "UTC" }: CronBuilderProps) {
  const [scheduleType, setScheduleType] = useState<"onetime" | "recurring">("onetime")
  const [oneTimeDate, setOneTimeDate] = useState("")
  const [oneTimeTime, setOneTimeTime] = useState("")

  const [cronFields, setCronFields] = useState<CronFields>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  })
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [selectedMinutes, setSelectedMinutes] = useState<string[]>([])
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([])
  const [cronExpression, setCronExpression] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [nextExecutions, setNextExecutions] = useState<string[]>([])
  const [scheduleExpires, setScheduleExpires] = useState({
    day: "25",
    month: "August",
    year: "2026",
    hour: "21",
    minute: "23",
  })
  const [scheduleExpiresEnabled, setScheduleExpiresEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple")
  const [simpleInterval, setSimpleInterval] = useState("daily")
  const [simpleTime, setSimpleTime] = useState("09:00")
  const [simpleDayOfWeek, setSimpleDayOfWeek] = useState<string[]>(["1"]) // Default to Monday
  const [simpleDayOfMonth, setSimpleDayOfMonth] = useState("1")
  const [simpleMonth, setSimpleMonth] = useState("1") // January
  const [simpleYearDay, setSimpleYearDay] = useState("1")

  useEffect(() => {
    if (scheduleType === "onetime") {
      const expression = generateOneTimeCron()
      setCronExpression(expression)
      validateCronExpression(expression)
    } else if (scheduleType === "recurring" && activeTab === "simple") {
      const expression = generateSimpleCron()
      setCronExpression(expression)
      validateCronExpression(expression)
    } else if (scheduleType === "recurring" && activeTab === "advanced") {
      const minute = selectedMinutes.length > 0 ? selectedMinutes.join(",") : cronFields.minute
      const hour = selectedHours.length > 0 ? selectedHours.join(",") : cronFields.hour
      const dayOfMonth = selectedDaysOfMonth.length > 0 ? selectedDaysOfMonth.join(",") : cronFields.dayOfMonth
      const month = selectedMonths.length > 0 ? selectedMonths.join(",") : cronFields.month
      const dayOfWeek = selectedDaysOfWeek.length > 0 ? selectedDaysOfWeek.join(",") : cronFields.dayOfWeek

      let finalDayOfMonth = dayOfMonth
      let finalDayOfWeek = dayOfWeek

      if (selectedDaysOfMonth.length > 0 && selectedDaysOfWeek.length > 0) {
        finalDayOfMonth = dayOfMonth
        finalDayOfWeek = dayOfWeek
      } else if (selectedDaysOfMonth.length > 0) {
        finalDayOfWeek = "*"
      } else if (selectedDaysOfWeek.length > 0) {
        finalDayOfMonth = "*"
      }

      const expression = `${minute} ${hour} ${finalDayOfMonth} ${month} ${finalDayOfWeek}`
      setCronExpression(expression)
      validateCronExpression(expression)
    }
  }, [
    scheduleType,
    oneTimeDate,
    oneTimeTime,
    activeTab,
    simpleInterval,
    simpleTime,
    simpleDayOfWeek,
    simpleDayOfMonth,
    simpleMonth,
    simpleYearDay,
    cronFields,
    selectedHours,
    selectedMinutes,
    selectedDaysOfMonth,
    selectedMonths,
    selectedDaysOfWeek,
  ])

  // Call parent callback whenever cron data changes
  useEffect(() => {
    if (onCronChange) {
      onCronChange({
        cronExpression,
        nextExecutions,
        isValid,
        scheduleType,
        scheduleExpires: scheduleExpiresEnabled ? scheduleExpires : undefined,
        scheduleExpiresEnabled,
      })
    }
  }, [cronExpression, nextExecutions, isValid, scheduleType, scheduleExpires, scheduleExpiresEnabled, onCronChange])

  useEffect(() => {
    if (scheduleType === "onetime" && oneTimeDate && oneTimeTime) {
      const executionDate = new Date(oneTimeDate)
      const [hour, minute] = oneTimeTime.split(":").map(Number)

      if (!isNaN(hour) && !isNaN(minute)) {
        executionDate.setHours(hour, minute, 0, 0)

        // Calculate expiry date (2 days after execution)
        const expiryDate = new Date(executionDate)
        expiryDate.setDate(expiryDate.getDate() + 2)

        console.log("[v0] One-time execution date:", executionDate.toString())
        console.log("[v0] One-time execution expiry (2 days after):", expiryDate.toString())
      }
    }
  }, [scheduleType, oneTimeDate, oneTimeTime])

  const validateCronExpression = (expression: string) => {
    try {
      if (scheduleType === "onetime") {
        if (!oneTimeDate || !oneTimeTime) {
          setIsValid(false)
          setValidationError("Please select both date and time")
          setNextExecutions([])
          return
        }

        const targetDate = new Date(oneTimeDate)
        const [hour, minute] = oneTimeTime.split(":").map(Number)
        targetDate.setHours(hour, minute, 0, 0)

        // Validate that the target date is in the future
        if (targetDate <= new Date()) {
          setIsValid(false)
          setValidationError("Selected date and time must be in the future")
          setNextExecutions([])
          return
        }

        setIsValid(true)
        setValidationError("")
        setNextExecutions([targetDate.toString()])
        return
      }

      const interval = parser.parseExpression(expression)
      setIsValid(true)
      setValidationError("")

      console.log("[v0] Cron expression:", expression)
      const executions: string[] = []

      if (scheduleType === "recurring" && selectedDaysOfMonth.length > 0 && selectedDaysOfWeek.length > 0) {
        const targetDaysOfMonth = selectedDaysOfMonth.map((d) => Number.parseInt(d))
        const targetDaysOfWeek = selectedDaysOfWeek.map((d) => Number.parseInt(d))
        const targetMonths =
          selectedMonths.length > 0
            ? selectedMonths.map((m) => Number.parseInt(m))
            : Array.from({ length: 12 }, (_, i) => i + 1)
        const targetHours = selectedHours.length > 0 ? selectedHours.map((h) => Number.parseInt(h)) : [0]
        const targetMinutes = selectedMinutes.length > 0 ? selectedMinutes.map((m) => Number.parseInt(m)) : [0]

        const currentDate = new Date()
        let foundExecutions = 0

        while (foundExecutions < 5 && currentDate.getFullYear() < new Date().getFullYear() + 50) {
          const year = currentDate.getFullYear()

          for (const month of targetMonths) {
            for (const dayOfMonth of targetDaysOfMonth) {
              const testDate = new Date(year, month - 1, dayOfMonth)

              if (
                testDate.getMonth() === month - 1 &&
                testDate.getDate() === dayOfMonth &&
                targetDaysOfWeek.includes(testDate.getDay())
              ) {
                for (const hour of targetHours) {
                  for (const minute of targetMinutes) {
                    const executionDate = new Date(year, month - 1, dayOfMonth, hour, minute)

                    if (executionDate > new Date()) {
                      executions.push(executionDate.toString())
                      console.log("[v0] Next execution:", executionDate.toString())
                      foundExecutions++

                      if (foundExecutions >= 5) break
                    }
                  }
                  if (foundExecutions >= 5) break
                }
              }
              if (foundExecutions >= 5) break
            }
            if (foundExecutions >= 5) break
          }

          currentDate.setFullYear(currentDate.getFullYear() + 1)
        }
      } else {
        for (let i = 0; i < 5; i++) {
          const nextDate = interval.next().toString()
          console.log("[v0] Next execution:", nextDate)
          executions.push(nextDate)
        }
      }

      setNextExecutions(executions)
    } catch (error) {
      setIsValid(false)
      setValidationError(error instanceof Error ? error.message : "Invalid cron expression")
      setNextExecutions([])
    }
  }

  const formatExecutionTime = (dateString: string) => {
    const date = new Date(dateString)

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
    const day = date.getDate()
    const month = date.toLocaleDateString("en-US", { month: "long" })
    const year = date.getFullYear()

    let hour = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, "0")
    const ampm = hour >= 12 ? "PM" : "AM"

    if (hour === 0) {
      hour = 12
    } else if (hour > 12) {
      hour = hour - 12
    }

    return `${weekday}, ${day} ${month} ${year} at ${hour}:${minute} ${ampm} - ${timezone}`
  }

  const handleFieldChange = (field: keyof CronFields, value: string) => {
    setCronFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelect = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression)
    toast({
      title: "Copied!",
      description: "Cron expression copied to clipboard",
    })
  }

  const resetFields = () => {
    setCronFields({
      minute: "*",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    })
    setSelectedHours([])
    setSelectedMinutes([])
    setSelectedDaysOfMonth([])
    setSelectedMonths([])
    setSelectedDaysOfWeek([])
  }

  const handleScheduleExpiresToggle = (checked: boolean) => {
    setScheduleExpiresEnabled(checked)

    if (checked) {
      const now = new Date()
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]

      setScheduleExpires({
        day: now.getDate().toString(),
        month: monthNames[now.getMonth()],
        year: now.getFullYear().toString(),
        hour: now.getHours().toString(),
        minute: now.getMinutes().toString(),
      })
    }
  }

  const formatExpiryDate = () => {
    if (!scheduleExpiresEnabled) return null

    const day = Number.parseInt(scheduleExpires.day)
    const month = scheduleExpires.month
    const year = scheduleExpires.year
    let hour = Number.parseInt(scheduleExpires.hour)
    const minute = scheduleExpires.minute.padStart(2, "0")
    const ampm = hour >= 12 ? "pm" : "am"

    if (hour === 0) {
      hour = 12
    } else if (hour > 12) {
      hour = hour - 12
    }

    return `${day} ${month} ${year} at ${hour}:${minute} ${ampm}`
  }

  const generateSimpleCron = () => {
    const [hour, minute] = simpleTime.split(":").map(Number)

    switch (simpleInterval) {
      case "daily":
        return `${minute} ${hour} * * *`
      case "weekly":
        return `${minute} ${hour} * * ${simpleDayOfWeek.join(",")}`
      case "monthly":
        return `${minute} ${hour} ${simpleDayOfMonth} * *`
      case "yearly":
        return `${minute} ${hour} ${simpleYearDay} ${simpleMonth} *`
      default:
        return `${minute} ${hour} * * *`
    }
  }

  const generateOneTimeCron = () => {
    if (!oneTimeDate || !oneTimeTime) {
      return "0 0 1 1 *" // Default fallback
    }

    const [hour, minute] = oneTimeTime.split(":").map(Number)
    const date = new Date(oneTimeDate)

    // Validate the date
    if (isNaN(date.getTime())) {
      return "0 0 1 1 *" // Default fallback for invalid date
    }

    const day = date.getDate()
    const month = date.getMonth() + 1 // getMonth() returns 0-11, cron expects 1-12

    // Return cron expression: minute hour day month dayOfWeek
    // Note: Standard cron doesn't support year, so we'll handle year validation in the validation function
    return `${minute} ${hour} ${day} ${month} *`
  }

  const getSimpleDescription = () => {
    const [hour, minute] = simpleTime.split(":").map(Number)
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    // eslint-disable-next-line no-case-declarations
    switch (simpleInterval) {
      case "daily":
        return `Job will repeat every day at ${timeStr}`
      case "weekly": {
        const dayNames = simpleDayOfWeek.map((day) => DAYS_OF_WEEK.find((d) => d.value === day)?.label).join(", ")
        return `Job will repeat every week on ${dayNames} at ${timeStr}`
      }
      case "monthly":
        return `Job will repeat every month on the ${simpleDayOfMonth}${getOrdinalSuffix(Number.parseInt(simpleDayOfMonth))} at ${timeStr}`
      case "yearly": {
        const monthName = MONTHS.find((m) => m.value === simpleMonth)?.label
        return `Job will repeat every year on ${monthName} ${simpleYearDay}${getOrdinalSuffix(Number.parseInt(simpleYearDay))} at ${timeStr}`
      }
      default:
        return `Job will repeat every day at ${timeStr}`
    }
  }

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return "st"
    if (j === 2 && k !== 12) return "nd"
    if (j === 3 && k !== 13) return "rd"
    return "th"
  }

  const handleSimpleMultiSelect = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {/* Schedule Type selection at the top */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Type</h2>
          <RadioGroup value={scheduleType} onValueChange={(value: "onetime" | "recurring") => setScheduleType(value)}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="onetime" id="onetime" />
              <Calendar className="h-4 w-4 text-gray-600" />
              <Label htmlFor="onetime" className="text-base font-medium cursor-pointer">
                One-time execution
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="recurring" id="recurring" />
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <Label htmlFor="recurring" className="text-base font-medium cursor-pointer">
                Recurring schedule
              </Label>
            </div>
          </RadioGroup>
        </div>

        {scheduleType === "onetime" && (
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">One-time Execution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium text-gray-900">Date</Label>
                <div className="mt-2 relative">
                  <input
                    type="date"
                    value={oneTimeDate}
                    onChange={(e) => setOneTimeDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900">Time</Label>
                <div className="mt-2 relative">
                  <input
                    type="time"
                    value={oneTimeTime}
                    onChange={(e) => setOneTimeTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="--:-- --"
                  />
                </div>
              </div>
            </div>

            {oneTimeDate && oneTimeTime && (
              <div className="space-y-3 mt-6 pt-4 border-t">
                <h4 className="text-base font-medium text-gray-900">Next executions:</h4>
                {isValid && nextExecutions.length > 0 ? (
                  <>
                    <div className="text-xs text-gray-700">{formatExecutionTime(nextExecutions[0])}</div>
                    <div className="text-xs text-gray-500">expires after 1 Execution</div>
                  </>
                ) : (
                  <div className="text-sm text-red-500">{validationError || "Invalid date/time selection"}</div>
                )}
              </div>
            )}
          </div>
        )}

        {scheduleType === "recurring" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Recurring Schedule</h1>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Cron expression</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                  <code className="flex-1 font-mono text-sm break-all">{cronExpression}</code>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    disabled={!isValid}
                    className="h-8 w-8 p-0 bg-transparent flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-600">Next executions</h3>
                <div className="space-y-2">
                  {isValid && nextExecutions.length > 0 ? (
                    nextExecutions.map((execution, index) => (
                      <div key={index} className="text-sm text-gray-700 break-words">
                        {formatExecutionTime(execution)}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      {!isValid ? "Invalid cron expression" : "No executions scheduled"}
                    </div>
                  )}

                  {scheduleExpiresEnabled && formatExpiryDate() && (
                    <div className="text-sm text-gray-500 mt-3 pt-2 border-t break-words">
                      expires on {formatExpiryDate()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("simple")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "simple" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "advanced" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Advanced
              </button>
            </div>

            {activeTab === "simple" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-gray-900">Repeat Interval</Label>
                  <Select value={simpleInterval} onValueChange={setSimpleInterval}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900">Time</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="time"
                      value={simpleTime}
                      onChange={(e) => setSimpleTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {simpleInterval === "weekly" && (
                  <div>
                    <Label className="text-base font-medium text-gray-900">Day of Week</Label>
                    <Select
                      value={simpleDayOfWeek.length === 1 ? simpleDayOfWeek[0] : ""}
                      onValueChange={(value) => handleSimpleMultiSelect(value, simpleDayOfWeek, setSimpleDayOfWeek)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue
                          placeholder={
                            simpleDayOfWeek.length === 0
                              ? "Select days"
                              : simpleDayOfWeek.length === 1
                                ? DAYS_OF_WEEK.find((d) => d.value === simpleDayOfWeek[0])?.label
                                : `${simpleDayOfWeek.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={simpleDayOfWeek.includes(day.value)}
                                onCheckedChange={() =>
                                  handleSimpleMultiSelect(day.value, simpleDayOfWeek, setSimpleDayOfWeek)
                                }
                              />
                              {day.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {simpleInterval === "monthly" && (
                  <div>
                    <Label className="text-base font-medium text-gray-900">Day of Month</Label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={simpleDayOfMonth}
                      onChange={(e) => setSimpleDayOfMonth(e.target.value)}
                      className="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>
                )}

                {simpleInterval === "yearly" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium text-gray-900">Month</Label>
                      <Select value={simpleMonth} onValueChange={setSimpleMonth}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-base font-medium text-gray-900">Day</Label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={simpleYearDay}
                        onChange={(e) => setSimpleYearDay(e.target.value)}
                        className="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-4">
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> */}
                <div className="flex flex-col gap-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Hours</Label>
                    <Select
                      value=""
                      onValueChange={(value) => handleMultiSelect(value, selectedHours, setSelectedHours)}
                    >
                      <SelectTrigger
                        multiSelect={true}
                        selectedValues={selectedHours}
                        onMultiSelectChange={setSelectedHours}
                      >
                        <SelectValue
                          placeholder={
                            selectedHours.length === 0
                              ? "Select hours"
                              : selectedHours.length === 1
                                ? selectedHours[0]
                                : `${selectedHours.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedHours.includes(i.toString())}
                                onCheckedChange={() => handleMultiSelect(i.toString(), selectedHours, setSelectedHours)}
                              />
                              {i}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Minutes</Label>
                    <Select
                      value=""
                      onValueChange={(value) => handleMultiSelect(value, selectedMinutes, setSelectedMinutes)}
                    >
                      <SelectTrigger
                        multiSelect={true}
                        selectedValues={selectedMinutes}
                        onMultiSelectChange={setSelectedMinutes}
                      >
                        <SelectValue
                          placeholder={
                            selectedMinutes.length === 0
                              ? "Select minutes"
                              : selectedMinutes.length === 1
                                ? selectedMinutes[0]
                                : `${selectedMinutes.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedMinutes.includes(i.toString())}
                                onCheckedChange={() =>
                                  handleMultiSelect(i.toString(), selectedMinutes, setSelectedMinutes)
                                }
                              />
                              {i}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Days of month</Label>
                    <Select
                      value=""
                      onValueChange={(value) => handleMultiSelect(value, selectedDaysOfMonth, setSelectedDaysOfMonth)}
                    >
                      <SelectTrigger
                        multiSelect={true}
                        selectedValues={selectedDaysOfMonth}
                        onMultiSelectChange={setSelectedDaysOfMonth}
                      >
                        <SelectValue
                          placeholder={
                            selectedDaysOfMonth.length === 0
                              ? "Select days"
                              : selectedDaysOfMonth.length === 1
                                ? selectedDaysOfMonth[0]
                                : `${selectedDaysOfMonth.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedDaysOfMonth.includes((i + 1).toString())}
                                onCheckedChange={() =>
                                  handleMultiSelect((i + 1).toString(), selectedDaysOfMonth, setSelectedDaysOfMonth)
                                }
                              />
                              {i + 1}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Days of week</Label>
                    <Select
                      value=""
                      onValueChange={(value) => handleMultiSelect(value, selectedDaysOfWeek, setSelectedDaysOfWeek)}
                    >
                      <SelectTrigger
                        multiSelect={true}
                        selectedValues={selectedDaysOfWeek}
                        onMultiSelectChange={setSelectedDaysOfWeek}
                      >
                        <SelectValue
                          placeholder={
                            selectedDaysOfWeek.length === 0
                              ? "Select days"
                              : selectedDaysOfWeek.length === 1
                                ? DAYS_OF_WEEK.find((d) => d.value === selectedDaysOfWeek[0])?.label
                                : `${selectedDaysOfWeek.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedDaysOfWeek.includes(day.value)}
                                onCheckedChange={() =>
                                  handleMultiSelect(day.value, selectedDaysOfWeek, setSelectedDaysOfWeek)
                                }
                              />
                              {day.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Months</Label>
                    <Select
                      value=""
                      onValueChange={(value) => handleMultiSelect(value, selectedMonths, setSelectedMonths)}
                    >
                      <SelectTrigger
                        multiSelect={true}
                        selectedValues={selectedMonths}
                        onMultiSelectChange={setSelectedMonths}
                      >
                        <SelectValue
                          placeholder={
                            selectedMonths.length === 0
                              ? "Select months"
                              : selectedMonths.length === 1
                                ? MONTHS.find((m) => m.value === selectedMonths[0])?.label
                                : `${selectedMonths.length} selected`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedMonths.includes(month.value)}
                                onCheckedChange={() =>
                                  handleMultiSelect(month.value, selectedMonths, setSelectedMonths)
                                }
                              />
                              {month.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {scheduleType === "recurring" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 my-5">
            <Checkbox
              id="schedule-expires"
              checked={scheduleExpiresEnabled}
              onCheckedChange={handleScheduleExpiresToggle}
              className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <Label htmlFor="schedule-expires" className="font-medium cursor-pointer">
              Schedule expires
            </Label>
          </div>

          {scheduleExpiresEnabled && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span>on</span>
              <Select
                value={scheduleExpires.day}
                onValueChange={(value) => setScheduleExpires((prev) => ({ ...prev, day: value }))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={scheduleExpires.month}
                onValueChange={(value) => setScheduleExpires((prev) => ({ ...prev, month: value }))}
              >
                <SelectTrigger className="w-24 sm:w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.label}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={scheduleExpires.year}
                onValueChange={(value) => setScheduleExpires((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                      {2024 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>at</span>
              <Select
                value={scheduleExpires.hour}
                onValueChange={(value) => setScheduleExpires((prev) => ({ ...prev, hour: value }))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select
                value={scheduleExpires.minute}
                onValueChange={(value) => setScheduleExpires((prev) => ({ ...prev, minute: value }))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


