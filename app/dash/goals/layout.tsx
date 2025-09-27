import { getSEOTags } from "@/lib/seo";
import React from "react";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Goals | ${config.appName}`,
  description:
    "Manage your life goals, tasks, and habits. View, edit, pause, and track your AI-powered phone call reminders.",
  canonicalUrlRelative: "/dash/goals",
  openGraph: {
    title: `Goals | ${config.appName}`,
    description:
      "Manage your life goals, tasks, and habits with AI-powered reminders.",
  },
});

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
