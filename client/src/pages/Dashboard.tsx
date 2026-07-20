import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link2, MousePointerClick, Zap, QrCode, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClicksChart } from '@/components/dashboard/ClicksChart';
import { CreateLinkModal } from '@/components/dashboard/CreateLinkModal';
import { LinkTable } from '@/components/dashboard/LinkTable';
import { Button } from '@/components/ui/Button';
import { getOverviewRequest } from '@/services/analytics.service';

export function Dashboard() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, refetch } = useQuery({ queryKey: ['overview'], queryFn: getOverviewRequest });

  return (
    <DashboardLayout title="Overview">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Here's how your links are performing.
        </p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> New link
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total links" value={data?.totalLinks ?? '—'} icon={Link2} />
        <StatCard label="Total clicks" value={data?.totalClicks ?? '—'} icon={MousePointerClick} accent="signal" />
        <StatCard label="Active links" value={data?.activeLinks ?? '—'} icon={Zap} />
        <StatCard label="QR codes ready" value={data?.qrCodesGenerated ?? '—'} icon={QrCode} accent="signal" />
      </div>

      <div className="mt-6">
        <ClicksChart data={data?.clicksOverTime || []} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Recent links</h2>
        <LinkTable />
      </div>

      <CreateLinkModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          refetch();
        }}
      />
    </DashboardLayout>
  );
}
