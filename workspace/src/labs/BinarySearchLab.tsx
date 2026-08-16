import React, { useState } from "react";
import { Cell, LabControls, LabFrame, LabNote, VarBox, useTicker } from "./bits";

const ARR = [2, 5, 8, 12, 16, 23, 38, 41, 56, 72, 85, 91, 96, 103, 110];
const TARGETS = [23, 91, 2, 110, 50, 1, 111, 72];

type Variant = {
  id: string;
  name: string;
  code: string;
  truth: "correct" | "miss" | "spin";
  why: string;
};
const VARIANTS: Variant[] = [
  {
    id: "A", name: "A", truth: "correct",
    code: `while (lo <= hi) {
  mid = lo + (hi - lo) / 2;
  if (a[mid] == t) return mid;
  if (a[mid] <  t) lo = mid + 1;
  else             hi = mid - 1;
}
return -1;`,
    why: "lo ≤ hi keeps the interval inclusive; mid ± 1 always shrinks it. Every probe either finds t or provably discards half.",
  },
  {
    id: "B", name: "B", truth: "miss",
    code: `while (lo < hi) {          /* strict < */
  mid = lo + (hi - lo) / 2;
  if (a[mid] == t) return mid;
  if (a[mid] <  t) lo = mid + 1;
  else             hi = mid - 1;
}
return -1;`,
    why: "With lo < hi the search stops while one element is still unexamined — exactly when lo == hi. Targets sitting on that last cell are reported missing.",
  },
  {
    id: "C", name: "C", truth: "spin",
    code: `while (lo <= hi) {
  mid = lo + (hi - lo) / 2;
  if (a[mid] == t) return mid;
  if (a[mid] <  t) lo = mid;     /* no +1 */
  else             hi = mid;     /* no -1 */
}
return -1;`,
    why: "lo = mid and hi = mid can leave the interval unchanged (when hi = lo + 1, mid = lo). Nothing shrinks → the loop never ends. Time limit exceeded, forever.",
  },
];

function runVariant(id: string, t: number) {
  let lo = 0, hi = ARR.length - 1, probes = 0;
  const trace: { lo: number; hi: number; mid: number }[] = [];
  while (lo <= hi && probes < 30) {
    const mid = lo + Math.floor((hi - lo) / 2);
    probes++;
    trace.push({ lo, hi, mid });
    if (ARR[mid] === t) return { found: mid, probes, trace, verdict: "found" as const };
    if (ARR[mid] < t) lo = id === "C" ? mid : mid + 1;
    else hi = id === "C" ? mid : mid - 1;
    if (id === "C" && probes >= 6 && lo === trace[trace.length - 2]?.lo && hi === trace[trace.length - 2]?.hi)
      return { found: -1, probes, trace, verdict: "spin" as const };
    if (id === "B" && lo === hi) {
      // loop condition lo < hi fails: the last remaining element is NEVER checked
      return { found: -1, probes, trace, verdict: "miss" as const };
    }
  }
  return { found: -1, probes, trace, verdict: probes >= 30 ? ("spin" as const) : ("miss" as const) };
}

