/** @format */

import { ReactNode } from 'react';
import { getSEOTags } from '@/lib/seo';
import config from '@/config';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = getSEOTags({
  title: `Sign In | ${config.appName}`,
  description:
    'Sign in to your nevermissai account to access high-paying nevermissai jobs and opportunities across India.',
  canonicalUrlRelative: '/login',
  keywords: ['sign in', 'login', 'nevermissai jobs', 'account access'],
});

export default async function SignInLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(config.auth.callbackUrl);
  }

  return children;
}
