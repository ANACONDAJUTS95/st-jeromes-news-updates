"use client";

import { useState, useEffect } from "react";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { 
  Type, 
  Sun, 
  Moon, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  Settings2,
  AlignCenter,
  AlignLeft,
  X
} from "lucide-react";

export default function ArticlePage() {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [fontSize, setFontSize] = useState(18); // px
  const [theme, setTheme] = useState<"parchment" | "dark" | "contrast">("parchment");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [showSettings, setShowSettings] = useState(false);

  // Toggle body scroll and classes for reading mode
  useEffect(() => {
    if (isReadingMode) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isReadingMode]);

  const article = {
    title: "A Billion-Byte Gift for the Future of Memory",
    subtitle: "The St. Jerome Initiative receives record endowment to accelerate the Alexandria Protocol.",
    author: "Silas Vane",
    date: "Oct 21, 2026",
    readingTime: "12 min read",
    category: "The Jerome Initiative",
    image: "/next.svg",
    content: [
      "In a landmark move that has reverberated across the academic landscape, the St. Jerome Scriptorium has announced its largest single endowment to date: a multi-million byte contribution dedicated specifically to the advancement of the Alexandria Protocol.",
      "The gift, donated by an anonymous coalition of alumni and technology historians, aims to address the critical challenge of 'bit-rot'—the gradual decay of digital information that threatens to erase nearly three decades of cultural and scientific progress.",
      "The Alexandria Protocol, established in 2021, was originally conceived as a niche effort to preserve legacy campus networks. However, under the leadership of current curators, it has evolved into a global standard for metadata forensics and hardware-level restoration.",
      "'This isn't just about storage,' says head curator Dr. Helena Vance. 'It's about the preservation of the human texture. When we lose a digital file, we don't just lose data; we lose the idiosyncrasies of the era that produced it.'",
      "The new funding will be directed toward three primary sectors: the expansion of the Scriptorium's forensic laboratory, the recruitment of 'digital paleographers' specialized in early 90s storage media, and the public release of the Protocol's restoration tools.",
      "For the students and faculty at St. Jerome, the news is a validation of their unique focus on 'Digital Archaeology.' In an age where most institutions are obsessed with the 'next big thing,' the Jerome community has found its purpose in the 'next old thing.'",
      "As part of the initiative, the Scriptorium will also launch a public outreach program, inviting the global community to submit their own 'digital fossils' for analysis and potential inclusion in the Great Archive."
    ]
  };

  const themeClasses = {
    parchment: "bg-surface text-primary selection:bg-secondary/20",
    dark: "bg-[#1a1a1a] text-[#dcdcdc] selection:bg-orange-500/30",
    contrast: "bg-black text-white selection:bg-yellow-400/50"
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isReadingMode ? themeClasses[theme] : "bg-background"}`}>
      {!isReadingMode && <Masthead />}

      <main className={`flex-1 ${isReadingMode ? "pt-0" : "pt-24 md:pt-32 pb-32"}`}>
        
        {/* Web View Layout */}
        {!isReadingMode && (
          <div className="container-tight">
            <div className="mb-12">
              <Link href="/news" className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-8">
                <ChevronLeft size={14} /> Back to Newsroom
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/5 pb-12">
                <div className="max-w-3xl space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{article.category}</p>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">{article.title}</h1>
                  <p className="text-xl italic font-serif text-on-surface-muted">{article.subtitle}</p>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-on-surface-muted min-w-fit">
                   <button 
                    onClick={() => setIsReadingMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-secondary hover:text-white transition-all rounded-full border border-primary/5 shadow-academic"
                   >
                     <Maximize2 size={12} /> Reading Mode
                   </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                <div className="relative aspect-video bg-surface-muted rounded-sm overflow-hidden shadow-academic">
                  <Image src={article.image} alt={article.title} fill className="object-contain p-20 opacity-10" />
                </div>

                <div className="flex items-center justify-between py-6 border-y border-primary/5">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                        {article.author[0]}
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest">{article.author}</p>
                       <p className="text-[9px] font-bold text-on-surface-muted uppercase">{article.date} • {article.readingTime}</p>
                     </div>
                   </div>
                </div>

                <div className="text-body-editorial space-y-8">
                  {article.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-12 sticky top-32 h-fit">
                <div className="p-8 bg-surface-container/30 rounded-sm border border-primary/5 shadow-academic">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-8">Related Briefs</h3>
                  <div className="space-y-8">
                    {[1, 2].map((i) => (
                      <div key={i} className="group cursor-pointer">
                        <p className="text-[9px] font-black text-on-surface-muted mb-2 uppercase">Protocol Update</p>
                        <h5 className="text-lg font-serif font-bold group-hover:text-secondary transition-all leading-tight">
                          Restoring the '94 Scriptorium Backups: A Progress Report
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Reading Mode Layout */}
        {isReadingMode && (
          <div className="fixed inset-0 z-50 overflow-y-auto pb-40">
            {/* Top Toolbar */}
            <div className={`sticky top-0 w-full z-[60] border-b ${theme === 'dark' ? 'border-white/10 bg-[#1a1a1a]/80' : 'border-primary/5 bg-surface/80'} backdrop-blur-md`}>
              <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                <button 
                  onClick={() => setIsReadingMode(false)}
                  className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <X size={14} /> Close
                </button>

                <div className="flex items-center gap-6">
                  <button onClick={() => setShowSettings(!showSettings)} className="hover:text-secondary transition-colors">
                    <Settings2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className={`max-w-3xl mx-auto px-6 py-24 md:py-32 transition-all duration-500`} style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontWeight: fontWeight }}>
              <div className="mb-16 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary text-center">{article.category}</p>
                <h1 className="text-center font-serif font-bold leading-tight" style={{ fontSize: `${fontSize * 2}px` }}>{article.title}</h1>
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                   <span>{article.author}</span>
                   <span>•</span>
                   <span>{article.date}</span>
                </div>
              </div>

              <article className={`space-y-10 ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
                {article.content.map((p, i) => (
                  <p key={i} className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:mt-2">
                    {p}
                  </p>
                ))}
              </article>
            </div>

            {/* Accessibility Settings Overlay */}
            {showSettings && (
              <div className={`fixed bottom-8 right-8 z-[100] w-72 p-6 rounded-sm border shadow-2xl animate-fade-in-up ${theme === 'dark' ? 'bg-[#2a2a2a] border-white/10' : 'bg-surface border-primary/5'}`}>
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Reading Controls</h4>
                   <button onClick={() => setShowSettings(false)}><X size={14} /></button>
                </div>

                <div className="space-y-8">
                  {/* Font Size */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase opacity-50">
                       <span>Size</span>
                       <span>{fontSize}px</span>
                    </div>
                    <input 
                      type="range" min="14" max="32" step="1" 
                      value={fontSize} 
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full accent-secondary"
                    />
                  </div>

                  {/* Themes */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-bold uppercase opacity-50">Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setTheme("parchment")}
                        className={`h-8 rounded-sm border ${theme === 'parchment' ? 'border-secondary ring-1 ring-secondary' : 'border-primary/10'} bg-surface`} 
                      />
                      <button 
                        onClick={() => setTheme("dark")}
                        className={`h-8 rounded-sm border ${theme === 'dark' ? 'border-secondary ring-1 ring-secondary' : 'border-white/10'} bg-[#1a1a1a]`} 
                      />
                      <button 
                        onClick={() => setTheme("contrast")}
                        className={`h-8 rounded-sm border ${theme === 'contrast' ? 'border-secondary ring-1 ring-secondary' : 'border-white/20'} bg-black`} 
                      />
                    </div>
                  </div>

                  {/* Font Family & Weight */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-bold uppercase opacity-50">Typography</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button 
                        onClick={() => setFontFamily("serif")}
                        className={`py-2 text-xs font-serif rounded-sm border transition-all ${fontFamily === 'serif' ? 'border-secondary bg-secondary/10' : 'border-primary/10'}`}
                      >
                        Serif
                      </button>
                      <button 
                        onClick={() => setFontFamily("sans")}
                        className={`py-2 text-xs font-sans rounded-sm border transition-all ${fontFamily === 'sans' ? 'border-secondary bg-secondary/10' : 'border-primary/10'}`}
                      >
                        Sans
                      </button>
                    </div>
                    <button 
                      onClick={() => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal')}
                      className={`w-full py-2 text-xs font-black rounded-sm border transition-all ${fontWeight === 'bold' ? 'border-secondary bg-secondary/10' : 'border-primary/10'}`}
                    >
                      {fontWeight === 'bold' ? 'Bold Text Active' : 'Normal Weight'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {!isReadingMode && <Footer />}
    </div>
  );
}
