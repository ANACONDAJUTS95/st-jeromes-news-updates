import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const categories = ["Academics", "Campus Life", "Alumni", "Research", "Events"];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          {/* Section Header */}
          <div className="pb-10 md:pb-12 mb-12 md:mb-16">
            <p className="text-label-caps text-secondary mb-4">The Newsroom</p>
            <h1 className="text-display-md mb-8 md:mb-10">
              Latest Dispatches<span className="text-gold opacity-60">.</span>
            </h1>

            <nav className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="text-label-sm hover:text-primary transition-colors cursor-pointer py-2"
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Featured Story */}
            <div className="lg:col-span-8 space-y-12 md:space-y-16">
              <Link href="/news/a-billion-byte-gift" className="group cursor-pointer block">
                <div className="relative aspect-[16/9] bg-surface rounded-sm overflow-hidden mb-6 md:mb-8 shadow-academic">
                  <Image
                    src="/next.svg"
                    alt="News Hero"
                    fill
                    className="object-contain p-12 md:p-20 opacity-20 group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-label-caps text-secondary">Breaking &bull; The Jerome Initiative</span>
                    <span className="text-label-sm">Oct 21</span>
                  </div>
                  <h3 className="text-headline-lg group-hover:text-gold transition-colors">
                    A Billion-Byte Gift for the Future of Memory
                  </h3>
                  <p className="text-body-editorial line-clamp-3">
                    The St. Jerome endowment has received its largest single donation to date, aimed specifically at the Alexandria Protocol. This initiative represents more than just storage; it is a commitment to the preservation of our collective academic soul.
                  </p>
                  <button className="btn-minimal mt-4">Read Full Briefing</button>
                </div>
              </Link>

              <div className="section-spacer" />

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
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-label-sm">Oct {20 - i}</span>
                        <span className="text-label-sm">8 min read</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-40 h-28 bg-surface rounded-sm relative overflow-hidden flex-shrink-0 shadow-academic">
                      <Image src="/window.svg" alt="Thumbnail" fill className="object-contain p-8 opacity-20" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10 md:space-y-12 lg:sticky lg:top-32 lg:h-fit">
              <div className="p-6 md:p-8 bg-surface rounded-sm shadow-academic">
                <h3 className="text-label-caps text-secondary mb-6 md:mb-8">Must Read</h3>
                <div className="space-y-6 md:space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <p className="text-label-sm mb-2">Ranking 0{i}</p>
                      <h5 className="text-base md:text-lg font-serif font-bold group-hover:text-gold transition-colors leading-snug">
                        The Ethics of Digital Immortality: Preserving the Scholar's Voice
                      </h5>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 bg-surface rounded-sm">
                <h3 className="text-label-caps mb-4">Stay Updated</h3>
                <p className="text-sm italic font-serif text-on-surface-muted mb-6">Join the newsletter for the latest protocol dispatches.</p>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-background border-b-2 border-outline py-3 mb-6 focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-muted/30 text-sm"
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
