import { useState } from "react";
import { LabControls, LabFrame, LabNote, useTicker } from "./bits";

function buildSieve(N: number) {
  const isC = new Array<boolean>(N + 1).fill(false);
  const steps: { p: number; hits: number[] }[] = [];
  for (let p = 2; p * p <= N; p++) {
    if (!isC[p]) {
      const hits: number[] = [];
      for (let m = p * p; m <= N; m += p) if (!isC[m]) { isC[m] = true; hits.push(m); }
      steps.push({ p, hits });
    }
  }
  const primes: number[] = [];
  for (let v = 2; v <= N; v++) if (!isC[v]) primes.push(v);
  return { steps, primes };
}

/* Item 28 preview · the sieve of Eratosthenes, one prime per step */
export default function SieveLab() {
  const [N, setN] = useState(60);
  const [k, setK] = useState(0); // primes processed
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const { steps, primes } = buildSieve(N);
  const done = k >= steps.length;
  useTicker(playing && !done, speed, () => setK((v) => Math.min(steps.length, v + 1)), 1100);

  const crossed = new Set<number>();
  const lastHits = new Set<number>();
  steps.slice(0, k).forEach((s) => s.hits.forEach((h) => crossed.add(h)));
  if (k > 0) steps[k - 1].hits.forEach((h) => lastHits.add(h));
  const curP = k > 0 && k <= steps.length ? steps[k - 1].p : null;

  return (
    <LabFrame
      code="0028"
      title="cross out the multiples"
      accent="var(--green)"
      footer={
        done
          ? `Sweep finished: ${primes.length} primes ≤ ${N}, found with only ${steps.length} crossing passes. Trial division would re-check every candidate from scratch.`
          : "Each pass takes the smallest uncrossed number (necessarily prime) and kills its multiples from p² onward — smaller ones died earlier."
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <label className="flex items-center gap-3 mono text-[11px] font-bold tracking-wide" style={{ color: "var(--ink-soft)" }}>
          N =
          <input type="range" min={30} max={120} step={10} value={N} onChange={(e) => { setN(parseInt(e.target.value)); setK(0); setPlaying(false); }} style={{ width: 130 }} aria-label="sieve limit N" />
          <span className="text-[15px] text-[var(--ink)]">{N}</span>
        </label>
        <LabControls
          playing={playing}
          onPlay={() => { if (done) setK(0); setPlaying(!playing); }}
          onStep={() => { setPlaying(false); setK((v) => Math.min(steps.length, v + 1)); }}
          onReset={() => { setPlaying(false); setK(0); }}
          speed={speed}
          setSpeed={setSpeed}
          stepLabel="next prime"
        />
      </div>

      <div className="flex flex-wrap gap-[5px] rough-lo">
        {Array.from({ length: N - 1 }, (_, i) => i + 2).map((v) => {
          const dead = crossed.has(v);
          const fresh = lastHits.has(v);
          const isP = curP === v;
          return (
            <div
              key={v}
              className="mono flex items-center justify-center transition-all duration-300"
              style={{
                width: v >= 100 ? 34 : 30,
                height: 30,
                fontSize: 11.5,
                fontWeight: 700,
                border: "1.5px solid var(--ink)",
                borderRadius: "6px 9px 5px 10px / 9px 5px 10px 6px",
                background: isP ? "var(--orange)" : fresh ? "rgba(228,87,46,0.30)" : dead ? "rgba(29,47,78,0.08)" : "#fcf8ec",
                color: isP ? "#fdf3e7" : dead ? "rgba(29,47,78,0.38)" : "var(--ink)",
                textDecoration: dead ? "line-through 2px var(--orange)" : undefined,
                transform: isP ? "scale(1.18)" : fresh ? "scale(0.92)" : undefined,
                boxShadow: isP ? "2px 2px 0 var(--ink)" : undefined,
              }}
            >
              {v}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {curP !== null && !done && (
          <div className="mono text-[13.5px] font-bold" style={{ color: "var(--orange)" }}>
            p = {curP}: crossing {steps[k - 1].hits.length} multiples starting at {curP}²…
          </div>
        )}
        <div className="mono text-[13px] font-semibold" style={{ color: "var(--green)" }}>
          primes so far: {primes.filter((p) => p <= (curP ?? 1) || done).length} {done && `of ${primes.length} total`}
        </div>
      </div>

      {done && (
        <LabNote>
          <strong className="f-ui">Why it's fast:</strong> every composite ≤ N has a prime factor ≤ √N, so only those primes ever lead a
          pass — {steps.length} passes here. Total work is O(N log log N): for counting primes it beats testing each number by a country mile.
        </LabNote>
      )}
    </LabFrame>
  );
}
