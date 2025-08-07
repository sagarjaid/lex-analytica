/** @format */

import { getSEOTags } from "@/lib/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Login | ${config.appName}`,
  description: 'Sign in to your NeverMissAI account to manage your life goals and receive AI-powered phone call reminders.',
  canonicalUrlRelative: '/login',
  openGraph: {
    title: `Login | ${config.appName}`,
    description: 'Sign in to your NeverMissAI account to manage your life goals and receive AI-powered phone call reminders.',
    type: 'website',
  },
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
