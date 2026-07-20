import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, apiErrorMessage } from '@/services/api';

export function LinkPassword() {
  const { code } = useParams();
  const [params] = useSearchParams();
  const fallbackNext = params.get('next') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!code) return;
    api
      .get(`/redirect/${code}/meta`)
      .then((res) => setTitle(res.data?.data?.title || ''))
      .catch(() => {});
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post(`/redirect/${code}/unlock`, { password });
      const dest = res.data?.data?.originalUrl || fallbackNext;
      if (dest) window.location.href = dest;
    } catch (err) {
      setError(apiErrorMessage(err, 'Incorrect password'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid bg-[#f0f0ee] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-gray-900">This link is protected</h1>
        <p className="mt-1 text-sm text-gray-500">
          {title || `snaplink/${code}`} requires a password to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            autoFocus
          />
          <Button type="submit" className="w-full group" size="lg" loading={submitting}>
            Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
