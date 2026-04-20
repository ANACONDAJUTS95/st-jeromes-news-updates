import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function SpotlightPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Masthead />
      
      <main className="flex-1 pt-40 md:pt-64 px-6 md:px-12 pb-32">
        <div className="max-w-[1800px] mx-auto">
          <section className="mb-48">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
              {/* Profile Side */}
              <div className="lg:col-span-5 sticky top-32 animate-fade-in-up">
                <div className="aspect-[3/4] relative bg-primary rounded-[3rem] shadow-2xl overflow-hidden group">
                  <Image 
                    src="/globe.svg" 
                    alt="Student Profile" 
                    fill 
                    className="object-contain p-20 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <p className="text-label-md text-cta mb-2">Class of &apos;27</p>
                    <h3 className="text-4xl font-serif">Julian Thorne</h3>
                    <p className="italic text-white/60 font-serif text-xl mt-2">Digital Archaeology Major</p>
                  </div>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="lg:col-span-7 space-y-16 pt-12">
                <div className="space-y-6">
                  <p className="text-label-md text-cta animate-fade-in-up">The Scholar Spotlight</p>
                  <h2 className="text-display-md animate-reveal leading-none">The Future of Memory<span className="text-cta">.</span></h2>
                </div>
                
                <div className="space-y-12 text-2xl font-sans text-secondary leading-relaxed animate-fade-in-up [animation-delay:400ms]">
                  <p className="first-letter:text-8xl first-letter:font-black first-letter:text-cta first-letter:float-left first-letter:mr-4 first-letter:leading-[0.8]">
                    In the quiet corners of the Scriptorium, Julian Thorne spends his days 
                    translating discarded hard drives into searchable historical narratives. 
                    &quot;We&apos;re not just saving data,&quot; he explains, &quot;we&apos;re saving the human 
                    textures that were once considered noise.&quot;
                  </p>
                  
                  <div className="relative py-12">
                    <div className="absolute top-0 left-0 w-24 h-1 bg-cta" />
                    <blockquote className="text-4xl md:text-5xl font-serif italic text-primary leading-tight">
                      &quot;The archives are alive. Every time someone accesses a file, they&apos;re 
                      performing a small act of resurrection.&quot;
                    </blockquote>
                    <div className="absolute bottom-0 right-0 w-24 h-1 bg-cta" />
                  </div>
                  
                  <p>
                    Thorne&apos;s work has recently gained international attention for the 
                    reconstruction of the &apos;Alexandria Protocol&apos;—a set of early internet 
                    governance documents that were previously thought lost to bit-rot.
                  </p>
                  
                  <h3 className="text-4xl font-serif text-primary pt-12">The Restoration Process</h3>
                  <p>
                    The process is meticulous. It involves physical hardware cleaning followed 
                    by specialized bit-level forensic analysis. For Julian, it&apos;s a form of 
                    devotion. &quot;I see myself as a translator between the past&apos;s obsolescence 
                    and the future&apos;s hunger for context.&quot;
                  </p>
                </div>
                
                <div className="mt-24 pt-16 border-t border-outline/50 flex flex-wrap gap-8 animate-fade-in-up [animation-delay:600ms]">
                  <button className="btn-primary">Full Interview Transcript</button>
                  <button className="btn-secondary">View Research Portfolio</button>
                </div>
              </div>
            </div>
          </section>

          {/* Related Spotlights */}
          <section className="mb-32">
            <div className="flex justify-between items-end mb-16">
              <h3 className="text-display-sm">Other Notable Scholars<span className="text-cta">.</span></h3>
              <p className="text-label-md text-cta mb-2">View All Spotlights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "Elena Rossi", year: "26", topic: "Ancient Audio", icon: "/file.svg" },
                { name: "Marcus Chen", year: "28", topic: "Visual Ephemera", icon: "/window.svg" },
                { name: "Sarah Jenkins", year: "25", topic: "Paper Restoration", icon: "/next.svg" }
              ].map((scholar, i) => (
                <div key={i} className="group card-editorial !p-12">
                  <div className="aspect-square bg-primary/5 rounded-2xl relative mb-8 overflow-hidden">
                    <Image src={scholar.icon} alt={scholar.name} fill className="object-contain p-12 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="text-label-md text-cta mb-2">Class of &apos;{scholar.year}</p>
                  <h4 className="text-3xl font-serif group-hover:text-cta transition-colors leading-tight mb-4">{scholar.name}</h4>
                  <p className="text-secondary italic font-serif">{scholar.topic}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
