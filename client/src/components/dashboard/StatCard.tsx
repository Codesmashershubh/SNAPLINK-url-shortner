import type { LucideIcon } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'brand',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'brand' | 'signal';
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            accent === 'brand' ? 'bg-blue-50 text-blue-600' : 'bg-blue-100 text-blue-700'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold leading-none text-gray-900">{value}</p>
          <p className="mt-1.5 text-sm text-gray-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}
