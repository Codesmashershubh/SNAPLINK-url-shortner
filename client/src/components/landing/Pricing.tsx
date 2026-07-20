import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const included = [
  'Unlimited short links',
  'Custom aliases',
  'QR codes (PNG + SVG)',
  'Click analytics & CSV export',
  'Password-protected links',
  'Link expiry rules',
  'REST API access',
  'Dark mode dashboard',
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-gray-200 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">Pricing</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            One plan. Everything included. Actually free.
          </h2>
          <p className="mt-4 text-gray-500">
            No seat limits, no feature paywall, no credit card at signup.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-gray-900">$0</span>
            <span className="text-sm text-gray-400">/ forever</span>
          </div>
          <ul className="mt-6 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/register" className="mt-8 block">
            <Button className="w-full" size="lg">
              Create your free account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
