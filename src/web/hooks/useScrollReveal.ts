import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal, .stagger-children");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export function useCountUp(target: number, duration = 1500) {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-countup]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const end = parseInt(el.getAttribute("data-countup") || "0");
            const start = 0;
            const range = end - start;
            const increment = end / (duration / 16);
            let current = start;
            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                el.textContent = end + (el.getAttribute("data-suffix") || "");
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(current) + (el.getAttribute("data-suffix") || "");
              }
            }, 16);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
