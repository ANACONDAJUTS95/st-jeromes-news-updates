import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function SpotlightPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Masthead />
      
      <main className="flex-1 pt-24 md:pt-32 pb-32">
        <div className="container-tight">
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Profile Side */}
              <div className="lg:col-span-5 sticky top-32">
                <div className="aspect-[3/4] relative bg-surface-container rounded-sm shadow-academic overflow-hidden group">
                  <Image 
                    src="/globe.svg" 
                    alt="Student Profile" 
                    fill 
                    className="object-contain p-20 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute bottom-12 left-12 right-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">Class of &apos;27</p>
                    <h3 className="text-4xl font-serif font-bold text-primary">Julian Thorne</h3>
                    <p className="italic text-on-surface-muted font-serif text-lg mt-1">Digital Archaeology Major</p>
                  </div>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="lg:col-span-7 space-y-16 pt-8">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">The Scholar Spotlight</p>
                  <h2 className="text-display-md leading-tight">The Future of Memory<span className="text-secondary opacity-30">.</span></h2>
                  <div className="no-line-divider opacity-30" />
                </div>

                <div className="space-y-8 text-body-editorial">
                  <p>
                    In the quiet corners of the Scriptorium, Julian Thorne spends his days translating discarded hard drives into searchable historical narratives. &quot;We&apos;re not just saving data,&quot; he explains, &quot;we&apos;re saving the human textures that were once considered noise.&quot;
                  </p>
                  
                  <blockquote className="border-l-2 border-secondary pl-8 py-2 italic text-2xl text-primary font-serif">
                    &quot;The archives are alive. Every time someone accesses a file, they&apos;re performing a small act of resurrection.&quot;
                  </blockquote>

                  <p>
                    Thorne&apos;s work has recently gained international attention for the reconstruction of the &apos;Alexandria Protocol&apos;—a set of early internet governance documents that were previously thought lost to bit-rot.
                  </p>

                  <h3 className="text-2xl font-serif font-bold text-primary pt-8">The Restoration Process</h3>
                  <p>
                    The process is meticulous. It involves physical hardware cleaning followed by specialized bit-level forensic analysis. For Julian, it&apos;s a form of devotion. &quot;I see myself as a translator between the past&apos;s obsolescence and the future&apos;s hunger for context.&quot;
                  </p>

                  <div className="space-y-4 pt-12">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Research Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Bit-rot Mitigation", "Legacy Systems", "Metadata Forensics"].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-surface-container text-[10px] font-bold uppercase tracking-tighter rounded-full border border-primary/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-12 border-t border-primary/5">
                    <div className="flex flex-wrap gap-6">
                      <Link href="/news/a-billion-byte-gift" className="btn-minimal">Full Interview Transcript</Link>
                      <button className="btn-outline">View Portfolio</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Spotlights */}
          <section className="pt-32 border-t border-primary/5">
            <div className="flex justify-between items-end mb-16">
              <h3 className="text-display-md text-primary">Notable Scholars<span className="text-secondary opacity-30">.</span></h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2 cursor-pointer hover:text-primary transition-colors">View All Spotlights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Elena Rossi", year: "26", topic: "Ancient Audio", icon: "/file.svg" },
                { name: "Marcus Chen", year: "28", topic: "Visual Ephemera", icon: "/window.svg" },
                { name: "Sarah Jenkins", year: "25", topic: "Paper Restoration", icon: "/next.svg" }
              ].map((scholar, i) => (
                <Link href="/news/a-billion-byte-gift" key={i} className="group cursor-pointer space-y-6 block">
                  <div className="aspect-[4/5] relative bg-surface-container rounded-sm overflow-hidden shadow-academic group-hover:shadow-academic-hover transition-all duration-500">
                    <Image src={scholar.icon} alt={scholar.name} fill className="object-contain p-12 opacity-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Class of &apos;{scholar.year}</p>
                    <h4 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{scholar.name}</h4>
                    <p className="text-[10px] text-on-surface-muted uppercase font-bold tracking-tighter italic">{scholar.topic}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
