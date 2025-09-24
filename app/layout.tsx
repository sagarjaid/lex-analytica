/** @format */

import { ReactNode } from "react";
import { Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import { Viewport } from "next";
import { getSEOTags } from "@/lib/seo";
import ClientLayout from "@/components/LayoutClient";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import config from "@/config";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Script from "next/script";

const font = Bricolage_Grotesque({ subsets: ["latin"] });
const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-serif",
});

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags({
  title: "Lex Analytica - The Gold Standard for Paralegal Research",
  description:
    "The Gold Standard for Paralegal Research. Access precedent cases and analysis in one place, cutting research time while significantly boosting productivity for legal professionals.",
  keywords: [
    "paralegal research",
    "legal research",
    "precedent cases",
    "case analysis",
    "legal database",
    "paralegal tools",
    "legal productivity",
    "case law research",
    "legal technology",
    "law firm software",
  ],
  canonicalUrlRelative: "/",
  extraTags: {
    "google-site-verification": "bpVto528QOEsbHsk4o2dP8yL3DMcQb6kFWjoQUgSoq0",
    "google-adsense-account": "ca-pub-8500986101092156",
    robots: "index, follow",
    "theme-color": "#3B82F6",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Lex Analytica",
    "application-name": "Lex Analytica",
    "msapplication-TileColor": "#3B82F6",
    "msapplication-config": "/browserconfig.xml",
    "format-detection": "telephone=no",
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${font.className} ${serifFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8500986101092156"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
          forcedTheme="light"
        >
          <GoogleAnalytics />
          {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
