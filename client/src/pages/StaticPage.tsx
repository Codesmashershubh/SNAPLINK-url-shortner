import type { ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export function StaticPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f0ee] text-gray-900">
      <Navbar />
      <main className="container-page py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{title}</h1>
          <div className="prose-sm mt-8 space-y-4 text-sm leading-relaxed text-gray-600">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
