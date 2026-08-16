import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CodeBlock, HandDivider, StatusStamp, Squiggle, useReviewedCtx } from "../components/fx";
import { ProblemCard } from "../components/ProblemCard";
import { getProblems } from "../data/problems";
import { QuizBlock, QuizSolvedProvider } from "../components/QuizBlock";
import { getItem, nextItem, prevItem, type Item, type Phase, type Quiz } from "../data/curriculum";
import { LAB_STEPS, PREVIEWS, type Step, type StepKind } from "./labSteps";
import { DRILL_INTROS, RECAP_STEPS, SKILLS, TEACHBACK } from "../data/recapContent";
import { LESSONS_A } from "../data/lessonsCoreA";
import { LESSONS_B } from "../data/lessonsCoreB";
import { DRILL_QUIZZES } from "../data/drillQuizzes";
import { LESSONS_P1 } from "../data/lessonsPhase1";
import { LESSONS_P4 } from "../data/lessonsPhase4";
import { LESSONS_P5A } from "../data/lessonsPhase5A";
import { LESSONS_P5B } from "../data/lessonsPhase5B";

/* fully-authored, self-contained teaching for every concept lesson.
   Merged once; buildSteps consults this first. Order matters: later
   spreads override earlier ones, so the deep rewrites (P1) win over
   the older short versions in CoreA. */
export const FULL_LESSONS: Record<string, Step[]> = {
  ...LESSONS_A,
  ...LESSONS_B,
  ...LESSONS_P1,
  ...LESSONS_P4,
  ...LESSONS_P5A,
  ...LESSONS_P5B,
};

/* ————— the exit-ticket quizzes for the lab lessons ————— */
/* Exit tickets: input type = produce the number from memory (true recall);
   mc type = reserved for genuinely conceptual discriminations. */
const LAB_QUIZZES: Record<string, Quiz> = {
  "p1-02": {
    type: "input",
    q: "Streaming the count of heights ≥ H: what is the minimum number of int variables the program must keep alive (including n itself)?",
    inputAnswer: 3,
    inputHint: "n, the height you're reading right now, and the running count. Anything else?",
    explain:
      "n, h, and ok — three ints, forever. The moment you reach for an array, ask which of the three it replaces: none of them. The median, by contrast, WOULD force storage — it needs the whole multiset.",
  },
  "p1-10": {
    type: "input",
    q: "for (i = 0; i < n; i++) for (j = 0; j < i; j++) work(); — with n = 8, exactly how many times does work() run?",
    inputAnswer: 28,
    inputHint: "0 + 1 + 2 + … + (n−1). There's a closed form for that sum.",
    explain: "0+1+…+7 = 8·7/2 = 28 — a triangular number. Still O(n²): the ½ vanishes, the quadratic shape doesn't.",
  },
  "p2-14": {
    type: "input",
    q: "sum[3..7] = P[7] − P[?]. What number fills the blank?",
    inputAnswer: 2,
    inputHint: "The left endpoint must stay inside the sum. So you subtract everything strictly before it.",
    explain: "a − 1 = 2. Subtracting P[3] would silently drop element 3 — the single off-by-one this pattern has, and it lives at the left endpoint.",
  },
  "p2-17": {
    type: "input",
    q: "Worst-case: how many probes does binary search need on 1,000,000 sorted elements?",
    inputAnswer: 20,
    inputHint: "⌈log₂ 10⁶⌉. How many times can you halve a million before one element is left?",
    explain: "⌈log₂ 10⁶⌉ ≈ 20. Each probe halves the interval; twenty halvings turn a million into one. A linear scan would need up to 1,000,000.",
  },
};

/* ————— pedagogical role of each step — always visible, so the reader
       knows WHY they are looking at what they are looking at ————— */
const KIND_META: Record<StepKind, { label: string; color: string }> = {
  context: { label: "context · why this earns exam time", color: "var(--orange)" },
  concept: { label: "the concept", color: "var(--blue)" },
  handson: { label: "hands-on · move it yourself", color: "var(--orange)" },
  worked: { label: "worked example · pencil speed", color: "var(--green)" },
  bug: { label: "spot the bug", color: "var(--orange)" },
  retrieval: { label: "retrieval · prove it stuck", color: "var(--green)" },
  problem: { label: "problem sheet · what the judge will actually ask", color: "var(--blue)" },
};

