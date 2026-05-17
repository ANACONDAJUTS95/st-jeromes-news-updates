"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sections/news", label: "News" },
  { href: "/sections/sports", label: "Sports" },
  { href: "/sections/sci-tech", label: "Sci-Tech" },
  { href: "/sections/editorial", label: "Editorial" },
  { href: "/sections/opinion", label: "Opinion" },
  { href: "/sections/feature", label: "Feature" },
  { href: "/literary-folio", label: "Literary Folio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export default function Masthead() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          "--masthead-height",
          `${headerRef.current.offsetHeight}px`,
        );
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-background/96 backdrop-blur-2xl shadow-academic"
            : "bg-background"
        }`}
      >
        {/* ── Tier 1: Utility Bar (desktop, collapses on scroll) ─────── */}
        <div
          className={`hidden md:block border-b border-outline/30 overflow-hidden transition-all duration-500 ${
            isScrolled
              ? "max-h-0 opacity-0 pointer-events-none"
              : "max-h-10 opacity-100"
          }`}
        >
          <div className="container-tight flex items-center justify-between h-9">
            <span className="text-label-sm">{today}</span>
            <span className="text-label-sm hidden lg:block">
              St. Jerome&apos;s Academy · Morong, Rizal
            </span>
            <span className="text-label-sm">
              Vol. XII, No. 4 &middot; A.Y. 2025–2026
            </span>
          </div>
        </div>

        {/* ── Tier 2: Wordmark Row (desktop, collapses on scroll) ────── */}
        <div
          className={`hidden md:block border-b border-outline/30 overflow-hidden transition-all duration-500 ${
            isScrolled
              ? "max-h-0 opacity-0 pointer-events-none"
              : "max-h-36 opacity-100"
          }`}
        >
          <div className="py-5 text-center">
            <Link href="/" className="group block">
              <p
                className="font-serif font-black tracking-[-0.04em] text-primary leading-none group-hover:opacity-85 transition-opacity"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
              >
                Jeromian
                <span className="text-gold" style={{ opacity: 0.65 }}>
                  {" "}
                  Voice
                </span>
              </p>
              <p
                className="text-label-sm mt-2"
                style={{ letterSpacing: "0.2em" }}
              >
                The Official Student Publication of St. Jerome&apos;s Academy
              </p>
            </Link>
          </div>
        </div>

        {/* ── Tier 3: Navigation Bar (always visible) ───────────────── */}
        <div className="border-b border-outline/30">
          <div className="container-tight flex items-center h-11 md:h-10 gap-2">
            {/* Mobile wordmark */}
            <Link
              href="/"
              className="font-serif font-black text-primary text-lg tracking-tight md:hidden shrink-0"
            >
              Jeromian
            </Link>

            {/* Desktop compact logo — slides in when scrolled */}
            <Link
              href="/"
              aria-hidden={!isScrolled}
              className={`hidden md:block font-serif font-black text-primary tracking-tight text-sm shrink-0 overflow-hidden transition-all duration-500 ${
                isScrolled
                  ? "opacity-100 max-w-28 mr-3"
                  : "opacity-0 max-w-0 mr-0 pointer-events-none"
              }`}
            >
              Jeromian
            </Link>

            {/* Desktop nav links */}
            <nav
              className="hidden md:flex items-center flex-1 scrollbar-none"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 px-2.5 py-2 font-sans font-bold uppercase whitespace-nowrap transition-colors ${
                    isActive(link.href)
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-muted hover:text-primary"
                  }`}
                  style={{ fontSize: "0.59rem", letterSpacing: "0.1em" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0 ml-auto shrink-0">
              <button
                className="p-2.5 text-on-surface-muted hover:text-primary transition-colors cursor-pointer"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2.5 text-on-surface-muted hover:text-primary transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute right-0 top-0 h-full w-[80vw] max-w-sm bg-surface shadow-academic flex flex-col animate-slide-up">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline/30">
              <div>
                <p
                  className="font-serif font-black text-primary leading-none"
                  style={{ fontSize: "1.3rem" }}
                >
                  Jeromian Voice
                </p>
                <p className="text-label-sm mt-1">St. Jerome&apos;s Academy</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-on-surface-muted hover:text-primary transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-5 py-4 font-serif font-bold text-base border-b border-outline/20 transition-colors ${
                    isActive(link.href)
                      ? "text-secondary bg-surface-muted/60"
                      : "text-primary hover:bg-surface-muted/30"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-secondary text-xs">→</span>
                </Link>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-5 py-4 bg-surface-muted/40 border-t border-outline/30">
              <p className="text-label-sm">{today}</p>
              <p className="text-label-sm mt-1 text-secondary">
                Vol. XII, No. 4
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
