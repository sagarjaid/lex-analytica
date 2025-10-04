'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingNew = () => {
  const plans = [
    {
      title: "PARA-PRIME",
      price: "Free",
      features: [
        "Access to our paralegal pipeline with multiple chain of thought",
        "10 Requests per month",
        "Basic document analysis",
        "Standard response time",
        "Email support"
      ],
      buttonText: "Get Para Prime",
      buttonVariant: "outline" as const,
      isPopular: false
    },
    {
      title: "PARA-PRIMUS +",
      price: "$200",
      pricePeriod: "/ month",
      features: [
        "Everything in Para-Primus",
        "Unlimited Requests per month",
        "Advanced AI analysis",
        "Priority support",
        "Custom templates"
      ],
      buttonText: "Get Para Prime +",
      buttonVariant: "default" as const,
      isPopular: true
    },
    {
      title: "PARA-PRIME PRO",
      price: "Enterprise Package",
      features: [
        "Everything in Para-Primus Plus",
        "Team Sharing",
        "Custom RAG database for improved outcome generation",
        "Dedicated account manager",
        "Custom integrations"
      ],
      buttonText: "Request Info",
      buttonVariant: "outline" as const,
      isPopular: false
    }
  ];

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col justify-between text-center items-center w-full mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose the perfect plan for your legal needs
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col border-2 rounded-3xl bg-white p-8 ${
              plan.isPopular 
                ? 'border-black shadow-lg scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">
                {plan.title}
              </h3>
              <div className="text-3xl font-bold text-black">
                {plan.price}
                {plan.pricePeriod && (
                  <span className="text-lg font-normal text-gray-600">
                    {plan.pricePeriod}
                  </span>
                )}
              </div>
            </div>

            <ul className="space-y-4 flex-1 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed font-light">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.buttonVariant}
              className={`w-full py-3 font-semibold rounded-lg ${
                plan.buttonVariant === 'default'
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {plan.buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingNew;
