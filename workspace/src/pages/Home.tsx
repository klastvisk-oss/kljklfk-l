import { Link } from "react-router-dom";
import { CurlyArrow, HandDivider, InkProgress, Reveal, Squiggle, useReviewedCtx } from "../components/fx";
import { PHASES, GLOBAL_STATS, phaseStats, ALL_ITEMS } from "../data/curriculum";

/* ————— ambient notebook junk: the page should look lived-in, not decorated ————— */

function CoffeeStain({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: 118,
        height: 112,
        border: "7px solid rgba(146, 96, 44, 0.16)",
        borderRadius: "48% 52% 50% 50% / 52% 48% 52% 48%",
        boxShadow: "inset 0 0 0 3px rgba(146, 96, 44, 0.06), 3px 4px 0 -1px rgba(146, 96, 44, 0.08)",
        transform: "rotate(-9deg)",
      }}
    >
      <span
        className="absolute rounded-full"
        style={{ inset: -14, border: "2px solid rgba(146, 96, 44, 0.08)", borderRadius: "50% 46% 54% 48%" }}
      />
    </div>
  );
}

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute block ${className}`}
      style={{
        width: 92,
        height: 26,
        background: "rgba(233, 222, 187, 0.72)",
        border: "1px solid rgba(29, 47, 78, 0.14)",
        boxShadow: "0 1px 2px rgba(29,47,78,0.12)",
        transform: "rotate(-4deg)",
        clipPath: "polygon(2% 0, 98% 6%, 100% 92%, 0 100%)",
      }}
    />
  );
}

/* ————— the page ————— */

export default function Home() {
  const ctx = useReviewedCtx();
  const { done, wip, total } = GLOBAL_STATS;
  const reviewed = ctx?.reviewed.size ?? 0;
  const current = ALL_ITEMS.find((i) => i.status === "wip") ?? ALL_ITEMS.find((i) => i.status === "planned");
  const after = current ? ALL_ITEMS[ALL_ITEMS.findIndex((i) => i.id === current.id) + 1] : undefined;

  return (
    <div className="grid-paper">
      <div className="max-w-[1380px] mx-auto px-6">

        {/* ————— opening spread: the goal, in hand ————— */}
        <header className="relative pt-14 lg:pt-20 pb-10">
          <CoffeeStain className="hidden md:block right-[6%] top-8" />
          <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-12 items-start">
            <div>
              <p className="f-ui text-[15px] m-0" style={{ color: "var(--orange)", fontWeight: 720, fontStyle: "italic" }}>
                a study notebook · maratona sbc, first phase · solo team of one
              </p>
              <h1 className="f-disp boil text-[64px] sm:text-[92px] lg:text-[108px] mt-3 mb-0 leading-[0.9]">
                Solve the<br />easy six.
              </h1>
              <div className="mt-3"><Squiggle w={260} h={12} color="var(--orange)" /></div>

              <div className="mt-7 space-y-4 max-w-[620px]">
                <p className="f-body text-[18.5px] leading-[1.72] m-0">
                  The first phase of the Maratona has about a dozen problems, and — here's the secret —{" "}
                  you don't need all of them. You need the five or six easy ones, solved
                  cleanly, untimed, on a real paper. Everything in this notebook exists for that one afternoon.
                </p>
                <p className="f-body text-[17px] leading-[1.72] m-0" style={{ color: "var(--ink-2)" }}>
                  The plan: <strong>56 small ideas</strong>, in order, each one earned on a problem that actually appeared — read the
                  contract, trace it by hand, write the C, then prove you still remember it days later. No lectures, no certificates.
                  The scoreboard on the right is the only grade.
                </p>
              </div>

              <div className="relative mt-9 flex flex-wrap items-center gap-4">
                {current && (
                  <Link to={`/lesson/${current.id}`} className="btn btn-ink" style={{ fontSize: 19, padding: "14px 26px" }}>
                    open the notebook · #{current.num} →
                  </Link>
                )}
                <Link to="/phase/1" className="btn" style={{ fontSize: 16, padding: "14px 22px" }}>
                  read from day one
                </Link>
                {current && (
                  <span className="hidden sm:block" style={{ transform: "translateY(-18px) rotate(3deg)" }}>
                    <CurlyArrow label={after ? `then #${after.num}` : "the last page"} />
                  </span>
                )}
              </div>
            </div>

            {/* the only scoreboard that matters */}
            <Reveal delay={120}>
              <div className="card sketch-boil p-6 relative max-w-[460px] lg:ml-auto">
                <Tape className="-top-3 left-10" />
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="f-head text-[24px] m-0">standings</h2>
                  <span className="f-ui text-[13px] italic" style={{ color: "var(--ink-soft)" }}>a table of one</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-end justify-between">
                    <span className="f-disp text-[64px] leading-none" style={{ color: "var(--green)" }}>{done}</span>
                    <span className="f-ui text-[14px] pb-2" style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
                      of {total} concepts banked
                    </span>
                  </div>
                  <div className="mt-3"><InkProgress value={done / total} label={`${Math.round((done / total) * 100)}% of the syllabus`} /></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 f-ui text-[14px]" style={{ fontStyle: "italic", color: "var(--ink-2)" }}>
                  <span><strong style={{ color: "var(--orange)" }}>{wip}</strong> half-built right now</span>
                  <span><strong style={{ color: "var(--blue)" }}>{reviewed}</strong> reviewed by me</span>
                </div>
                <p className="f-body text-[14.5px] mt-4 mb-0 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Rules of the table: untimed, open-notebook, alone. The day this reads{" "}
                  <strong style={{ color: "var(--ink)" }}>56</strong>, a fresh 2026 paper gets printed and we see what's real.
                </p>
              </div>
            </Reveal>
          </div>
        </header>

        <HandDivider />

        {/* ————— the syllabus, as a table of contents — not a table of tables ————— */}
        <section className="py-12">
          <Reveal>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h2 className="f-head text-[34px] sm:text-[42px] m-0">five days' worth of ideas</h2>
              <span className="f-ui text-[15px] italic" style={{ color: "var(--ink-soft)" }}>
                (twenty-one, realistically — the ledger keeps me honest)
              </span>
            </div>
          </Reveal>

          <div className="mt-7 space-y-3.5 max-w-[980px]">
            {PHASES.map((ph, i) => {
              const s = phaseStats(ph);
              return (
                <Reveal key={ph.n} delay={i * 70}>
                  <Link
                    to={`/phase/${ph.n}`}
                    className="card lift block p-5 sm:p-6 no-underline relative overflow-hidden group"
                    style={{ borderColor: "var(--ink)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="f-disp absolute -top-3 -right-1 text-[92px] leading-none select-none pointer-events-none"
                      style={{ color: ph.accent, opacity: 0.16, filter: "url(#rough-hi)" }}
                    >
                      {ph.numeral}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 relative">
                      <span className="f-disp text-[30px] leading-none w-[44px]" style={{ color: ph.accent }}>{ph.numeral}</span>
                      <h3 className="f-head text-[24px] m-0 group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[6px]" style={{ textDecorationColor: ph.accent }}>
                        {ph.title}
                      </h3>
                      <span className="f-ui text-[13.5px] italic" style={{ color: "var(--ink-soft)" }}>{ph.days}</span>
                    </div>
                    <p className="f-body text-[16.5px] m-0 mt-2 leading-relaxed max-w-[640px] relative">
                      {ph.bigIdea}
                    </p>
                    <div className="flex items-center gap-4 mt-4 max-w-[520px] relative">
                      <InkProgress value={s.total ? s.done / s.total : 0} color={ph.accent} />
                      <span className="mono text-[12px] font-bold shrink-0" style={{ color: "var(--ink-2)" }}>
                        {s.done}/{s.total}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <HandDivider />

        {/* ————— how a single idea gets learned, in one breath ————— */}
        <section className="py-12">
          <Reveal>
            <h2 className="f-head text-[34px] sm:text-[42px] m-0">every idea runs the same loop</h2>
            <p className="f-body text-[17px] mt-3 mb-0 max-w-[640px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
              No idea gets a lesson until it has survived all six of these. If one step is skipped, the idea doesn't count —
              that's the whole pedagogical content of this site, and it fits on one line:
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-3 f-ui text-[17px]" style={{ fontWeight: 660 }}>
              {["read the contract", "trace by hand", "write the C", "solve one alone", "review what breaks it"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="chip" style={{ fontSize: 14.5, padding: "5px 13px 6px" }}>{s}</span>
                  {i < 4 && <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" style={{ display: "block" }}><path d="M1 5 Q 8 1 15 5 T 25 5" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" /><path d="M19 1 L25 5 L19 9" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
              ))}
              <span className="flex items-center gap-2">
                <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" style={{ display: "block" }}><path d="M1 5 Q 8 1 15 5 T 25 5" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" /><path d="M19 1 L25 5 L19 9" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="chip chip-green" style={{ fontSize: 14.5, padding: "5px 13px 6px" }}>days later: still there?</span>
              </span>
            </div>
          </Reveal>
        </section>

        <HandDivider />

        {/* ————— the human corner: field notes, the shelf, the rules of not-doing ————— */}
        <section className="py-12 pb-16">
          <div className="grid md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 items-start">
            {/* field notes — a useless table, lovingly kept */}
            <Reveal>
              <div className="card-2 p-6 relative">
                <CoffeeStain className="-right-7 -bottom-8 scale-90" />
                <h2 className="f-head text-[26px] m-0">field notes</h2>
                <span className="f-ui text-[13px] italic" style={{ color: "var(--ink-soft)" }}>unscientific · kept anyway</span>
                <table className="trace rough-lo mt-4" style={{ maxWidth: 400 }}>
                  <thead>
                    <tr><th>day</th><th>problems</th><th>mood</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>1</td><td>terrified, politely</td></tr>
                    <tr><td>3</td><td>3</td><td>okay, the loop makes sense</td></tr>
                    <tr><td>7</td><td>3</td><td>suspiciously confident</td></tr>
                    <tr><td>11</td><td>2</td><td>humbled by an off-by-one</td></tr>
                    <tr><td className="hl">…</td><td className="hl">…</td><td className="hl">the table continues</td></tr>
                  </tbody>
                </table>
                <p className="f-body text-[15px] mt-4 mb-0 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Lesson so far: confidence and correctness take turns, and the retrieval days are where the real learning hides.
                </p>
              </div>
            </Reveal>

            {/* the shelf + the taped rule */}
            <div className="space-y-8">
              <Reveal delay={80}>
                <div>
                  <h2 className="f-head text-[26px] m-0">the shelf</h2>
                  <p className="f-body text-[16px] mt-1.5 mb-4 leading-relaxed" style={{ color: "var(--ink-2)" }}>
                    Four real exam papers wait here. Phase IV is nothing but sitting down with them, one year at a time,
                    and counting how many of the easy six actually fall.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { y: "2022", to: "/lesson/p4-40", note: "where item 1 was born" },
                      { y: "2023", to: "/lesson/p4-43", note: "three ideas mined already" },
                      { y: "2024", to: "/lesson/p4-44", note: "next in line" },
                      { y: "2025", to: "/lesson/p4-45", note: "the fresh one · no peeking" },
                    ].map((p) => (
                      <Link key={p.y} to={p.to} className="card-2 lift block p-4 no-underline min-w-[150px]" style={{ transform: "none" }}>
                        <span className="f-disp text-[34px] leading-none block" style={{ color: "var(--blue)" }}>{p.y}</span>
                        <span className="f-ui text-[13px] italic block mt-1.5" style={{ color: "var(--ink-soft)" }}>{p.note}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="card-2 p-5 relative max-w-[560px]">
                  <Tape className="-top-3 right-8" />
                  <div className="f-ui text-[15px]" style={{ fontWeight: 760, color: "#9c3413", fontStyle: "italic" }}>
                    taped rule — explicitly not happening this sprint
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["segment trees", "max flow", "KMP", "bitmask DP", "heavy geometry"].map((s) => (
                      <span key={s} className="stamp stamp-ink" style={{ fontSize: 11, transform: `rotate(${(s.length % 3) - 1}deg)` }}>{s}</span>
                    ))}
                  </div>
                  <p className="f-body text-[15px] mt-3.5 mb-0 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    If a problem needs one of these, it is not one of my six. I skip it, I say why, and I move on.
                    Ambition is a resource; the exam is the spender.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ————— colophon, human-sized ————— */}
        <footer className="pb-12">
          <HandDivider />
          <div className="flex flex-wrap justify-between items-center gap-4 pt-6">
            <p className="f-body text-[14.5px] m-0 italic" style={{ color: "var(--ink-soft)" }}>
              made by hand, one ink at a time — navy for the lines, <span style={{ color: "var(--orange)", fontWeight: 700 }}>derivative orange</span> for
              what changes, <span style={{ color: "var(--green)", fontWeight: 700 }}>integral green</span> for what accumulates.
            </p>
            <p className="mono text-[12px] m-0" style={{ color: "var(--ink-soft)" }}>
              no accounts · no analytics · the ledger lives in this browser
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
