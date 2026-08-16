import { Link, Navigate, useParams } from "react-router-dom";
import { HandDivider, InkProgress, Reveal, Squiggle, StatusStamp, useReviewedCtx } from "../components/fx";
import { PHASES, phaseStats } from "../data/curriculum";

export default function PhasePage() {
  const { n } = useParams();
  const phase = PHASES.find((p) => p.n === Number(n));
  const ctx = useReviewedCtx();
  if (!phase) return <Navigate to="/" replace />;

  const stats = phaseStats(phase);
  const idx = PHASES.indexOf(phase);
  const prev = idx > 0 ? PHASES[idx - 1] : null;
  const next = idx < PHASES.length - 1 ? PHASES[idx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* header */}
      <section className="grid-paper relative border-b-2 border-[var(--ink)] -mx-4 px-4 overflow-hidden">
        <div className="halftone absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl pt-12 pb-10 grid md:grid-cols-[auto_1fr] gap-6 items-start relative">
          <div className="f-disp text-[110px] sm:text-[150px] leading-[0.8] select-none" style={{ color: phase.accent, filter: "url(#rough-hi)" }} aria-hidden="true">
            {phase.numeral}
          </div>
          <div>
            <div className="mono text-[11.5px] font-bold tracking-[0.22em]" style={{ color: "var(--orange)" }}>
              PHASE {phase.numeral} · {phase.days}
            </div>
            <h1 className="f-disp text-[40px] sm:text-[56px] m-0 mt-1">
              {phase.title}
            </h1>
            <div className="mt-1.5"><Squiggle w={210} h={10} color={phase.accent} /></div>
            <p className="f-body text-[18px] italic mt-4 max-w-[58ch]" style={{ color: "var(--ink-soft)" }}>
              Big idea — “{phase.bigIdea}”
            </p>
            <div className="mt-5 max-w-[440px]">
              <InkProgress value={stats.frac} color={phase.accent} label={`${stats.done} done · ${stats.wip} in progress · ${stats.total} items`} />
            </div>
          </div>
        </div>
      </section>

      {/* item ledger */}
      <section className="pt-10">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h2 className="f-head text-[26px] m-0">The ledger</h2>
          <span className="text-[13.5px] italic" style={{ color: "var(--ink-soft)" }}>every item is a lesson — open any of them, even the planned ones.</span>
        </div>

        <div className="mt-6 space-y-4">
          {phase.items.map((item, i) => {
            const reviewed = ctx?.reviewed.has(item.id);
            return (
              <Reveal key={item.id} delay={Math.min(i * 55, 400)}>
                <Link to={`/lesson/${item.id}`} className="block no-underline group">
                  <div
                    className={`card lift p-4 sm:p-5 relative flex flex-wrap items-center gap-4 ${item.status === "wip" ? "sketch-boil" : ""}`}
                    style={{ opacity: item.status === "planned" ? 0.92 : 1 }}
                  >
                    {/* status accent edge */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1.5 top-3 bottom-3 w-[7px] rough-lo"
                      style={{
                        background: item.status === "done" ? "var(--green)" : item.status === "wip" ? "var(--orange)" : "var(--ink-faint)",
                        borderRadius: "4px 6px 5px 7px / 6px 4px 7px 5px",
                      }}
                    />
                    <div className="mono text-[15px] font-bold w-11 h-11 shrink-0 border-2 border-[var(--ink)] bg-[#fcf8ec] flex items-center justify-center rough-lo" style={{ borderRadius: "9px 13px 8px 14px / 13px 8px 14px 9px", color: phase.accent }}>
                      {item.num}
                    </div>
                    <div className="flex-1 min-w-[230px]">
                      <div className="f-ui text-[18.5px] leading-tight group-hover:underline decoration-wavy decoration-[var(--orange)] underline-offset-4" style={{ fontWeight: 760 }}>
                        {item.title}
                      </div>
                      <div className="mono text-[11.5px] mt-1 tracking-wide" style={{ color: "var(--ink-soft)" }}>
                        {item.artifact} · ~{item.minutes} min ·{" "}
                        {item.kind === "lab" ? "interactive lab" : item.kind === "recap" ? "recap lesson" : "drill card"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {reviewed && <span className="stamp stamp-green" style={{ fontSize: 10, padding: "1px 7px 2px" }}>reviewed</span>}
                      <StatusStamp status={item.status} small />
                      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                        <path d="M1 8 H 17 M 12 2 L 19 8 L 12 14" fill="none" stroke="var(--orange)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="mt-12"><HandDivider /></div>

      {/* phase-to-phase navigation */}
      <nav className="flex flex-wrap justify-between gap-4 py-8" aria-label="phases">
        {prev ? (
          <Link to={`/phase/${prev.n}`} className="btn">← {prev.numeral} · {prev.title}</Link>
        ) : (
          <Link to="/" className="btn">← the notebook</Link>
        )}
        {next ? (
          <Link to={`/phase/${next.n}`} className="btn btn-ink">{next.numeral} · {next.title} →</Link>
        ) : (
          <Link to="/" className="btn btn-ink">back to the notebook →</Link>
        )}
      </nav>
    </div>
  );
}
