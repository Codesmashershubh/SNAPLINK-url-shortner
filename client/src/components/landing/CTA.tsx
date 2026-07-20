import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTA() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(600px circle at 20% 20%, rgba(59,130,246,0.10), transparent 40%), radial-gradient(500px circle at 80% 80%, rgba(59,130,246,0.08), transparent 40%)',
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-lg text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Your links deserve better than a raw URL.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-gray-500">
              Create an account in under a minute — no credit card, no trial clock.
            </p>
            <Link to="/register">
              <Button size="lg" className="mt-8 group">
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
