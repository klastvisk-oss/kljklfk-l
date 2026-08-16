import { useState } from "react";
import { Cell, LabControls, LabFrame, LabNote, VarBox, useTicker } from "./bits";

const TAPE = [152, 171, 140, 180, 165, 171, 149, 190, 158, 176];
const HMIN = 160;

/* Item 2 · streaming input: don't store what you only visit once */
export default function StreamLab() {
  const [k, setK] = useState(0); // values consumed so far
  const [mode, setMode] = useState<"stream" | "array">("stream");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const ok = TAPE.slice(0, k).filter((h) => h >= HMIN).length;
  const cur = k > 0 ? TAPE[k - 1] : null;
  const done = k >= TAPE.length;

  useTicker(playing && !done, speed, () => setK((v) => Math.min(TAPE.length, v + 1)), 780);

  return (
    <LabFrame
      code="0002"
      title="the tape vs. the box"
      accent="var(--green)"
      footer={
        done ? (
          <span>
            Answer <strong className="mono">{ok}</strong> players clear {HMIN} cm — computed with the values already gone from memory.{" "}
            {mode === "stream" ? "Peak storage: 3 ints, forever." : "Peak storage: n ints — and you never read the box back."}
          </span>
        ) : (
          <span>Press play or step. Watch what the program chooses to remember.</span>
        )
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="f-ui text-[13.5px] mr-1" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>memory model</span>
          <button className={`btn btn-sm ${mode === "stream" ? "btn-green" : ""}`} onClick={() => setMode("stream")}>stream · 3 vars</button>
          <button className={`btn btn-sm ${mode === "array" ? "btn-orange" : ""}`} onClick={() => setMode("array")}>array[n]</button>
        </div>
        <LabControls
          playing={playing}
          onPlay={() => { if (done) setK(0); setPlaying(!playing); }}
          onStep={() => { setPlaying(false); setK((v) => Math.min(TAPE.length, v + 1)); }}
          onReset={() => { setPlaying(false); setK(0); }}
          speed={speed}
          setSpeed={setSpeed}
        />
      </div>

      {/* input tape */}
      <div className="mb-4">
        <div className="f-ui text-[13px] mb-2" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>
          stdin — one value at a time {mode === "stream" && <span style={{ color: "var(--orange)" }}>(read, decide, forget)</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAPE.map((h, i) => (
            <Cell
              key={i}
              value={h}
              small
              label={i === k - 1 ? "h" : i < k ? (h >= HMIN ? "✓" : "·") : ""}
              state={i < k - 1 ? "dim" : i === k - 1 ? (h >= HMIN ? "hit" : "active") : "idle"}
            />
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* memory panel */}
        <div className="doodle-border p-3 bg-[#fcf8ec]">
          <div className="f-ui text-[13px] mb-2.5" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>
            what the program remembers
          </div>
          {mode === "stream" ? (
            <div className="flex flex-wrap gap-2">
              <VarBox name="n" value={TAPE.length} />
              <VarBox name="h" value={cur ?? "—"} accent="var(--blue)" />
              <VarBox name="ok" value={ok} accent="var(--green)" />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-1.5">
                {TAPE.map((h, i) => (
                  <Cell key={i} value={i < k ? h : ""} small state={i < k ? "idle" : "dim"} label={i} />
                ))}
              </div>
              <div className="mono text-[11px] mt-2 font-semibold" style={{ color: "var(--orange)" }}>
                {k}/{TAPE.length} slots filled · grows with the input · never read back
              </div>
            </div>
          )}
        </div>

        {/* live decision */}
        <div className="doodle-border p-3 bg-[var(--card-2)]">
          <div className="f-ui text-[13px] mb-2.5" style={{ color: "var(--ink-soft)", fontWeight: 740, fontStyle: "italic" }}>
            live decision
          </div>
          {cur !== null ? (
            <div className="mono text-[15px] font-bold">
              h = {cur} {cur >= HMIN ? "≥" : "<"} {HMIN} →{" "}
              <span style={{ color: cur >= HMIN ? "var(--green)" : "var(--orange)" }}>{cur >= HMIN ? "ok++" : "skip"}</span>
            </div>
          ) : (
            <div className="mono text-[13px]" style={{ color: "var(--ink-soft)" }}>waiting for the first height…</div>
          )}
          <div className="mt-3 flex items-center gap-3">
            <VarBox name="ok" value={ok} accent="var(--green)" />
            <div className="text-[13.5px] italic" style={{ color: "var(--ink-soft)" }}>
              the answer so far —<br />the only thing worth keeping
            </div>
          </div>
        </div>
      </div>

      {done && mode === "stream" && (
        <LabNote>
          <strong className="f-ui">The lesson:</strong> the array version and the stream version print the same number — but one of them
          pays <em>O(n)</em> memory for information it never uses again. Before allocating, ask:{" "}
          <em>will I ever visit this value twice?</em>
        </LabNote>
      )}
      {done && mode === "array" && (
        <LabNote>
          <strong className="f-ui">The lesson:</strong> this box holds {TAPE.length} ints and the code only ever reads each of them once,
          in order. Flip to <em>stream · 3 vars</em> and watch the answer survive with almost no memory at all.
        </LabNote>
      )}
    </LabFrame>
  );
}
