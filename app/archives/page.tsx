import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function ArchivesPage() {
  const categories = ["Manuscripts", "Periodicals", "Photography", "Audio Logs", "Digital Ephemera"];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          <section className="mb-16 md:mb-24">
            <p className="text-label-caps text-secondary mb-4">The Collection</p>
            <h1 className="text-display-md mb-10 md:mb-12">
              The Archives<span className="text-gold opacity-60">.</span>
            </h1>

            <div className="relative group max-w-2xl">
              <input
                type="text"
                placeholder="Search the collection protocol..."
                className="w-full bg-transparent border-b-2 border-outline px-0 py-5 md:py-6 text-xl md:text-2xl font-serif focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-muted/30"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Sidebar - Category Filter */}
            <aside className="lg:col-span-3 space-y-10 md:space-y-12 h-fit">
              <div className="space-y-6">
                <h3 className="text-label-caps text-secondary">Categories</h3>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat} className="group cursor-pointer">
                      <span className="flex items-center justify-between py-3 text-sm font-bold uppercase tracking-tight text-on-surface-muted group-hover:text-primary transition-colors">
                        {cat}
                        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">&rarr;</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-surface-container/50 border-l-2 border-gold rounded-sm">
                <h4 className="text-label-caps mb-2 text-secondary">Curator Tip</h4>
                <p className="text-on-surface-muted text-xs leading-relaxed italic font-serif">
                  Use the ID filter to find specific records from the Alexandria Protocol.
                </p>
              </div>
            </aside>

            {/* Catalog Grid */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link href="/news/a-billion-byte-gift" key={i} className="group p-6 md:p-8 bg-surface rounded-sm shadow-academic hover:shadow-academic-hover transition-all duration-500 cursor-pointer relative overflow-hidden block">
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                    <p className="text-label-caps text-secondary">Record AR-2026-0{i}</p>
                    <div className="w-8 h-8 relative opacity-10 group-hover:opacity-50 group-hover:rotate-12 transition-all duration-500">
                      <Image src="/file.svg" alt="File" fill className="object-contain" />
                    </div>
                  </div>

                  <h4 className="text-xl md:text-2xl font-serif font-bold mb-4 group-hover:text-gold transition-colors leading-tight">
                    The Alexandria Protocols: Volume {i}
                  </h4>
                  <p className="text-on-surface-muted text-sm mb-8 md:mb-12 line-clamp-2 leading-relaxed">
                    An exhaustive study of the preservation methods used in the second wave of digital recovery efforts.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-label-sm text-primary/30">Protocol v1.4</span>
                    <span className="text-label-sm text-secondary group-hover:translate-x-2 transition-transform">
                      View Record
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
