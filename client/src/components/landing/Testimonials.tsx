const quotes = [
  {
    quote:
      'We moved every campaign link to SnapLink in an afternoon. The click breakdown by referrer is the one report our whole growth team actually opens.',
    name: 'Priya Nathan',
    role: 'Head of Growth, Loopward',
  },
  {
    quote:
      'Password-protected links solved a real problem for us — we share embargoed press links without emailing a PDF back and forth.',
    name: 'Marcus Aldridge',
    role: 'Comms Lead, Fielding Press',
  },
  {
    quote:
      'The API is the whole product for us. We generate a short link the moment an order ships, QR code included, zero manual steps.',
    name: 'Ines Bouhadana',
    role: 'Engineering, Portside',
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-gray-200 py-24">
      <div className="container-page">
        <p className="mb-14 text-center text-xs font-semibold uppercase tracking-widest text-blue-500">
          Trusted by lean teams
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <blockquote className="text-sm leading-relaxed text-gray-700">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-gray-900">{q.name}</span>
                <span className="text-gray-400"> — {q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
