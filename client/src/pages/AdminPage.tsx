import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Users, Link2, MousePointerClick, Ban, ShieldOff, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api, apiErrorMessage } from '@/services/api';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface AdminLink {
  _id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  owner?: { name: string; email: string };
}

export function AdminPage() {
  const [tab, setTab] = useState<'users' | 'links'>('users');
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data.data,
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data.data.items as AdminUser[],
    enabled: tab === 'users',
  });

  const { data: links } = useQuery({
    queryKey: ['admin-links'],
    queryFn: async () => (await api.get('/admin/links')).data.data.items as AdminLink[],
    enabled: tab === 'links',
  });

  async function toggleBan(id: string) {
    try {
      await api.patch(`/admin/users/${id}/ban`);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Remove this link for all users?')) return;
    try {
      await api.delete(`/admin/links/${id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-links'] });
      toast.success('Link removed');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  return (
    <DashboardLayout title="Admin">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={stats?.totalUsers ?? '—'} icon={Users} />
        <StatCard label="Total links" value={stats?.totalLinks ?? '—'} icon={Link2} accent="signal" />
        <StatCard label="Total clicks logged" value={stats?.totalClicks ?? '—'} icon={MousePointerClick} />
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant={tab === 'users' ? 'primary' : 'outline'} size="sm" onClick={() => setTab('users')}>
          Users
        </Button>
        <Button variant={tab === 'links' ? 'primary' : 'outline'} size="sm" onClick={() => setTab('links')}>
          Links
        </Button>
      </div>

      <Card className="mt-4 overflow-x-auto">
        {tab === 'users' ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u._id} className="border-b border-gray-200 last:border-0">
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <Badge variant={u.role === 'admin' ? 'brand' : 'neutral'}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={u.isBanned ? 'danger' : 'signal'}>{u.isBanned ? 'Banned' : 'Active'}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleBan(u._id)}>
                      {u.isBanned ? <ShieldOff className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Short code</th>
                <th className="px-5 py-3 font-medium">Destination</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Clicks</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {links?.map((l) => (
                <tr key={l._id} className="border-b border-gray-200 last:border-0">
                  <td className="px-5 py-3 font-mono">{l.shortCode}</td>
                  <td className="max-w-xs truncate px-5 py-3 text-gray-500">{l.originalUrl}</td>
                  <td className="px-5 py-3 text-gray-500">{l.owner?.email || 'Anonymous'}</td>
                  <td className="px-5 py-3">{l.clicks}</td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteLink(l._id)}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardLayout>
  );
}
