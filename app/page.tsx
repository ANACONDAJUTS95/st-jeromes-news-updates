import Image from "next/image";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import SectionsCarousel from "@/components/SectionsCarousel";
import { getAllArticles } from "@/lib/articles";

const SECTIONS = [
  {
    href: "/sections/news",
    slug: "news",
    title: "News",
    label: "Campus & Beyond",
    blurb: "Dispatches from St. Jerome's and the wider world.",
  },
  {
    href: "/sections/sports",
    slug: "sports",
    title: "Sports",
    label: "On the Field",
    blurb: "Championships, training, and Jeromian athletes.",
  },
  {
    href: "/sections/sci-tech",
    slug: "sci-tech",
    title: "Sci-Tech",
    label: "The Lab",
    blurb: "Science and technology through a student lens.",
  },
  {
    href: "/sections/editorial",
    slug: "editorial",
    title: "Editorial",
    label: "From the Board",
    blurb: "The official stance and voice of Jeromian Voice.",
  },
  {
    href: "/sections/opinion",
    slug: "opinion",
    title: "Opinion",
    label: "The Forum",
    blurb: "Perspectives from students, faculty, and alumni.",
  },
  {
    href: "/sections/feature",
    slug: "feature",
    title: "Feature",
    label: "In Focus",
    blurb: "Long-form stories that go deeper than the headline.",
  },
];

