import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ArchivesPage() {
  const categories = ["Manuscripts", "Periodicals", "Photography", "Audio Logs", "Digital Ephemera"];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Masthead />
      
      <main className="flex-1 pt-40 md:pt-64 px-6 md:px-12 pb-32">
        <div className="max-w-[1800px] mx-auto">
          <section className="mb-32">
            <div className="max-w-4xl">
              <p className="text-label-md text-cta mb-6 animate-fade-in-up">The Collection</p>
              <h2 className="text-display-md mb-12 animate-reveal">The Archives<span className="text-cta">.</span></h2>
              <div className="relative group max-w-2xl animate-fade-in-up [animation-delay:200ms]">
                <input 
                  type="text" 
                  placeholder="Search the collection protocol..." 
                  className="w-full bg-transparent border-b-2 border-primary/10 px-0 py-8 text-3xl font-serif focus:outline-none focus:border-cta transition-colors placeholder:text-primary/10"
                />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cta scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-500" />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Sidebar - Category Filter */}
            <aside className="lg:col-span-3 space-y-12 animate-fade-in-up [animation-delay:400ms]">
              <div>
                <h3 className="text-label-md mb-8 text-primary">Categories</h3>
                <ul className="space-y-6">
                  {categories.map((cat) => (
                    <li key={cat} className="group cursor-pointer flex items-center justify-between">
                      <span className="text-xl font-serif group-hover:text-cta transition-colors">{cat}</span>
                      <span className="text-xs font-sans text-primary/20 group-hover:text-cta transition-colors">→</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary p-8 rounded-2xl text-white">
                <h4 className="text-label-md text-cta mb-4">Pro Tip</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Use the ID filter to find specific records from the Alexandria Protocol.
                </p>
              </div>
            </aside>

            {/* Catalog Grid */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in-up [animation-delay:600ms]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group bg-white p-10 rounded-2xl border border-outline/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cta/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700" />
                  
                  <div className="flex justify-between items-start mb-12">
                    <p className="text-label-md text-cta">ID: AR-2026-0{i}</p>
                    <div className="w-10 h-10 relative opacity-10 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                      <Image src="/file.svg" alt="File" fill className="object-contain" />
                    </div>
                  </div>
                  
                  <h4 className="text-3xl font-serif mb-6 group-hover:text-cta transition-colors leading-tight">
                    The Alexandria Protocols: Volume {i}
                  </h4>
                  <p className="text-secondary mb-12 line-clamp-3 leading-relaxed">
                    An exhaustive study of the preservation methods used in the second wave of digital recovery efforts.
                  </p>
                  
                  <button className="text-label-md group-hover:tracking-[0.3em] transition-all duration-500">
                    View Full Record
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
