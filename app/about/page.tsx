import { Suspense } from "react";
import HeaderHome from "@/components/HeaderHome";
import FooterBig from "@/components/FooterBig";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import type { Metadata } from "next";

// Enhanced SEO metadata for the about page
export const metadata: Metadata = getSEOTags({
  title: "About Lex Analytica - The Gold Standard for Paralegal Research",
  description:
    "Learn about Lex Analytica's mission to revolutionize legal research with AI-powered tools. Meet our team and discover why we're the gold standard for paralegal research.",
  keywords: [
    "about lex analytica",
    "legal research team",
    "paralegal research mission",
    "legal technology company",
    "AI legal tools",
    "legal research innovation",
    "paralegal software",
    "legal tech leadership",
    "about us",
    "company mission",
    "legal research standards",
  ],
  canonicalUrlRelative: "/about",
  openGraph: {
    title: "About Lex Analytica - The Gold Standard for Paralegal Research",
    description:
      "Learn about Lex Analytica's mission to revolutionize legal research with AI-powered tools and our commitment to excellence.",
    url: "https://lexanalytica.com/about",
  },
  extraTags: {
    "article:author": "Lex Analytica Team",
    "article:section": "About Us",
    "article:tag": ["About", "Team", "Mission", "Legal Research", "AI Technology"],
  },
});

const About = () => {
  return (
    <>
      {renderSchemaTags("about")}
      <Suspense>
        <HeaderHome />
      </Suspense>

      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                About Lex Analytica
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The Gold Standard for Paralegal Research
              </p>
            </div>
          </div>
        </div>

        {/* 2x2 Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Who We Are */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-white border-b border-gray-300 p-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Who We Are
                </h2>
              </div>
              <div className="p-6 bg-gray-100 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 text-center leading-relaxed">
                  Lex Analytica is a pioneering legal technology company dedicated to transforming how legal professionals conduct research. We combine cutting-edge AI technology with deep legal expertise to provide the most accurate and efficient paralegal research tools available.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-white border-b border-gray-300 p-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Our Mission
                </h2>
              </div>
              <div className="p-6 bg-gray-100 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 text-center leading-relaxed">
                  To revolutionize legal research by providing AI-powered tools that deliver unprecedented accuracy, speed, and reliability. We're committed to empowering legal professionals with technology that enhances their capabilities and drives better outcomes for their clients.
                </p>
              </div>
            </div>

            {/* Leadership */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-white border-b border-gray-300 p-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Leadership
                </h2>
              </div>
              <div className="p-6 bg-gray-100 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 text-center leading-relaxed">
                  Our leadership team combines decades of experience in legal practice, technology development, and AI research. We're led by former practicing attorneys and technology innovators who understand both the challenges of legal research and the potential of AI to solve them.
                </p>
              </div>
            </div>

            {/* Why Us */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-white border-b border-gray-300 p-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Why Us
                </h2>
              </div>
              <div className="p-6 bg-gray-100 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 text-center leading-relaxed">
                  We deliver 95%+ accuracy in legal analysis, process cases 10x faster than traditional methods, and provide comprehensive coverage of case law with real-time updates. Our platform is trusted by leading law firms and legal professionals worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Legal Research?
              </h2>
              <p className="text-gray-600 mb-8">
                Join thousands of legal professionals who trust Lex Analytica for their research needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signin"
                  className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Get Started
                </a>
                <a
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterBig />
    </>
  );
};

export default About;
