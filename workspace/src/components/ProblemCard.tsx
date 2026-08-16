import React from "react";
import type { Problem } from "../data/problems";

/* A contest problem sheet, rendered on the site so the judge's contract
   (statement · I/O · constraints · samples) is read here, not googled. */
export function ProblemCard({ p }: { p: Problem }) {
  return (
    <article className="card-2 p-5 sm:p-7" style={{ "--sketch-c": "var(--blue)" } as React.CSSProperties}>
      {/* source line */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="f-ui text-[13.5px]" style={{ color: "var(--blue)", fontWeight: 780, fontStyle: "italic" }}>
            {p.source}
          </div>
          <h3 className="f-head text-[26px] sm:text-[30px] m-0 mt-1 leading-tight">{p.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-sm no-underline">
            judge page ↗
          </a>
          <span className="mono text-[11px] font-semibold" style={{ color: "var(--ink-soft)" }}>{p.limits}</span>
        </div>
      </div>

      {p.reconstruction && (
        <div
          className="mt-3.5 px-3.5 py-2.5 text-[13.5px] leading-snug"
          style={{
            background: "var(--orange-soft)",
            borderLeft: "4px solid var(--orange)",
            borderRadius: "2px 9px 9px 2px",
            color: "#8a2f10",
          }}
        >
          <strong>Practice reconstruction.</strong> Rebuilt from the syllabus so you can train on it right here — always check the
          official statement on the judge before you submit for real.
        </div>
      )}

      {/* statement */}
      <div className="mt-5">
        <SectionLabel color="var(--ink-2)">the statement</SectionLabel>
        {p.statement.map((para, i) => (
          <p key={i} className="f-body text-[17px] sm:text-[18px] leading-[1.7] m-0 mt-2 first:mt-0">{para}</p>
        ))}
      </div>

      {/* input / output */}
      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <div>
          <SectionLabel color="var(--ink-2)">input</SectionLabel>
          <p className="f-body text-[15.5px] sm:text-[16px] leading-relaxed m-0 mt-1.5">{p.input}</p>
        </div>
        <div>
          <SectionLabel color="var(--ink-2)">output</SectionLabel>
          <p className="f-body text-[15.5px] sm:text-[16px] leading-relaxed m-0 mt-1.5">{p.output}</p>
        </div>
      </div>

      {/* constraints */}
      <div className="mt-5">
        <SectionLabel color="var(--ink-2)">constraints</SectionLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {p.constraints.map((c) => (
            <span key={c} className="chip mono" style={{ fontSize: 12.5 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* samples */}
      <div className="mt-5">
        <SectionLabel color="var(--ink-2)">try it — sample {p.samples.length > 1 ? "tests" : "test"}</SectionLabel>
        <div className={`grid gap-3 mt-2 ${p.samples.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {p.samples.map((s, i) => (
            <div key={i} className="doodle-border bg-[#fcf8ec] p-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mono text-[10.5px] font-bold tracking-[0.12em] mb-1" style={{ color: "var(--ink-soft)" }}>stdin</div>
                  <pre className="mono text-[13.5px] leading-relaxed m-0 whitespace-pre-wrap">{s.in}</pre>
                </div>
                <div>
                  <div className="mono text-[10.5px] font-bold tracking-[0.12em] mb-1" style={{ color: "var(--green)" }}>stdout</div>
                  <pre className="mono text-[13.5px] leading-relaxed m-0 whitespace-pre-wrap" style={{ color: "var(--green)" }}>{s.out}</pre>
                </div>
              </div>
              {p.samples.length > 1 && (
                <div className="mono text-[10.5px] mt-2 font-semibold" style={{ color: "var(--ink-soft)" }}>test {i + 1}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* exam tell */}
      <div
        className="mt-5 px-4 py-3"
        style={{
          background: "var(--green-soft)",
          borderLeft: "4px solid var(--green)",
          borderRadius: "2px 10px 10px 2px",
        }}
      >
        <div className="f-ui text-[13.5px]" style={{ color: "var(--green)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--green) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>
          exam tell — how you spot it on paper
        </div>
        <p className="f-body text-[15.5px] sm:text-[16px] leading-relaxed m-0 mt-1.5">{p.tell}</p>
      </div>
    </article>
  );
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="f-ui text-[14.5px]" style={{ color, fontWeight: 760, fontStyle: "italic" }}>
      {children}
    </div>
  );
}
