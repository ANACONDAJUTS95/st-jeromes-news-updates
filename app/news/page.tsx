import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function NewsPage() {
  const categories = ["Academics", "Campus Life", "Alumni", "Research", "Events"];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Masthead />
      
      <main className="flex-1 pt-40 md:pt-64 px-6 md:px-12 pb-32">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-4xl">
              <p className="text-label-md text-cta mb-6 animate-fade-in-up">Latest Dispatches</p>
              <h2 className="text-display-md animate-reveal">The Newsroom<span className="text-cta">.</span></h2>
            </div>
            <nav className="flex flex-wrap gap-8 animate-fade-in-up [animation-delay:200ms]">
              {categories.map((cat) => (
                <button key={cat} className="text-label-md hover:text-cta transition-colors cursor-pointer relative group">
                  {cat}
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-cta scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              ))}
            </nav>
          </div>

          <section className="space-y-48">
            {/* Main Featured Story */}
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center group">
              <div className="lg:col-span-8 relative aspect-[16/9] bg-primary rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up [animation-delay:400ms]">
                <Image 
                  src="/next.svg" 
                  alt="News Hero" 
                  fill 
                  className="object-contain p-20 opacity-20 group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-label-md text-cta mb-4">Breaking • The Jerome Initiative</p>
                  <h3 className="text-4xl md:text-6xl text-white font-serif leading-tight">A Billion-Byte Gift for the Future of Memory</h3>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-8 animate-fade-in-up [animation-delay:600ms]">
                <p className="text-2xl font-serif italic text-secondary leading-relaxed">
                  &quot;This endowment represents more than just storage; it is a commitment to the preservation of our collective academic soul.&quot;
                </p>
                <div className="h-[2px] w-24 bg-cta" />
                <button className="btn-primary w-full">Read the Briefing</button>
              </div>
            </article>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              <div className="lg:col-span-8 space-y-24">
                {[1, 2, 3].map((i) => (
                  <article key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-12 items-start cursor-pointer">
                    <div className="md:col-span-4 aspect-[4/5] relative bg-white border border-outline/50 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <Image src="/window.svg" alt="Thumbnail" fill className="object-contain p-12 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="md:col-span-8 space-y-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-label-md text-cta">Dispatch 0{i}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        <span className="text-label-md text-secondary">Research</span>
                      </div>
                      <h4 className="text-4xl font-serif group-hover:text-cta transition-colors leading-tight">
                        Uncovering the Lost Sermons of St. Jerome&apos;s First Dean
                      </h4>
                      <p className="text-xl text-secondary leading-relaxed line-clamp-3">
                        New restorative techniques have allowed scholars to access previously 
                        unreadable wax cylinders containing over 40 hours of lost audio...
                      </p>
                      <button className="text-label-md flex items-center gap-2 group/btn">
                        Learn More 
                        <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-16">
                <div className="bg-white p-12 rounded-3xl border border-outline shadow-academic">
                  <h3 className="text-label-md text-cta mb-12">Must Read</h3>
                  <div className="space-y-12">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group cursor-pointer">
                        <p className="text-xs font-bold text-primary/30 mb-2">RANKING 0{i}</p>
                        <h5 className="text-2xl font-serif group-hover:text-cta group-hover:italic transition-all leading-tight">
                          The Ethics of Digital Immortality: Preserving the Scholar&apos;s Voice
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-cta p-12 rounded-3xl text-white">
                  <h3 className="text-label-md text-white/50 mb-8">Newsletter</h3>
                  <p className="text-2xl font-serif mb-8 italic">Stay updated on the protocol.</p>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-white/10 border-b border-white/30 py-4 mb-8 focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
                  />
                  <button className="w-full bg-white text-cta font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all">
                    Subscribe
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
