import React from "react";
import { CodeBlock, Term } from "../components/fx";
import type { Step } from "../pages/labSteps";

/* Shared authoring kit — every real lesson is built from these pieces.
   Pedagogy contract: teach from nothing · show working code · name the
   killer mistake · check recall. */

export type { Step };

export function P({ children }: { children: React.ReactNode }) {
  return <p className="f-body text-[17.5px] leading-[1.74] m-0">{children}</p>;
}

/* sub-heading inside a long step — breaks the wall without a new page */
export function Sub({ children }: { children: React.ReactNode }) {
  return <div className="f-ui text-[20.5px] mt-2 mb-1" style={{ fontWeight: 800 }}>{children}</div>;
}

/* an ordered reasoning chain, numbered like margin notes */
export function Chain({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="m-0 p-0 list-none space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 text-[16.5px] leading-relaxed">
          <span className="f-ui shrink-0" style={{ fontWeight: 800, color: "var(--orange)", minWidth: 22 }}>{i + 1}.</span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}

export function Note({ color = "var(--blue)", children }: { color?: string; children: React.ReactNode }) {
  return (
    <div className="doodle-border px-4 py-3" style={{ "--sketch-c": color, background: "var(--card-2)" } as React.CSSProperties}>
      <div className="text-[15.5px] leading-relaxed">{children}</div>
    </div>
  );
}

/* the single mistake that costs you the problem — shown BEFORE the fix */
export function Gotcha({ children, title = "the one mistake" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="card-2 p-4" style={{ "--sketch-c": "var(--orange)", boxShadow: "3px 3px 0 var(--orange)" } as React.CSSProperties}>
      <div className="f-ui text-[14px] mb-1.5" style={{ color: "var(--orange)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--orange) 55%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>{title}</div>
      <div className="text-[15.5px] leading-relaxed">{children}</div>
    </div>
  );
}

export function Code({ code, title, caption }: { code: string; title: string; caption?: string }) {
  return <CodeBlock code={code} title={title} caption={caption} />;
}

export function Trace({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="trace rough-lo" style={{ maxWidth: 560 }}>
      <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} className={i === rows.length - 1 ? "hl" : undefined}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

/* a tight "remember this" box — the sentence you should be able to recall */
export function Key({ children }: { children: React.ReactNode }) {
  return (
    <div className="doodle-border px-4 py-3 bg-[var(--green-soft)]" style={{ "--sketch-c": "var(--green)" } as React.CSSProperties}>
      <div className="f-ui text-[13.5px] mb-1" style={{ color: "var(--green)", fontWeight: 780, fontStyle: "italic" }}>the sentence you can now derive</div>
      <div className="f-ui text-[16.5px]" style={{ fontWeight: 720 }}>{children}</div>
    </div>
  );
}

export function Recall({ prompt }: { prompt: string }) {
  return (
    <div className="space-y-3">
      <P>Close your eyes, or cover the page, and answer out loud before reading on:</P>
      <div className="doodle-border px-4 py-3" style={{ "--sketch-c": "var(--orange)" } as React.CSSProperties}>
        <div className="f-ui text-[16.5px]" style={{ fontWeight: 740 }}>{prompt}</div>
      </div>
      <P>If the answer didn't come quickly, scroll back and re-read the concept step — then try again. The struggle is the lesson.</P>
    </div>
  );
}

export { Term, CodeBlock };
