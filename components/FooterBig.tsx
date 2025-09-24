/** @format */
"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logoDark from "@/app/logo-2-dark.png";
// import AnimatedLogo from './AnimatedLogo';
// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.mailgun.supportEmail, the link won't be displayed.

const FooterBig = () => {
  // Always use dark logo since we're forcing dark theme
  const getLogo = () => {
    return logoDark;
  };
  return (
    <footer className="w-full mx-auto">
      <div className="max-w-6xl mx-auto px-8 md:py-24 py-16">
        <div className="flex justify-between lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col md:gap-40 gap-10">
          <div className="w-72 flex-shrink-0 mx-0  text-left">
            <Link
              href={"/"}
              className={`flex items-center justify-start gap-2 text-[hsl(var(--text-primary))] transition-colors duration-200`}
            >
              <Image
                className="opacity-80"
                src={getLogo()}
                alt={config.appName}
                width={70}
                height={70}
              />
            </Link>

            <p className="mt-3 ml-2 text-xs text-[hsl(var(--text-secondary))] transition-colors duration-200">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
          <div className="flex md:flex-row flex-col justify-end md:gap-10">
            <div className="px-4 text-left w-full">
              <div className="footer-title font-semibold text-[hsl(var(--text-primary))] tracking-widest text-sm mb-3 transition-colors duration-200">
                LINKS
              </div>

              <div className="flex flex-col justify-center gap-2 mb-10 text-sm">
                <Link
                  href="/product"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Product
                </Link>
                <Link
                  href="/resources"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Resources
                </Link>
                <Link
                  href="/pricing"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Prices
                </Link>
                <Link
                  href="/faq"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  FAQ
                </Link>
              </div>
            </div>

            <div className="px-4 text-left w-full">
              <div className="footer-title font-semibold text-[hsl(var(--text-primary))] tracking-widest text-sm mb-3 transition-colors duration-200">
                LEGAL
              </div>

              <div className="flex flex-col justify-center gap-2 mb-10 text-sm">
                <Link
                  href="/tc"
                  className="link link-hover whitespace-nowrap text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Terms of services
                </Link>
                <Link
                  href="/privacy"
                  className="link link-hover whitespace-nowrap text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/contact"
                  className="link link-hover whitespace-nowrap text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  Contact
                </Link>
                <Link
                  href="/about"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  About
                </Link>
              </div>
            </div>

            {/* <div className="px-4 text-left w-full">
              <div className="footer-title font-semibold text-[hsl(var(--text-primary))] tracking-widest text-sm mb-3 transition-colors duration-200">
                SOCIAL
              </div>

              <div className="flex flex-col justify-center gap-2 mb-10 text-sm">
                <Link
                  href="https://www.linkedin.com/in/sagarjaid/"
                  className="link link-hover text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-200"
                >
                  LinkedIn
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBig;
