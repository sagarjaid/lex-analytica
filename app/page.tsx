import { Suspense } from "react";
import Header from "@/components/Header";
import FooterBig from "@/components/FooterBig";
import ButtonLearnMore from "@/components/ButtonLearnMore";
import pattern from "@/app/laywer.jpg";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import type { Metadata } from "next";
import HeaderHome from "@/components/HeaderHome";

// Enhanced SEO metadata for the home page
export const metadata: Metadata = getSEOTags({
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
    "legal research platform",
    "paralegal software",
    "case management",
    "legal analysis tools",
    "law research",
  ],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Lex Analytica - The Gold Standard for Paralegal Research",
    description:
      "The Gold Standard for Paralegal Research. Access precedent cases and analysis in one place, cutting research time while significantly boosting productivity.",
    url: "https://lexanalytica.com/",
  },
  extraTags: {
    "article:author": "Lex Analytica Team",
    "article:section": "Legal Technology",
    "article:tag": [
      "Paralegal Research",
      "Legal Technology",
      "Case Analysis",
      "Legal Productivity",
    ],
  },
});

const Home = () => {
  return (
    <>
      {renderSchemaTags("home")}
      {/* <HelloBar /> */}
      <Suspense>
        <HeaderHome />
      </Suspense>

      {/* <main className="m-auto h-screen flex flex-col bg-[url('/bg.gif')] bg-cover bg-center bg-no-repeat"> */}
      {/* <main className="m-auto flex flex-col bg-[url('/bg-grid.svg')] bg-cover bg-center bg-no-repeat"> */}
      <main className="m-auto flex flex-col">
        {/* <div className="flex flex-col items-center justify-center">
      <img src={aboutHero.src} className="w-1/2 text-center h-full object-cover" />
      </div> */}

        {/* <div className="flex flex-col items-center justify-center">
          <img
            src={bg.src}
            className="w-[300px] text-center h-full object-cover"
          />
        </div> */}

        <div className="flex md:flex-row flex-col-reverse max-w-6xl w-full overflow-hidden m-auto items-center justify-center px-8 py-10 md:py-24">
          <div className="flex flex-col md:gap-3 gap-2 w-full">
            <div className="text-lg font-abold ml-1 uppercase ">
              Lex Analytica
            </div>
            <div className="md:text-5xl font-serif text-4xl font-semibold">
              The Gold Standard for
            </div>
            <div className="md:text-5xl font-serif text-4xl font-semibold">
              Paralegal Research
            </div>

            <div className="text-base mt-1.5 font-light text-gray-400">
              With access to precedent cases and analysis in one place, Lex
              Analytica cuts research time while significantly boosting
              productivity!
            </div>
            <div className="flex flex-row gap-4 mt-6">
              <ButtonLearnMore
                href="/signin"
                text="Get Started"
                className="bg-black text-white hover:bg-gray-800"
              />
              <ButtonLearnMore
                href="/pricing"
                text="Explore Plans"
                className="bg-white text-black border border-black hover:bg-gray-50"
              />
            </div>
          </div>

          {/* <ParticleHead /> */}
          <img
            src={pattern.src}
            // className="w-[380px] text-center h-full object-cover"
            className="w-full  max-w-[480px]  text-center h-full object-cover"
          />
        </div>

        <FooterBig />
      </main>
    </>
  );
};

export default Home;
