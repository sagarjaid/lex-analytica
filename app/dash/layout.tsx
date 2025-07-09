/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  Tags,
  User,
  Plus,
  LogOut,
  LogIn,
  RefreshCw,
  Check,
  CheckCheck,
  Flame,
  History,
  LoaderPinwheel,
  Pyramid,
  Repeat,
  Repeat2,
  RotateCcw,
  RotateCcwSquare,
  Shell,
  Sparkle,
  SquareAsterisk,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { useTheme } from "next-themes";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { href: "/dash/goals", label: "Goals" },
    { href: "/dash/add", label: "Add Goal" },
  ];

  const isActive = (href: string) => {
    if (href === "/dash") {
      return pathname === "/dash";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto bg-background">
      <Header handleSignOut={handleSignOut} user={user} router={router} />

      <div className="flex flex-col md:flex-row mt-2 min-h-screen">
        {/* Sidebar */}
        <aside className="w-48 hidden sticky left-0 top-0  md:w-56 flex-shrink-0 md:flex flex-col justify-between border-r h-auto md:h-[calc(100vh-20px)] p-4">
          <nav className="space-y-1 md:space-y-2">
            {/* <Link href="/dash" className="flex items-center gap-2 px-1.5 py-2 rounded-lg hover:bg-gray-200 text-gray-900">
              <Repeat2 strokeWidth={3.5} color='Green' className="w-6 h-6" /> <span className='font-semibold text-base'>NevermissAI</span>
            </Link> */}

            <Link
              href="/dash"
              className="hidden lg:flex  items-center gap-2 px-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-900"
            >
              <Sparkle
                strokeWidth={1}
                color="Green"
                fill="Green"
                className="w-6 h-6"
              />{" "}
              <span className="font-semibold text-base">NevermissAI</span>
            </Link>

            <Link
              href="/dash"
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-900 font-medium  text-sm",
                isActive("/dash") && "bg-gray-200 font-bold"
              )}
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" /> Dashboard
            </Link>
            <Link
              href="/dash/goals"
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700 text-sm",
                isActive("/dash/goals") && "bg-gray-200 font-bold"
              )}
            >
              <Target className="w-4 h-4 md:w-5 md:h-5" /> Goals
            </Link>
            <Link
              href="/dash/pricing"
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700 text-sm",
                isActive("/dash/pricing") && "bg-gray-200 font-bold"
              )}
            >
              <Tags className="w-4 h-4 md:w-5 md:h-5" /> Pricing
            </Link>
            <Link
              href="/dash/account"
              className={cn(
                "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700  text-sm",
                isActive("/dash/account") && "bg-gray-200 font-bold"
              )}
            >
              <User className="w-4 h-4 md:w-5 md:h-5" /> Account
            </Link>
            <div className="flex items-center cursor-pointer gap-4">
              {user ? (
                <div
                  onClick={handleSignOut}
                  className="flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-red-100 text-gray-700 w-full text-sm"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" /> Sign Out
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-700 w-full text-sm"
                >
                  <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                  Sign In
                </Link>
              )}
            </div>
       
          </nav>

          <div className="space-y-1 text-xs text-gray-500 mt-6 md:mt-0">
            <div className="font-bold tracking-widest mb-2">LEGAL</div>
            <Link href="/tos/page.tsx" className="block hover:underline">
              Terms of services
            </Link>
            <Link
              href="/privacy-policy/page.tsx"
              className="block hover:underline"
            >
              Privacy policy
            </Link>
            <Link href="/support" className="block hover:underline">
              Support
            </Link>
            <div className="mt-2">Build by Sagar Jaid</div>
          </div>
        </aside>

        {/* Main Content and Right Sidebar (stacked on mobile) */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row">
          {/* Main Content */}
          <main className="flex-1 min-w-0 flex flex-col items-start pb-24">
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 border-l hidden lg:block p-4 mt-4 md:mt-0">
            <div className=" rounded-xl border border-gray-200 shadow sticky top-4 p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-base md:text-md">
                  Active Plan
                </div>
                <button className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  Upgrade
                </button>
              </div>
              <div className="text-xs md:text-xs text-gray-700 mb-2">
                Free Plan
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Interview credits:
              </div>
              <div className="text-xs text-gray-700 flex flex-col gap-1">
                <div>Total : 0</div>
                <div>Used : 0</div>
                <div>Remaining : 0</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
