import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function SpotlightPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          <section className="mb-16 md:mb-24 lg:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Profile Side */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <div className="aspect-[3/4] relative bg-surface-container rounded-sm shadow-academic overflow-hidden group">
                  <Image
                    src="/globe.svg"
                    alt="Student Profile"
                    fill
                    className="object-contain p-12 md:p-20 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12 md:right-12">
                    <p className="text-label-caps text-secondary mb-2">Class of '27</p>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary">Julian Thorne</h3>
                    <p className="italic text-on-surface-muted font-serif text-base md:text-lg mt-1">Digital Archaeology Major</p>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:col-span-7 space-y-12 md:space-y-16 pt-0 lg:pt-8">
                <div className="space-y-4 md:space-y-6">
                  <p className="text-label-caps text-secondary">The Scholar Spotlight</p>
                  <h2 className="text-display-md leading-tight">The Future of Memory<span className="text-gold opacity-60">.</span></h2>
                </div>

                <div className="space-y-6 md:space-y-8 text-body-editorial">
                  <p>
                    In the quiet corners of the Scriptorium, Julian Thorne spends his days translating discarded hard drives into searchable historical narratives. "We're not just saving data," he explains, "we're saving the human textures that were once considered noise."
                  </p>

                  <blockquote className="border-l-2 border-gold pl-6 md:pl-8 py-2 italic text-xl md:text-2xl text-primary font-serif">
                    "The archives are alive. Every time someone accesses a file, they're performing a small act of resurrection."
                  </blockquote>

                  <p>
                    Thorne's work has recently gained international attention for the reconstruction of the 'Alexandria Protocol'&mdash;a set of early internet governance documents that were previously thought lost to bit-rot.
                  </p>

                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary pt-4 md:pt-8">The Restoration Process</h3>
                  <p>
                    The process is meticulous. It involves physical hardware cleaning followed by specialized bit-level forensic analysis. For Julian, it's a form of devotion. "I see myself as a translator between the past's obsolescence and the future's hunger for context."
                  </p>

                  <div className="space-y-4 pt-6 md:pt-12">
                    <h4 className="text-label-caps text-primary">Research Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Bit-rot Mitigation", "Legacy Systems", "Metadata Forensics"].map(tag => (
                        <span key={tag} className="px-3 py-2 bg-surface-container text-label-sm rounded-sm border border-outline min-h-[44px] flex items-center">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 md:pt-12">
                    <div className="flex flex-wrap gap-4">
                      <Link href="/news/a-billion-byte-gift" className="btn-minimal">Full Interview Transcript</Link>
                      <button className="btn-outline">View Portfolio</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Spotlights */}
          <section className="pt-16 md:pt-24 lg:pt-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 md:mb-16">
              <h3 className="text-display-md text-primary">Notable Scholars<span className="text-gold opacity-60">.</span></h3>
              <p className="text-label-caps text-secondary cursor-pointer hover:text-primary transition-colors">View All Spotlights</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { name: "Elena Rossi", year: "26", topic: "Ancient Audio", icon: "/file.svg" },
                { name: "Marcus Chen", year: "28", topic: "Visual Ephemera", icon: "/window.svg" },
                { name: "Sarah Jenkins", year: "25", topic: "Paper Restoration", icon: "/next.svg" }
              ].map((scholar, i) => (
                <Link href="/news/a-billion-byte-gift" key={i} className="group cursor-pointer space-y-4 md:space-y-6 block">
                  <div className="aspect-[4/5] relative bg-surface-container rounded-sm overflow-hidden shadow-academic group-hover:shadow-academic-hover transition-all duration-500">
                    <Image src={scholar.icon} alt={scholar.name} fill className="object-contain p-10 md:p-12 opacity-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-label-caps text-secondary">Class of '{scholar.year}</p>
                    <h4 className="text-lg md:text-xl font-serif font-bold group-hover:text-gold transition-colors">{scholar.name}</h4>
                    <p className="text-label-sm italic">{scholar.topic}</p>
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
