import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Is SnapLink really free?',
    a: 'Yes. The core product — unlimited links, QR codes, analytics, and API access — is free with no seat limits or trial clock.',
  },
  {
    q: 'What happens when a link expires?',
    a: 'Expired links stop redirecting and are automatically removed from the database, so there is nothing to clean up manually.',
  },
  {
    q: 'Can I bring my own domain?',
    a: 'Custom domains are on the roadmap. Today, links are served from your SnapLink deployment URL.',
  },
  {
    q: 'How is click data collected?',
    a: 'Each redirect is logged with country, device, browser, and referrer. IP addresses are hashed and never stored in raw form.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-gray-200 py-24">
      <div className="container-page mx-auto max-w-2xl">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-blue-500">FAQ</p>
        <h2 className="mb-12 text-balance text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Questions, answered
        </h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={cn('h-4 w-4 shrink-0 text-gray-400 transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
