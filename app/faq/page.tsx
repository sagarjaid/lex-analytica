"use client";

import HeaderHome from "@/components/HeaderHome";
import FooterBig from "@/components/FooterBig";

// FAQ data with the questions from the image
const faqData = [
  {
    id: 1,
    question: "How does Lex Analytica deal with hallucinations?",
    answer: "Lex Analytica employs advanced validation techniques and cross-referencing with verified legal databases to minimize hallucinations. Our system uses multiple AI models in parallel and cross-validates results against authoritative legal sources to ensure accuracy and reliability."
  },
  {
    id: 2,
    question: "How does Lex Analytica compare to just using ChatGPT or other LLM tools?",
    answer: "Unlike general-purpose LLMs, Lex Analytica is specifically trained on legal data and precedents. It provides structured legal analysis, case citations, and follows legal research methodologies that general AI tools cannot match. Our platform offers specialized legal knowledge with higher accuracy for legal research tasks."
  },
  {
    id: 3,
    question: "Does Lex Analytica replace a paralegal research team?",
    answer: "Lex Analytica enhances and accelerates paralegal research rather than replacing it entirely. It serves as a powerful tool that can handle routine research tasks, case analysis, and precedent identification, allowing paralegals to focus on higher-level analysis and strategy. Think of it as a research assistant that works 24/7."
  },
  {
    id: 4,
    question: "What is the accuracy of Lex Analytica compared to human counterparts?",
    answer: "Lex Analytica achieves 95%+ accuracy in case identification and legal analysis, often matching or exceeding human research accuracy while being significantly faster. Our system continuously learns and improves, and we provide confidence scores for each analysis to help users assess reliability."
  },
  {
    id: 5,
    question: "How do you avoid referencing bad law?",
    answer: "We maintain a comprehensive database of overruled, superseded, and invalidated cases. Our system automatically flags potentially outdated precedents and provides current status updates. We also integrate with real-time legal databases to ensure all referenced cases are current and valid."
  },
  {
    id: 6,
    question: "What is the cancellation policy?",
    answer: "You can cancel your subscription at any time with no cancellation fees. Your access will continue until the end of your current billing period. We offer a 30-day money-back guarantee for new subscribers who are not satisfied with the service."
  }
];

interface FAQItemProps {
  item: typeof faqData[0];
}

const FAQItem = ({ item }: FAQItemProps) => {
  return (
    <div className="bg-white border border-black rounded-lg overflow-hidden">
      {/* Black header with question - no button, no icons */}
      <div className="w-full bg-black text-white p-6">
        <h3 className="text-lg font-semibold leading-tight">
          {item.question}
        </h3>
      </div>
      
      {/* White answer box - always visible */}
      <div className="p-6 bg-white">
        <div className="text-gray-700 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQPage() {

  return (
    <>
      <HeaderHome />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about Lex Analytica and how it can transform your legal research workflow.
              </p>
            </div>
          </div>
        </div>

      {/* FAQ Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="/signin"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Try Lex Analytica
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
      <FooterBig />
    </>
  );
}

