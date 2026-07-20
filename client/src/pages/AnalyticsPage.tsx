import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BreakdownChart } from '@/components/dashboard/BreakdownChart';
import { ClicksChart } from '@/components/dashboard/ClicksChart';
import { Card, CardBody } from '@/components/ui/Card';
import { getAccountAnalyticsRequest, getLinkAnalyticsRequest } from '@/services/analytics.service';

export function AnalyticsPage() {
  const [params] = useSearchParams();
  const linkId = params.get('link');

  const accountQuery = useQuery({
    queryKey: ['account-analytics'],
    queryFn: getAccountAnalyticsRequest,
    enabled: !linkId,
  });

  const linkQuery = useQuery({
    queryKey: ['link-analytics', linkId],
    queryFn: () => getLinkAnalyticsRequest(linkId as string),
    enabled: Boolean(linkId),
  });

  const countries = (linkId ? linkQuery.data?.countries : accountQuery.data?.countries) || [];
  const devices = (linkId ? linkQuery.data?.devices : accountQuery.data?.devices) || [];
  const browsers = (linkId ? linkQuery.data?.browsers : accountQuery.data?.browsers) || [];
  const referrers = (linkId ? linkQuery.data?.referrers : accountQuery.data?.referrers) || [];

  return (
    <DashboardLayout title="Analytics">
      {linkId && linkQuery.data && (
        <Card className="mb-6">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Showing analytics for
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-blue-600">
                {linkQuery.data.link.shortUrl.replace(/^https?:\/\//, '')}
              </p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{linkQuery.data.link.clicks} clicks</p>
          </CardBody>
        </Card>
      )}

      {linkId && linkQuery.data && (
        <div className="mb-6">
          <ClicksChart data={linkQuery.data.timeline || []} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BreakdownChart title="Top countries" data={countries} />
        <BreakdownChart title="Devices" data={devices} />
        <BreakdownChart title="Browsers" data={browsers} />
        <BreakdownChart title="Referrers" data={referrers} />
      </div>
    </DashboardLayout>
  );
}
