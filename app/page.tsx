import Image from "next/image";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          {/* Hero / Featured Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24 items-start">
            <div className="lg:col-span-8">
              <Link href="/news/a-billion-byte-gift" className="group cursor-pointer block">
                <div className="relative aspect-video bg-surface rounded-sm overflow-hidden mb-6 md:mb-8 shadow-academic">
                  <Image
                    src="/next.svg"
                    alt="Featured Story"
                    fill
                    className="object-contain p-12 md:p-20 opacity-20 group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <p className="text-label-caps text-secondary">Featured dispatch</p>
                  <h3 className="text-headline-lg group-hover:text-gold transition-colors">
                    A Billion-Byte Gift for the Future of Memory
                  </h3>
                  <p className="text-body-editorial line-clamp-3">
                    The St. Jerome endowment has received its largest single donation to date, aimed specifically at the Alexandria Protocol. This initiative represents more than just storage; it is a commitment to the preservation of our collective academic soul.
                  </p>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-4 space-y-8 md:space-y-10">
              <h3 className="text-label-caps pb-4">Staff Picks</h3>
              {[
                { title: "Scriptorium Chronicles", author: "Dr. Alistair Thorne", date: "Oct 19" },
                { title: "The Future of Memory", author: "Elena Vance", date: "Oct 15" },
                { title: "Digital Archaeology in the 21st Century", author: "Julian Graves", date: "Oct 12" }
              ].map((pick, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-surface-container flex-shrink-0" />
                    <span className="text-label-sm">{pick.author}</span>
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-bold group-hover:text-gold transition-colors leading-snug">
                    {pick.title}
                  </h4>
                  <p className="text-label-sm mt-1">{pick.date} &bull; 5 min read</p>
                </div>
              ))}
              <Link href="/news" className="inline-block text-label-caps text-secondary hover:text-primary transition-colors mt-2">
                Full Collection &rarr;
              </Link>
            </div>
          </div>

          <div className="section-spacer" />

          {/* Main Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h3 className="text-label-caps mb-8 md:mb-12">Latest Stories</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Link href="/news/a-billion-byte-gift" key={i} className="article-card block">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-container flex-shrink-0" />
                        <span className="text-label-sm text-secondary">Research &bull; Dispatch 0{i}</span>
                      </div>
                      <h4 className="text-lg md:text-2xl font-serif font-bold hover:text-gold transition-colors leading-tight">
                        Uncovering the Lost Sermons of St. Jerome's First Dean
                      </h4>
                      <p className="text-on-surface-muted text-sm line-clamp-2 leading-relaxed">
                        New restorative techniques have allowed scholars to access previously unreadable wax cylinders containing over 40 hours of lost audio from the founding era.
                      </p>
                    </div>
                    <div className="hidden md:block w-40 h-28 bg-surface rounded-sm relative overflow-hidden flex-shrink-0 shadow-academic">
                      <Image src="/window.svg" alt="Article Thumbnail" fill className="object-contain p-8 opacity-20" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar / Topics */}
            <div className="lg:col-span-4 space-y-10 md:space-y-12 lg:sticky lg:top-32 lg:h-fit">
              <div className="p-6 md:p-8 bg-surface rounded-sm shadow-academic">
                <h4 className="text-label-caps mb-6">Discover More</h4>
                <div className="flex flex-wrap gap-2">
                  {["Technology", "Self", "Preservation", "Archive", "History", "Campus", "Society"].map(topic => (
                    <button key={topic} className="px-4 py-2.5 bg-background border border-outline text-label-sm rounded-sm hover:border-secondary transition-colors cursor-pointer min-h-[44px]">
                      {topic}
                    </button>
                  ))}
                </div>
                <Link href="/news" className="inline-block text-label-caps text-secondary mt-6 hover:text-primary transition-colors">
                  All Topics &rarr;
                </Link>
              </div>

              <div className="space-y-6">
                <h4 className="text-label-caps">Scholars to follow</h4>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-label-sm tracking-tight">Researcher {i}</p>
                        <p className="text-label-sm italic font-normal line-clamp-1">Expert in Digital Archaeology</p>
                      </div>
                    </div>
                    <button className="btn-outline text-[10px] font-black px-3 py-1.5 uppercase tracking-tighter flex-shrink-0">Follow</button>
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
