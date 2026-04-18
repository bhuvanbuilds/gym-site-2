export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-32">
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=80&fit=crop"
          alt="Gym background" className="w-full h-full object-cover opacity-15"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#080808]/60" />
      </div>

      {/* Yellow glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#E8FF00]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center reveal">
        <div className="section-label mb-6 justify-center">Don't Wait</div>

        <h2 className="display text-[clamp(56px,10vw,120px)] text-white leading-none mb-6">
          START YOUR<br />
          FITNESS{" "}
          <span className="text-[#E8FF00]">JOURNEY</span><br />
          TODAY
        </h2>

        <p className="text-[#666] text-lg mb-12 max-w-lg mx-auto">
          Every day you delay is a day further from the version of yourself you want to be. Take the first step — it's completely free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#lead-form" className="btn-cta text-lg py-5 px-10">Book Free Trial →</a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
            className="btn-outline py-5 px-10 border-[#25D366]/30 text-[#25D366] hover:border-[#25D366]/60 hover:bg-[#25D366]/5">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