export default async function Home() {
  const articles = await getAllArticles();
  const featured = articles[0];
  const latest = articles.slice(1, 7);
  const galleryArticles = articles.filter((a) => a.image).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">

        {/* ── Welcome Strip ──────────────────────────────────────── */}
        <div className="container-tight mb-10 md:mb-14">
          <div className="flex items-center gap-4">
            <div className="rule-gold flex-1" />
            <p className="text-label-caps text-secondary whitespace-nowrap">
              Welcome, Jeromians &middot; Vol. XII, No. 4
            </p>
            <div className="rule-gold flex-1" />
          </div>
        </div>

        {/* ── Hero: Featured Article ──────────────────────────────── */}
        <section className="container-tight mb-14 md:mb-20">
          {featured ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Text column */}
              <div className="md:col-span-7 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-label-caps text-secondary mb-4">
                    {featured.category || "Featured Dispatch"}
                  </p>
                  <h2 className="text-display-lg mb-5 max-w-2xl">
                    {featured.title}
                  </h2>
                  <p className="text-body-editorial max-w-xl line-clamp-4 mb-6">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                  <Link href={`/news/${featured.slug}`} className="btn-minimal">
                    Read the Story
                  </Link>
                  <span className="byline">
                    {new Date(featured.timestamp).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Image column */}
              <Link
                href={`/news/${featured.slug}`}
                className="group md:col-span-5 block"
              >
                <div className="relative aspect-4/3 md:aspect-3/4 bg-surface-container rounded-sm overflow-hidden shadow-academic">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-serif font-black text-primary"
                        style={{ fontSize: "clamp(4rem, 12vw, 8rem)", opacity: 0.07 }}
                      >
                        JV
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            /* Empty state — no articles yet */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-7">
                <p className="text-label-caps text-secondary mb-4">Welcome to</p>
                <h2 className="text-display-lg mb-5">
                  Jeromian Voice<span className="text-gold" style={{ opacity: 0.6 }}>.</span>
                </h2>
                <p className="text-body-editorial max-w-xl mb-8">
                  The official student publication of St. Jerome&apos;s Academy —
                  covering news, sports, science, culture, and the creative arts
                  from the Jeromian perspective.
                </p>
                <Link href="/sections/news" className="btn-minimal">
                  Browse Sections
                </Link>
              </div>
              <div className="md:col-span-5">
                <div className="aspect-3/4 bg-surface-container rounded-sm flex items-center justify-center shadow-academic">
                  <span
                    className="font-serif font-black text-primary"
                    style={{ fontSize: "clamp(5rem, 14vw, 10rem)", opacity: 0.06 }}
                  >
                    JV
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Section Navigation Carousel ──────────────────────────── */}
        <SectionsCarousel sections={SECTIONS} />

        {/* ── Latest Stories + Sidebar ────────────────────────────── */}
        <div className="container-tight mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Main article list */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-label-caps">Latest Stories</h2>
                <Link
                  href="/sections/news"
                  className="text-label-caps text-secondary hover:text-primary transition-colors"
                >
                  All Stories →
                </Link>
              </div>

              {latest.length > 0 ? (
                <div className="space-y-0">
                  {latest.map((article, i) => (
                    <Link
                      href={`/news/${article.slug}`}
                      key={article.id}
                      className="group flex gap-5 md:gap-7 py-6 border-b border-outline/30 last:border-0 items-start"
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="section-tag">{article.category || "General"}</span>
                          <span className="byline">
                            Dispatch {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold leading-snug group-hover:text-secondary transition-colors line-clamp-2"
                          style={{ fontSize: "clamp(1rem, 2.5vw, 1.3125rem)" }}>
                          {article.title}
                        </h3>
                        <p className="text-on-surface-muted text-sm line-clamp-2 leading-relaxed hidden sm:block">
                          {article.excerpt}
                        </p>
                        <p className="byline">
                          {new Date(article.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {article.image && (
                        <div className="w-20 h-16 md:w-28 md:h-20 relative rounded-sm overflow-hidden shrink-0 shadow-academic">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-label-sm py-10 text-center">
                  Stories will appear here after the next sync.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20 lg:h-fit">
              {/* Community note */}
              <div className="p-6 bg-primary rounded-sm">
                <p className="font-sans font-bold uppercase tracking-[0.14em] mb-3"
                  style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.5)" }}>
                  For Jeromians
                </p>
                <p className="font-serif font-bold text-base leading-snug mb-4"
                  style={{ color: "#faf6ed" }}>
                  A publication by students, for the whole St. Jerome&apos;s community.
                </p>
                <Link href="/about"
                  className="font-sans font-bold uppercase tracking-widest transition-colors text-surface/60 hover:text-surface"
                  style={{ fontSize: "0.5rem" }}
                >
                  About Us →
                </Link>
              </div>

              {/* Literary folio teaser */}
              <div className="p-6 bg-surface rounded-sm shadow-academic">
                <p className="text-label-caps text-secondary mb-3">Literary Folio</p>
                <h4 className="font-serif font-bold text-xl mb-2">
                  Short Stories & Poems
                </h4>
                <p className="text-on-surface-muted text-sm leading-relaxed mb-5">
                  The creative writing wing of Jeromian Voice — prose and poetry from our student writers.
                </p>
                <Link href="/literary-folio" className="btn-outline text-xs">
                  Enter the Folio
                </Link>
              </div>

              {/* Gallery teaser */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-label-caps">Photo Gallery</p>
                  <Link href="/gallery" className="text-label-caps text-secondary hover:text-primary transition-colors">
                    All Photos →
                  </Link>
                </div>
                {galleryArticles.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {galleryArticles.map((a) => (
                      <Link href={`/news/${a.slug}`} key={a.id}
                        className="group relative aspect-square rounded-sm overflow-hidden shadow-academic block">
                        <Image
                          src={a.image!}
                          alt={a.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href="/gallery"
                    className="flex aspect-3/1 bg-surface-container rounded-sm items-center justify-center shadow-academic">
                    <span className="text-label-caps text-secondary">View Gallery →</span>
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* ── Community Welcome Band ──────────────────────────────── */}
        <section className="container-tight mb-8">
          <div className="bg-surface-container-low rounded-sm px-8 md:px-14 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-label-caps text-secondary mb-4">Students · Teachers · Staff</p>
              <h2 className="text-headline-lg mb-4">
                Your school.<br />
                <span className="italic font-normal text-secondary">Your voice.</span>
              </h2>
              <p className="text-body-editorial max-w-md">
                Jeromian Voice covers the stories that matter to the St. Jerome&apos;s
                Academy community — from the classroom to the championship field.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:justify-end">
              <Link href="/sections/news" className="btn-minimal">
                Read the News
              </Link>
              <Link href="/about" className="btn-outline">
                About the Paper
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
