'use client';

import ButtonLearnMore from '@/components/ButtonLearnMore';

const CTA = () => {
  return (
    <section className="py-24 px-8 max-w-4xl mx-auto text-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Transform Your Legal Research?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust Lex Analytica for their research needs.
          </p>
        </div>
        
        <div className="flex flex-row gap-4 justify-center">
          <ButtonLearnMore
            href="/signin"
            text="Get Started"
            className="bg-black text-white hover:bg-gray-800"
          />
          <ButtonLearnMore
            href="/contact"
            text="Contact Us"
            className="bg-white text-black border border-black hover:bg-gray-50"
          />
        </div>
      </div>
    </section>
  );
};

export default CTA;