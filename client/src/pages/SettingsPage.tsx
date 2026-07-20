import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Key, Copy, Check, RefreshCcw, User, Mail } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { getApiKeyRequest, regenerateApiKeyRequest } from '@/services/auth.service';
import { apiErrorMessage } from '@/services/api';

export function SettingsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getApiKeyRequest()
      .then(setApiKey)
      .catch(() => setApiKey(null));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    try {
      const key = await regenerateApiKeyRequest();
      setApiKey(key);
      toast.success('API key regenerated');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input label="Name" icon={<User className="h-4 w-4" />} value={user?.name || ''} readOnly />
            <Input label="Email" icon={<Mail className="h-4 w-4" />} value={user?.email || ''} readOnly />
            <p className="text-xs text-gray-400">
              Profile editing is coming soon — for now, contact support to update these fields.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API key</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-gray-500">
              Use this key in the <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">x-api-key</code> header to call the SnapLink API programmatically.
            </p>
            {apiKey ? (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm">
                <span className="truncate">{apiKey}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(apiKey).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="shrink-0 rounded-lg bg-gray-900 p-2 text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400">
                <Key className="h-4 w-4" /> No API key generated yet
              </div>
            )}
            <Button variant="outline" onClick={handleGenerate} loading={loading}>
              <RefreshCcw className="h-4 w-4" /> {apiKey ? 'Regenerate key' : 'Generate key'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