/* ————— teach-it-back (Feynman): write the sentence, then compare ————— */
function TeachBack({ id }: { id: string }) {
  const tb = TEACHBACK[id];
  const [val, setVal] = useState(() => {
    try { return localStorage.getItem("ml-teach-" + id) ?? ""; } catch { return ""; }
  });
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);
  if (!tb) return null;

  const save = () => {
    try { localStorage.setItem("ml-teach-" + id, val); } catch { /* private mode */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 800);
  };

  return (
    <div className={`card-2 p-4 sm:p-5 mt-5 ${saved ? "flash-ok" : ""}`}>
      <div className="f-ui text-[15px] mb-2.5" style={{ color: "var(--green)", fontWeight: 760, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--green) 55%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>
        teach it back — if you can't say it in one sentence, it isn't yours yet
      </div>
      <p className="f-ui text-[16.5px] m-0 mb-3" style={{ fontWeight: 700 }}>{tb.prompt}</p>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        placeholder="your one sentence…"
        className="doodle-border w-full p-3 text-[15px] leading-relaxed"
        style={{
          fontFamily: "var(--font)",
          background: "#fcf8ec",
          borderRadius: "8px 12px 9px 13px / 12px 9px 13px 8px",
          color: "var(--ink)",
          resize: "vertical",
        }}
        aria-label="your one-sentence explanation"
      />
      <div className="flex flex-wrap gap-2.5 mt-3 items-center">
        <button className="btn btn-sm" onClick={save} disabled={val.trim().length === 0}>save my sentence</button>
        <button className="btn btn-sm btn-green" onClick={() => setShow((s) => !s)}>
          {show ? "hide the model sentence" : "reveal the model sentence"}
        </button>
        {saved && <span className="mono text-[12px] font-bold" style={{ color: "var(--green)" }}>kept in your notebook ✓</span>}
      </div>
      {show && (
        <div className="doodle-border mt-3 p-3.5 step-in text-[15px] leading-relaxed" style={{ background: "var(--green-soft)", borderRadius: "10px 13px 9px 14px / 13px 9px 14px 10px", "--sketch-c": "var(--green)" } as React.CSSProperties}>
          <span className="f-ui text-[13.5px] block mb-1" style={{ color: "var(--green)", fontWeight: 760, fontStyle: "italic" }}>the model sentence</span>
          {tb.model}
          <p className="text-[13px] italic mt-2 mb-0" style={{ color: "var(--ink-soft)" }}>
            Yours doesn't need these words — it needs the same idea. If the gap between the two sentences surprised you, re-read the concept step.
          </p>
        </div>
      )}
    </div>
  );
}

