import { getSEOTags } from "@/lib/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Add Goal | ${config.appName}`,
  description: 'Create a new life goal with AI-powered phone call reminders. Set up personalized schedules, AI personas, and never miss your important milestones.',
  canonicalUrlRelative: '/dash/add',
  openGraph: {
    title: `Add Goal | ${config.appName}`,
    description: 'Create a new life goal with AI-powered phone call reminders.',
    type: 'website',
  },
});

export default function AddGoalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
