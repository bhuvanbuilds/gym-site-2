export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "₹999",
      period: "/mo",
      desc: "Perfect starting point",
      features: ["Gym access 6AM–10PM", "All basic equipment", "Locker facility", "2 group classes/week", "Diet tip sheet"],
      missing: ["Personal trainer", "Nutrition coaching"],
      featured: false,
    },
    {
      name: "Standard",
      price: "₹1,999",
      period: "/mo",
      desc: "Best value — most popular",
      features: ["24/7 gym access", "All equipment", "Locker + shower", "Unlimited group classes", "Monthly body assessment", "Nutrition coaching", "1 PT session/month"],
      missing: [],
      featured: true,
    },
    {
      name: "Premium",
      price: "₹3,499",
      period: "/mo",
      desc: "Maximum results, full support",
      features: ["Everything in Standard", "4 PT sessions/month", "Custom workout plan", "Custom diet plan", "Weekly progress review", "Supplement guidance", "Priority support 24/7"],
      missing: [],
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4 justify-center">Membership Plans</div>
          <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none mb-4">
            SIMPLE <span className="text-[#E8FF00]">PRICING</span>
          </h2>
          <p className="text-[#666] text-base max-w-md mx-auto">
            No hidden fees. No annual lock-in. Start with a free trial.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 items-start stagger-children">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.featured ? "plan-featured" : "surface"}`}>
              {plan.featured && <div className="badge-featured">Most Popular</div>}

              {/* Plan header */}
              <div className="mb-6 pt-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="display-upright text-xl text-white">{plan.name}</div>
                    <div className="text-[#555] text-xs mt-0.5">{plan.desc}</div>
                  </div>
                  {plan.featured && (
                    <div className="w-2 h-2 rounded-full bg-[#E8FF00] mt-1" />
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className={`display-upright text-5xl ${plan.featured ? "text-[#E8FF00]" : "text-white"}`}>{plan.price}</span>
                  <span className="text-[#555] text-sm">{plan.period}</span>
                </div>
              </div>

              <div className="h-px bg-white/[0.06] mb-5" />

              {/* Features */}
              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#ccc]">
                    <svg className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing?.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#333]">
                    <svg className="w-4 h-4 text-[#333] mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#lead-form" className={`block text-center py-3 rounded-lg text-sm font-semibold transition-all ${
                plan.featured
                  ? "bg-[#E8FF00] text-[#080808] hover:bg-[#f5ff4d]"
                  : "border border-white/10 text-[#aaa] hover:border-white/25 hover:text-white"
              }`}>
                {plan.featured ? "Get Started Free →" : "Choose Plan"}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-[#444] text-xs mt-8">
          All plans include a <span className="text-[#E8FF00]">free 1-day trial</span>. No credit card needed.
        </p>
      </div>
    </section>
  );
}
