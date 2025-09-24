"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/logo.png";
import logoDark from "@/app/logo-dark.png";
import config from "@/config";
import { MenuIcon } from "lucide-react";

// A header with a logo on the left, and a CTA on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Always use dark logo since we're forcing dark theme
  const getLogo = () => {
    return logoDark;
  };

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--header-bg))] border-[hsl(var(--header-border))] transition-colors duration-200">
      <nav
        className="flex items-center max-w-6xl justify-between py-2.5 px-4 mx-auto"
        aria-label="Global"
      >
        {/* Your logo/name on large screens */}
        <Link
          href={"/"}
          className={`flex items-center gap-2 text-[hsl(var(--text-primary))] transition-colors duration-200`}
        >
          <Image src={getLogo()} alt={config.appName} width={160} height={80} />
        </Link>

        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon className="w-7 h-7" strokeWidth={1.5} />
          </button>
        </div>

        {/* Right side elements on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:items-center gap-3">
          {/* Navigation Links */}
          <div className="flex items-center gap-6 mr-4">
            <Link
              href="/"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/product"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              Product
            </Link>
            <Link
              href="/resources"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              Resources
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
            >
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 bg-[hsl(var(--header-bg))] w-full px-4 py-2.5 overflow-y-auto border-l border-[hsl(var(--header-border))] transform origin-right transition ease-in-out duration-300`}
        >
          {/* Your logo/name on small screens */}
          <div className="flex items-center justify-between">
            <Link
              href={"/"}
              className={`flex items-center gap-2 text-[hsl(var(--text-primary))] transition-colors duration-200`}
            >
              <Image
                src={getLogo()}
                alt={config.appName}
                width={160}
                height={80}
              />
            </Link>

            <button
              type="button"
              className="-m-2.5 p-2.5 text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors duration-200"
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
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="mt-2">
            <div className="flex flex-col gap-y-3 items-start">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col w-full gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/product"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Product
                </Link>
                <Link
                  href="/resources"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/faq"
                  className="px-4 py-2 text-sm font-semibold text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
