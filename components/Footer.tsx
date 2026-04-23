export default function Footer() {
  const links = [
    "Help",
    "Status",
    "About",
    "Careers",
    "Press",
    "Blog",
    "Privacy",
    "Terms",
    "Teams",
  ];

  return (
    <footer className="bg-surface-muted/30">
      <div className="section-spacer" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {links.map((label) => (
              <span
                key={label}
                className="text-label-sm hover:text-primary cursor-pointer transition-colors py-2"
              >
                {label}
              </span>
            ))}
          </nav>
          <p className="text-label-sm">
            &copy; 2026 St. Jerome's Jeromian.
          </p>
        </div>
      </div>
    </footer>
  );
}
