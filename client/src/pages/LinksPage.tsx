import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LinkTable } from '@/components/dashboard/LinkTable';
import { CreateLinkModal } from '@/components/dashboard/CreateLinkModal';
import { Button } from '@/components/ui/Button';
import { exportCsvUrl } from '@/services/link.service';

export function LinksPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <DashboardLayout title="Links">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage every short link in your account.</p>
        <div className="flex gap-2">
          <a href={exportCsvUrl()} target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </a>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New link
          </Button>
        </div>
      </div>

      <LinkTable />

      <CreateLinkModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => {}} />
    </DashboardLayout>
  );
}
