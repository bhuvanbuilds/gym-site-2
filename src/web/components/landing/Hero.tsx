import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const stats = [
    { value: "500+", label: "Active Members" },
    { value: "98%", label: "Success Rate" },
    { value: "90", label: "Day Program" },
    { value: "5★", label: "Avg. Rating" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080808] flex flex-col">

      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=85&fit=crop"
          alt="Gym Interior"
          className="w-full h-full object-cover object-center opacity-35"
          loading="eager"
          decoding="async"
        />
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        {/* grain */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.75\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="max-w-3xl">

          {/* Label */}
          <div className={`section-label mb-6 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Bangalore's Premier Gym
          </div>

          {/* Headline */}
          <h1 className={`display text-[clamp(44px,12vw,140px)] text-white leading-none mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            TRANSFORM<br />
            YOUR<br />
            <span className="text-[#E8FF00]">BODY</span>{" "}
            <span className="text-white/30">IN 90</span><br />
            <span className="text-white/30">DAYS</span>
          </h1>

          {/* Sub */}
          <p className={`text-[#999] text-base md:text-lg max-w-md leading-relaxed mb-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Science-backed fat loss, muscle gain & personal training programs — designed to get you visible results, fast.
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row gap-3 mb-16 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <a href="#lead-form" className="btn-cta text-base py-4 px-8">Book Free Trial →</a>
            <a href="#programs" className="btn-outline py-4 px-8">Explore Programs</a>
          </div>

          {/* Stats row */}
          <div className={`grid grid-cols-2 md:flex md:flex-wrap gap-x-8 gap-y-6 transition-all duration-700 delay-[450ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div>
                  <div className="display-upright text-2xl text-white leading-none mb-1">{s.value}</div>
                  <div className="text-[#555] text-[10px] uppercase tracking-[0.15em] font-medium">{s.label}</div>
                </div>
                {i % 2 === 0 && <div className="md:hidden w-px h-8 bg-white/5 ml-auto" />}
                {i < stats.length - 1 && <div className="hidden md:block w-px h-8 bg-white/10 ml-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating proof card */}
      <div className={`hidden sm:block absolute bottom-24 right-8 lg:right-16 z-20 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="surface px-5 py-4 w-56">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#22c55e] text-[10px] font-semibold uppercase tracking-widest">Spots Available</span>
          </div>
          <div className="text-white font-semibold text-sm">Next Batch: Monday</div>
          <div className="text-[#666] text-xs mt-0.5">6:00 AM · Only 6 spots left</div>
          <div className="flex mt-3 -space-x-2">
            {["FF4500","FF6B35","E8FF00","22c55e","60a5fa"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#101010]"
                style={{ background: `#${c}` }} />
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-[#101010] bg-[#222] flex items-center justify-center text-[9px] text-white">+12</div>
          </div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="relative z-10 flex items-center gap-3 px-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[#444] text-xs tracking-widest uppercase">Scroll to explore</span>
      </div>
    </section>
  );
}
