import React, { createContext, useContext, useState } from "react";
import { getItem, type Quiz } from "../data/curriculum";

/* lets a lesson page learn that its exit quiz was passed,
   even when the quiz is mounted deep inside an authored step */
const SolvedCtx = createContext<(() => void) | undefined>(undefined);
export const QuizSolvedProvider = SolvedCtx.Provider;

const WAVY = (color: string): React.CSSProperties => ({
  textDecoration: "underline wavy",
  textDecorationColor: `color-mix(in srgb, ${color} 50%, transparent)`,
  textDecorationThickness: 2,
  textUnderlineOffset: 5,
});

export function QuizBlock({ quiz, onSolved }: { quiz: Quiz; onSolved?: () => void }) {
  /* any quiz mounted inside a lesson step auto-reports to the page's
     completion gate through the provider */
  const ctxSolved = useContext(SolvedCtx);
  const report = () => { ctxSolved?.(); onSolved?.(); };
  const isInput = quiz.type === "input";
  const [picked, setPicked] = useState<number | null>(null);
  const [val, setVal] = useState("");
  const [wrongFlash, setWrongFlash] = useState(false);
  const [tries, setTries] = useState(0);
  const solved = isInput ? picked === 1 : picked !== null && picked === quiz.answer;

  const fail = () => {
    setWrongFlash(true);
    setTries((t) => t + 1);
    setTimeout(() => setWrongFlash(false), 450);
  };

  const checkInput = () => {
    if (solved) return;
    const n = parseInt(val.replace(/[^\d-]/g, ""), 10);
    if (Number.isFinite(n) && n === quiz.inputAnswer) {
      setPicked(1);
      report();
    } else fail();
  };

  const choose = (i: number) => {
    if (solved) return;
    setPicked(i);
    if (i === quiz.answer) report();
    else fail();
  };

  return (
    <div className={`card-2 p-4 sm:p-6 ${wrongFlash ? "flash-no" : ""} ${solved ? "flash-ok" : ""}`}>
      <div
        className="f-ui text-[15.5px] mb-2.5"
        style={{ color: "var(--orange)", fontWeight: 780, fontStyle: "italic", ...WAVY("var(--orange)") }}
      >
        {isInput ? "retrieval check — no options; produce the answer from memory" : "retrieval check — answer from memory first"}
      </div>
      <div className="f-ui text-[19px] leading-snug mb-4" style={{ fontWeight: 750 }}>{quiz.q}</div>

      {isInput ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={val}
            disabled={solved}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") checkInput(); }}
            placeholder="your answer…"
            aria-label="your answer"
            className="mono"
            style={{ width: 170, fontSize: 17, fontWeight: 700, textAlign: "center" }}
          />
          <button className="btn btn-ink" onClick={checkInput} disabled={solved || val.trim() === ""}>
            check my answer
          </button>
          {solved && <span className="stamp stamp-green pop-in">correct — stamped</span>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {(quiz.options ?? []).map((opt, i) => {
            const isRight = solved && i === quiz.answer;
            const isWrong = picked === i && i !== quiz.answer;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className="btn justify-start text-left"
                style={{
                  fontSize: 15.5,
                  fontWeight: 600,
                  "--btn-bg": isRight ? "var(--green)" : isWrong ? "var(--orange)" : "#fcf8ec",
                  color: isRight || isWrong ? "#fdf6e6" : "var(--ink)",
                } as React.CSSProperties}
              >
                <span className="mono text-[12.5px] font-bold mr-2 opacity-70">{String.fromCharCode(97 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {picked !== null && !solved && (
        <div className="mt-3 text-[15px] font-semibold" style={{ color: "#9c3413" }}>
          {isInput
            ? `Not yet${tries > 1 ? ` — ${tries} tries so far` : ""}. ${quiz.inputHint ?? "Go back one step and retrace it with pencil."}`
            : "Not yet — eliminate one option out loud, then try again. The goal is understanding, not luck."}
        </div>
      )}
      {solved && (
        <div className="mt-3.5 text-[15.5px] leading-relaxed" style={{ color: "#1e5637" }}>
          <strong className="f-ui">Why that's right:</strong> {quiz.explain}
        </div>
      )}
    </div>
  );
}

/* mounts an item's authored quiz (used by recap lessons);
   reports success through the provider if one is mounted */
export function QuizSlot({ id, onSolved }: { id: string; onSolved?: () => void }) {
  const ctxSolved = useContext(SolvedCtx);
  const q = getItem(id)?.item.quiz;
  if (!q) return null;
  return <QuizBlock quiz={q} onSolved={() => { ctxSolved?.(); onSolved?.(); }} />;
}
