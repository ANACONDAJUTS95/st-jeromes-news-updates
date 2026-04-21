export default function Footer() {
  return (
    <footer className="bg-surface py-12 border-t border-primary/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-on-surface-muted">
            <span className="hover:text-primary cursor-pointer transition-colors">Help</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Status</span>
            <span className="hover:text-primary cursor-pointer transition-colors">About</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Careers</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Press</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Blog</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Teams</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-muted">© 2026 St. Jerome&apos;s Jeromian.</p>
        </div>
      </div>
    </footer>
  );
}
