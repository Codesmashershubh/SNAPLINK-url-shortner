import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    title: 'Paste your long URL',
    description: 'Drop in any destination link — with or without an account.',
  },
  {
    n: '02',
    title: 'Customize the short link',
    description: 'Pick an alias, add a password, set an expiry date, or tag it with UTM parameters.',
  },
  {
    n: '03',
    title: 'Share it anywhere',
    description: 'Post it, print the QR code, or drop it in an email — it just redirects.',
  },
  {
    n: '04',
    title: 'Watch the clicks roll in',
    description: 'Every visit is logged by country, device, and referrer in your dashboard.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-gray-200 py-24">
      <div className="container-page">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">Workflow</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            From long URL to live link in four steps
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-l border-gray-200 px-6 py-2 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="font-mono text-sm text-blue-500">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
