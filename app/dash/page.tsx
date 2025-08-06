import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  Tags,
  User,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <main className="flex flex-col items-center pt-6 px-6 pb-24 w-full">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl  font-extrabold">Dashboard</h1>
          <span className="lg:block hidden">
            <ThemeToggle />
          </span>
        </div>

        <p className="mb-6 md:mb-8 text-gray-700 text-xs md:text-base">
          Take the first step toward your dream today!
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Add New Goal Card */}
          <Link
            href="/dash/add"
            className="flex-1 border border-gray-200 rounded-xl shadow p-4 flex flex-col items-start gap-2 md:gap-3 hover:shadow-lg transition"
          >
            <div className="bg-gray-100 rounded-full  ">
              <Plus className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-md  font-bold">Add New Goal</h2>
            <p className="text-gray-600 text-xs md:text-xs">
              Create a Goal, AI will call on your mobile number to remind your
              goal
            </p>
          </Link>
          {/* Active Goals Card */}
          <Link
            href="/dash/goals"
            className="flex-1 border border-gray-200 rounded-xl shadow p-4 pb-8 flex flex-col items-start gap-2 md:gap-3 hover:shadow-lg transition"
          >
            <div className="bg-gray-100 rounded-full ">
              <RefreshCw className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-md  font-bold">Active Goals</h2>
            <p className="text-gray-600 text-xs md:text-xs">
              Instantly Access your active goals, view, delete, edit, pause them
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
