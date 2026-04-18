export default function Transformations() {
  const cases = [
    {
      name: "Rahul S.",
      result: "−18 KG",
      duration: "4 Months",
      program: "Weight Loss",
      before: "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&q=80&fit=crop",
      after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&fit=crop",
    },
    {
      name: "Priya M.",
      result: "−12 KG",
      duration: "3 Months",
      program: "Personal Training",
      before: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80&fit=crop",
      after: "https://images.unsplash.com/photo-1549476464-37392f717541?w=400&q=80&fit=crop",
    },
    {
      name: "Arjun K.",
      result: "+8 KG",
      duration: "5 Months",
      program: "Muscle Gain",
      before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop",
      after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80&fit=crop",
    },
    {
      name: "Sneha R.",
      result: "−15 KG",
      duration: "5 Months",
      program: "Weight Loss",
      before: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=400&q=80&fit=crop",
      after: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80&fit=crop",
    },
  ];

  return (
    <section id="transformations" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 reveal">
          <div className="section-label mb-4">Real Results</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none">
              REAL<br /><span className="text-[#E8FF00]">TRANSFORMATIONS</span>
            </h2>
            <p className="text-[#666] text-sm max-w-xs leading-relaxed md:pb-2">
              Every single one of these was achieved right here — with our coaches, our programs.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 stagger-children">
          {cases.map((c) => (
            <div key={c.name} className="group cursor-pointer">
              {/* Before/after */}
              <div className="relative rounded-xl overflow-hidden mb-3">
                <div className="grid grid-cols-2 gap-px bg-[#222]">
                  <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden">
                    <img src={c.before} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-widest bg-black/60 text-white/60 px-2 py-0.5 rounded">Before</span>
                  </div>
                  <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden">
                    <img src={c.after} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                    <span className="absolute bottom-2 right-2 text-[9px] font-bold uppercase tracking-widest bg-[#E8FF00] text-[#080808] px-2 py-0.5 rounded">After</span>
                  </div>
                </div>
                {/* Result badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#E8FF00] text-[#080808] display-upright text-lg px-3 py-0.5 rounded whitespace-nowrap">
                  {c.result}
                </div>
              </div>
              <div className="px-1">
                <div className="text-white text-sm font-semibold">{c.name}</div>
                <div className="text-[#555] text-xs mt-0.5">{c.duration} · {c.program}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 reveal">
          <p className="text-[#555] text-sm">You could be our next success story.</p>
          <a href="#lead-form" className="btn-cta">Start Your Transformation →</a>
        </div>
      </div>
    </section>
  );
}
