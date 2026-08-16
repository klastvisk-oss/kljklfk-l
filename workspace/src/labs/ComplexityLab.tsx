import React, { useMemo, useState } from "react";
import { LabFrame, LabNote } from "./bits";

type Preset = {
  id: string;
  label: string;
  loops: string[];          // human-readable loop lines
  nest: number;
  ops: (n: number) => number;
  cls: string;              // true class
  explain: string;
};

const PRESETS: Preset[] = [
  { id: "single", label: "one loop to n", loops: ["for (i = 0; i < n; i++)"], nest: 1, ops: (n) => n, cls: "O(n)", explain: "One loop, n turns. Sequential work adds: this is the unit everything else is compared to." },
  { id: "inner3", label: "loop n × 3 inside", loops: ["for (i = 0; i < n; i++)", "  for (j = 0; j < 3; j++)"], nest: 2, ops: (n) => 3 * n, cls: "O(n)", explain: "Nested, but the inner bound is a constant: 3n is still O(n). Constants never change the class." },
  { id: "double", label: "loop n × loop n", loops: ["for (i = 0; i < n; i++)", "  for (j = 0; j < n; j++)"], nest: 2, ops: (n) => n * n, cls: "O(n²)", explain: "Nested loops multiply: n × n. Every time n doubles, the work quadruples." },
  { id: "tri", label: "loop n × n × n", loops: ["for (i = 0; i < n; i++)", "  for (j = 0; j < n; j++)", "    for (k = 0; k < n; k++)"], nest: 3, ops: (n) => n * n * n, cls: "O(n³)", explain: "Three nested n-loops: n³. At n = 1000 that's 10⁹ operations — the usual time-limit wall." },
  { id: "halve", label: "i doubles each turn", loops: ["for (i = 1; i < n; i *= 2)"], nest: 1, ops: (n) => Math.max(1, Math.ceil(Math.log2(n))), cls: "O(log n)", explain: "The variable jumps by ×2, so the loop runs only ⌈log₂ n⌉ times. Halving (or doubling) progress = logarithm." },
];

const CLASS_OPTIONS = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)"];

