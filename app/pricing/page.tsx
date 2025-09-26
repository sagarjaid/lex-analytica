import { Suspense } from 'react';
import HeaderHome from '@/components/HeaderHome';
import PricingNew from '@/components/PricingNew';
import CTA from '@/components/CTA';
import FooterBig from '@/components/FooterBig';
import { getSEOTags } from "@/lib/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Pricing | ${config.appName}`,
  description: 'Choose the perfect plan for your legal AI needs. Compare features, pricing, and find the best option for your practice.',
  canonicalUrlRelative: '/pricing',
  openGraph: {
    title: `Pricing | ${config.appName}`,
    description: 'Choose the perfect plan for your legal AI needs.',
    type: 'website',
  },
});

export default function Pricing() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderHome />
      </Suspense>
      <main className="min-h-screen bg-white">
        <PricingNew />
        <CTA />
      </main>
      <FooterBig />
    </>
  );
}
