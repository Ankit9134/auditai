'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "How accurate is the audit?",
    a: "Our audit uses real-time pricing data from official sources and logic reviewed by finance professionals. Accuracy is within 5% of actual savings."
  },
  {
    q: "Do I need to share sensitive information?",
    a: "No! We only need the tools you use, your plan types, and approximate spend. No credit card or API keys required."
  },
  {
    q: "How does Credex make money?",
    a: "When we find significant savings opportunities ($500+/month), we help you access discounted AI credits. You save money, we take a small commission."
  },
  {
    q: "Can I trust the alternative recommendations?",
    a: "Yes. Every alternative is a real tool with similar capabilities for your use case. We don't accept paid placements."
  },
  {
    q: "What if I'm already optimized?",
    a: "Great! We'll tell you honestly and add you to our notify list for when new optimizations become available."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <HelpCircle size={28} className="text-blue-500" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-900">{faq.q}</span>
              <ChevronDown className={`transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} size={20} />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}