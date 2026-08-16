import React, { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SvgFilters, useBoil } from "./fx";
import { PHASES, GLOBAL_STATS } from "../data/curriculum";

function Monogram() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="rough-lo">
      <rect x="2" y="2" width="36" height="36" rx="8" fill="var(--ink)" />
      <text x="20" y="28" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="22" fill="var(--paper)">M</text>
      <circle cx="32" cy="8" r="5" fill="var(--orange)" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  useBoil();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <SvgFilters />
      <header className="sticky top-0 z-50" style={{ background: "rgba(243,235,215,0.94)", backdropFilter: "blur(4px)" }}>
        <div className="border-b-2 border-[var(--ink)]">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-4 flex-wrap">
            <Link to="/" className="flex items-center gap-2.5 no-underline group">
              <span className="transition-transform duration-200 group-hover:-rotate-6 inline-block"><Monogram /></span>
              <span className="leading-none">
                <span className="f-head block text-[19px]" style={{ filter: "url(#rough-md)" }}>Maratona Lab</span>
                <span className="mono block text-[9.5px] font-bold tracking-[0.22em] mt-0.5" style={{ color: "var(--orange)" }}>ICPC STUDY NOTEBOOK</span>
              </span>
            </Link>

            <nav className="flex items-center gap-4 flex-wrap ml-auto" aria-label="main">
              <NavLink to="/" end className={({ isActive }) => `navlink f-ui text-[14.5px] no-underline ${isActive ? "active" : ""}`} style={({ isActive }) => ({ color: isActive ? "var(--orange)" : "var(--ink)" })}>
                Notebook
              </NavLink>
              {PHASES.map((p) => (
                <NavLink
                  key={p.n}
                  to={`/phase/${p.n}`}
                  title={`Phase ${p.numeral} — ${p.title}`}
                  className={({ isActive }) => `navlink f-ui text-[14.5px] no-underline ${isActive ? "active" : ""}`}
                  style={({ isActive }) => ({ color: isActive ? "var(--orange)" : "var(--ink)" })}
                >
                  {p.numeral}
                  <sup className="mono text-[8.5px] font-bold ml-0.5" style={{ color: "var(--ink-soft)" }}>{phaseDone(p.n)}</sup>
                </NavLink>
              ))}
              <span className="chip chip-orange hidden md:inline-flex">
                <span className="tick-pulse" style={{ color: "var(--orange)" }}>●</span> day 5 · phase II
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t-2 border-[var(--ink)] mt-16" style={{ background: "var(--paper-deep)" }}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="f-head text-[20px] mb-2" style={{ filter: "url(#rough-md)" }}>The promise, restated</div>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              Independently solve <strong style={{ color: "var(--ink)" }}>5–6 of the easiest problems</strong> from a recent Maratona SBC
              first-phase exam — untimed, alone, for real. Everything on this site exists to make that sentence true.
            </p>
          </div>
          <div>
            <div className="mono text-[11px] font-bold tracking-[0.18em] mb-3" style={{ color: "var(--orange)" }}>JUMP TO</div>
            <ul className="space-y-1.5 list-none p-0 m-0">
              {PHASES.map((p) => (
                <li key={p.n}>
                  <Link to={`/phase/${p.n}`} className="navlink text-[14.5px] no-underline">
                    Phase {p.numeral} · {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono text-[11px] font-bold tracking-[0.18em] mb-3" style={{ color: "var(--orange)" }}>THE LEDGER</div>
            <p className="mono text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {GLOBAL_STATS.done} done · {GLOBAL_STATS.wip} in progress · {GLOBAL_STATS.total - GLOBAL_STATS.done - GLOBAL_STATS.wip} planned
              <br />language: C now, C++17 after item 24
              <br />out of scope: segtrees, flows, heavy geometry — and proud of it.
            </p>
            <p className="text-[12px] italic mt-4" style={{ color: "var(--ink-soft)" }}>
              Hand-set in ink on cream paper · misregistration intentional · no template was harmed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function phaseDone(n: number) {
  const p = PHASES.find((x) => x.n === n)!;
  return `${p.items.filter((i) => i.status === "done").length}/${p.items.length}`;
}
