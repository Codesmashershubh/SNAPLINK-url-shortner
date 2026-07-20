import { useEffect, useState } from 'react';
import { StaticPage } from './StaticPage';
import { API_BASE_URL } from '@/services/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function Terms() {
  return (
    <StaticPage title="Terms of Service">
      <p>
        These terms govern your use of SnapLink. By creating an account or shortening a link, you
        agree to use the service lawfully and not to create links that facilitate fraud, malware
        distribution, or harassment.
      </p>
      <p>
        We reserve the right to disable any short link or account that violates these terms.
        SnapLink is provided "as is" without warranty of any kind, consistent with its status as a
        free, community-run service.
      </p>
      <p>You are responsible for the content your short links resolve to.</p>
    </StaticPage>
  );
}

export function Privacy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        SnapLink collects the minimum data needed to operate: your account email and name, the
        links you create, and aggregate click metadata (country, device, browser, referrer).
      </p>
      <p>
        Visitor IP addresses are hashed with SHA-256 before storage and are never retained in raw
        form. We do not sell personal data to third parties.
      </p>
      <p>You can delete your account and all associated links at any time from Settings.</p>
    </StaticPage>
  );
}

export function About() {
  return (
    <StaticPage title="About SnapLink">
      <p>
        SnapLink is a small, focused link-shortening platform built to be genuinely free —
        unlimited links, real analytics, and an open API, hosted entirely on free-tier
        infrastructure.
      </p>
      <p>
        It started as a rejection of "free trial" link shorteners that paywall basic features like
        custom aliases or click counts past a handful of links.
      </p>
    </StaticPage>
  );
}

export function Contact() {
  return (
    <StaticPage title="Contact">
      <p>
        Questions, bug reports, or feature requests — reach the team at{' '}
        <a className="text-blue-500 hover:underline" href="mailto:hello@snaplink.dev">
          hello@snaplink.dev
        </a>
        .
      </p>
    </StaticPage>
  );
}

export function StatusPage() {
  const [status, setStatus] = useState<'checking' | 'up' | 'down'>('checking');
  const [dbStatus, setDbStatus] = useState<string>('unknown');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((r) => r.json())
      .then((data) => {
        setStatus('up');
        setDbStatus(data?.data?.db || 'unknown');
      })
      .catch(() => setStatus('down'));
  }, []);

  return (
    <StaticPage title="System Status">
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
        {status === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
        {status === 'up' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
        {status === 'down' && <XCircle className="h-5 w-5 text-red-500" />}
        <div>
          <p className="font-medium text-gray-900">
            API: {status === 'checking' ? 'Checking…' : status === 'up' ? 'Operational' : 'Unreachable'}
          </p>
          <p className="text-xs text-gray-500">Database: {dbStatus}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Hosted on Render's free tier — the backend may take up to a minute to wake from sleep
        after a period of inactivity.
      </p>
    </StaticPage>
  );
}
