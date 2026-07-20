import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Copy,
  Check,
  Star,
  Trash2,
  Power,
  Search,
  MoreHorizontal,
  ExternalLink,
  QrCode,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  listLinksRequest,
  updateLinkRequest,
  deleteLinkRequest,
  getQrPngRequest,
} from '@/services/link.service';
import { apiErrorMessage } from '@/services/api';
import { cn } from '@/lib/utils';

export function LinkTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['links', { search, page }],
    queryFn: () => listLinksRequest({ search, page, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['links'] });
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await updateLinkRequest(id, { active: !active });
      refresh();
      toast.success(active ? 'Link disabled' : 'Link enabled');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function handleFavorite(id: string, favorite: boolean) {
    try {
      await updateLinkRequest(id, { favorite: !favorite });
      refresh();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this link? This cannot be undone.')) return;
    try {
      await deleteLinkRequest(id);
      refresh();
      toast.success('Link deleted');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function handleDownloadQr(id: string, code: string) {
    try {
      const dataUri = await getQrPngRequest(id);
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = `snaplink-${code}.png`;
      a.click();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not generate QR code'));
    }
  }

  function copyToClipboard(id: string, url: string) {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const items = data?.items || [];
  const pagination = data?.pagination;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4">
        <div className="w-full max-w-xs">
          <Input
            placeholder="Search links..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Link</th>
              <th className="px-5 py-3 font-medium">Clicks</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  Loading links…
                </td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  No links yet — create your first one above.
                </td>
              </tr>
            )}
            {items.map((link) => (
              <tr
                key={link.id}
                className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
              >
                <td className="max-w-xs px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleFavorite(link.id, link.favorite)}>
                      <Star
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          link.favorite ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        )}
                      />
                    </button>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-medium text-blue-600">
                        {link.shortUrl.replace(/^https?:\/\//, '')}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {link.title || link.originalUrl}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-medium">{link.clicks.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={link.active ? 'signal' : 'neutral'}>
                    {link.active ? 'Active' : 'Disabled'}
                  </Badge>
                  {link.hasPassword && (
                    <Badge variant="brand" className="ml-1.5">
                      Protected
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-500">
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="relative px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.id, link.shortUrl)}>
                      {copiedId === link.id ? <Check className="h-4 w-4 text-blue-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpenMenu(openMenu === link.id ? null : link.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  {openMenu === link.id && (
                    <div className="absolute right-5 top-12 z-10 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Visit destination
                      </a>
                      <Link
                        to={`/dashboard/analytics?link=${link.id}`}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <BarChart3 className="h-3.5 w-3.5" /> View analytics
                      </Link>
                      <button
                        onClick={() => handleDownloadQr(link.id, link.shortCode)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <QrCode className="h-3.5 w-3.5" /> Download QR
                      </button>
                      <button
                        onClick={() => handleToggleActive(link.id, link.active)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <Power className="h-3.5 w-3.5" /> {link.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 p-4 text-sm">
          <span className="text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
