import { Suspense } from 'react';
import Header from '@/components/Header';
// import ButtonSubmitYT from '@/components/ButtonSubmitYT';
// import ChannelList from '@/components/ChannelList';

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


import UserInfo from '@/components/User';
import { getSEOTags } from "@/lib/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Account | ${config.appName}`,
  description: 'Manage your NeverMissAI account settings, subscription, and preferences. Update your profile and control your AI-powered goal reminders.',
  canonicalUrlRelative: '/dash/account',
  openGraph: {
    title: `Account | ${config.appName}`,
    description: 'Manage your NeverMissAI account settings and preferences.',
    type: 'website',
  },
});

export default function Dashboard() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header user={null} router={null} />
      </Suspense>

<main className="flex flex-col items-center pt-6 px-6 pb-24 w-full w-full">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl  font-extrabold">Account</h1>
          <span className="lg:block hidden">
            <ThemeToggle />
          </span>
        </div>

        <p className="mb-6 md:mb-8 text-gray-700 text-xs md:text-base">
        Manage your account, change Plan, and more
        </p>
        <UserInfo />
      </div>
    </main>
    </>
  );
}
