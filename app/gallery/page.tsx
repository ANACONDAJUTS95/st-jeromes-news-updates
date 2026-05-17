import Image from "next/image";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getAllArticles } from "@/lib/articles";

const SECTION_FILTERS = ["All", "News", "Sports", "Sci-Tech", "Editorial", "Opinion", "Feature"] as const;

export default async function GalleryPage() {
  const allArticles = await getAllArticles();
  const articlesWithImages = allArticles.filter((a) => !!a.image);

  // Group articles by category for display
  const grouped = articlesWithImages.reduce<Record<string, typeof articlesWithImages>>(
    (acc, article) => {
      const cat = article.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(article);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">

          {/* ── Page Header ─────────────────────────────────────── */}
          <div className="mb-12 md:mb-16">
            <p className="text-label-caps text-secondary mb-3">Visual Archive</p>
            <h1 className="text-display-md mb-4">Gallery</h1>
            <p className="text-body-editorial max-w-2xl mb-6">
              Photography and visuals from across all sections of Jeromian Voice —
              the moments that defined our stories.
            </p>
            <div className="rule-gold" />
          </div>

          {articlesWithImages.length === 0 ? (
            /* ── Empty State ──────────────────────────────────────── */
            <div className="py-24 md:py-32 text-center max-w-lg mx-auto">
              <p className="text-label-caps text-secondary mb-4">No photos yet</p>
              <h2 className="text-headline-md mb-4">
                Photos will appear here as articles are published.
              </h2>
              <p className="text-body-editorial mb-8">
                The gallery pulls images directly from published articles across
                all sections. Sync the content pipeline to populate it.
              </p>
              <Link href="/" className="btn-minimal">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              {/* ── Stats strip ──────────────────────────────────── */}
              <div className="flex items-center gap-8 mb-10 md:mb-14 flex-wrap">
                <div>
                  <p className="text-label-caps text-secondary mb-1">Total Photos</p>
                  <p className="font-serif font-black text-3xl text-primary">
                    {articlesWithImages.length}
                  </p>
                </div>
                <div className="w-px h-10 bg-outline/30" />
                <div>
                  <p className="text-label-caps text-secondary mb-1">Sections</p>
                  <p className="font-serif font-black text-3xl text-primary">
                    {Object.keys(grouped).length}
                  </p>
                </div>
                <div className="w-px h-10 bg-outline/30" />
                <div>
                  <p className="text-label-caps text-secondary mb-1">Latest</p>
                  <p className="font-serif font-bold text-base text-primary">
                    {new Date(articlesWithImages[0].timestamp).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* ── Section-grouped gallery ───────────────────────── */}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-14 md:mb-20">
                  {/* Section label */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-label-caps text-secondary whitespace-nowrap">{category}</h2>
                    <div className="rule-gold flex-1" />
                    <span className="byline shrink-0">{items.length} photo{items.length !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Masonry-style grid using CSS columns */}
                  <div
                    className="gap-3"
                    style={{
                      columnCount: 3,
                      columnGap: "0.75rem",
                    }}
                  >
                    {items.map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="group block mb-3 break-inside-avoid rounded-sm overflow-hidden shadow-academic relative"
                        style={{ breakInside: "avoid" }}
                      >
                        <div className="relative w-full overflow-hidden"
                          style={{ paddingBottom: "66.67%" }}>
                          <Image
                            src={article.image!}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 opacity-90"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-300 flex items-end">
                            <div className="p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <span className="section-tag mb-2 block w-fit">
                                {article.category || "General"}
                              </span>
                              <p className="font-serif font-bold text-surface text-xs md:text-sm leading-snug line-clamp-2">
                                {article.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
