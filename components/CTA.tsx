'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-24 px-8 max-w-4xl mx-auto text-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Ready to Transform Your Legal Research?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust Lex Analytica for their research needs.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signin">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Get Started
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;