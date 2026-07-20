import { motion } from 'framer-motion';
import { QrCode, BarChart3, ShieldCheck, Clock, Palette, Code2 } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'QR codes, generated instantly',
    description: 'Every short link ships with a scannable QR code — download as PNG or SVG, no design tool required.',
  },
  {
    icon: BarChart3,
    title: 'Analytics that actually help',
    description: 'See clicks by country, device, browser, and referrer as they happen, not in a weekly digest.',
  },
  {
    icon: ShieldCheck,
    title: 'Password-protected links',
    description: 'Gate sensitive destinations behind a password before the redirect fires.',
  },
  {
    icon: Clock,
    title: 'Expiry you control',
    description: 'Set a link to self-destruct on a date, or leave it running indefinitely.',
  },
  {
    icon: Palette,
    title: 'Custom aliases',
    description: 'Replace the random code with something memorable and on-brand.',
  },
  {
    icon: Code2,
    title: 'A REST API for everything',
    description: 'Script the entire product — shorten, tag, and pull analytics from your own tools.',
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-gray-200 py-24">
      <div className="container-page">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">Platform</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Built for teams who ship links every day
          </h2>
          <p className="mt-4 text-gray-500">
            Not a novelty shortener — a small piece of infrastructure your marketing, growth,
            and support teams can depend on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
