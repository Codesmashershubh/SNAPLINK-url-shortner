import { Link as RouterLink } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks: { label: string; href: string; internal?: boolean }[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: '/docs', internal: true },
];

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen overflow-hidden bg-grid bg-[#f0f0ee]">
      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex items-center justify-center gap-2 px-4 pt-4 sm:gap-3 sm:px-8 sm:pt-6">
          <RouterLink
            to="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
            style={{ backgroundColor: '#EDEDED' }}
            aria-label="SnapLink home"
          >
            <LinkIcon className="h-[18px] w-[18px]" style={{ color: 'rgb(84, 84, 84)' }} />
          </RouterLink>

          <div
            className="flex items-center gap-4 rounded-xl px-4 py-2.5 sm:gap-10 sm:px-8 sm:py-3"
            style={{ backgroundColor: '#EDEDED' }}
          >
            {navLinks.map((link) =>
              link.internal ? (
                <RouterLink
                  key={link.label}
                  to={link.href}
                  className="text-[12px] font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 sm:text-[14px]"
                >
                  {link.label}
                </RouterLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 sm:text-[14px]"
                >
                  {link.label}
                </a>
              )
            )}
            <RouterLink
              to={user ? '/dashboard' : '/login'}
              className="text-[12px] font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 sm:text-[14px]"
            >
              {user ? 'Dashboard' : 'Sign in'}
            </RouterLink>
          </div>
        </nav>

        <div className="flex flex-1 items-end px-6 pb-10 sm:px-12 sm:pb-16 md:px-20 lg:px-28 lg:pb-20">
          <div className="max-w-xs">
            <a
              href="#pricing"
              className="group mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 transition-colors hover:text-blue-600"
            >
              Free forever — no credit card
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>

            <h1 className="mb-3 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">
              Every link, shortened, tracked, and yours to control.
            </h1>

            <p className="mb-3 text-[13px] font-normal text-gray-400">
              Shorten, brand, and measure every click in seconds.
            </p>

            <RouterLink
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full border border-blue-400 px-5 py-2.5 text-[13px] font-medium text-blue-500 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Start shortening free
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
