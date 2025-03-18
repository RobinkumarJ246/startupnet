'use client';
import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';

const PricingPage = () => {
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  
  const currencies = {
    USD: { symbol: '$', rate: 1 },
    INR: { symbol: '₹', rate: 87.44 },
    EUR: { symbol: '€', rate: 0.91 },
    GBP: { symbol: '£', rate: 0.79 },
  };

  const annualDiscount = 0.20; // 20% discount for annual plans

  const formatPrice = (basePrice, isAnnual = false) => {
    if (basePrice === 0) return null;
    
    let price = basePrice * currencies[currency].rate;
    if (isAnnual) {
      price = price * 12 * (1 - annualDiscount);
    }
    return `${currencies[currency].symbol}${price.toFixed(2)}`;
  };

  const studentPlans = [
    {
      name: 'Basic',
      price: 0,
      features: [
        'Create up to 3 projects',
        'Basic project management tools',
        'Community support',
        'Student portfolio'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 4,
      features: [
        'Unlimited projects',
        'Advanced project tools',
        'Priority matching',
        'AI-powered recommendations',
        'Premium templates',
        'Direct startup connections'
      ],
      popular: true
    }
  ];

  const organizationPlans = [
    {
      name: 'Startup Basic',
      price: 0,
      features: [
        'Up to 5 members',
        'Basic talent search',
        '5 active projects',
        'Standard support'
      ],
      popular: false
    },
    {
      name: 'Startup Pro',
      price: 19,
      features: [
        'Up to 10 members',
        'Advanced talent search',
        '10 active projects',
        'Priority support'
      ],
      popular: false
    },
    {
      name: 'Growth',
      price: 49,
      features: [
        'Up to 25 members',
        'Advanced + AI powered talent match',
        'Unlimited projects',
        '24/7 Priority support',
        'Custom branding',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 149,
      features: [
        'Unlimited members',
        'AI-powered talent matching',
        'Dedicated account manager',
        'Custom integration',
        'Advanced analytics',
        'API access'
      ],
      popular: false
    },
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes, contact our sales team for custom enterprise solutions tailored to your organization\'s specific needs.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes, you get a 20% discount when you choose annual billing for any paid plan.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your needs
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="relative inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingCycle === 'annual'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Annual
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
            
            {/* Currency Selector */}
            <div className="inline-flex items-center bg-white rounded-lg shadow-sm p-1">
              {Object.keys(currencies).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currency === curr
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Student Plans */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-12">For Students</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {studentPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ${
                    plan.popular ? 'ring-2 ring-indigo-600' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                    <div className="flex items-baseline mb-6">
                      {plan.price === 0 ? (
                        <span className="text-2xl font-bold text-gray-900">
                          Free Forever
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            {formatPrice(plan.price, billingCycle === 'annual')}
                          </span>
                          <span className="text-gray-600 ml-2">
                            /{billingCycle === 'annual' ? 'year' : 'month'}
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-indigo-500 mr-3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full mt-8 py-3 px-4 rounded-lg font-medium ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}>
                      {plan.price === 0 ? 'Start Free' : 'Get Started'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organization Plans */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-12">For Organizations</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {organizationPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ${
                    plan.popular ? 'ring-2 ring-indigo-600' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                    <div className="flex items-baseline mb-6">
                      {plan.price === 0 ? (
                        <span className="text-2xl font-bold text-gray-900">
                          Free Forever
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            {formatPrice(plan.price, billingCycle === 'annual')}
                          </span>
                          <span className="text-gray-600 ml-2">
                            /{billingCycle === 'annual' ? 'year' : 'month'}
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-indigo-500 mr-3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full mt-8 py-3 px-4 rounded-lg font-medium ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}>
                      {plan.price === 0 ? 'Start Free' : 'Contact Sales'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-left">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openFaq === index ? 'max-h-40' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 bg-gray-50 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;