import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getAllArticles } from "@/lib/articles";

const SECTION_CONFIG = {
  news: {
    title: "News",
    label: "The Newsroom",
    description:
      "Breaking stories and campus dispatches from St. Jerome's Academy and the world beyond.",
  },
  sports: {
    title: "Sports",
    label: "On the Field",
    description:
      "Championships, training grounds, and the athletes who define Jeromian spirit.",
  },
  "sci-tech": {
    title: "Sci-Tech",
    label: "The Lab",
    description:
      "Science, technology, and the innovations shaping our generation — through a student lens.",
  },
  editorial: {
    title: "Editorial",
    label: "From the Board",
    description:
      "The official stance, perspective, and voice of the Jeromian Voice editorial board.",
  },
  opinion: {
    title: "Opinion",
    label: "The Forum",
    description:
      "Perspectives, arguments, and reflections from students, faculty, and alumni.",
  },
  feature: {
    title: "Feature",
    label: "In Focus",
    description:
      "Long-form, in-depth stories that go deeper than the headline.",
  },
} as const;

type SectionSlug = keyof typeof SECTION_CONFIG;

const OTHER_SECTIONS = Object.entries(SECTION_CONFIG) as [SectionSlug, typeof SECTION_CONFIG[SectionSlug]][];

export async function generateStaticParams() {
  return Object.keys(SECTION_CONFIG).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = SECTION_CONFIG[section as SectionSlug];
  if (!config) return { title: "Section Not Found" };
  return {
    title: `${config.title} | Jeromian Voice`,
    description: config.description,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = SECTION_CONFIG[section as SectionSlug];

  if (!config) return notFound();

  const allArticles = await getAllArticles();
  const articles = allArticles.filter(
    (a) =>
      a.category?.toLowerCase() === config.title.toLowerCase() ||
      a.category?.toLowerCase() === section
  );

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">

          {/* ── Section Header ────────────────────────────────────── */}
          <div className="mb-12 md:mb-16">
            <p className="text-label-caps text-secondary mb-3">{config.label}</p>
            <h1 className="text-display-md mb-4">{config.title}</h1>
            <p className="text-body-editorial max-w-2xl mb-6">{config.description}</p>
            <div className="rule-gold" />
          </div>

          {articles.length === 0 ? (
            /* ── Empty State ──────────────────────────────────────── */
            <div className="py-24 md:py-32 text-center max-w-lg mx-auto">
              <p className="text-label-caps text-secondary mb-4">No articles yet</p>
              <h2 className="text-headline-md mb-4">
                {config.title} coverage is on its way.
              </h2>
              <p className="text-body-editorial mb-8">
                Articles will appear here after the next sync from the Jeromian
                Voice content pipeline.
              </p>
              <Link href="/" className="btn-minimal">
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

              {/* ── Main Content ─────────────────────────────────── */}
              <div className="lg:col-span-8 space-y-12">

                {/* Featured article */}
                {featured && (
                  <Link href={`/news/${featured.slug}`} className="group block">
                    <div className="relative aspect-video bg-surface-container rounded-sm overflow-hidden mb-6 shadow-academic">
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
                            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", opacity: 0.07 }}
                          >
                            JV
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-label-caps text-secondary mb-3">Featured</p>
                    <h2 className="text-headline-lg group-hover:text-secondary transition-colors mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-body-editorial max-w-2xl line-clamp-3 mb-4">
                      {featured.excerpt}
                    </p>
                    <p className="byline">
                      {new Date(featured.timestamp).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                )}

                {/* Remaining articles */}
                {rest.length > 0 && (
                  <div className="space-y-0 pt-4">
                    <h3 className="text-label-caps mb-6">More in {config.title}</h3>
                    {rest.map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="group flex items-start gap-5 md:gap-7 py-6 border-b border-outline/30 last:border-0"
                      >
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4
                            className="font-serif font-bold leading-snug group-hover:text-secondary transition-colors line-clamp-2"
                            style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                          >
                            {article.title}
                          </h4>
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
                )}
              </div>

              {/* ── Sidebar ──────────────────────────────────────── */}
              <aside className="lg:col-span-4 space-y-10 lg:sticky lg:top-20 lg:h-fit">

                {/* Other sections */}
                <div>
                  <h4 className="text-label-caps mb-5">Other Sections</h4>
                  <ul>
                    {OTHER_SECTIONS.filter(([key]) => key !== section).map(([key, meta]) => (
                      <li key={key}>
                        <Link
                          href={`/sections/${key}`}
                          className="flex items-center justify-between py-3.5 border-b border-outline/25 group"
                        >
                          <span className="font-serif font-bold text-sm group-hover:text-secondary transition-colors">
                            {meta.title}
                          </span>
                          <span className="text-secondary text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Literary Folio teaser */}
                <Link
                  href="/literary-folio"
                  className="block p-6 bg-surface rounded-sm shadow-academic hover:shadow-academic-hover transition-shadow group"
                >
                  <p className="text-label-caps text-secondary mb-2">Literary Folio</p>
                  <h5 className="font-serif font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                    Short Stories & Poems
                  </h5>
                  <p className="text-sm text-on-surface-muted leading-relaxed">
                    The creative writing wing of Jeromian Voice.
                  </p>
                </Link>

              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
