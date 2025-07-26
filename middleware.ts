/** @format */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not logged in and the current path is not /login or /signin,
  // redirect the user to /login
  // if (
  //   !user &&
  //   !req.nextUrl.pathname.startsWith('/login') &&
  //   !req.nextUrl.pathname.startsWith('/signin')
  // ) {
  //   const redirectUrl = req.nextUrl.clone();
  //   redirectUrl.pathname = '/login';
  //   redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // If user is logged in and the current path is /login or /signin,
  // redirect the user to /dash/goals
  if (
    user &&
    (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signin')
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dash/goals';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (we'll handle auth in the API routes separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
