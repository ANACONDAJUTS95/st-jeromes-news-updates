"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

interface Section {
  href: string;
  slug: string;
  title: string;
  label: string;
  blurb: string;
}

export default function SectionsCarousel({ sections }: { sections: Section[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    el?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 1 : 260;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mb-14 md:mb-20">
      <div className="container-tight">

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-label-caps text-secondary whitespace-nowrap">Explore Sections</h2>
          <div className="rule-gold flex-1" />
        </div>

        {/* Carousel */}
        <div className="relative">

          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous sections"
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface border border-outline-variant shadow-academic flex items-center justify-center text-primary transition-all duration-200 ${
              canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next sections"
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface border border-outline-variant shadow-academic flex items-center justify-center text-primary transition-all duration-200 ${
              canRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 11.78a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Track — overflow-hidden clips the peeking next card */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex overflow-x-auto scrollbar-none"
              style={{ gap: "1px", background: "rgba(61, 36, 23, 0.1)", scrollSnapType: "x mandatory" }}
            >
              {sections.map((section) => (
                <Link
                  key={section.slug}
                  href={section.href}
                  className="group bg-background hover:bg-surface-container-lowest transition-colors p-5 md:p-6 block shrink-0"
                  style={{ width: "clamp(200px, 28vw, 260px)", scrollSnapAlign: "start" }}
                >
                  <p className="text-label-caps text-secondary mb-2 group-hover:text-primary transition-colors">
                    {section.label}
                  </p>
                  <h3 className="font-serif font-black text-primary text-lg md:text-xl mb-2 group-hover:text-secondary transition-colors">
                    {section.title}
                  </h3>
                  <p className="font-sans text-on-surface-muted leading-relaxed" style={{ fontSize: "0.7rem" }}>
                    {section.blurb}
                  </p>
                  <p className="text-label-caps text-secondary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read →
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Fade hint — right edge */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-12 pointer-events-none transition-opacity duration-300 ${canRight ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to right, transparent, var(--color-background))" }}
          />

        </div>
      </div>
    </section>
  );
}
