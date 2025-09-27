import { Suspense } from "react";
import Header from "@/components/Header";
// import ButtonSubmitYT from '@/components/ButtonSubmitYT';
// import ChannelList from '@/components/ChannelList';
// import Navbar from '@/components/Navbar';
// import VisaInterviewThree from '@/components/core/visaInterviewThree';
// import VisaInterviewF from '@/components/core/visaInterviewF';

// import VisaInterviewTwo from '@/components/core/visaInterviewTwo';
// import VisaInterview from '@/components/core/visaInterview';
// import Pricing from '@/components/Pricing';
// import RightSidebar from '@/components/molecules/RightSidebar';
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

import PricingNew from "@/components/PricingNew";
import CTA from "@/components/CTA";
import { getSEOTags } from "@/lib/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Pricing | ${config.appName}`,
  description:
    "Choose the perfect plan for your AI-powered goal reminders. Compare features, pricing, and find the best option for your productivity needs.",
  canonicalUrlRelative: "/dash/pricing",
  openGraph: {
    title: `Pricing | ${config.appName}`,
    description: "Choose the perfect plan for your AI-powered goal reminders.",
  },
});

export default function Pricing() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header user={null} router={null} />
      </Suspense>
      <main className="flex flex-col items-center pt-6 px-6 pb-24 w-full">
        <div className="w-full max-w-2xl md:max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl  font-extrabold">Pricing</h1>
            <span className="lg:block hidden">
              <ThemeToggle />
            </span>
          </div>
          <PricingNew />
          <CTA />
        </div>
      </main>
    </>
  );
}
