import { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Marquee from "../components/landing/Marquee";
import Programs from "../components/landing/Programs";
import Transformations from "../components/landing/Transformations";
import Pricing from "../components/landing/Pricing";
import LeadForm from "../components/landing/LeadForm";
import Testimonials from "../components/landing/Testimonials";
import Contact from "../components/landing/Contact";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function Index() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .stagger-children")
      .forEach((el) => revealObserver.observe(el));

    // Count-up
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const end = parseInt(el.getAttribute("data-countup") || "0");
          const suffix = el.getAttribute("data-suffix") || "";
          let current = 0;
          const step = end / 60;
          const timer = setInterval(() => {
            current = Math.min(current + step, end);
            el.textContent = Math.floor(current) + suffix;
            if (current >= end) clearInterval(timer);
          }, 16);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-countup]").forEach((el) => countObserver.observe(el));

    return () => { revealObserver.disconnect(); countObserver.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <Hero />
      <Marquee />
      <Programs />
      <Transformations />
      <Pricing />
      <LeadForm />
      <Testimonials />
      <Contact />
      <FinalCTA />
      <Footer />
    </div>
  );
}
