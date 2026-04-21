import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const categories = ["Academics", "Campus Life", "Alumni", "Research", "Events"];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Masthead />
      
      <main className="flex-1 pt-24 md:pt-32 pb-32">
        <div className="container-tight">
          {/* Section Header */}
          <div className="border-b border-primary/5 pb-12 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-4">The Newsroom</p>
            <h1 className="text-display-md mb-8">Latest Dispatches<span className="text-secondary opacity-30">.</span></h1>
            
            <nav className="flex flex-wrap gap-x-8 gap-y-4">
              {categories.map((cat) => (
                <button key={cat} className="text-[10px] font-black uppercase tracking-widest text-on-surface-muted hover:text-primary transition-colors cursor-pointer relative group">
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Featured Story */}
            <div className="lg:col-span-8 space-y-16">
              <Link href="/news/a-billion-byte-gift" className="group cursor-pointer block">
                <div className="relative aspect-[16/9] bg-surface-muted/50 rounded-sm overflow-hidden mb-8">
                  <Image 
                    src="/next.svg" 
                    alt="News Hero" 
                    fill 
                    className="object-contain p-20 opacity-10 group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Breaking • The Jerome Initiative</span>
                    <span className="text-on-surface-muted text-[10px] uppercase font-bold">• Oct 21</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold leading-tight group-hover:text-secondary transition-colors">
                    A Billion-Byte Gift for the Future of Memory
                  </h3>
                  <p className="text-body-editorial line-clamp-3">
                    The St. Jerome endowment has received its largest single donation to date, aimed specifically at the Alexandria Protocol. This initiative represents more than just storage; it is a commitment to the preservation of our collective academic soul.
                  </p>
                  <button className="btn-minimal mt-4">Read Full Briefing</button>
                </div>
              </Link>

              <div className="no-line-divider my-16 opacity-30" />

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link href="/news/a-billion-byte-gift" key={i} className="article-card block">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-container" />
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Research • Dispatch 0{i}</span>
                      </div>
                      <h4 className="text-2xl font-serif font-bold hover:text-secondary transition-colors leading-tight">
                        Uncovering the Lost Sermons of St. Jerome&apos;s First Dean
                      </h4>
                      <p className="text-on-surface-muted text-sm line-clamp-2 leading-relaxed">
                        New restorative techniques have allowed scholars to access previously unreadable wax cylinders containing over 40 hours of lost audio from the founding era.
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tighter">Oct {20 - i}</span>
                        <span className="text-[10px] font-bold text-on-surface-muted uppercase tracking-tighter">8 min read</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-40 h-28 bg-surface-muted/30 relative overflow-hidden flex-shrink-0 rounded-sm">
                       <Image src="/window.svg" alt="Thumbnail" fill className="object-contain p-8 opacity-10" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12 sticky top-32 h-fit">
              <div className="p-8 bg-surface-container/30 rounded-sm border border-primary/5 shadow-academic">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-8">Must Read</h3>
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <p className="text-[9px] font-black text-on-surface-muted mb-2 uppercase tracking-tighter">RANKING 0{i}</p>
                      <h5 className="text-lg font-serif font-bold group-hover:text-secondary transition-all leading-snug">
                        The Ethics of Digital Immortality: Preserving the Scholar&apos;s Voice
                      </h5>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-surface-muted/50 rounded-sm border border-primary/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4">Stay Updated</h3>
                <p className="text-sm italic font-serif text-on-surface-muted mb-6">Join the newsletter for the latest protocol dispatches.</p>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-surface border-b border-primary/10 py-3 mb-6 focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-muted/30 text-sm"
                />
                <button className="btn-minimal w-full text-xs">
                  Subscribe
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
