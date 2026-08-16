import { useState } from "react";
import { LabControls, LabFrame, LabNote, useTicker } from "./bits";

const A = [3, 1, 4, 1, 5, 9, 2, 6];
const P = A.reduce<number[]>((acc, v) => { acc.push((acc[acc.length - 1] ?? 0) + v); return acc; }, [0]);
const MAXP = P[P.length - 1];

/* Item 14 · prefix sums — O(1) range queries after O(n) build */
export default function PrefixSumLab() {
  const [mode, setMode] = useState<"build" | "query">("build");
  const [k, setK] = useState(0); // P entries built (P[0] counts as step 0)
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [l, setL] = useState(2); // 1-indexed into A
  const [r, setR] = useState(6);

  const built = k >= A.length;
  useTicker(playing && !built, speed, () => setK((v) => Math.min(A.length, v + 1)), 820);

  const sum = P[r] - P[l - 1];

  return (
    <LabFrame
      code="0014"
      title="pay once, ask forever"
      accent="var(--orange)"
      footer={
        mode === "build"
          ? built
            ? "Built. P[i] is the sum of everything to its left — including itself. That one array is about to answer an unlimited number of questions."
            : "Each step adds exactly one number. Total bill: n additions, paid once."
          : "Drag the window. Every query costs two subtractions no matter how wide the range — that is the whole trick."
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="mono text-[11px] font-bold tracking-[0.14em] mr-1" style={{ color: "var(--ink-soft)" }}>PHASE</span>
          <button className={`btn btn-sm ${mode === "build" ? "btn-orange" : ""}`} onClick={() => setMode("build")}>1 · build P[]</button>
          <button className={`btn btn-sm ${mode === "query" ? "btn-green" : ""}`} onClick={() => { setMode("query"); setK(A.length); }} disabled={!built}>
            2 · answer queries
          </button>
        </div>
        {mode === "build" && (
          <LabControls
            playing={playing}
            onPlay={() => { if (built) setK(0); setPlaying(!playing); }}
            onStep={() => { setPlaying(false); setK((v) => Math.min(A.length, v + 1)); }}
            onReset={() => { setPlaying(false); setK(0); }}
            speed={speed}
            setSpeed={setSpeed}
          />
        )}
      </div>

      {/* the array A with query window */}
      <div className="mb-5">
        <div className="mono text-[10.5px] font-bold tracking-[0.16em] mb-2" style={{ color: "var(--ink-soft)" }}>
          A[1..{A.length}] — the raw data
        </div>
        <div className="flex items-end gap-1.5 flex-wrap">
          {A.map((v, i) => {
            const idx = i + 1;
            const inWin = mode === "query" && idx >= l && idx <= r;
            const consumed = mode === "build" && idx <= k;
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="border-2 border-[var(--ink)] flex items-end justify-center transition-all duration-500"
                  style={{
                    width: 42,
                    height: 12 + v * 8,
                    background: inWin ? "var(--green)" : consumed ? "rgba(228,87,46,0.25)" : "#fcf8ec",
                    borderRadius: "8px 11px 5px 12px / 11px 5px 12px 8px",
                    boxShadow: inWin ? "2px 2px 0 var(--ink)" : undefined,
                  }}
                />
                <div className="mono text-[13px] font-bold mt-1">{v}</div>
                <div className="mono text-[9.5px]" style={{ color: "var(--ink-soft)" }}>{idx}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* the prefix array P */}
      <div className="doodle-border p-3 bg-[#fcf8ec]">
        <div className="mono text-[10.5px] font-bold tracking-[0.16em] mb-2" style={{ color: "var(--ink-soft)" }}>
          P[0..{A.length}] — sums of prefixes {mode === "build" && <span style={{ color: "var(--orange)" }}>· {k + 1}/{A.length + 1} built</span>}
        </div>
        <div className="flex items-end gap-1.5 flex-wrap">
          {P.map((v, i) => {
            const isBuilt = i <= k;
            const isEdge = mode === "query" && (i === r || i === l - 1);
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="border-2 border-[var(--ink)] flex items-end justify-center transition-all duration-500"
                  style={{
                    width: 42,
                    height: 10 + (v / MAXP) * 86,
                    background: isEdge ? "var(--orange)" : isBuilt ? "var(--blue)" : "rgba(29,47,78,0.05)",
                    opacity: isBuilt ? 1 : 0.5,
                    borderRadius: "11px 8px 12px 5px / 5px 12px 8px 11px",
                    boxShadow: isEdge ? "2px 2px 0 var(--ink)" : undefined,
                  }}
                />
                <div className="mono text-[13px] font-bold mt-1" style={{ opacity: isBuilt ? 1 : 0.35 }}>{isBuilt ? v : "·"}</div>
                <div className="mono text-[9.5px]" style={{ color: "var(--ink-soft)" }}>{i}</div>
              </div>
            );
          })}
        </div>
        {mode === "build" && k > 0 && !built && (
          <div className="mono text-[14px] font-bold mt-3" style={{ color: "var(--orange)" }}>
            P[{k}] = P[{k - 1}] + A[{k}] = {P[k - 1]} + {A[k - 1]} = {P[k]}
          </div>
        )}
        {mode === "build" && built && (
          <div className="mono text-[14px] font-bold mt-3" style={{ color: "var(--green)" }}>
            done: {A.length} additions total → now any range sum is two subtractions.
          </div>
        )}
      </div>

      {/* query console */}
      {mode === "query" && (
        <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <span className="mono text-[12px] font-bold w-8">l =</span>
              <input type="range" min={1} max={A.length} value={l} onChange={(e) => setL(Math.min(parseInt(e.target.value), r))} style={{ flex: 1 }} aria-label="query left end" />
              <span className="mono font-bold w-6 text-right">{l}</span>
            </label>
            <label className="flex items-center gap-3">
              <span className="mono text-[12px] font-bold w-8">r =</span>
              <input type="range" className="range-green" min={1} max={A.length} value={r} onChange={(e) => setR(Math.max(parseInt(e.target.value), l))} style={{ flex: 1 }} aria-label="query right end" />
              <span className="mono font-bold w-6 text-right">{r}</span>
            </label>
          </div>
          <div className="doodle-border px-4 py-3 bg-[var(--card-2)]">
            <div className="mono text-[14px] font-bold">
              sum = P[{r}] − P[{l - 1}] = {P[r]} − {P[l - 1]} = <span style={{ color: "var(--green)" }}>{sum}</span>
            </div>
            <div className="mono text-[11px] mt-1.5" style={{ color: "var(--ink-soft)" }}>
              naive loop: {r - l + 1} additions · prefix sums: <strong style={{ color: "var(--orange)" }}>2 ops</strong> · 10⁵ queries? still 2 ops each.
            </div>
          </div>
        </div>
      )}

      {mode === "query" && (
        <LabNote>
          <strong className="f-ui">The invariant:</strong> P never changes after the build — that's why CSES calls these{" "}
          <em>static</em> range sums. If updates arrive between queries, the premise breaks and the tool changes (that's a later phase's problem — and it's explicitly out of scope here).
        </LabNote>
      )}
    </LabFrame>
  );
}
