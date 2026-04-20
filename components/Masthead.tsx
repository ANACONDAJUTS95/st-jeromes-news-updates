"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Masthead() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-4 bg-background/80 backdrop-blur-md border-b border-outline/20" 
          : "py-12 bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex flex-col">
          <Link href="/" className="group">
            <h1 className={`font-serif font-black transition-all duration-500 tracking-tighter ${
              isScrolled ? "text-2xl" : "text-4xl md:text-5xl"
            }`}>
              Jeromian Voice<span className="text-cta">.</span>
            </h1>
          </Link>
          {!isScrolled && (
            <p className="text-label-md text-secondary mt-2 animate-fade-in-up">
              {currentDate} • Vol. XIV
            </p>
          )}
        </div>

        <nav className="flex items-center gap-8 md:gap-12">
          <Link href="/archives" className="text-label-md hover:text-cta transition-colors cursor-pointer">Archive</Link>
          <Link href="/news" className="text-label-md hover:text-cta transition-colors cursor-pointer">News</Link>
          <Link href="/spotlight" className="text-label-md hover:text-cta transition-colors cursor-pointer">Spotlight</Link>
          <button className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-cta transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
