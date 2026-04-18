import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Programs", href: "#programs" },
    { label: "Results", href: "#transformations" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#testimonials" },
  ];

  return (
    <nav className={`nav-glass fixed top-0 left-0 right-0 z-50 ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E8FF00] rounded-sm flex items-center justify-center">
            <span className="text-[#080808] font-black text-xs leading-none">FZ</span>
          </div>
          <span className="display-upright text-white text-xl tracking-wide">FitZone</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href}
              className="text-[#777] hover:text-white text-sm font-medium transition-colors tracking-wide">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/member" className="text-[#777] hover:text-white text-sm transition-colors">Member Login</a>
          <a href="#lead-form" className="btn-cta text-sm py-2.5 px-5">Book Free Trial →</a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-5 h-0.5 bg-white transition-all origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-16 left-0 right-0 bg-[#080808]/90 border-b border-white/[0.07] backdrop-blur-xl transition-all duration-300 origin-top ${menuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"}`}>
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-[#aaa] text-lg font-medium py-1 tracking-wide">
              {l.label}
            </a>
          ))}
          <div className="h-px bg-white/[0.05] my-1" />
          <a href="/member" onClick={() => setMenuOpen(false)} className="text-[#aaa] text-lg font-medium">Member Login</a>
          <a href="#lead-form" className="btn-cta text-center py-4 mt-2" onClick={() => setMenuOpen(false)}>
            Book Free Trial →
          </a>
        </div>
      </div>
    </nav>
  );
}