/* Item 10 · read O(·) off the loop structure */
export default function ComplexityLab() {
  const [presetId, setPresetId] = useState("double");
  const [n, setN] = useState(6);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const ops = preset.ops(n);

  const bars = useMemo(
    () => PRESETS.map((p) => ({ p, v: p.ops(n) })).sort((a, b) => b.v - a.v),
    [n]
  );
  const maxBar = bars[0].v;

  const pick = (c: string) => {
    setPicked(c);
    if (c === preset.cls) {
      setStreak((s) => s + 1);
      setFlash("ok");
    } else {
      setStreak(0);
      setFlash("no");
    }
    setTimeout(() => setFlash(null), 750);
  };

  return (
    <LabFrame
      code="0010"
      title="name the growth"
      accent="var(--blue)"
      footer={
        picked === null ? (
          <span>Drag n, watch the work grow, then commit to a class below.</span>
        ) : picked === preset.cls ? (
          <span>Correct — {preset.explain}</span>
        ) : (
          <span>Not yet. Count how many times the innermost line runs <em>as a function of n</em>, then try again.</span>
        )
      }
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5 items-start">
        <div>
          {/* structure picker */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                className={`btn btn-sm ${p.id === presetId ? "btn-ink" : ""}`}
                onClick={() => { setPresetId(p.id); setPicked(null); }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* nested loop picture */}
          <div className="doodle-border p-3 bg-[#fcf8ec]">
            <div className="flex items-center gap-4">
              <div className="mono text-[13px] leading-relaxed whitespace-pre font-semibold">{preset.loops.join("\n")}</div>
              <div className="ml-auto text-right">
                <div className="f-ui text-[12.5px]" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>innermost runs</div>
                <div className={`mono text-[26px] font-bold leading-none ${flash === "ok" ? "flash-ok" : ""}`} style={{ color: "var(--orange)" }}>{ops}×</div>
              </div>
            </div>
            <label className="flex items-center gap-3 mt-3">
              <span className="mono text-[11px] font-bold tracking-wide" style={{ color: "var(--ink-soft)" }}>n =</span>
              <input type="range" min={2} max={preset.id === "tri" ? 14 : 32} value={n} onChange={(e) => setN(parseInt(e.target.value))} style={{ flex: 1 }} aria-label="input size n" />
              <span className="mono text-[16px] font-bold w-8 text-right">{n}</span>
            </label>
            {/* dot field: one dot per innermost run */}
            <div className="mt-3 flex flex-wrap gap-[3px] min-h-[26px] rough-lo" aria-hidden="true">
              {Array.from({ length: Math.min(ops, 400) }).map((_, i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "2px 3px 2px 4px", background: i < 400 ? "var(--blue)" : "var(--ink)", opacity: 0.85, display: "inline-block" }} />
              ))}
              {ops > 400 && <span className="mono text-[11px] font-bold self-center" style={{ color: "var(--orange)" }}>…+{ops - 400} more</span>}
            </div>
          </div>

          {/* growth comparison */}
          <div className="mt-3">
            <div className="f-ui text-[13px] mb-1.5" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>all five, at n = {n}</div>
            {bars.map(({ p, v }) => (
              <div key={p.id} className="flex items-center gap-2 mb-1">
                <span className="mono text-[10.5px] font-semibold w-14 shrink-0" style={{ color: p.id === presetId ? "var(--orange)" : "var(--ink-soft)" }}>{p.cls}</span>
                <div className="h-[11px] border-[1.5px] border-[var(--ink)] flex-1 bg-[#fcf8ec]" style={{ borderRadius: "5px 8px 4px 9px" }}>
                  <div className="h-full transition-all duration-500" style={{ width: `${Math.max(1.5, (v / maxBar) * 100)}%`, background: p.id === presetId ? "var(--orange)" : "var(--blue)", borderRadius: "4px 7px 3px 8px" }} />
                </div>
                <span className="mono text-[11px] font-bold w-12 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* quiz side */}
        <div className={`doodle-border p-4 bg-[var(--card-2)] ${flash === "no" ? "flash-no" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="f-ui text-[13.5px]" style={{ color: "var(--orange)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--orange) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>your call</div>
            <div className="chip chip-orange">streak {streak}</div>
          </div>
          <div className="f-ui text-[17px] mb-3" style={{ fontWeight: 750 }}>
            “{preset.label}” runs in…
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CLASS_OPTIONS.map((c) => {
              const isRight = picked !== null && c === preset.cls;
              const isWrongPick = picked === c && c !== preset.cls;
              return (
                <button
                  key={c}
                  onClick={() => pick(c)}
                  className="btn justify-center mono"
                  style={{
                    fontSize: 14,
                    "--btn-bg": isRight ? "var(--green)" : isWrongPick ? "var(--orange)" : undefined,
                    color: isRight || isWrongPick ? "#fdf6e6" : undefined,
                  } as React.CSSProperties}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {picked === preset.cls && (
            <div className="mt-3 stamp stamp-green pop-in">nailed it</div>
          )}
          <div className="mt-3">
            <div className="f-ui text-[13px] mb-1.5" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>reading rules</div>
            <ul className="text-[13.5px] space-y-1 list-none">
              <li>↳ nested loops <strong>multiply</strong></li>
              <li>↳ sequential loops <strong>add</strong> (keep the biggest)</li>
              <li>↳ constant inner bounds <strong>vanish</strong></li>
              <li>↳ ×2 / ÷2 steps mean <strong>logarithm</strong></li>
            </ul>
          </div>
        </div>
      </div>
      {streak >= 3 && (
        <LabNote>
          <strong className="f-ui">Streak {streak}!</strong> You're reading structure, not counting dots. On exam paper there is no
          compiler — this exact skill decides what you attempt first.
        </LabNote>
      )}
    </LabFrame>
  );
}
