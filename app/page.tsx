import Image from "next/image";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-cta selection:text-white">
      <Masthead />

      <main className="flex-1 pt-24 md:pt-32 pb-32">
        <div className="container-tight">
          {/* Hero / Featured Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
            <div className="lg:col-span-8">
              <Link href="/news/a-billion-byte-gift" className="group cursor-pointer">
                <div className="relative aspect-video bg-surface-muted/50 rounded-sm overflow-hidden mb-8">
                  <Image 
                    src="/next.svg" 
                    alt="Featured Story" 
                    fill 
                    className="object-contain p-20 opacity-10 group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Featured dispatch</p>
                  <h3 className="text-4xl md:text-6xl font-serif font-bold leading-tight group-hover:text-secondary transition-colors">
                    A Billion-Byte Gift for the Future of Memory
                  </h3>
                  <p className="text-body-editorial line-clamp-3">
                    The St. Jerome endowment has received its largest single donation to date, aimed specifically at the Alexandria Protocol. This initiative represents more than just storage; it is a commitment to the preservation of our collective academic soul.
                  </p>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <h3 className="text-label-caps border-b border-primary/5 pb-4 mb-8">Staff Picks</h3>
              {[
                { title: "Scriptorium Chronicles", author: "Dr. Alistair Thorne", date: "Oct 19" },
                { title: "The Future of Memory", author: "Elena Vance", date: "Oct 15" },
                { title: "Digital Archaeology in the 21st Century", author: "Julian Graves", date: "Oct 12" }
              ].map((pick, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-surface-container" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{pick.author}</span>
                  </div>
                  <h4 className="text-lg font-serif font-bold group-hover:text-secondary transition-colors leading-snug">
                    {pick.title}
                  </h4>
                  <p className="text-[10px] text-on-surface-muted mt-1 uppercase font-bold tracking-tighter">{pick.date} • 5 min read</p>
                </div>
              ))}
              <Link href="/news" className="inline-block text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors mt-4">
                Full Collection →
              </Link>
            </div>
          </div>

          <div className="no-line-divider mb-24 opacity-50" />

          {/* Main Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <h3 className="text-label-caps mb-12">Latest Stories</h3>
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
                    </div>
                    <div className="hidden md:block w-40 h-28 bg-surface-muted/30 relative overflow-hidden flex-shrink-0 rounded-sm">
                       <Image src="/window.svg" alt="Article Thumbnail" fill className="object-contain p-8 opacity-10" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar / Topics */}
            <div className="lg:col-span-4 space-y-12 sticky top-32 h-fit">
              <div className="p-8 bg-surface-muted/50 rounded-sm shadow-academic border border-primary/5">
                <h4 className="text-xs font-black uppercase tracking-widest mb-6">Discover More</h4>
                <div className="flex flex-wrap gap-2">
                  {["Technology", "Self", "Preservation", "Archive", "History", "Campus", "Society"].map(topic => (
                    <button key={topic} className="px-4 py-2 bg-surface border border-primary/5 text-[10px] font-bold uppercase tracking-tighter rounded-full hover:border-secondary transition-colors cursor-pointer">
                      {topic}
                    </button>
                  ))}
                </div>
                <Link href="/news" className="inline-block text-[10px] font-black uppercase tracking-widest text-secondary mt-8 hover:text-primary">
                  All Topics →
                </Link>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-label-caps">Scholars to follow</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-tight">Researcher {i}</p>
                        <p className="text-[10px] text-on-surface-muted line-clamp-1 italic">Expert in Digital Archaeology</p>
                      </div>
                    </div>
                    <button className="btn-outline text-[9px] font-black px-3 py-1 uppercase tracking-tighter">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
