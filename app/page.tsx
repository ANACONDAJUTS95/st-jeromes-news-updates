import Image from "next/image";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-cta selection:text-white">
      <Masthead />

      <main className="flex-1 pt-40 md:pt-64">
        {/* Hero Section - Exaggerated Minimalism */}
        <section className="px-6 md:px-12 mb-32 md:mb-64">
          <div className="max-w-[1800px] mx-auto">
            <div className="overflow-hidden mb-8">
              <h1 className="text-display-lg animate-reveal">
                THE<br />ARCHIVE<span className="text-cta">.</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end animate-fade-in-up [animation-delay:400ms]">
              <div className="lg:col-span-5">
                <p className="text-xl md:text-2xl font-sans text-secondary leading-relaxed">
                  Preserving the storied layouts of academia through a modern, 
                  high-contrast lens. Heritage meets the speed of light.
                </p>
              </div>
              <div className="lg:col-span-7 flex justify-end">
                <button className="btn-primary flex items-center gap-4 group">
                  Explore Collection
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-2 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Story - Asymmetric Grid */}
        <section className="px-6 md:px-12 mb-32 md:mb-64">
          <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-7 relative aspect-[16/10] group overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/globe.svg"
                alt="Featured Story"
                fill
                className="object-contain p-24 opacity-10 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute top-12 left-12">
                <span className="bg-cta text-white text-label-md px-4 py-2 rounded-full">Lead Editorial</span>
              </div>
            </div>
            
            <div className="lg:col-span-5 space-y-8 animate-fade-in-up">
              <h2 className="text-display-md">
                Digital Archaeology in the 21st Century
              </h2>
              <p className="text-lg text-secondary leading-relaxed font-sans">
                How St. Jerome is pioneering new methods of digital curation to protect our collective scholarly memory against the threat of bit-rot and obsolescence.
              </p>
              <Link href="/news" className="inline-block text-primary font-bold border-b-2 border-cta pb-1 hover:text-cta transition-colors cursor-pointer">
                Read the full briefing
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Grid Section */}
        <section className="bg-primary text-white py-32 md:py-64 px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <h3 className="text-display-md text-white">Latest Dispatches<span className="text-cta">.</span></h3>
              <p className="text-label-md text-cta mb-4">View All Stories</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: "The Alexandria Protocol", cat: "Research", icon: "/file.svg" },
                { title: "Scriptorium Chronicles", cat: "History", icon: "/window.svg" },
                { title: "The Future of Memory", cat: "Philosophy", icon: "/next.svg" }
              ].map((item, i) => (
                <div key={i} className="group p-10 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-12 h-12 mb-8 relative opacity-50 group-hover:opacity-100 transition-opacity">
                    <Image src={item.icon} alt={item.title} fill className="object-contain" />
                  </div>
                  <p className="text-label-md text-cta mb-4">{item.cat}</p>
                  <h4 className="text-3xl font-serif mb-6 group-hover:text-cta transition-colors">{item.title}</h4>
                  <p className="text-white/60 mb-8 line-clamp-2">Exploring the intersections of historical preservation and modern technology.</p>
                  <div className="h-[1px] w-full bg-white/10 group-hover:bg-cta transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Statement */}
        <section className="py-32 md:py-64 px-6 md:px-12 text-center overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <p className="text-label-md text-cta mb-8">Our Mission</p>
            <h3 className="text-display-md leading-tight italic">
              &quot;We do not store data; we curate the human textures that once was noise.&quot;
            </h3>
            <div className="mt-16 flex justify-center gap-8">
              <Link href="/archives" className="btn-secondary">Explore Catalog</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
