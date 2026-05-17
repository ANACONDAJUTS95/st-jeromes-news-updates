import Link from "next/link";

const SECTIONS = [
  { href: "/sections/news", label: "News" },
  { href: "/sections/sports", label: "Sports" },
  { href: "/sections/sci-tech", label: "Sci-Tech" },
  { href: "/sections/editorial", label: "Editorial" },
  { href: "/sections/opinion", label: "Opinion" },
  { href: "/sections/feature", label: "Feature" },
];

const MORE = [
  { href: "/literary-folio", label: "Literary Folio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-surface mt-auto">
      {/* Main footer body */}
      <div className="container-tight py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Publication identity */}
          <div className="md:col-span-1">
            <p
              className="font-serif font-black tracking-tight leading-none mb-3"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#faf6ed" }}
            >
              Jeromian Voice
            </p>
            <p
              className="font-sans font-semibold uppercase tracking-[0.14em] mb-5"
              style={{ fontSize: "0.5625rem", color: "rgba(250,246,237,0.5)" }}
            >
              The Official Student Publication
            </p>
            <p
              className="font-serif text-sm leading-relaxed"
              style={{ color: "rgba(250,246,237,0.65)" }}
            >
              Published by the students of St. Jerome&apos;s Academy, Morong,
              Rizal. Vol. XII, No. 4 &middot; A.Y. 2025–2026.
            </p>
          </div>

          {/* Sections nav */}
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.14em] mb-5"
              style={{ fontSize: "0.5625rem", color: "rgba(250,246,237,0.45)" }}
            >
              Sections
            </p>
            <ul className="space-y-0">
              {SECTIONS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 font-serif font-bold text-sm transition-colors border-b border-surface/10 last:border-0 text-surface/75 hover:text-surface"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.14em] mb-5"
              style={{ fontSize: "0.5625rem", color: "rgba(250,246,237,0.45)" }}
            >
              More
            </p>
            <ul className="space-y-0">
              {MORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 font-serif font-bold text-sm transition-colors border-b border-surface/10 last:border-0 text-surface/75 hover:text-surface"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ borderTop: "1px solid rgba(250,246,237,0.1)" }}>
        <div className="container-tight py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            className="font-sans font-semibold uppercase tracking-widest"
            style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.4)" }}
          >
            &copy; {year} Jeromian Voice &middot; St. Jerome&apos;s Academy
            &middot; All Rights Reserved
          </p>
          <p
            className="font-sans font-semibold uppercase tracking-widest"
            style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.3)" }}
          >
            Built by the Jeromian Web Team
          </p>
        </div>
      </div>
    </footer>
  );
}
