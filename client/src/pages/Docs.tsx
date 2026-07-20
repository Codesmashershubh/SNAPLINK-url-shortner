import { Navbar } from '@/components/landing/Navbar';
import { API_BASE_URL } from '@/services/api';
import { ExternalLink } from 'lucide-react';

export function Docs() {
  return (
    <div className="min-h-screen bg-[#f0f0ee]">
      <Navbar />
      <div className="container-page flex items-center justify-between pt-24 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">API Reference</h1>
        <a
          href={`${API_BASE_URL}/api/docs`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-blue-500 hover:underline"
        >
          Open full screen <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe
        title="SnapLink API Docs"
        src={`${API_BASE_URL}/api/docs`}
        className="h-[calc(100vh-8rem)] w-full border-0"
      />
    </div>
  );
}
