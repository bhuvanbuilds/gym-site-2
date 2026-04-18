export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14 reveal">
          <div className="section-label mb-4">Find Us</div>
          <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none">
            VISIT <span className="text-[#E8FF00]">US</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 stagger-children">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 11a3 3 0 100-6 3 3 0 000 6z" stroke="#E8FF00" strokeWidth="1.5"/>
                  <path d="M10 2a7 7 0 017 7c0 5-7 9-7 9S3 14 3 9a7 7 0 017-7z" stroke="#E8FF00" strokeWidth="1.5"/>
                </svg>
              ),
              label: "Address",
              lines: ["123 Fitness Street, Koramangala", "Bangalore, Karnataka 560034"],
              action: null,
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3h4l2 5-2.5 1.5a11 11 0 005 5L13 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" stroke="#E8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Phone",
              lines: ["+91 98765 43210"],
              action: { label: "💬 WhatsApp us", href: "https://wa.me/919876543210" },
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7.5" stroke="#E8FF00" strokeWidth="1.5"/>
                  <path d="M10 6v4l3 2" stroke="#E8FF00" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              label: "Working Hours",
              lines: ["Mon–Fri: 5:00 AM – 11:00 PM", "Sat: 5:00 AM – 9:00 PM", "Sun: 7:00 AM – 6:00 PM"],
              action: { label: "✦ Premium: 24/7 Access", href: "#pricing", green: true },
            },
          ].map((card) => (
            <div key={card.label} className="surface p-7">
              <div className="w-10 h-10 rounded-lg bg-[#E8FF00]/[0.06] flex items-center justify-center mb-5">
                {card.icon}
              </div>
              <div className="text-[#555] text-xs font-semibold uppercase tracking-widest mb-2">{card.label}</div>
              {card.lines.map((l, i) => (
                <div key={i} className="text-[#ccc] text-sm mb-0.5">{l}</div>
              ))}
              {card.action && (
                <a href={card.action.href}
                  className={`mt-4 inline-block text-xs font-semibold ${(card.action as any).green ? "text-[#22c55e]" : "text-[#E8FF00]"} hover:underline`}>
                  {card.action.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
