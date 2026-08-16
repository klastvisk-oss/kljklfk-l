import React from "react";
import StreamLab from "../labs/StreamLab";
import ComplexityLab from "../labs/ComplexityLab";
import PrefixSumLab from "../labs/PrefixSumLab";
import BinarySearchLab from "../labs/BinarySearchLab";
import SieveLab from "../labs/SieveLab";
import TwoPointerLab from "../labs/TwoPointerLab";
import { CodeBlock, Term } from "../components/fx";

/* Every step declares its pedagogical role, so the reader always knows
   WHY they are looking at what they are looking at. */
export type StepKind = "context" | "concept" | "handson" | "worked" | "bug" | "retrieval" | "problem";

export interface Step {
  kind?: StepKind;
  title: string;
  body: React.ReactNode;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="f-body text-[18px] leading-[1.75] m-0">{children}</p>;
}

/* a short reading guide placed next to every interactive, so the lab is
   never "just a toy" — the text tells you what the motion is proving */
export function Watch({ label = "watch for", items }: { label?: string; items: string[] }) {
  return (
    <div className="card-2 px-4 py-3" style={{ "--sketch-c": "var(--blue)" } as React.CSSProperties}>
      <div className="f-ui text-[14px] mb-1.5" style={{ color: "var(--blue)", fontWeight: 780, fontStyle: "italic", textDecoration: "underline wavy", textDecorationColor: "color-mix(in srgb, var(--blue) 50%, transparent)", textDecorationThickness: 2, textUnderlineOffset: 5 }}>{label}</div>
      <ul className="m-0 p-0 list-none space-y-1">
        {items.map((w) => (
          <li key={w} className="text-[14.5px] leading-snug flex gap-2">
            <span aria-hidden="true" style={{ color: "var(--blue)" }}>↳</span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ————— authored step sequences for the lab lessons ————— */
export const LAB_STEPS: Record<string, Step[]> = {
  "p1-02": [
    {
      kind: "context",
      title: "The array that snuck in",
      body: (
        <div className="space-y-3">
          <P>
            Look back at item 1. It reads n heights and probably kept them in <code className="mono text-[15px]">h[n]</code> “because the
            input is an array”. That instinct — mirror the shape of the input in memory — is the single most expensive habit a beginner
            can have. Reread the question: <em>count</em> the heights above the bar. The count only ever needs the value it is reading{" "}
            <strong>right now</strong> — every height is visited exactly once and then never again.
          </P>
          <P>
            <Term def="Processing input value-by-value, keeping only running state, so memory stays constant no matter how long the input is.">Streaming</Term>{" "}
            is the name of that discipline: the input is a river, not a warehouse. You stand in the river with three variables and let
            the water pass. This is not micro-optimization — on later problems the memory limit, not the time limit, is what kills the
            array version.
          </P>
        </div>
      ),
    },
    {
      kind: "handson",
      title: "Lab · the tape vs. the box",
      body: (
        <div className="space-y-3">
          <StreamLab />
          <Watch
            items={[
              "run it in stream mode: ok is the only variable that accumulates meaning — n and h are scaffolding.",
              "flip to array[n] at the end: same answer, ten filled slots. Now imagine n = 10⁶.",
              "the live decision panel: every value is judged the instant it arrives, then forgotten. That is the whole trick.",
            ]}
          />
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Why the count survives and the array doesn't",
      body: (
        <div className="space-y-3">
          <P>
            The lab showed two programs printing the same number. Here is the argument that decides which one to write, and it
            generalizes to every “should I store this?” question on the exam. Ask, of the value you're holding: <em>will any future
            step need to distinguish it from the values that came before it?</em> In Altura Mínima, no — each height is compared with
            H exactly once and contributes to <code className="mono text-[15px]">ok</code> or not. The count is a <strong>summary</strong>:
            it absorbs each value's entire contribution the moment the value arrives. Once absorbed, the raw value is information-free;
            keeping it is keeping a receipt for a purchase already recorded.
          </P>
          <P>
            The array version pays O(n) memory for a question the statement never asks — <em>which</em> heights cleared the bar. It
            asks only <em>how many</em>, and “how many” is one integer. The general test: <strong>store a value only if some future
            step must see it again as itself.</strong> If the future only needs a running total, a max, a count, a flag — that's a
            summary variable, and the input stays a river.
          </P>
          <P>
            And the honest edge of the rule, so it doesn't harden into dogma: a question like “report the <em>median</em> height”
            would force storage — the median needs the whole multiset, and no one-pass summary absorbs it. When you feel the pull to
            declare an array, name the future step that needs the raw values. No answer → no array. That one habit is this lesson's
            entire legacy.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Check yourself before the quiz",
      body: (
        <P>
          Without looking back at the lab: name the one question a value must answer before you are allowed to throw it away.{" "}
          <em>(“Will I ever visit it again?”)</em> If you hesitated, replay the lab once more — the next step is the graded exit ticket
          and it asks exactly this.
        </P>
      ),
    },
  ],

  "p1-10": [
    {
      kind: "concept",
      title: "Counting without counting",
      body: (
        <div className="space-y-3">
          <P>
            Nobody times your program with a stopwatch; the judge counts{" "}
            <Term def="The size of the input, abstractly. We classify algorithms by how their work grows as n grows — ignoring constants and lower-order terms.">operations as a function of n</Term>.
            The loop structure tells you that function directly, if you know three reading rules:
          </P>
          <ul className="f-body text-[16.5px] leading-relaxed my-0 pl-5 space-y-1.5">
            <li>nested loops <strong>multiply</strong> their bounds;</li>
            <li>loops in sequence <strong>add</strong> — and only the biggest term survives;</li>
            <li>a variable that <strong>doubles (or halves)</strong> each turn means a <strong>logarithm</strong>.</li>
          </ul>
          <P>
            Constants like an inner <code className="mono text-[15px]">j &lt; 3</code> vanish entirely — 3n is O(n). The lab below forces
            you to defend that claim with the n-slider instead of trusting it on faith.
          </P>
        </div>
      ),
    },
    {
      kind: "handson",
      title: "Lab · name the growth",
      body: (
        <div className="space-y-3">
          <ComplexityLab />
          <Watch
            items={[
              "drag n on “loop n × 3 inside”: the bar and the dot field grow, the class doesn't. Constants bend, never break.",
              "switch to “i doubles each turn” and push n to 32: five probes. That gap — 32 vs 5 — is why log n wins contests.",
              "miss one on purpose and read the feedback; the streak counter is the point, not the confetti.",
            ]}
          />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · the triangular loop",
      body: (
        <div className="space-y-3">
          <P>One structure deserves a pencil trace because it fools everyone exactly once — the inner bound is a <em>variable</em>, not n:</P>
          <CodeBlock
            title="triangle.c"
            code={`for (i = 0; i < n; i++)
    for (j = 0; j < i; j++)   /* bound is i, not n! */
        work();`}
          />
          <table className="trace rough-lo" style={{ maxWidth: 420 }}>
            <thead><tr><th>i</th><th>inner runs</th><th>total so far</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>0</td><td>0</td></tr>
              <tr><td>1</td><td>1</td><td>1</td></tr>
              <tr><td>2</td><td>2</td><td>3</td></tr>
              <tr><td>3</td><td>3</td><td>6</td></tr>
              <tr><td className="hl">n−1</td><td className="hl">n−1</td><td className="hl">n(n−1)/2</td></tr>
            </tbody>
          </table>
          <P>
            The total is 0+1+2+…+(n−1) = n(n−1)/2 — still <strong>O(n²)</strong>, just with a friendlier constant. The reading rule
            survives intact: the <em>shape</em> decides the class, the shape here is “a triangle of work”, and triangles are quadratic.
          </P>
        </div>
      ),
    },
  ],

  "p2-14": [
    {
      kind: "context",
      title: "The query storm",
      body: (
        <div className="space-y-3">
          <P>
            CSES 1646 hands you n numbers — then up to 200,000 questions of the form “sum from position a to position b”. The naive
            answer re-adds the range every time: O(n) per query, O(n·q) total, time limit gone. The trick is to notice that the array{" "}
            <Term def="Never modified after input. Updates between queries would break prefix sums and demand a different tool — and you should be able to say that sentence out loud, because an examiner will ask.">never changes</Term>,
            so work can be done <strong>once, before the questions start</strong>. Precomputation is trading memory and one upfront pass
            for a lifetime of O(1) answers.
          </P>
          <P>
            The object that makes it work is the prefix array: <strong>P[i] = a₁ + a₂ + … + aᵢ</strong>, with P[0] = 0 by definition.
            Every range then telescopes — everything before <em>a</em> appears in both P[b] and P[a−1] and cancels:{" "}
            <span className="mono font-bold text-[16px]">sum[a..b] = P[b] − P[a−1]</span>. Two subtractions, every time, forever.
          </P>
        </div>
      ),
    },
    {
      kind: "handson",
      title: "Lab · pay once, ask forever",
      body: (
        <div className="space-y-3">
          <PrefixSumLab />
          <Watch
            items={[
              "the build phase: each P[i] reuses P[i−1] — that single reuse is what makes the whole build O(n) instead of O(n²).",
              "drag the query window so l = 1: the answer is P[r] alone, because P[0] = 0 eats the special case. That's why P has n+1 slots.",
              "try l = r: a single element falls out of two subtractions. If that feels like magic, re-derive the telescoping on paper.",
            ]}
          />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · build P for [4, 2, 5, 1]",
      body: (
        <div className="space-y-3">
          <P>Small enough for exam paper — this is the exact motion the lab animated, slowed to pencil speed:</P>
          <table className="trace rough-lo" style={{ maxWidth: 500 }}>
            <thead><tr><th>i</th><th>A[i]</th><th>P[i] = P[i−1] + A[i]</th><th>P</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>—</td><td>base case</td><td>0</td></tr>
              <tr><td>1</td><td>4</td><td>0 + 4</td><td>4</td></tr>
              <tr><td>2</td><td>2</td><td>4 + 2</td><td>6</td></tr>
              <tr><td>3</td><td>5</td><td>6 + 5</td><td>11</td></tr>
              <tr><td className="hl">4</td><td className="hl">1</td><td className="hl">11 + 1</td><td className="hl">12</td></tr>
            </tbody>
          </table>
          <P>
            Query [2..4]: P[4] − P[1] = 12 − 4 = <strong>8</strong> = 2+5+1 ✓. Notice P[1] — not P[2] — is subtracted: the left endpoint
            must stay <em>inside</em> the sum. That a−1 is the one off-by-one this pattern has, and it is the only one you need to fear.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "The full solver",
      body: (
        <CodeBlock
          title="static-range-sums.c"
          code={`#include <stdio.h>
#define MAXN 200002

long long P[MAXN];            /* sums can outgrow int */

int main(void) {
    int n, q, a, b;
    scanf("%d %d", &n, &q);
    P[0] = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        scanf("%d", &x);
        P[i] = P[i - 1] + x;   /* the O(n) bill, paid once */
    }
    while (q--) {
        scanf("%d %d", &a, &b);
        printf("%lld\\n", P[b] - P[a - 1]);  /* O(1), always */
    }
    return 0;
}`}
          caption="long long is not paranoia: 2·10⁵ values of 10⁹ sum past INT_MAX. The prefix array is the first place overflow ambushes people — and the cheapest place to prevent it."
        />
      ),
    },
    {
      kind: "concept",
      title: "Why the subtraction telescopes — the picture behind P[b] − P[a−1]",
      body: (
        <div className="space-y-3">
          <P>
            The lab animated the formula; here is why it must be true, so you can rebuild it from nothing mid-exam. P[b] is the sum of
            everything from position 1 through b — the whole bar up to b. P[a−1] is the whole bar up to a−1. Subtracting removes
            exactly the segment before a, leaving positions a through b and nothing else:
          </P>
          <CodeBlock
            title="the-picture.txt"
            code={`P[b]    = a1 + a2 + ... + a(a-1) + [ aa + ... + ab ]
P[a-1]  = a1 + a2 + ... + a(a-1)
P[b] - P[a-1]                 =    [ aa + ... + ab ]`}
          />
          <P>
            Two consequences worth owning. First, the subtracted index is a−1, <em>not</em> a — because a must stay inside the answer;
            you cut everything strictly before it. That is the only off-by-one this pattern has, and you now know its exact address.
            Second, the argument never used anything about the values — they can be negative, huge, anything — only that the array
            doesn't change between queries. The moment updates arrive, the bars stop being bars, and this picture stops applying.
            Knowing <em>that</em> boundary is part of knowing the technique.
          </P>
        </div>
      ),
    },
  ],

  "p2-17": [
    {
      kind: "context",
      title: "Two ways to look for a number",
      body: (
        <div className="space-y-3">
          <P>
            On an <em>unsorted</em> array there is no shortcut: checking every element is{" "}
            <Term def="Θ describes the exact growth rate — the work is sandwiched between c₁·f(n) and c₂·f(n). O is an upper bound (“no worse than”), Ω a lower bound (“no better than”). Contest talk mostly uses O, but Θ is what you have actually proved when both match.">Θ(n)</Term>{" "}
            and no algorithm can do better — an adversary can always hide the target behind the last cell you check. That lower bound is
            worth stating on the exam: it shows you know when a search <em>cannot</em> be improved.
          </P>
          <P>
            Sorted input is a different world. Compare against the <strong>middle</strong> element and the answer tells you which half to
            throw away — a whole half, every time. Halving n repeatedly reaches 1 in ⌈log₂ n⌉ steps; for n = 10⁶ that is 20 probes
            instead of a million. The engine is not cleverness, it is an{" "}
            <Term def="An assertion that is true before the loop, preserved by every iteration, and strong enough to conclude the answer when the loop ends.">invariant</Term>:{" "}
            <em>if the target exists, it is inside [lo..hi]</em>. The lab lets you watch that sentence stay true probe after probe.
          </P>
        </div>
      ),
    },
    {
      kind: "handson",
      title: "Lab · half the world per probe",
      body: (
        <div className="space-y-3">
          <BinarySearchLab />
          <Watch
            items={[
              "the grey cells: each probe doesn't just test mid — it executes a whole half of the array. That discard is the algorithm.",
              "pick a target that isn't there (50): the pointers still converge, and 'absent' gets proven in ~4 probes, not 15.",
              "then open the off-by-one drill tab and run submission C — watching a loop that never shrinks is a vaccine against writing one.",
            ]}
          />
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Best, worst, always",
      body: (
        <div className="space-y-3">
          <P>Three symbols, one idea each — the lab's probe counter just made all three concrete:</P>
          <ul className="f-body text-[16.5px] leading-relaxed my-0 pl-5 space-y-1.5">
            <li><strong>Ω(1)</strong> best case: the middle element is the target on probe one.</li>
            <li><strong>O(log n)</strong> worst case: the interval halves until it's empty — ⌈log₂ n⌉ + 1 probes.</li>
            <li><strong>Θ(log n)</strong> the exam answer: worst case is also what typically happens.</li>
          </ul>
          <P>
            And the price is real: binary search demands{" "}
            <Term def="The array must be sorted before queries. If input arrives unsorted and never changes, one O(n log n) sort buys O(log n) queries forever. If it changes, the sorted view must be rebuilt — and that is a different chapter.">sorted input</Term>.
            Half of all misused binary searches in the wild are actually sorted-input bugs wearing a disguise. Before you write the loop,
            say out loud <em>why</em> the array is sorted — if you can't, you're not ready to write it.
          </P>
        </div>
      ),
    },
  ],
};

/* ————— preview widgets shown on planned drill cards ————— */
export const PREVIEWS: Record<string, { intro: React.ReactNode; node: React.ReactNode }> = {
  "p2-20": {
    intro: (
      <P>
        A toy version of the day's tool, already wired: two pointers squeezing a sorted array toward a target sum. Play with it now —
        when the real lesson arrives it will only have to add the discard argument and the code, because the motion will already be in
        your hands.
      </P>
    ),
    node: <TwoPointerLab />,
  },
  "p3-25": {
    intro: (
      <P>
        The mechanics lab from item 17 hides a second tab — the <strong>off-by-one drill</strong>. This lesson will be that drill,
        graded, plus the first-≥-x and last-≤-x variants that exams love. Warm up below; the three broken submissions are real student
        code, anonymized and immortalized.
      </P>
    ),
    node: <BinarySearchLab />,
  },
  "p3-28": {
    intro: (
      <P>
        The sieve is almost impossible to learn from prose — it is a sweeping motion, and motions are learned by watching and then
        doing. Here it is as a toy: one prime per step, multiples crossing themselves out in waves. The real lesson will add the
        complexity accounting (why it is O(n log log n) and why nobody asks you to prove it mid-exam).
      </P>
    ),
    node: <SieveLab />,
  },
};
