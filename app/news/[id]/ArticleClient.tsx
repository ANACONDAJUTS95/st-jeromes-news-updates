"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Maximize2,
  ChevronLeft,
  Settings2,
  X
} from "lucide-react";
import type { Article } from "@/lib/articles";

interface Props {
  article: Article;
}

export default function ArticleClient({ article }: Props) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"parchment" | "dark" | "contrast">("parchment");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isReadingMode) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isReadingMode]);

  const themeClasses = {
    parchment: "bg-background text-primary selection:bg-secondary/20",
    dark: "bg-[#1c120e] text-[#f0e2d0] selection:bg-[#d4884a]/20",
    contrast: "bg-black text-white selection:bg-yellow-400/50"
  };

  const toolbarBorder = theme === "dark" ? "border-white/10" : "border-outline-variant";
  const toolbarBg = theme === "dark" ? "bg-[#1c120e]/80" : "bg-background/80";
  const settingsBg = theme === "dark" ? "bg-[#2a1b15] border-white/10" : "bg-surface border-outline-variant";

  const displayDate = new Date(article.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isReadingMode ? themeClasses[theme] : "bg-background selection:bg-secondary/20 selection:text-primary"}`}>

      <main className={`flex-1 ${isReadingMode ? "pt-0" : "page-padding"}`}>

        {/* Web View Layout */}
        {!isReadingMode && (
          <div className="container-tight">
            <div className="mb-10 md:mb-12">
              <Link href="/news" className="text-label-caps text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 mb-6 md:mb-8 py-2">
                <ChevronLeft size={14} /> Back to Newsroom
              </Link>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 pb-10 md:pb-12">
                <div className="max-w-3xl space-y-4">
                  <p className="text-label-caps text-secondary">{article.category || "News"}</p>
                  <h1 className="text-headline-lg">{article.title}</h1>
                  {article.excerpt && (
                    <p className="text-lg md:text-xl italic font-serif text-on-surface-muted">{article.excerpt}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-label-sm text-on-surface-muted flex-shrink-0">
                  <button
                    onClick={() => setIsReadingMode(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-secondary hover:text-white transition-all rounded-sm border border-outline shadow-academic min-h-[44px] text-primary"
                  >
                    <Maximize2 size={14} /> Reading Mode
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-8 space-y-10 md:space-y-12">
                <div className="relative aspect-video bg-surface rounded-sm overflow-hidden shadow-academic">
                  <Image src={article.image || "/next.svg"} alt={article.title} fill className="object-contain p-12 md:p-20 opacity-20" />
                </div>

                <div className="flex items-center justify-between py-4 md:py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-primary flex-shrink-0 font-bold">
                      {article.title[0]}
                    </div>
                    <div>
                      <p className="text-label-sm">{article.category || "News"}</p>
                      <p className="text-label-sm text-on-surface-muted">{displayDate}</p>
                    </div>
                  </div>
                </div>

                <div className="text-body-editorial space-y-6 md:space-y-8">
                  {article.content.startsWith("<") ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : (
                    article.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
                  )}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-10 md:space-y-12 lg:sticky lg:top-32 lg:h-fit">
                <div className="p-6 md:p-8 bg-surface rounded-sm shadow-academic">
                  <h3 className="text-label-caps text-secondary mb-6 md:mb-8">Related Briefs</h3>
                  <div className="space-y-6 md:space-y-8">
                    {[1, 2].map((i) => (
                      <div key={i} className="group cursor-pointer">
                        <p className="text-label-sm mb-2">Protocol Update</p>
                        <h5 className="text-base md:text-lg font-serif font-bold group-hover:text-gold transition-colors leading-snug">
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
            <div className={`sticky top-0 w-full z-[60] border-b ${toolbarBorder} ${toolbarBg} backdrop-blur-[24px]`}>
              <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <button
                  onClick={() => setIsReadingMode(false)}
                  className="text-label-sm flex items-center gap-2 hover:text-secondary transition-colors py-2"
                >
                  <X size={14} /> Close
                </button>

                <div className="flex items-center gap-4 md:gap-6">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="hover:text-secondary transition-colors p-2"
                    aria-label="Reading settings"
                  >
                    <Settings2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className={`max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 transition-all duration-500`} style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontWeight: fontWeight }}>
              <div className="mb-12 md:mb-16 space-y-4">
                <p className="text-label-caps text-secondary text-center">{article.category || "News"}</p>
                <h1 className="text-center font-serif font-bold leading-tight" style={{ fontSize: `${fontSize * 2}px` }}>{article.title}</h1>
                <div className="flex items-center justify-center gap-4 text-label-sm opacity-50">
                  <span>{displayDate}</span>
                </div>
              </div>

              <article className={`space-y-8 md:space-y-10 ${fontFamily === "serif" ? "font-serif" : "font-sans"}`}>
                {article.content.startsWith("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  article.content.split("\n\n").map((p, i) => (
                    <p key={i} className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:mt-2">
                      {p}
                    </p>
                  ))
                )}
              </article>
            </div>

            {/* Accessibility Settings Panel */}
            {showSettings && (
              <div className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto z-[100] w-auto md:w-72 p-5 md:p-6 rounded-sm border shadow-2xl animate-fade-in ${settingsBg}`}>
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h4 className="text-label-caps">Reading Controls</h4>
                  <button onClick={() => setShowSettings(false)} className="p-1 hover:text-secondary transition-colors" aria-label="Close settings">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-6 md:space-y-8">
                  {/* Font Size */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between text-label-sm opacity-50">
                      <span>Size</span>
                      <span>{fontSize}px</span>
                    </div>
                    <input
                      type="range" min="14" max="32" step="1"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full accent-secondary h-6"
                    />
                  </div>

                  {/* Themes */}
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-label-sm opacity-50">Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme("parchment")}
                        className={`h-10 md:h-8 rounded-sm border ${theme === "parchment" ? "border-secondary ring-1 ring-secondary" : "border-outline-variant"} bg-background`}
                        aria-label="Parchment theme"
                      />
                      <button
                        onClick={() => setTheme("dark")}
                        className={`h-10 md:h-8 rounded-sm border ${theme === "dark" ? "border-secondary ring-1 ring-secondary" : "border-white/10"} bg-[#1c120e]`}
                        aria-label="Dark theme"
                      />
                      <button
                        onClick={() => setTheme("contrast")}
                        className={`h-10 md:h-8 rounded-sm border ${theme === "contrast" ? "border-secondary ring-1 ring-secondary" : "border-white/20"} bg-black`}
                        aria-label="High contrast theme"
                      />
                    </div>
                  </div>

                  {/* Font Family & Weight */}
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-label-sm opacity-50">Typography</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => setFontFamily("serif")}
                        className={`py-2.5 md:py-2 text-xs font-serif rounded-sm border transition-all ${fontFamily === "serif" ? "border-secondary bg-secondary/10" : "border-outline"}`}
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setFontFamily("sans")}
                        className={`py-2.5 md:py-2 text-xs font-sans rounded-sm border transition-all ${fontFamily === "sans" ? "border-secondary bg-secondary/10" : "border-outline"}`}
                      >
                        Sans
                      </button>
                    </div>
                    <button
                      onClick={() => setFontWeight(fontWeight === "normal" ? "bold" : "normal")}
                      className={`w-full py-2.5 md:py-2 text-xs font-black rounded-sm border transition-all ${fontWeight === "bold" ? "border-secondary bg-secondary/10" : "border-outline"}`}
                    >
                      {fontWeight === "bold" ? "Bold Text Active" : "Normal Weight"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