/* Item 17 · searching + running time — linear vs binary, invariant in motion */
export default function BinarySearchLab() {
  const [tab, setTab] = useState<"mech" | "drill">("mech");
  const [t, setT] = useState(23);
  const [stepIdx, setStepIdx] = useState(0); // probes revealed
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [pick, setPick] = useState<string | null>(null);
  const [drillT, setDrillT] = useState(91);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  const run = runVariant("A", t);
  const done = stepIdx >= run.trace.length;
  useTicker(playing && !done, speed, () => setStepIdx((v) => Math.min(run.trace.length, v + 1)), 950);

  const cur = stepIdx > 0 ? run.trace[stepIdx - 1] : null;
  const last = cur;
  const isFound = done && run.verdict === "found";
  const isMissed = done && run.verdict === "miss";

  const alive = (i: number) => {
    if (!last) return true;
    return i >= last.lo && i <= last.hi;
  };

  const drillRun = pick ? runVariant(pick, drillT) : null;
  const pickVariant = (id: string) => {
    setPick(id);
    const v = VARIANTS.find((x) => x.id === id)!;
    setFlash(v.truth === "correct" ? "ok" : "no");
    setTimeout(() => setFlash(null), 750);
  };

  const newMechRound = (nt: number) => { setT(nt); setStepIdx(0); setPlaying(false); };

  return (
    <LabFrame
      code="0017"
      title="half the world per probe"
      accent="var(--blue)"
      footer={
        tab === "mech"
          ? isFound
            ? `Found ${t} at index ${run.found} in ${run.probes} probes. A linear scan could have taken ${ARR.indexOf(t) + 1} — and up to ${ARR.length} on a miss.`
            : isMissed
              ? `${t} is not here: proven in ${run.probes} probes, not ${ARR.length}. The invariant did the proving.`
              : "Invariant: if t exists, it is inside [lo..hi]. Each probe keeps the invariant and halves the interval."
          : "Pick the implementation you trust, then run it against the target and watch what actually happens."
      }
    >
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <button className={`btn btn-sm ${tab === "mech" ? "btn-ink" : ""}`} onClick={() => setTab("mech")}>mechanics</button>
        <button className={`btn btn-sm ${tab === "drill" ? "btn-ink" : ""}`} onClick={() => setTab("drill")}>off-by-one drill</button>
      </div>

      {tab === "mech" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="f-ui text-[13.5px] mr-1" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>target t =</span>
              {TARGETS.map((v) => (
                <button key={v} className={`btn btn-sm mono ${v === t ? "btn-orange" : ""}`} style={{ fontSize: 12.5 }} onClick={() => newMechRound(v)}>{v}</button>
              ))}
            </div>
            <LabControls
              playing={playing}
              onPlay={() => { if (done) setStepIdx(0); setPlaying(!playing); }}
              onStep={() => { setPlaying(false); setStepIdx((v) => Math.min(run.trace.length, v + 1)); }}
              onReset={() => newMechRound(t)}
              speed={speed}
              setSpeed={setSpeed}
              stepLabel="probe"
            />
          </div>

          {/* array with pointers */}
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-1.5 min-w-max">
              {ARR.map((v, i) => {
                const st = !alive(i) ? "dead" : last && i === last.mid ? (isFound && i === run.found && done ? "hit" : "active") : alive(i) ? "idle" : "dim";
                return (
                  <Cell
                    key={i}
                    value={v}
                    label={
                      <span className="flex flex-col items-center leading-none gap-0.5">
                        <span>{i}</span>
                        {last && (
                          <span className="flex gap-0.5">
                            {i === last.lo && <b style={{ color: "var(--blue)" }}>lo</b>}
                            {i === last.mid && <b style={{ color: "var(--orange)" }}>mid</b>}
                            {i === last.hi && <b style={{ color: "var(--green)" }}>hi</b>}
                          </span>
                        )}
                      </span>
                    }
                    state={st as "idle" | "active" | "dim" | "hit" | "dead"}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <VarBox name="lo" value={last ? last.lo : 0} accent="var(--blue)" />
            <VarBox name="mid" value={last ? last.mid : "—"} accent="var(--orange)" />
            <VarBox name="hi" value={last ? last.hi : ARR.length - 1} accent="var(--green)" />
            <VarBox name="probes" value={stepIdx} />
            <div className="text-[13.5px] italic max-w-[260px]" style={{ color: "var(--ink-soft)" }}>
              n = {ARR.length} → worst case ⌈log₂ {ARR.length}⌉ + 1 = {Math.ceil(Math.log2(ARR.length)) + 1} probes. Linear: up to {ARR.length}.
            </div>
            {isFound && <span className="stamp stamp-green pop-in">found · {run.probes} probes</span>}
            {isMissed && <span className="stamp stamp-orange pop-in">absent · proven</span>}
          </div>

          {cur && !done && (
            <div className="mono text-[13.5px] font-semibold mt-3">
              a[{cur.mid}] = {ARR[cur.mid]} {ARR[cur.mid] === t ? "==" : ARR[cur.mid] < t ? "<" : ">"} {t} →{" "}
              {ARR[cur.mid] === t ? "return" : ARR[cur.mid] < t ? `lo = ${cur.mid + 1}` : `hi = ${cur.mid - 1}`}
            </div>
          )}
        </>
      )}

      {tab === "drill" && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="f-ui text-[13.5px]" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>three students submitted:</span>
            <select value={drillT} onChange={(e) => { setDrillT(parseInt(e.target.value)); setPick(null); }}>
              {TARGETS.map((v) => <option key={v} value={v}>t = {v}</option>)}
            </select>
            <span className="text-[13px] italic" style={{ color: "var(--ink-soft)" }}>only one is always right — run them and see.</span>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {VARIANTS.map((v) => {
              const picked = pick === v.id;
              const res = picked && drillRun ? drillRun : null;
              return (
                <button
                  key={v.id}
                  onClick={() => pickVariant(v.id)}
                  className={`text-left card-2 p-3 transition-all duration-150 ${picked && flash === "ok" ? "flash-ok" : ""}`}
                  style={{
                    "--sketch-c": picked ? (v.truth === "correct" ? "var(--green)" : "var(--orange)") : "var(--ink)",
                    boxShadow: picked
                      ? `7px 9px 18px -8px color-mix(in srgb, ${v.truth === "correct" ? "var(--green)" : "var(--orange)"} 55%, transparent)`
                      : "5px 7px 14px -9px rgba(29, 47, 78, 0.38)",
                    transform: picked ? "translateY(-2px)" : undefined,
                  } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="mono text-[12px] font-bold tracking-[0.12em]">SUBMISSION {v.name}</span>
                    {picked && res && (
                      <span className="mono text-[10.5px] font-bold" style={{ color: res.verdict === "found" ? "var(--green)" : "var(--orange)" }}>
                        {res.verdict === "found" ? `✓ found in ${res.probes}` : res.verdict === "miss" ? "✗ missed it" : "∞ never ends"}
                      </span>
                    )}
                  </div>
                  <pre className="mono text-[11px] leading-relaxed whitespace-pre" style={{ color: "var(--ink)" }}>{v.code}</pre>
                  {picked && (
                    <div className="mt-2 text-[12.5px] leading-snug pop-in" style={{ color: v.truth === "correct" ? "var(--green)" : "#9c3413" }}>
                      {v.why}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {pick && (
            <LabNote>
              <strong className="f-ui">The drill's point:</strong> off-by-one bugs don't crash — they pass the sample and fail one
              boundary. The invariant (“t is inside [lo..hi]”) plus “the interval must shrink” is the checklist that catches all three.
            </LabNote>
          )}
        </>
      )}
    </LabFrame>
  );
}
