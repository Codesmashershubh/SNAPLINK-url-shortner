import { Link } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'API docs', href: '/docs' },
      { label: 'Status', href: '/status' },
      { label: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-14">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white">
                <LinkIcon className="h-3.5 w-3.5" />
              </span>
              SnapLink
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Short links, real intelligence.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-blue-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} SnapLink. Built for the open web.</p>
          <p>Hosted free on Render.</p>
        </div>
      </div>
    </footer>
  );
}
