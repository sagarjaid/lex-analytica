"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"

interface GymReminderProps {
  className?: string
  onPhoneSubmit?: (phoneNumber: string) => void
}

export default function GymReminderComponent({ className = "", onPhoneSubmit }: GymReminderProps) {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onPhoneSubmit && phoneNumber.trim()) {
      onPhoneSubmit(phoneNumber)
    }
  }

  // Profile images data - using placeholder images that match the design
  const profileImages = [
    "/placeholder.svg?height=48&width=48",
    "/placeholder.svg?height=48&width=48",
    "/placeholder.svg?height=48&width=48",
    "/placeholder.svg?height=48&width=48",
    "/placeholder.svg?height=48&width=48",
    "/placeholder.svg?height=48&width=48",
  ]

  return (
    <div className={`w-full max-w-sm mx-auto bg-white ${className}`}>
      {/* Phone Frame Container */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Phone Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

          {/* Screen Content */}
          <div className="pt-12 pb-16 px-8 min-h-[640px] flex flex-col items-center justify-center space-y-8">
            {/* Logo/Icon */}
            <div className="flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-black" strokeWidth={2.5} />
            </div>

            {/* Heading */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-black leading-tight">Try Gym Reminder</h1>
              <h2 className="text-2xl font-bold text-black leading-tight">AI for FREE!</h2>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-2xl p-4 space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Phone Input */}
                  <Input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-12 px-4 bg-white border-0 rounded-xl text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-0 text-center"
                  />

                  {/* Call Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
                  >
                    Call Me Now
                  </Button>
                </form>
              </div>
            </div>

            {/* Profile Images */}
            <div className="flex items-center justify-center space-x-1">
              {profileImages.map((src, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm"
                  style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`User ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Stats Text */}
            <p className="text-gray-600 text-sm font-medium">289+ goals reminded yesterday</p>

            
          </div>
        </div>
      </div>
    </div>
  )
}
