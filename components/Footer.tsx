export default function Footer() {
  return (
    <footer className="bg-primary text-white py-32 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-6 space-y-12">
            <h2 className="text-display-md text-white">
              ST. JEROME<span className="text-cta">.</span>
            </h2>
            <p className="text-2xl text-white/50 font-serif italic max-w-lg">
              The Digital Curator for Scholarly Archives & Historical Preservation.
            </p>
            <div className="flex gap-4">
              <input 
                type="email" 
                placeholder="Join the protocol..." 
                className="bg-white/5 border border-white/10 px-6 py-4 rounded-lg flex-1 focus:outline-none focus:border-cta transition-colors text-white placeholder:text-white/20"
              />
              <button className="btn-primary">
                Join
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-label-md text-cta">Archives</h4>
              <ul className="space-y-4 text-white/40">
                <li className="hover:text-white transition-colors cursor-pointer">Manuscripts</li>
                <li className="hover:text-white transition-colors cursor-pointer">Periodicals</li>
                <li className="hover:text-white transition-colors cursor-pointer">Audio Logs</li>
                <li className="hover:text-white transition-colors cursor-pointer">Photography</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-label-md text-cta">Platform</h4>
              <ul className="space-y-4 text-white/40">
                <li className="hover:text-white transition-colors cursor-pointer">Research</li>
                <li className="hover:text-white transition-colors cursor-pointer">Briefings</li>
                <li className="hover:text-white transition-colors cursor-pointer">Spotlight</li>
                <li className="hover:text-white transition-colors cursor-pointer">Events</li>
              </ul>
            </div>
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-label-md text-cta">Jerome&apos;s</h4>
              <ul className="space-y-4 text-white/40">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Donations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20">
          <p className="text-label-md">© 2026 St. Jerome&apos;s News Updates. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="text-label-md hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="text-label-md hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