/* ————— right margin: the reference strip beside the reading ————— */
function Margin({ item, phase, prv, nxt, reviewed, ctx }: {
  item: Item; phase: Phase; prv: Item | null; nxt: Item | null; reviewed: boolean;
  ctx: ReturnType<typeof useReviewedCtx>;
}) {
  return (
    <aside className="sticky top-24 self-start hidden xl:flex flex-col gap-4" aria-label="lesson margin">
      <div className="card-2 p-4" style={{ boxShadow: "5px 6px 14px -9px rgba(29,47,78,0.4)" }}>
        <div className="f-ui text-[13px] mb-2" style={{ color: "var(--orange)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--orange) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 4 }}>
          the big idea of {phase.numeral}
        </div>
        <p className="f-body text-[14.5px] leading-relaxed m-0" style={{ color: "var(--ink-2)" }}>“{phase.bigIdea}”</p>
      </div>

      <div className="card-2 p-4" style={{ boxShadow: "5px 6px 14px -9px rgba(29,47,78,0.4)" }}>
        <div className="f-ui text-[13px] mb-2.5" style={{ color: "var(--blue)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--blue) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 4 }}>
          where this sits
        </div>
        <div className="space-y-2">
          {prv ? (
            <Link to={`/lesson/${prv.id}`} className="block no-underline group">
              <span className="mono text-[10px] font-bold block" style={{ color: "var(--ink-soft)" }}>↳ builds on</span>
              <span className="f-ui text-[13.5px] leading-snug block group-hover:underline" style={{ fontWeight: 700 }}>#{prv.num} {prv.title}</span>
            </Link>
          ) : (
            <span className="mono text-[11px]" style={{ color: "var(--ink-soft)" }}>↳ the starting line</span>
          )}
          {nxt ? (
            <Link to={`/lesson/${nxt.id}`} className="block no-underline group">
              <span className="mono text-[10px] font-bold block" style={{ color: "var(--ink-soft)" }}>↳ unlocks</span>
              <span className="f-ui text-[13.5px] leading-snug block group-hover:underline" style={{ fontWeight: 700 }}>#{nxt.num} {nxt.title}</span>
            </Link>
          ) : (
            <span className="mono text-[11px]" style={{ color: "var(--ink-soft)" }}>↳ the last page</span>
          )}
        </div>
      </div>

      <div className="card-2 p-4" style={{ boxShadow: "5px 6px 14px -9px rgba(29,47,78,0.4)" }}>
        <div className="f-ui text-[13px] mb-2.5" style={{ color: "var(--green)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--green) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 4 }}>
          your ledger
        </div>
        <button className={`btn btn-sm w-full justify-center ${reviewed ? "" : "btn-green"}`} onClick={() => ctx?.toggle(item.id)}>
          {reviewed ? "reviewed ✓ · unmark" : "mark as reviewed"}
        </button>
        <p className="f-body text-[12.5px] m-0 mt-2 leading-snug" style={{ color: "var(--ink-soft)" }}>
          Feeds the front-page ledger — and your future self the night before the exam.
        </p>
      </div>
    </aside>
  );
}

/* ————— problem sheet injector: the judge's contract, read on the site ————— */
function withProblems(item: Item, steps: Step[]): Step[] {
  const ps = getProblems(item.problems);
  if (!ps.length) return steps;
  const sheet: Step = {
    kind: "problem",
    title: ps.length > 1 ? "The problems behind this lesson" : `The problem behind this lesson — ${ps[0].title}`,
    body: (
      <div className="space-y-5">
        <p className="f-body text-[17px] sm:text-[18px] leading-[1.72] m-0">
          Before the mechanics, the contract. This is exactly what the judge hands you on exam day — read it the way you'll read it
          under pressure: statement, input, output, constraints, samples. Half of competitive programming is parsing this page
          correctly; the other half is the technique this lesson installs.
        </p>
        {ps.map((p) => <ProblemCard key={p.id} p={p} />)}
      </div>
    ),
  };
  return steps[0]?.kind === "context" ? [steps[0], sheet, ...steps.slice(1)] : [sheet, ...steps];
}

/* ————— step builders ————— */
function buildSteps(item: Item, onQuizSolved: () => void): Step[] {
  /* fully-authored teaching wins for every kind (recap gaps + drill cards) */
  const authoredFull = FULL_LESSONS[item.id];
  if (authoredFull) {
    const steps = [...authoredFull];
    /* if this concept has a ready interactive preview, splice it right after
       the hands-on step so the toy sits where the prose promises it */
    const preview = PREVIEWS[item.id];
    if (preview) {
      const node: Step = { kind: "handson", title: "Move it yourself", body: <div className="space-y-3">{preview.intro}{preview.node}</div> };
      const at = steps.findIndex((s) => s.kind === "handson");
      if (at >= 0) steps.splice(at + 1, 0, node); else steps.push(node);
    }
    /* exit ticket: the item's authored quiz, or the drill-quiz bank */
    const quiz = item.quiz ?? DRILL_QUIZZES[item.id];
    if (quiz) steps.push({ kind: "retrieval", title: "Exit ticket", body: <QuizBlock quiz={quiz} onSolved={onQuizSolved} /> });
    return withProblems(item, steps);
  }

  if (item.kind === "lab") {
    const authored = LAB_STEPS[item.id] ?? [];
    const quiz = LAB_QUIZZES[item.id];
    return withProblems(item, quiz
      ? [...authored, { kind: "retrieval" as StepKind, title: "The exit ticket", body: <QuizBlock quiz={quiz} onSolved={onQuizSolved} /> }]
      : authored);
  }

  if (item.kind === "recap") {
    const authored = RECAP_STEPS[item.id];
    if (authored) return withProblems(item, authored);
    /* fallback for recaps without authored content yet */
    const steps: Step[] = [{ kind: "concept", title: "The idea, in one breath", body: <p className="f-body text-[17px] leading-[1.72] m-0">{item.summary}</p> }];
    if (item.code) steps.push({ kind: "worked", title: "The code that carries it", body: <CodeBlock code={item.code} title={item.codeTitle} caption={item.codeCaption} /> });
    if (item.quiz) steps.push({ kind: "retrieval", title: "Exit ticket", body: <QuizBlock quiz={item.quiz} onSolved={onQuizSolved} /> });
    return withProblems(item, steps);
  }

  /* fallback for sessions that don't have a fully-authored lesson yet:
     Phase 4 exam cycles and the Phase 5 C++ transition. These still teach —
     a C++ item is "the idea you already know, with less typing", an exam item
     is a concrete, runnable session plan — never a dead "coming soon". */
  const intro = DRILL_INTROS[item.id];
  const skill = SKILLS[item.id] ?? item.willLearn?.[0];
  const isCpp = !!item.codePair;
  const steps: Step[] = [
    {
      kind: "context",
      title: isCpp ? "Why this exists" : "What this session is for",
      body: (
        <div className="space-y-3">
          <p className="f-body text-[17.5px] leading-[1.74] m-0">
            {intro ?? item.summary}
          </p>
          {isCpp && (
            <p className="f-body text-[16px] leading-relaxed m-0" style={{ color: "var(--ink-soft)" }}>
              This is not a new idea — it's the idea you already learned in C, re-expressed so you type less and make fewer mistakes under
              time pressure. Everything you know transfers; only the spelling changes.
            </p>
          )}
          {intro && !isCpp && <p className="f-body text-[16px] leading-relaxed m-0" style={{ color: "var(--ink-soft)" }}>As written in the syllabus: {item.summary}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="chip">artifact · {item.artifact}</span>
            <span className="chip">~{item.minutes} min</span>
          </div>
        </div>
      ),
    },
  ];

  if (skill) {
    steps.push({
      kind: "concept",
      title: "By the end you can…",
      body: (
        <div className="doodle-border px-4 py-3 bg-[var(--green-soft)]" style={{ "--sketch-c": "var(--green)" } as React.CSSProperties}>
          <div className="f-ui text-[16.5px]" style={{ fontWeight: 750 }}>{skill}</div>
        </div>
      ),
    });
  }

  if (item.codePair) {
    steps.push({
      kind: "worked",
      title: "Same idea, less typing",
      body: (
        <div className="space-y-3">
          <p className="f-body text-[16.5px] leading-relaxed m-0">
            Read the two columns side by side. The logic is identical — only the machinery (allocation, bounds, the terminator) is handed
            to the standard library. Your job is to see through the syntax to the unchanged idea underneath.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <CodeBlock code={item.codePair.c} title="the C you know" />
            <CodeBlock code={item.codePair.cpp} title="the C++17 spelling" />
          </div>
          <p className="f-body text-[15px] italic" style={{ color: "var(--ink-soft)" }}>↳ {item.codePair.note}</p>
        </div>
      ),
    });
  } else if (item.code) {
    steps.push({ kind: "worked", title: "The code that carries it", body: <CodeBlock code={item.code} title={item.codeTitle} caption={item.codeCaption} /> });
  }

  if (item.willLearn && item.willLearn.length > 0) {
    steps.push({
      kind: "concept",
      title: "The moves, in order",
      body: (
        <ul className="m-0 p-0 list-none space-y-2.5">
          {item.willLearn.map((w, i) => (
            <li key={w} className="flex items-start gap-3 text-[16px] leading-snug">
              <span className="f-ui shrink-0 mt-[1px]" style={{ fontWeight: 800, color: "var(--orange)" }}>{i + 1}.</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (item.quiz) {
    steps.push({ kind: "retrieval", title: "Exit ticket", body: <QuizBlock quiz={item.quiz} onSolved={onQuizSolved} /> });
  }

  return withProblems(item, steps);
}

/* ————— the page itself ————— */
export default function LessonPage() {
  const { id } = useParams();
  const found = id ? getItem(id) : null;
  const ctx = useReviewedCtx();
  const [idx, setIdx] = useState(0);
  const [proved, setProved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIdx(0); setProved(false); }, [id]);
  useEffect(() => {
    if (found) document.title = `#${found.item.num} ${found.item.title} · Maratona Lab`;
    return () => { document.title = "Maratona Lab · ICPC Study Notebook"; };
  }, [found]);

  const markProved = () => setProved(true);
  const steps = useMemo(() => (found ? buildSteps(found.item, markProved) : []), [found]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") setIdx((v) => Math.min(steps.length - 1, v + 1));
      if (e.key === "ArrowLeft") setIdx((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  useEffect(() => {
    if (idx > 0 && cardRef.current) {
      const top = cardRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [idx]);

  if (!found) return <Navigate to="/" replace />;
  const { item, phase } = found as { item: Item; phase: Phase };
  const last = idx >= steps.length - 1;
  const reviewed = ctx?.reviewed.has(item.id);
  const nxt = nextItem(item.id);
  const prv = prevItem(item.id);
  const step = steps[idx];
  const kind = step?.kind;
  /* a lesson needs proof whenever it has an exit ticket of any kind */
  const needsProof = !!(item.quiz ?? DRILL_QUIZZES[item.id] ?? LAB_QUIZZES[item.id]);
  const skill = SKILLS[item.id] ?? (item.willLearn && item.willLearn[0]);

  return (
    <div className="grid-paper">
      <div className="max-w-[1440px] mx-auto px-6 pb-4">
      {/* breadcrumb + header */}
      <div className="pt-8">
        <Link to={`/phase/${phase.n}`} className="navlink f-ui text-[14px] no-underline" style={{ color: "var(--orange)", fontWeight: 700, fontStyle: "italic" }}>
          phase {phase.numeral} — {phase.title}
        </Link>
        <div className="flex items-start gap-5 sm:gap-7 mt-3">
          <div
            className="f-disp text-[76px] sm:text-[110px] leading-[0.82] select-none shrink-0 rough-hi"
            style={{ color: phase.accent }}
            aria-hidden="true"
          >
            {item.num}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="f-disp text-[32px] sm:text-[46px] m-0 leading-[1.05]">
                <span className="sr-only">{`Lesson ${item.num}: `}</span>
                {item.title}
              </h1>
              <StatusStamp status={item.status} />
            </div>
            <div className="mt-1.5"><Squiggle w={200} h={10} color={phase.accent} /></div>
          </div>
        </div>

        <div className="max-w-[880px]">
          {skill && (
            <p className="f-ui text-[16px] mt-3 mb-0" style={{ fontWeight: 700, color: "var(--ink-2)" }}>
              <span className="mr-2" style={{ color: "var(--green)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--green) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>the skill →</span>
              {skill}
            </p>
          )}
          <div className="f-ui text-[13.5px] mt-2 flex flex-wrap gap-x-4 gap-y-1" style={{ color: "var(--ink-soft)", fontStyle: "italic" }}>
            {prv ? (
              <Link to={`/lesson/${prv.id}`} className="no-underline hover:underline" style={{ color: "inherit" }}>
                ↳ builds on <strong>#{prv.num}</strong>
              </Link>
            ) : (
              <span>↳ the starting line</span>
            )}
            {nxt ? (
              <Link to={`/lesson/${nxt.id}`} className="no-underline hover:underline" style={{ color: "inherit" }}>
                ↳ unlocks <strong>#{nxt.num}</strong>
              </Link>
            ) : (
              <span>↳ the last page of the notebook</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3.5">
            <span className="chip">{item.artifact}</span>
            <span className="chip">~{item.minutes} min</span>
            <span className="chip chip-navy">{item.kind === "lab" ? "interactive lab" : item.kind === "recap" ? "recap lesson" : "drill card"}</span>
            {reviewed && <span className="chip chip-green">✓ reviewed by you</span>}
          </div>
        </div>
      </div>

      {/* reading column · notebook margin */}
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] mt-8 items-start">
        <main className="min-w-0 w-full max-w-[980px]">

      {/* progress dots */}
      <div className="flex items-center gap-2 mt-0 mb-4 lg:hidden" aria-label={`step ${idx + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`go to step ${i + 1}: ${s.title}`}
            className="p-0 border-none cursor-pointer transition-transform hover:scale-125"
            style={{ background: "transparent" }}
          >
            <span
              className="block border-2 border-[var(--ink)] transition-all duration-200"
              style={{
                width: i === idx ? 22 : 13,
                height: 13,
                background: i < idx ? "var(--green)" : i === idx ? "var(--orange)" : "#fcf8ec",
                borderRadius: "5px 8px 4px 9px / 8px 4px 9px 5px",
              }}
            />
          </button>
        ))}
        <span className="mono text-[11px] font-bold ml-2" style={{ color: "var(--ink-soft)" }}>
          step {idx + 1}/{steps.length} · <kbd>←</kbd> <kbd>→</kbd>
        </span>
      </div>

      {/* step card — deliberately flat and square: reading surface first, ink second */}
      <div ref={cardRef} key={item.id + idx} className="card p-6 sm:p-9 xl:p-11 step-in">
        {kind && (
          <div className="f-ui text-[14.5px] mb-2" style={{
            color: KIND_META[kind].color, fontWeight: 780, fontStyle: "italic",
            textDecoration: "underline wavy",
            textDecorationColor: "color-mix(in srgb, " + KIND_META[kind].color + " 50%, transparent)",
            textDecorationThickness: 2, textUnderlineOffset: 5,
          }}>
            {KIND_META[kind].label}
          </div>
        )}
        <h2 className="f-head text-[28px] sm:text-[34px] mt-1 mb-5 leading-tight">{step?.title}</h2>
        <QuizSolvedProvider value={markProved}>
          {step?.body}
        </QuizSolvedProvider>

        {/* teach-it-back appears on the final step, after the retrieval check */}
        {last && <TeachBack id={item.id} />}
      </div>

      {/* bottom nav: one big next-page button */}
      <div className="flex items-stretch gap-4 mt-9">
        <button
          className="btn"
          onClick={() => setIdx((v) => Math.max(0, v - 1))}
          disabled={idx === 0}
          style={{ fontSize: 16, padding: "13px 22px" }}
        >
          ← back
        </button>
        {!last ? (
          <button
            className="btn btn-ink flex-1 justify-center"
            onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
            style={{ fontSize: 20, padding: "13px 22px", fontVariationSettings: '"SOFT" 70, "WONK" 1' }}
          >
            next page · {String(idx + 2).padStart(2, "0")}/{String(steps.length).padStart(2, "0")} →
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed" style={{ borderColor: "var(--ink-faint)", borderRadius: "10px 14px 9px 13px / 13px 9px 14px 10px" }}>
            <span className="stamp stamp-green" style={{ transform: "rotate(-3deg)" }}>
              {needsProof && !proved ? "almost there" : "lesson complete"}
            </span>
          </div>
        )}
      </div>

      {/* completion panel — gated by the exit ticket */}
      {last && needsProof && !proved && (
        <div className="card-2 p-5 mt-6 step-in" style={{ "--sketch-c": "var(--orange)", boxShadow: "7px 9px 18px -9px rgba(228, 87, 46, 0.5)" } as React.CSSProperties}>
          <div className="f-ui text-[18px]" style={{ fontWeight: 780, color: "#9c3413" }}>The exit ticket isn't stamped yet.</div>
          <p className="text-[15px] m-0 mt-1 leading-relaxed">
            Scroll back into the retrieval step and solve the check from memory. Understanding is the gate on this site — scrolling to
            the bottom never was. The moment the check turns green, this panel becomes your review stamp.
          </p>
        </div>
      )}
      {last && (!needsProof || proved) && (
        <div className="card-2 p-5 mt-6 step-in">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <div className="f-ui text-[18px]" style={{ fontWeight: 780 }}>Bank it before it fades.</div>
              <p className="text-[14.5px] m-0 mt-1" style={{ color: "var(--ink-soft)" }}>
                Marking it reviewed feeds the ledger on the front page — and your future self, the night before the exam.
              </p>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <button className={`btn ${reviewed ? "" : "btn-green"}`} onClick={() => ctx?.toggle(item.id)}>
                {reviewed ? "unmark reviewed" : "mark as reviewed ✓"}
              </button>
              {nxt && <Link to={`/lesson/${nxt.id}`} className="btn btn-ink">next: #{nxt.num} →</Link>}
            </div>
          </div>
        </div>
      )}

      {/* context footer */}
      <div className="mt-6"><HandDivider /></div>
      <div className="flex flex-wrap justify-between gap-3 py-8">
        {prv ? (
          <Link to={`/lesson/${prv.id}`} className="btn btn-ghost">← #{prv.num} {prv.title.length > 26 ? prv.title.slice(0, 26) + "…" : prv.title}</Link>
        ) : (
          <Link to="/" className="btn btn-ghost">← the notebook</Link>
        )}
        {nxt ? (
          <Link to={`/lesson/${nxt.id}`} className="btn btn-ghost">#{nxt.num} {nxt.title.length > 26 ? nxt.title.slice(0, 26) + "…" : nxt.title} →</Link>
        ) : (
          <Link to="/phase/5" className="btn btn-ghost">end of the syllabus →</Link>
        )}
        </div>
        </main>
        <Margin item={item} phase={phase} prv={prv} nxt={nxt} reviewed={!!reviewed} ctx={ctx} />
      </div>
      </div>
    </div>
  );
}
