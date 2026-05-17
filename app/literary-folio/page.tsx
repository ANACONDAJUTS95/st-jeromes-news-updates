"use client";

import Link from "next/link";
import { useState } from "react";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

const TABS = ["Short Stories", "Poems"] as const;
type Tab = (typeof TABS)[number];

const PLACEHOLDER_STORIES = [
  {
    title: "The Last Lamp on Corrales Street",
    author: "Maria Santos, Grade 11",
    excerpt:
      "The night the power went out on Corrales Street, Lola Nena finally told us the story she had kept folded inside her chest for forty years. We sat on the bamboo bench, the candle between us throwing our shadows long across the wall...",
    readTime: "8 min read",
  },
  {
    title: "Seventeen, in the Rain",
    author: "Rafael Cruz, Grade 10",
    excerpt:
      "Everyone said the rain in CDO came without warning. But I had been watching the sky all morning, waiting for it — the way you wait for a grade to be posted, or for someone to say your name first.",
    readTime: "5 min read",
  },
  {
    title: "What We Leave in the Cafeteria",
    author: "Ana Reyes, Grade 12",
    excerpt:
      "There is a table in the far left corner that nobody sits at during lunch. It used to be ours — mine, Coco's, and Diane's — before Diane transferred to Cebu and Coco stopped eating at school altogether.",
    readTime: "6 min read",
  },
];

const PLACEHOLDER_POEMS = [
  {
    title: "Anatomy of a School Morning",
    author: "James Villanueva, Grade 11",
    lines: [
      "The gate opens at six fifteen —",
      "I am always seven minutes early,",
      "standing in the half-dark with my bag",
      "heavy as a question I can't answer yet.",
      "",
      "The janitor nods. He knows my name.",
      "This is the smallest kindness,",
      "and I carry it all the way to Room 204.",
    ],
  },
  {
    title: "Ode to the School Canteen",
    author: "Chloe Tan, Grade 9",
    lines: [
      "Blessed are the fishballs on a stick,",
      "the plastic cup of powdered juice,",
      "the ten-peso rice that stretches time —",
      "lunch break to last period,",
      "hunger to the jeepney home.",
    ],
  },
  {
    title: "Letter to My Uniform",
    author: "Diego Ramos, Grade 12",
    lines: [
      "You have held me through six years",
      "of assemblies, of heartbreaks,",
      "of medals I pretended not to want.",
      "",
      "You have yellowed at the collar",
      "and I have grown too tall for you.",
      "We are both a little worn, a little proud.",
    ],
  },
];

export default function LiteraryFolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Short Stories");

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">

          {/* ── Page Header ─────────────────────────────────────── */}
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-label-caps text-secondary mb-3">Creative Writing</p>
            <h1 className="text-display-md mb-4">
              Literary Folio
            </h1>
            <p className="text-body-editorial">
              Where Jeromian Voice becomes something quieter — prose and poetry
              from our student writers, unfiltered and unhurried.
            </p>
          </div>

          {/* ── Tab Navigation ───────────────────────────────────── */}
          <div className="flex items-end gap-0 mb-10 md:mb-14"
            style={{ borderBottom: "2px solid rgba(61,36,23,0.9)" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-serif font-bold text-base md:text-lg cursor-pointer transition-all relative ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-on-surface-muted hover:text-primary"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Short Stories Tab ────────────────────────────────── */}
          {activeTab === "Short Stories" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-8 space-y-0">
                {PLACEHOLDER_STORIES.map((story, i) => (
                  <article
                    key={i}
                    className="group py-10 border-b border-outline/25 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="byline mb-2">{story.author}</p>
                        <h2
                          className="font-serif font-bold leading-snug group-hover:text-secondary transition-colors"
                          style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)" }}
                        >
                          {story.title}
                        </h2>
                      </div>
                      <span className="byline shrink-0 pt-1">{story.readTime}</span>
                    </div>

                    <p className="font-serif text-on-surface-muted leading-relaxed line-clamp-3"
                      style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                      {story.excerpt}
                    </p>

                    <p className="text-label-caps text-secondary mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Full Story →
                    </p>
                  </article>
                ))}

                <p className="text-label-sm text-center py-10" style={{ color: "rgba(122,92,71,0.5)" }}>
                  More stories will appear as submissions are accepted.
                </p>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20 lg:h-fit">
                <div className="p-6 bg-primary rounded-sm">
                  <p className="font-sans font-bold uppercase tracking-[0.14em] mb-3"
                    style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.5)" }}>
                    Submit Your Work
                  </p>
                  <p className="font-serif font-bold text-base leading-snug mb-4"
                    style={{ color: "#faf6ed" }}>
                    Are you a Jeromian writer? The Literary Folio is open for submissions.
                  </p>
                  <Link
                    href="/about"
                    className="font-sans font-bold uppercase tracking-widest transition-colors"
                    style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.6)" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#faf6ed")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "rgba(250,246,237,0.6)")}
                  >
                    Contact the Editors →
                  </Link>
                </div>

                <div>
                  <p className="text-label-caps mb-5">Browse Sections</p>
                  {(["News", "Sports", "Sci-Tech", "Editorial", "Opinion", "Feature"] as const).map((s) => (
                    <Link
                      key={s}
                      href={`/sections/${s.toLowerCase().replace("-", "-")}`}
                      className="flex items-center justify-between py-3 border-b border-outline/20 group last:border-0"
                    >
                      <span className="font-serif font-bold text-sm group-hover:text-secondary transition-colors">{s}</span>
                      <span className="text-secondary text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* ── Poems Tab ────────────────────────────────────────── */}
          {activeTab === "Poems" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-8 space-y-0">
                {PLACEHOLDER_POEMS.map((poem, i) => (
                  <article
                    key={i}
                    className="group py-10 md:py-12 border-b border-outline/25 last:border-0"
                  >
                    <p className="byline mb-3">{poem.author}</p>
                    <h2
                      className="font-serif font-bold mb-7 group-hover:text-secondary transition-colors"
                      style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
                    >
                      {poem.title}
                    </h2>

                    {/* Poem body */}
                    <div className="font-serif leading-[1.9] text-on-surface"
                      style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)" }}>
                      {poem.lines.map((line, j) =>
                        line === "" ? (
                          <br key={j} />
                        ) : (
                          <p key={j}>{line}</p>
                        )
                      )}
                    </div>
                  </article>
                ))}

                <p className="text-label-sm text-center py-10" style={{ color: "rgba(122,92,71,0.5)" }}>
                  More poems will appear as submissions are accepted.
                </p>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20 lg:h-fit">
                <div className="p-6 bg-primary rounded-sm">
                  <p className="font-sans font-bold uppercase tracking-[0.14em] mb-3"
                    style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.5)" }}>
                    Submit Your Work
                  </p>
                  <p className="font-serif font-bold text-base leading-snug mb-4"
                    style={{ color: "#faf6ed" }}>
                    Share your poetry with the Jeromian community.
                  </p>
                  <Link
                    href="/about"
                    className="font-sans font-bold uppercase tracking-widest transition-colors"
                    style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.6)" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#faf6ed")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "rgba(250,246,237,0.6)")}
                  >
                    Contact the Editors →
                  </Link>
                </div>
              </aside>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
