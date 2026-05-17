import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

const STAFF = [
  { role: "Editor-in-Chief", name: "— Position Open —", note: "" },
  { role: "Managing Editor", name: "— Position Open —", note: "" },
  { role: "News Editor", name: "— Position Open —", note: "" },
  { role: "Sports Editor", name: "— Position Open —", note: "" },
  { role: "Sci-Tech Editor", name: "— Position Open —", note: "" },
  { role: "Literary Editor", name: "— Position Open —", note: "" },
  { role: "Layout Artist", name: "— Position Open —", note: "" },
  { role: "Web Team Lead", name: "— Position Open —", note: "" },
  { role: "Photo Editor", name: "— Position Open —", note: "" },
];

const VALUES = [
  {
    heading: "Truth First",
    body: "Every story we publish is verified to the best of our ability. We correct errors promptly and transparently.",
  },
  {
    heading: "Community Voice",
    body: "We write for every student, teacher, and staff member of St. Jerome's Academy — not just those with the loudest platforms.",
  },
  {
    heading: "Student-Led",
    body: "Jeromian Voice is produced entirely by students, with faculty advisers for guidance — not editorial control.",
  },
  {
    heading: "Creative Freedom",
    body: "Our Literary Folio is a space for creative risk. We publish work that surprises, unsettles, and moves.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-secondary/20 selection:text-primary">
      <Masthead />

      <main className="flex-1 page-padding">
        <div className="container-tight">
          {/* ── Page Header ─────────────────────────────────────── */}
          <div className="mb-14 md:mb-20">
            <p className="text-label-caps text-secondary mb-3">
              The Publication
            </p>
            <h1 className="text-display-md mb-4">About Us</h1>
            <div className="rule-gold" />
          </div>

          {/* ── Mission ──────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-24">
            <div className="lg:col-span-7">
              <p className="text-label-caps text-secondary mb-4">Our Mission</p>
              <h2 className="text-headline-lg mb-8">
                Giving every Jeromian a voice that is heard.
              </h2>
              <div className="space-y-5 text-body-editorial">
                <p>
                  <strong className="text-primary">Jeromian Voice</strong> is
                  the official student publication of St. Jerome&apos;s Academy,
                  Morong, Rizal. Founded to give students a meaningful outlet
                  for reporting, commentary, creative writing, and visual
                  storytelling, we have been the campus record since our first
                  volume.
                </p>
                <p>
                  We cover everything that matters to the St. Jerome&apos;s
                  community — from championship wins on the field to student-led
                  research in the lab, from opinion pieces that spark debate to
                  poems that make you sit quietly for a moment.
                </p>
                <p>
                  Our digital edition is powered by a student web team and
                  published continuously throughout the academic year. The print
                  edition releases at the end of each semester.
                </p>
              </div>
            </div>

            {/* Publication facts */}
            <aside className="lg:col-span-4 lg:col-start-9 space-y-0 lg:pt-16">
              {[
                { label: "Publication Name", value: "Jeromian Voice" },
                { label: "School", value: "St. Jerome's Academy" },
                { label: "Location", value: "Morong, Rizal" },
                { label: "Current Volume", value: "Volume XII" },
                { label: "Academic Year", value: "2025–2026" },
                { label: "Adviser", value: "Faculty Adviser (TBA)" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="py-4 border-b border-outline/25 last:border-0"
                >
                  <p className="byline mb-1">{label}</p>
                  <p className="font-serif font-bold text-sm text-primary">
                    {value}
                  </p>
                </div>
              ))}
            </aside>
          </section>

          {/* ── Values ───────────────────────────────────────────── */}
          <section className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-10 md:mb-12">
              <p className="text-label-caps text-secondary whitespace-nowrap">
                What We Stand For
              </p>
              <div className="rule-gold flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-outline">
              {VALUES.map((v) => (
                <div key={v.heading} className="bg-background p-7 md:p-8">
                  <h3 className="font-serif font-black text-xl md:text-2xl mb-3">
                    {v.heading}
                  </h3>
                  <p className="text-on-surface-muted text-sm leading-relaxed font-serif">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Editorial Staff ───────────────────────────────────── */}
          <section className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-10 md:mb-12">
              <p className="text-label-caps text-secondary whitespace-nowrap">
                Editorial Staff
              </p>
              <div className="rule-gold flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
              {STAFF.map((member) => (
                <div
                  key={member.role}
                  className="py-6 px-0 border-b border-outline/25 sm:odd:pr-8 sm:even:pl-8 sm:even:border-l sm:even:border-outline/25"
                >
                  <p className="byline mb-2">{member.role}</p>
                  <p className="font-serif font-bold text-base text-on-surface-muted">
                    {member.name}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="text-label-sm mt-8 text-center"
              style={{ color: "rgba(122,92,71,0.5)" }}
            >
              Staff roster is updated each academic year. Positions subject to
              student elections.
            </p>
          </section>

          {/* ── Join the Team CTA ────────────────────────────────── */}
          <section className="mb-8">
            <div className="bg-primary rounded-sm px-8 md:px-14 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p
                  className="font-sans font-bold uppercase tracking-[0.14em] mb-4"
                  style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.5)" }}
                >
                  Get Involved
                </p>
                <h2
                  className="font-serif font-black leading-tight mb-4"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    color: "#faf6ed",
                  }}
                >
                  Join the Jeromian Voice team.
                </h2>
                <p
                  className="font-serif text-sm leading-relaxed"
                  style={{ color: "rgba(250,246,237,0.65)" }}
                >
                  We accept applications from all Jeromian students — writers,
                  photographers, designers, and web developers. No experience
                  required. Just a story worth telling.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link href="/sections/news" className="btn-minimal">
                  Read Our Work First
                </Link>
                <p
                  className="font-sans font-bold uppercase tracking-widest"
                  style={{ fontSize: "0.5rem", color: "rgba(250,246,237,0.4)" }}
                >
                  Applications open each semester
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
