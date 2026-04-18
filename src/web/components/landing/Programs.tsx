export default function Programs() {
  const programs = [
    {
      num: "01",
      icon: "🔥",
      title: "Weight Loss",
      desc: "Science-backed cardio & nutrition protocols to strip fat without sacrificing muscle.",
      tags: ["HIIT Training", "Diet Plan", "Weekly Check-ins"],
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&fit=crop",
    },
    {
      num: "02",
      icon: "💪",
      title: "Muscle Gain",
      desc: "Progressive overload hypertrophy programs with structured nutrition for maximum size.",
      tags: ["Strength Training", "Protein Protocols", "Recovery Plans"],
      img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fit=crop",
    },
    {
      num: "03",
      icon: "🎯",
      title: "Personal Training",
      desc: "1-on-1 dedicated sessions with certified coaches — 100% tailored to your body and goals.",
      tags: ["Dedicated Coach", "Custom Plan", "Daily Tracking"],
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80&fit=crop",
    },
  ];

  return (
    <section id="programs" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
          <div>
            <div className="section-label mb-4">What We Offer</div>
            <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none">
              OUR<br /><span className="text-[#E8FF00]">PROGRAMS</span>
            </h2>
          </div>
          <p className="text-[#666] text-base max-w-sm leading-relaxed md:pb-2">
            Three focused paths built around your specific goal. Pick one and we'll handle the rest.
          </p>
        </div>

        {/* Program cards */}
        <div className="grid md:grid-cols-3 gap-4 stagger-children">
          {programs.map((p) => (
            <div key={p.title} className="surface-hover group overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
                <img src={p.img} alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 text-[#333] display-upright text-5xl font-black leading-none select-none">{p.num}</div>
                <div className="absolute top-4 right-4 text-2xl">{p.icon}</div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="display-upright text-2xl text-white mb-2">{p.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 border border-white/[0.08] text-[#777] rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <a href="#lead-form"
                  className="flex items-center gap-2 text-[#E8FF00] text-sm font-semibold group-hover:gap-3 transition-all">
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
