import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f0ee]">
      <Sidebar />
      <div className="lg:pl-60">
        <DashboardHeader title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
