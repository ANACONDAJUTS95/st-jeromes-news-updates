"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Masthead() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface/90 backdrop-blur-md ${
        isScrolled ? "border-b border-primary/5 shadow-academic" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tighter text-primary">
            Jeromian<span className="text-secondary opacity-30">.</span>
          </h1>
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">
            <Link href="/archives" className="hover:text-primary transition-colors">Archive</Link>
            <Link href="/news" className="hover:text-primary transition-colors">News</Link>
            <Link href="/spotlight" className="hover:text-primary transition-colors">Spotlight</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-muted hover:text-primary transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            <button className="btn-minimal text-xs py-1.5 px-4">
              Subscribe
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
