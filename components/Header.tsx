/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
// import { AssetSearch } from './asset-search';
import Logo from "./Logo";
// import ButtonLogin from './ButtonLogin';
import {
  LayoutDashboard,
  Target,
  Tags,
  User as UserIcon,
  LogOut,
  LogIn,
  Sparkle,
  AlignCenter,
  AlignJustify,
} from "lucide-react";

const Header = ({
  handleSignOut,
  user,
  router,
}: {
  handleSignOut?: () => void;
  user: any;
  router: any;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  // Focus search input when search popup opens
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    // Force the search popup to open by triggering a click on the input
    if (searchRef.current) {
      searchRef.current.click();
    }
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  // Hide header on lg+ screens when on /dash or any subroute
  const isDashRoute = pathname.startsWith("/dash");

  // Use Tailwind's hidden class for lg+ if on dash route
  return (
    <header
      className={`w-full z-40 bg-white border-b border-gray-200 shadow-sm ${isDashRoute ? "lg:hidden" : ""}`}
    >
      <nav
        className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-4"
        aria-label="Global"
      >
        <Link
          href={isDashRoute ? "/dash" : "/"}
          className={`flex items-center gap-2 px-1.5 py-2 rounded-lg  text-gray-900 ${
            isDashRoute ? "lg:hidden hover:bg-gray-100" : ""
          }`}
        >
          <Sparkle
            strokeWidth={1}
            color="Green"
            fill="Green"
            className={isDashRoute ? "w-6  h-6" : "w-8 h-8"}
          />{" "}
          <span
            className={
              isDashRoute ? "font-semibold text-base" : "font-bold text-xl"
            }
          >
            Lex Analytica
          </span>
        </Link>

        {/* Desktop Nav */}

        <div
          className={`${
            isDashRoute ? "hidden" : ""
          } items-center lg:flex lg:flex-1 lg:justify-end lg:gap-x-4`}
        >
          <div
            className={`${
              isDashRoute ? "hidden" : ""
            } flex gap-x-2 md:gap-x-4 items-center`}
          >
            {/* <Link
              href='#pricing'
              className='text-sm hidden md:block font-semibold leading-6 text-foreground hover:text-muted-foreground transition-colors'>
              Pricing
            </Link> */}
            <Link
              href="/login"
              className="text-sm border border-gray-400 text-black px-4 py-1.5 rounded-lg font-semibold leading-6 text-foreground hover:text-muted-foreground transition-colors"
            >
              Login
            </Link>
            {/* <Button
            variant='ghost'
            size='icon'
            className='border'
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }>
            <span className='sr-only'>Toggle theme</span>
            {resolvedTheme === 'dark' ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                className='w-5 h-5'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
                />
              </svg>
            )}
          </Button> */}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className={`${isDashRoute ? "flex lg:hidden" : "hidden"} `}>
          <AlignJustify
            className="w-6 h-6 cursor-pointer"
            strokeWidth={1.5}
            onClick={() => setIsOpen(true)}
          />
          <span className="sr-only">Open main menu</span>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white border-l border-gray-200 p-4 sm:max-w-sm sm:ring-1 sm:ring-gray-200">
          <div className="flex items-center justify-between">
            {/* <Logo priority={true} /> */}

            <Link
              href="/dash"
              className="flex items-center gap-2 px-1.5 rounded-lg hover:bg-gray-100 text-gray-900 lg:hidden"
            >
              <Sparkle
                strokeWidth={1}
                color="Green"
                fill="Green"
                className="w-6 h-6"
              />{" "}
              <span className="font-semibold text-base">Lex Analytica</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="border"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                <span className="sr-only">Toggle theme</span>
                {resolvedTheme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile links */}
          <div className="mt-8 flex flex-col gap-y-4 lg:hidden">
            <Link
              href="/dash"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-900 font-semibold text-sm"
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link
              href="/dash/goals"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
            >
              <Target className="w-5 h-5" /> Goals
            </Link>
            <Link
              href="/dash/pricing"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
            >
              <Tags className="w-5 h-5" /> Pricing
            </Link>
            <Link
              href="/dash/account"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
            >
              <UserIcon className="w-5 h-5" /> Account
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
