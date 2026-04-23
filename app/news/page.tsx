import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function NewsPage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  const categories = ["Academics", "Campus Life", "Alumni", "Research", "Events"];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          {/* Section Header */}
          <div className="pb-10 md:pb-12 mb-12 md:mb-16">
            <p className="text-label-caps text-secondary mb-4">The Newsroom</p>
            <h1 className="text-display-md mb-8 md:mb-10">
              Latest Dispatches<span className="text-gold opacity-60">.</span>
            </h1>

            <nav className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="text-label-sm hover:text-primary transition-colors cursor-pointer py-2"
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Featured Story */}
            <div className="lg:col-span-8 space-y-12 md:space-y-16">
              {featured ? (
                <Link href={`/news/${featured.slug}`} className="group cursor-pointer block">
                  <div className="relative aspect-[16/9] bg-surface rounded-sm overflow-hidden mb-6 md:mb-8 shadow-academic">
                    <Image
                      src={featured.image || "/next.svg"}
                      alt={featured.title}
                      fill
                      className="object-contain p-12 md:p-20 opacity-20 group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-label-caps text-secondary">{featured.category || "News"}</span>
                      <span className="text-label-sm">{new Date(featured.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <h3 className="text-headline-lg group-hover:text-gold transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-body-editorial line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <button className="btn-minimal mt-4">Read Full Briefing</button>
                  </div>
                </Link>
              ) : (
                <div className="bg-surface rounded-sm p-8 md:p-12 text-center">
                  <p className="text-label-caps text-secondary mb-4">No articles yet</p>
                  <p className="text-body-editorial">Articles will appear here once the sync pipeline is activated. Follow the SETUP.md guide to get started.</p>
                </div>
              )}

              <div className="section-spacer" />

              <div className="space-y-2">
                {rest.map((article, i) => (
                  <Link href={`/news/${article.slug}`} key={article.id} className="article-card block">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-container flex-shrink-0" />
                        <span className="text-label-sm text-secondary">{article.category || "General"} &bull; Dispatch {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h4 className="text-lg md:text-2xl font-serif font-bold hover:text-gold transition-colors leading-tight">
                        {article.title}
                      </h4>
                      <p className="text-on-surface-muted text-sm line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-label-sm">{new Date(article.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-40 h-28 bg-surface rounded-sm relative overflow-hidden flex-shrink-0 shadow-academic">
                      <Image src={article.image || "/window.svg"} alt={article.title} fill className="object-contain p-8 opacity-20" />
                    </div>
                  </Link>
                ))}

                {rest.length === 0 && featured && (
                  <p className="text-label-sm text-center py-8">More articles will appear here after the next sync.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10 md:space-y-12 lg:sticky lg:top-32 lg:h-fit">
              <div className="p-6 md:p-8 bg-surface rounded-sm shadow-academic">
                <h3 className="text-label-caps text-secondary mb-6 md:mb-8">Must Read</h3>
                <div className="space-y-6 md:space-y-8">
                  {articles.slice(0, 3).map((article, i) => (
                    <div key={article.id} className="group cursor-pointer">
                      <p className="text-label-sm mb-2">Ranking {String(i + 1).padStart(2, "0")}</p>
                      <Link href={`/news/${article.slug}`}>
                        <h5 className="text-base md:text-lg font-serif font-bold group-hover:text-gold transition-colors leading-snug">
                          {article.title}
                        </h5>
                      </Link>
                    </div>
                  ))}
                  {articles.length === 0 && (
                    <p className="text-label-sm">No articles available yet.</p>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8 bg-surface rounded-sm">
                <h3 className="text-label-caps mb-4">Stay Updated</h3>
                <p className="text-sm italic font-serif text-on-surface-muted mb-6">Join the newsletter for the latest protocol dispatches.</p>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-background border-b-2 border-outline py-3 mb-6 focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-muted/30 text-sm"
                />
                <button className="btn-minimal w-full text-xs">
                  Subscribe
                </button>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
