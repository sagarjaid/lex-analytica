import { Suspense } from "react";
import Header from "@/components/Header";
import FooterBig from "@/components/FooterBig";
import aboutHero from "@/app/about-hero.gif";
// import bg from "@/app/earth-3.gif";
import bg from "@/app/laywer.jpg";

import stats from "@/app/stats.png";
import ButtonLearnMore from "@/components/ButtonLearnMore";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import type { Metadata } from "next";
import HeaderHome from "@/components/HeaderHome";

// Enhanced SEO metadata for the about page
export const metadata: Metadata = getSEOTags({
  title:
    "About ZeroTheorem - PhD Team & Bitcoin Tail Risk Investment Philosophy",
  description:
    "Meet ZeroTheorem's team of PhD scientists specializing in Bitcoin tail risk warehousing. Learn about our mission to bridge market participants seeking downside protection with investors pursuing excess returns.",
  keywords: [
    "about zerotheorem",
    "PhD scientists",
    "bitcoin tail risk",
    "investment philosophy",
    "quantitative finance",
    "risk management",
    "PhD team",
    "blockchain expertise",
    "investment mission",
    "corporate services",
    "downside protection",
    "excess returns",
    "quantitative risk management",
    "extreme value theory",
    "actuarial science",
  ],
  canonicalUrlRelative: "/about",
  openGraph: {
    title:
      "About ZeroTheorem - PhD Team & Bitcoin Tail Risk Investment Philosophy",
    description:
      "Meet ZeroTheorem's team of PhD scientists specializing in Bitcoin tail risk warehousing and quantitative risk management strategies.",
    url: "https://zerotheorem.com/about",
  },
  extraTags: {
    "article:author": "ZeroTheorem Investment Team",
    "article:section": "About Us",
    "article:tag": [
      "About",
      "Team",
      "PhD Scientists",
      "Investment Philosophy",
      "Bitcoin",
    ],
  },
});

const About = () => {
  return (
    <>
      {renderSchemaTags("about")}
      {/* <HelloBar /> */}
      <Suspense>
        <HeaderHome />
      </Suspense>

      {/* <main className="m-auto h-screen flex flex-col bg-[url('/bg.gif')] bg-cover bg-center bg-no-repeat"> */}
      <main className="m-auto flex flex-col">
        <div className="flex justify-between md:flex-row flex-col-reverse max-w-6xl w-full overflow-hidden gap-4 m-auto items-center p-10 md:pt-16 md:pb-0">
          <div className="flex flex-col gap-4 md:max-w-lg w-full">
            <div className="md:text-3xl text-2xl font-extrabold">
              Our Mission
            </div>
            <div className="text-[22px] opacity-80">
              To bridge the gap between market participants seeking downside
              protection and investors pursuing excess returns
            </div>

            {/* <div className="text-xs mt-1.5 font-light text-gray-700">
              We invest early, before trends hit the mainstream
            </div> */}
            {/* <a
              href="/ai-tools"
              className="flex items-center gap-2 bg-black px-4 py-2 w-fit text-white mt-6"
            >
              <span className="text-sm font-semibold">Learn More</span>
              <svg
                className="w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </a> */}
          </div>

          <div className="flex flex-col items-center justify-center">
            <img
              src={bg.src}
              className="w-[380px] text-center h-full object-cover"
            />
          </div>
        </div>

        <div className="flex md:flex-row  flex-col justify-center max-w-6xl w-full overflow-hidden gap-8 m-auto items-center p-10">
          <div>
            <div className="text-2xl font-extrabold">Who are we?</div>
            <div className="text-base mt-2 text-justify opacity-80">
              We are a specialised private investment firm dedicated to
              warehousing Bitcoin tail risk. We are a team of PhDs in physics,
              engineering, and quantitative finance. As early Bitcoin adopters,
              We bring over a decade of experience in blockchain investing and
              entrepreneurial ventures — spanning mining, the development of
              blockchain-based financial products and marketplaces, and the
              management of investment funds.
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">What do we do?</div>
            <div className="text-base mt-2 text-justify opacity-80">
              By applying extreme value theory, actuarial science, and
              quantitative risk management, we engineer strategies on Bitcoin
              financial products that transform crash risk into structured
              outcomes. We draw on deep domain expertise and systematic trading
              to manage tail exposures with discipline and precision.
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 m-auto max-w-lg mt-20 mb-10">
          <div className="md:text-4xl text-3xl font-extrabold">
            Corporate Services
          </div>

          <div className="text-base text-center opacity-80">
            If you would like further information regarding corporate services
            please feel free to contact us directly.
          </div>

          <ButtonLearnMore href="/contact" text="Contact" className="mt-6" />
        </div>

        <FooterBig />
      </main>
    </>
  );
};

export default About;
