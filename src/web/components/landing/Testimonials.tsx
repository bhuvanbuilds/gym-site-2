export default function Testimonials() {
  const reviews = [
    { name: "Rahul Sharma", role: "Software Engineer", rating: 5, initials: "RS",
      text: "Lost 18kg in 4 months. The coaches actually give a damn. Every session is planned, every week is tracked. Nothing like I've tried before.", color: "#FF4500" },
    { name: "Priya Mehta", role: "Teacher", rating: 5, initials: "PM",
      text: "After 3 years of gym memberships going to waste, FitZone is the first place where I actually showed up consistently. Down 12kg.", color: "#E8FF00" },
    { name: "Arjun Kumar", role: "Business Owner", rating: 5, initials: "AK",
      text: "Gained 8kg of lean muscle in 5 months. The nutrition coaching alone changed everything. These guys actually know what they're doing.", color: "#60a5fa" },
    { name: "Sneha Reddy", role: "Doctor", rating: 5, initials: "SR",
      text: "24/7 access and a trainer who respects my crazy schedule. Lost 15kg and my energy levels are completely different now.", color: "#22c55e" },
    { name: "Vikram Patel", role: "Student", rating: 5, initials: "VP",
      text: "Basic plan is shockingly affordable. Full body transformation in 6 months. My confidence went from 0 to 100.", color: "#a78bfa" },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
          <div>
            <div className="section-label mb-4">Member Stories</div>
            <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none">
              WHAT THEY<br /><span className="text-[#E8FF00]">SAY</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 md:pb-2">
            <div className="text-right">
              <div className="display-upright text-4xl text-white">4.9</div>
              <div className="flex gap-0.5 justify-end mt-0.5">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#E8FF00] text-xs">★</span>)}
              </div>
              <div className="text-[#555] text-xs mt-0.5">500+ reviews</div>
            </div>
          </div>
        </div>

        {/* Scroll row on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar md:grid md:grid-cols-3 md:overflow-visible stagger-children snap-x snap-mandatory">
          {reviews.map((r) => (
            <div key={r.name}
              className="surface-hover flex-shrink-0 w-[280px] sm:w-[320px] md:w-auto p-6 flex flex-col gap-4 snap-center">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#E8FF00] text-xs">★</span>)}
              </div>
              {/* Quote */}
              <p className="text-[#888] text-sm leading-relaxed flex-1">"{r.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}30` }}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{r.name}</div>
                  <div className="text-[#555] text-xs">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
