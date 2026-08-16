import { useState } from "react";
import { Cell, LabControls, LabFrame, LabNote, VarBox, useTicker } from "./bits";

const ARR = [1, 3, 4, 7, 9, 12, 15, 18, 22, 26];
const TARGETS = [19, 25, 31, 11, 48, 17];

type Step = { i: number; j: number; verdict: "less" | "more" | "hit" | "gone"; pair: [number, number] | null };

function buildTrace(t: number): Step[] {
  const out: Step[] = [];
  let i = 0, j = ARR.length - 1;
  while (i < j) {
    const s = ARR[i] + ARR[j];
    if (s === t) { out.push({ i, j, verdict: "hit", pair: [ARR[i], ARR[j]] }); return out; }
    if (s < t) { out.push({ i, j, verdict: "less", pair: [ARR[i], ARR[j]] }); i++; }
    else { out.push({ i, j, verdict: "more", pair: [ARR[i], ARR[j]] }); j--; }
  }
  out.push({ i, j, verdict: "gone", pair: null });
  return out;
}

/* Item 20 preview · two pointers on a sorted array */
export default function TwoPointerLab() {
  const [t, setT] = useState(19);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const trace = buildTrace(t);
  const done = k >= trace.length;
  useTicker(playing && !done, speed, () => setK((v) => Math.min(trace.length, v + 1)), 950);

  const cur = k > 0 ? trace[k - 1] : null;
  const hit = trace.some((s, idx) => idx < k && s.verdict === "hit");

  return (
    <LabFrame
      code="0020"
      title="squeeze from both ends"
      accent="var(--orange)"
      footer={
        hit
          ? "Pair found. Every move of a pointer threw away a whole family of pairs at once — that's the O(n) hiding in an n² question."
          : done
            ? `${t} can't be written as a sum of two elements here — and the pointers proved it in ${trace.length - 1} probes, not ${ARR.length * (ARR.length - 1) / 2}.`
            : "Sorted array + target sum: too small → left pointer climbs; too big → right pointer retreats."
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="f-ui text-[13.5px] mr-1" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>sum S =</span>
          {TARGETS.map((v) => (
            <button key={v} className={`btn btn-sm mono ${v === t ? "btn-orange" : ""}`} style={{ fontSize: 12.5 }} onClick={() => { setT(v); setK(0); setPlaying(false); }}>{v}</button>
          ))}
        </div>
        <LabControls
          playing={playing}
          onPlay={() => { if (done) setK(0); setPlaying(!playing); }}
          onStep={() => { setPlaying(false); setK((v) => Math.min(trace.length, v + 1)); }}
          onReset={() => { setK(0); setPlaying(false); }}
          speed={speed}
          setSpeed={setSpeed}
          stepLabel="squeeze"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {ARR.map((v, idx) => {
          const st = cur ? (idx === cur.i || idx === cur.j ? (cur.verdict === "hit" ? "hit" : "active") : idx < cur.i || idx > cur.j ? "dead" : "idle") : "idle";
          return (
            <Cell
              key={idx}
              value={v}
              label={
                cur ? (
                  <span className="flex gap-1">
                    {idx === cur.i && <b style={{ color: "var(--blue)" }}>i</b>}
                    {idx === cur.j && <b style={{ color: "var(--green)" }}>j</b>}
                  </span>
                ) : ""
              }
              state={st as "idle" | "active" | "dim" | "hit" | "dead"}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {cur ? (
          <>
            <VarBox name="i" value={cur.i} accent="var(--blue)" />
            <VarBox name="j" value={cur.j} accent="var(--green)" />
            <div className="mono text-[14px] font-bold">
              {cur.pair ? (
                <>
                  {cur.pair[0]} + {cur.pair[1]} = {cur.pair[0] + cur.pair[1]}{" "}
                  {cur.verdict === "hit" ? <span style={{ color: "var(--green)" }}>= S ✓</span> : cur.verdict === "less" ? <span style={{ color: "var(--blue)" }}>&lt; S → i++</span> : <span style={{ color: "var(--orange)" }}>&gt; S → j−−</span>}
                </>
              ) : (
                <span style={{ color: "var(--orange)" }}>i met j — no pair sums to {t}</span>
              )}
            </div>
            {hit && <span className="stamp stamp-green pop-in">pair found</span>}
            {done && !hit && <span className="stamp stamp-orange pop-in">ruled out</span>}
          </>
        ) : (
          <div className="text-[14px] italic" style={{ color: "var(--ink-soft)" }}>
            press play — the pointers start at the extremes, where the sum is both largest and smallest.
          </div>
        )}
      </div>

      {done && (
        <LabNote>
          <strong className="f-ui">The discard argument:</strong> when a[i] + a[j] &lt; S, the pair (i, anything left of j) is too small as
          well — i advances and a whole column of candidates dies in one comparison. That's why two pointers turn n²/2 pairs into ≤ 2n probes.
        </LabNote>
      )}
    </LabFrame>
  );
}
