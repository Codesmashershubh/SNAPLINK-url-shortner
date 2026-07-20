import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grid bg-[#f0f0ee] px-4 text-center">
      <p className="font-mono text-sm text-blue-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-gray-900">This page took a wrong turn</h1>
      <p className="mt-2 max-w-sm text-gray-500">
        The page you're looking for doesn't exist, or the link may have expired.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
