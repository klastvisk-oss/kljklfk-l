import React from "react";
import { CodeBlock, Term } from "../components/fx";
import { getItem } from "./curriculum";
import type { Step } from "../pages/labSteps";

/* Rich, text-first lessons for the completed (recap) items.
   Pedagogy: context before mechanics · one idea per step · show the error
   before the fix · end every lesson with recall, not recognition. */

function P({ children }: { children: React.ReactNode }) {
  return <p className="f-body text-[18px] leading-[1.75] m-0">{children}</p>;
}

function TraceTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="trace rough-lo" style={{ maxWidth: 520 }}>
      <thead>
        <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={i === rows.length - 1 ? "hl" : undefined}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BugCard({ code, title = "bug.c", children }: { code: string; title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="card-2 p-4" style={{ "--sketch-c": "var(--orange)", boxShadow: "3px 3px 0 var(--orange)" } as React.CSSProperties}>
        <div className="mono text-[10.5px] font-bold tracking-[0.18em] mb-2" style={{ color: "var(--orange)" }}>
          SPOT THE BUG — this compiles. it is still wrong.
        </div>
        <CodeBlock code={code} title={title} />
        <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

const it = (id: string) => getItem(id)!.item;

/* —————————————————— the lessons —————————————————— */

export const RECAP_STEPS: Record<string, Step[]> = {
  "p1-01": [
    {
      kind: "context",
      title: "The shape of problem #1",
      body: (
        <div className="space-y-3">
          <P>
            Open almost any Maratona first-phase paper and problem A looks like <em>Altura Mínima</em> (2023): n values arrive, one rule
            filters them, the answer is a count. It is placed first on purpose — it is the warm-up, and teams that fumble it burn
            confidence and minutes they will want later. Your goal of 5–6 solved problems <strong>starts</strong> with this shape being
            automatic: read, loop, count, in under five minutes, with zero debugging.
          </P>
          <P>
            “Automatic” is the operative word. On exam day you do not want to be thinking about <code className="mono text-[15px]">scanf</code>{" "}
            semantics — you want those neurons spent on the three genuinely hard problems on the paper. So this lesson is not about a
            problem; it is about installing a reflex.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "The three-piece kit",
      body: (
        <div className="space-y-3">
          <P>Every problem of this shape decomposes into exactly three moves, in this order, forever:</P>
          <ol className="f-body text-[16.5px] leading-relaxed my-0 pl-5 space-y-1.5">
            <li><strong>Read the size.</strong> n tells the loop when to stop — it is the only thing you need before starting.</li>
            <li><strong>Loop exactly n times</strong>, reading one value per turn into a reused variable.</li>
            <li><strong>Update a running answer</strong> — a count, a sum, a max — using only the current value and the answer so far.</li>
          </ol>
          <P>
            Two C details carry the whole kit. First, <code className="mono text-[15px]">scanf</code> needs the{" "}
            <Term def="The & operator yields the memory address of a variable. scanf must write into your variable, so it needs that address — passing the value instead is the classic first-week segfault.">address of the variable</Term>{" "}
            (<code className="mono text-[15px]">&amp;h</code>), because it writes into it. Second, <code className="mono text-[15px]">scanf</code>{" "}
            returns how many conversions succeeded — checking it turns “mysterious 0” into a diagnosable input problem.
          </P>
          <CodeBlock
            title="altura-minima.c"
            code={it("p1-01").code ?? ""}
            caption={it("p1-01").codeCaption}
          />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · pencil before keyboard",
      body: (
        <div className="space-y-3">
          <P>
            Tracing by hand is not a beginner crutch — it is how you verify loop bounds on exam paper where no compiler exists. Input:{" "}
            <span className="mono font-bold">n = 6, bar = 160</span>, heights <span className="mono font-bold">150 165 155 170 160 158</span>.
          </P>
          <TraceTable
            head={["turn", "h read", "h ≥ 160?", "ok after"]}
            rows={[
              [1, 150, "no", 0],
              [2, 165, "yes", 1],
              [3, 155, "no", 1],
              [4, 170, "yes", 2],
              [5, 160, "yes — ≥ not >", 3],
              [6, 158, "no", 3],
            ]}
          />
          <P>
            Two things to notice in the trace. The fifth row: 160 <em>is</em> allowed — “mínima” means the bar is inclusive, and ≥ vs &gt;
            is precisely the kind of detail the problem statement hides in one word. And the answer after turn 6 equals the answer after
            turn 5: nothing forces you to “close” a count. Counts close themselves.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "The two bugs this shape breeds",
      body: (
        <div className="space-y-3">
          <BugCard
            title="missing-ampersand.c"
            code={`scanf("%d", n);   /* passing the VALUE of n…
                     which is uninitialized garbage */`}
          >
            <P>
              <code className="mono text-[15px]">scanf</code> treats that garbage integer as a memory address and writes into it. Best
              case: a crash you can see. Worst case: it “works” on your machine and dies on the judge. Read the address aloud every time
              you write scanf — <em>“ampersand, n”</em> — until it is reflex.
            </P>
          </BugCard>
          <P>
            The second bug is semantic, not syntactic: the boundary. {it("p1-01").gotcha} Underline the word in the statement that decides
            it (“mínima”, “at least”, “strictly more”) before you write the comparison — the exam rewards the reader, not the typist.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-01" />,
    },
  ],

  "p1-03": [
    {
      kind: "context",
      title: "When the exam begs you to simulate",
      body: (
        <div className="space-y-3">
          <P>
            <em>Atenção à Reunião</em> (Maratona 2024, problem A) describes people and seats with enough narrative motion that your hands
            itch to simulate it — loop over rounds, move people, check conditions. That itch is the trap. The input sizes on these
            problems are chosen so that a faithful simulation is too slow or too fiddly, while the actual answer is{" "}
            <Term def="Solving the counting/grouping question with arithmetic (usually division) instead of stepping through the process. If the process has no memory between steps, it can almost always be collapsed into a formula.">one line of arithmetic</Term>.
          </P>
          <P>
            The transferable skill: whenever a statement describes a repetitive process, ask <em>“what is this process actually
            counting?”</em> before asking “how do I code it?”. Here it is counting groups — and counting groups is division.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Floor, ceiling, and the +k−1 trick",
      body: (
        <div className="space-y-3">
          <P>
            Integer division in C is <strong>floor</strong> division for positive numbers: <code className="mono text-[15px]">n / k</code>{" "}
            counts how many <em>full</em> groups of k fit into n, and the remainder is silently dropped. Exams usually want the{" "}
            <strong>ceiling</strong>: how many groups you need so that <em>everyone</em> fits, including a partial last group. The
            workhorse identity is:
          </P>
          <div className="mono text-[19px] font-bold text-center py-2">⌈n / k⌉ = (n + k − 1) / k</div>
          <P>
            Why it works: adding k−1 pushes any non-zero remainder past the next multiple of k, so the floor of the inflated value lands
            exactly one group higher — but when n is already a multiple of k, k−1 is not quite enough to cross, so nothing changes. One
            expression, both cases, no branches, no floats. Think of it as dealing cards: you keep opening a new pile until the deck is
            gone; the last pile may be short, but it still costs you a pile.
          </P>
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · three sizes, one formula",
      body: (
        <div className="space-y-3">
          <P>Three inputs chosen to probe the formula's only two behaviors — remainder present, remainder absent, and the degenerate n &lt; k:</P>
          <TraceTable
            head={["n", "k", "n + k − 1", "÷ k (floor)", "meaning"]}
            rows={[
              [10, 4, 13, 3, "two full groups of 4 + 2 leftovers need a 3rd"],
              [12, 4, 15, 3, "exactly full groups: no phantom 4th"],
              [1, 4, 4, 1, "one person still needs one whole table"],
            ]}
          />
          <P>
            The middle row is the one students get wrong: when n divides evenly, naïve “round up” logic adds a phantom group. The +k−1
            formulation cannot make that mistake — there is no “if” anywhere for it to get wrong.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "The float version and the overflow version",
      body: (
        <div className="space-y-3">
          <BugCard
            title="tempting.c"
            code={`int tables = (int)ceil((double)n / k);`}
          >
            <P>
              It looks clean and it is a landmine. A <code className="mono text-[15px]">double</code> has 53 bits of mantissa; contest
              inputs routinely exceed that, and then n/k rounds <em>before</em> the ceiling — silently off by one on exactly the huge
              cases the judge tests. {it("p1-03").gotcha}
            </P>
          </BugCard>
          <P>
            The companion bug: <code className="mono text-[15px]">n + k − 1</code> itself can overflow a 32-bit int when n sits near
            2·10⁹. The fix is free — do the arithmetic in <code className="mono text-[15px]">long long</code>. In contest C, “just use
            long long for sums and products” is not sloppiness, it is insurance with no deductible.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-03" />,
    },
  ],

  "p1-05": [
    {
      kind: "context",
      title: "The matrix that never needs to exist",
      body: (
        <div className="space-y-3">
          <P>
            <em>Alimentação saudável</em> (Maratona 2025, problem A) hands you a grid — rows of students, columns of days — and asks a
            question <strong>per column</strong>: a day is healthy only if every student ate fruit on it. The reflex is to declare{" "}
            <code className="mono text-[15px]">int m[R][C]</code>, fill it, then scan it. It would even work here. It is still the wrong
            instinct, because half of all grid problems on future papers will have R and C large enough that the grid doesn't fit — and
            by then the reflex will be too deep to unlearn.
          </P>
          <P>
            The discipline to install now: <em>the shape of the input does not dictate the shape of your storage</em> (the big idea of
            this whole phase). Ask what the question aggregates over, and allocate exactly that.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "A column is a variable",
      body: (
        <div className="space-y-3">
          <P>
            If the question is “something about each column”, then the state you need is{" "}
            <Term def="A summary value per column — a flag, a count, a sum — updated as each row streams past. The full matrix is never materialized: memory is O(C) instead of O(R·C).">one summary per column</Term>:{" "}
            an array <code className="mono text-[15px]">ok[C]</code>, where <code className="mono text-[15px]">ok[c]</code> answers the
            question for column c <em>using everything read so far</em>. Here the per-day question is an AND:{" "}
            <code className="mono text-[15px]">ok[c]</code> starts at 1 and is <code className="mono text-[15px]">&amp;&amp;</code>-ed with
            every cell in that column. Read a row left to right, update each column's summary, throw the row away. After R rows, the
            answer array is complete and you never stored more than one row at a time.
          </P>
          <P>
            The mirror version — summaries per row — works identically with a single running variable reset per row. Which one you need
            is decided by one sentence of the statement; everything else is the same streaming kit from item 1, one level up.
          </P>
          <CodeBlock title="healthy-days.c" code={it("p1-05").code ?? ""} caption={it("p1-05").codeCaption} />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · 3 students × 4 days",
      body: (
        <div className="space-y-3">
          <P>
            Three students, four days; a day is healthy only if the column is all 1s. Watch a single 4-flag array absorb the entire
            grid, one student-row at a time:
          </P>
          <TraceTable
            head={["student read", "ok[] before", "updates", "ok[] after"]}
            rows={[
              ["1 1 1 1", "1 1 1 1", "all stay 1", "1 1 1 1"],
              ["1 0 1 1", "1 1 1 1", "ok[1] = 1 && 0", "1 0 1 1"],
              ["1 1 1 1", "1 0 1 1", "ok[1] stays 0", "1 0 1 1"],
            ]}
          />
          <P>
            The grid had 12 cells; the storage never exceeded 4 — and note the “stays” in the last row: an AND-summary is one-way in
            the downward direction (once a day is 0, no later student can repair it), which is exactly why each row can be discarded.
            If the question were “did <em>any</em> student eat fruit that day”, the summary would be an OR; if it were “how much fruit
            per day”, a sum. Same shape, different operator — the statement picks the operator, never the structure.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "Reset in the wrong place",
      body: (
        <div className="space-y-3">
          <BugCard
            title="row-summary.c"
            code={`int good = 1;
for (r = 0; r < R; r++) {
    for (c = 0; c < C; c++) { scanf("%d", &x); if (x) good = 0; }
    /* answer for row r… but good was initialized ONCE, outside */
}`}
          >
            <P>
              The classic per-row bug: state that should restart every row is initialized once, before the outer loop. Row 0 pollutes
              every row after it. The mechanical defense — write the reset <em>as the first line inside</em> the outer loop, every time,
              even when you're sure — costs one line and removes an entire bug family. {it("p1-05").gotcha}
            </P>
          </BugCard>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-05" />,
    },
  ],

  "p1-06": [
    {
      kind: "context",
      title: "The question every set problem is secretly asking",
      body: (
        <div className="space-y-3">
          <P>
            <em>João João</em> (Maratona 2025, problem J) is a membership story: have I seen this before? Is this a duplicate? Questions
            like this show up constantly, and in a real language you would reach for a set or a hash table. In contest C you reach for
            something better — an array whose <strong>indices are the data</strong>. That move, direct addressing, is one of the highest
            value-per-minute ideas in the whole syllabus.
          </P>
          <P>
            The prerequisite that makes it possible: the domain of values is small and known (heights up to a few hundred, digits,
            letters, days of a week). When that holds, an array of flags <em>is</em> the set — O(1) insert, O(1) lookup, zero library,
            zero collisions.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Presence vs. frequency, and the shift",
      body: (
        <div className="space-y-3">
          <P>
            Two flavors, one mechanism. A <strong>presence array</strong> answers “have I seen x?”:{" "}
            <code className="mono text-[15px]">seen[x] = 1</code> on arrival, check before setting to detect duplicates. A{" "}
            <strong>frequency array</strong> answers “how many times?”: <code className="mono text-[15px]">count[x]++</code>. Picking the
            wrong flavor is the most common error — duplicates need presence, tallies need frequency, and the statement decides which.
          </P>
          <P>
            Real domains rarely start at 0. Heights from 100 to 250 become indices 0..150 via a{" "}
            <Term def="Subtracting the domain minimum before indexing, so value v lives at v − MIN. Size the array MAX − MIN + 1 and every legal value lands inside it.">shift</Term>:{" "}
            <code className="mono text-[15px]">seen[h − 100]</code>. Size the array <code className="mono text-[15px]">MAX − MIN + 1</code>{" "}
            — the +1 is not optional; it is the difference between “works on samples” and “runtime error on test 7”. And declare the
            array <strong>global or static</strong> so it starts zero-filled; a local array starts as garbage.
          </P>
          <CodeBlock title="joao-joao.c" code={it("p1-06").code ?? ""} caption={it("p1-06").codeCaption} />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · who is the impostor?",
      body: (
        <div className="space-y-3">
          <P>Input: five people with badge numbers <span className="mono font-bold">7 3 7 9 3</span> (domain already 0-based, no shift needed):</P>
          <TraceTable
            head={["value x", "seen[x] before", "verdict", "seen[] after"]}
            rows={[
              [7, 0, "new — set seen[7]", "…1@7…"],
              [3, 0, "new — set seen[3]", "…1@3, 1@7…"],
              [7, 1, "DUPLICATE", "unchanged"],
              [9, 0, "new — set seen[9]", "…1@9…"],
              [3, 1, "DUPLICATE", "unchanged"],
            ]}
          />
          <P>
            Two duplicates found, in five O(1) lookups, with an array that never grows with the input — only with the domain. Contrast
            the alternative: for each new value, scan everything seen so far. Same answer, O(n²) worst case. Direct addressing is what
            turns that quadratic scan into a table lookup.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "Two allocation sins",
      body: (
        <div className="space-y-3">
          <BugCard
            title="sins.c"
            code={`int main(void) {
    int seen[MAXV];      /* local: UNINITIALIZED garbage */
    …
    if (seen[x]) …       /* reading garbage, calling it "seen" */
}`}
          >
            <P>
              Local arrays are not zeroed in C — <code className="mono text-[15px]">seen[x]</code> is whatever the stack had before you,
              so “is it a duplicate?” becomes a coin flip. Make it <code className="mono text-[15px]">static</code>, make it global, or
              memset it. {it("p1-06").gotcha}
            </P>
          </BugCard>
          <P>
            The second sin is the fence: <code className="mono text-[15px]">int seen[MAXV]</code> has legal indices 0..MAXV−1, so the
            value MAXV itself writes one past the end — silently, into memory you don't own. Size arrays by{" "}
            <code className="mono text-[15px]">MAXV + 1</code> (or MAX − MIN + 1 after a shift) and say the largest legal index out loud
            when you declare it.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-06" />,
    },
  ],

  "p1-07": [
    {
      kind: "context",
      title: "Runs: the pattern hiding in a dozen problems",
      body: (
        <div className="space-y-3">
          <P>
            <em>Achando os Monótonos</em> (Maratona 2022, problem A) asks about maximal runs — stretches of consecutive equal (or
            monotone) characters. Don't file this under “string problems”. File it under <strong>runs</strong>, because the same pattern
            is longest winning streak, longest plateau in a stock chart, longest consecutive login days, compression (run-length
            encoding), and your own transfer problem from item 9. Learn it once, correctly, and a dozen future problems become the same
            ten lines.
          </P>
          <P>
            “Correctly” is doing heavy lifting here: the run pattern has exactly one famous failure mode — the final run, which ends at
            the end of the string instead of at a visible break — and it costs points every single year somewhere.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "The scan, and the finalization idiom",
      body: (
        <div className="space-y-3">
          <P>
            The idiomatic scan compares each element with the previous one and keeps exactly two counters:{" "}
            <code className="mono text-[15px]">cur</code> (length of the run you are inside right now) and{" "}
            <code className="mono text-[15px]">best</code> (the longest run closed so far). If{" "}
            <code className="mono text-[15px]">s[i] == s[i−1]</code>, the run extends: <code className="mono text-[15px]">cur++</code>.
            Otherwise the run <em>breaks</em>: compare <code className="mono text-[15px]">cur</code> against{" "}
            <code className="mono text-[15px]">best</code>, then reset <code className="mono text-[15px]">cur = 1</code> — a new run
            starts at i, and a run of one element has length 1, not 0.
          </P>
          <P>
            And the idiom that separates the people who pass from the people who pass 9 of 10 tests:{" "}
            <Term def="After the loop ends, handle the run that was still open — the loop only 'sees' a run when it breaks, and the last run never breaks. Either compare one final time after the loop, or append a sentinel character guaranteed to differ."><strong>finalize after the loop</strong></Term>.
            The loop records runs at their <em>break</em>; the last run never breaks inside the loop, so it must be settled afterwards —
            one extra comparison, or a sentinel character guaranteed to differ.
          </P>
          <CodeBlock title="longest-run.c" code={it("p1-07").code ?? ""} caption={it("p1-07").codeCaption} />
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · \"aabbbc\"",
      body: (
        <div className="space-y-3">
          <P>
            The string <span className="mono font-bold">a a b b b c</span>, with <code className="mono text-[15px]">cur</code> starting
            at 1 and the loop running from i = 1. Watch <em>when</em> best changes — only at breaks and after the loop, never mid-run:
          </P>
          <TraceTable
            head={["i", "s[i]", "s[i]==s[i−1]?", "cur", "best"]}
            rows={[
              [1, "a", "yes → extend", 2, 0],
              [2, "b", "no → close cur=2", 1, 2],
              [3, "b", "yes → extend", 2, 2],
              [4, "b", "yes → extend", 3, 2],
              [5, "c", "no → close cur=3", 1, 3],
              ["after loop", "—", "close cur=1", 1, 3],
            ]}
          />
          <P>
            The loop ends with an open run of length 1 (the single c) that was never finalized — harmless here because best is already 3,
            but on input <span className="mono font-bold">a a b b c c c</span> that unfinalized tail is the answer. Run the same table on
            that input with and without the post-loop comparison and watch best go 2 vs 3. That one trace is the whole lesson.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "The last-run bug, in the wild",
      body: (
        <div className="space-y-3">
          <BugCard
            title="almost.c"
            code={`for (i = 1; i < n; i++) {
    if (s[i] != s[i-1]) {
        if (i - start > best) best = i - start;
        start = i;
    }
}
/* best is never compared with the final run */`}
          >
            <P>
              Correct on “aabbb” (the run breaks at c… except there is no c — it breaks at the end, which this loop never reaches).
              Wrong on every input whose longest run touches the last character — and the judge's generator knows exactly that. The fix
              is one line after the loop: <code className="mono text-[15px]">if (n − start &gt; best) best = n − start;</code>.{" "}
              {it("p1-07").gotcha}
            </P>
          </BugCard>
          <P>
            Its shy cousin: the single-character input. With n = 1 the loop body never runs, so best must start at 1 (or n), not 0. Two
            edge cases, two lines of defense, an entire bug family retired.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-07" />,
    },
  ],

  "p1-08": [
    {
      kind: "context",
      title: "What “unguided” is actually testing",
      body: (
        <div className="space-y-3">
          <P>
            Anton and Danik (Codeforces 734A) was assigned with no skeleton and no hints — and that is the point. Memorizing solutions is
            cheap; the exam measures <strong>transfer</strong>: faced with a statement you've never seen, can you classify it and reach
            for the right kit? This lesson makes the classification procedure explicit, because a procedure is something you can practice
            — inspiration is not.
          </P>
          <P>
            The problem itself: n games, each won by Anton (A) or Danik (D); print the winner, or “Friendship” on a tie. If you solved it
            in minutes, items 1–7 have already transferred. The remaining value is the checklist that got you there — so it works again
            on a problem you <em>haven't</em> seen.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "The four-question recognition checklist",
      body: (
        <div className="space-y-3">
          <P>Run these four questions on every new statement, in order, before writing anything:</P>
          <ol className="f-body text-[16.5px] leading-relaxed my-0 pl-5 space-y-2">
            <li>
              <strong>What arrives?</strong> A count + a sequence? A grid? Pairs? — this picks the reading loop.
              <em> Here: one n, then a string of n letters.</em>
            </li>
            <li>
              <strong>What single number (or few) does the answer boil down to?</strong> — this picks your state.
              <em> Here: two counts, A and D.</em>
            </li>
            <li>
              <strong>Do I ever need an old value again?</strong> If no, stream it (item 2). <em> Here: no — each game is judged once.</em>
            </li>
            <li>
              <strong>Is there an algebra shortcut?</strong> (item 3). <em> Here: no formula needed — but the tie rule is part of the
              answer, not an afterthought.</em>
            </li>
          </ol>
          <P>
            Notice the shape: questions 2–3 are exactly “what is the minimum state I must keep?” — the big idea of Phase 1, now running
            as a checklist instead of a vibe.
          </P>
        </div>
      ),
    },
    {
      kind: "worked",
      title: "The checklist, applied cold",
      body: (
        <div className="space-y-3">
          <P>
            Applying it to a fresh statement — <em>“n votes, each for one of three candidates; print the winner or 'tie'”</em> — the
            answers fall out mechanically: a count then n tokens; the state is <strong>three</strong> counters (question 2 scales with
            the output, not with the input); votes are never revisited, so stream them; no algebra. The code is item 1's kit with one
            counter per candidate and a three-way comparison at the end. Same reflex, new costume.
          </P>
          <P>
            The Anton–Danik trace is then trivial: walk the string, <code className="mono text-[15px]">c=='A' ? a++ : d++</code>, compare
            at the end — with the tie printed exactly as the statement spells it, capitalization included. Output format is a full
            quarter of all wrong submissions on “easy” problems; read the sample output like a contract.
          </P>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p1-08" />,
    },
  ],

  "p2-12": [
    {
      kind: "context",
      title: "Copy-paste is a bug with a deadline",
      body: (
        <div className="space-y-3">
          <P>
            By item 12, the longest-run scan from item 7 has been copy-pasted three times across your solutions — and every copy is a
            place where the last-run fix might be missing. This lesson is the pivot from “writing loops” to “owning small tools”: a
            function with a <strong>contract</strong> is a loop you debug once and trust forever. In a 5-hour exam with 10+ problems,
            that trust is minutes you can spend on the hard sheet.
          </P>
          <P>
            It is also a preview of Phase 5: <code className="mono text-[15px]">std::sort</code>, lambdas, and the STL are all “packaged
            loops with contracts”. Learn to think in contracts in C and the C++ transition becomes spelling, not thinking.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Contracts, const, and the array-parameter trap",
      body: (
        <div className="space-y-3">
          <P>
            A contract is the function's promise, stated in comments and enforced by discipline:{" "}
            <em>longest_run reads exactly n ints from a, never writes to them, and returns the length of the longest run of equal
            values; n = 0 returns 0.</em> Each clause maps to a C mechanism: “never writes” is{" "}
            <Term def="On a parameter, a promise not to modify the pointee. The compiler enforces it, and readers get the contract in the signature itself.">const</Term>;
            “reads exactly n” is why the length travels <strong>with</strong> the pointer — because in C,{" "}
            <Term def="An array argument decays into a pointer to its first element. The function receives no length information whatsoever; sizeof inside the function measures the pointer, not the array.">arrays decay to pointers</Term>{" "}
            and the array itself never crosses the call boundary.
          </P>
          <CodeBlock
            title="longest-run.h"
            code={`/* Returns the length of the longest run of equal
   values in a[0..n-1].  n == 0  =>  0.
   Does not modify the array. */
int longest_run(const int *a, int n) {
    if (n == 0) return 0;
    int best = 1, start = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] != a[i - 1]) {
            if (i - start > best) best = i - start;
            start = i;
        }
    }
    if (n - start > best) best = n - start;  /* item 7's fix, owned once */
    return best;
}`}
          />
          <P>
            Compare with item 7: the post-loop finalization now lives in exactly one place. Fix it once, it is fixed in every caller,
            present and future. That is the entire economic argument for functions.
          </P>
          <P>
            One difference you should see and understand, not be confused by: this version tracks <code className="mono text-[15px]">start</code>{" "}
            (where the open run began) where item 7 tracked <code className="mono text-[15px]">cur</code> (how long it is). Same invariant —{" "}
            <em>the open run is always accounted for, and gets closed once</em> — two bookkeeping styles. Pick one per codebase and stay
            with it; being fluent in reading both is what lets you review other people's contest code.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "sizeof lies inside functions",
      body: (
        <div className="space-y-3">
          <BugCard
            title="decay.c"
            code={`int f(int a[]) {                    /* really: int *a */
    int n = sizeof(a) / sizeof(a[0]);  /* 8 / 4 = 2. always. */
    …
}`}
          >
            <P>
              <code className="mono text-[15px]">int a[]</code> as a parameter is sugar for <code className="mono text-[15px]">int *a</code> —
              the function receives a bare pointer with no length attached, so <code className="mono text-[15px]">sizeof(a)</code> is the
              pointer's size (8 on a 64-bit judge), and the “length” computes to 2 on every input forever. The contract demands the
              caller pass n. This is why every C array function you ever write has an <code className="mono text-[15px]">int n</code>{" "}
              parameter — now you know it is not style, it is physics.
            </P>
          </BugCard>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p2-12" />,
    },
  ],

  "p2-13": [
    {
      kind: "context",
      title: "Stop simulating. Find what cannot change.",
      body: (
        <div className="space-y-3">
          <P>
            <em>Estojo de Joias</em> (Maratona 2024, problem E) tempts you into simulating a process step by step. Some processes
            deserve simulation — but when the numbers get big, simulation is a trap with the door left open: the intended solution is
            usually a sentence, not a loop. The sentence is almost always about something that{" "}
            <Term def="A property of the state that is true initially and preserved by every allowed operation. If the start and the goal differ in an invariant, the goal is unreachable — no amount of simulation will disagree.">does not change</Term>.
          </P>
          <P>
            This is the first lesson where the skill is <strong>mathematical</strong> rather than mechanical: you are not writing code,
            you are proving a tiny theorem about the problem, and the code falls out of the proof. The exam loves these — they separate
            the people who read from the people who type.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "Landmarks and parity",
      body: (
        <div className="space-y-3">
          <P>
            The working method has three moves. <strong>1) Name a candidate invariant</strong> — total count, parity of a count, sum
            modulo something, number of inversions mod 2. <strong>2) Check the base case</strong>: is it true in the starting
            configuration? <strong>3) Check preservation</strong>: does every allowed operation leave it unchanged? If both hold, the
            invariant splits <em>all</em> reachable states into two camps, and the answer is whichever camp the target sits in.
          </P>
          <P>
            The workhorse example is <strong>parity</strong>. If one operation toggles two jewels at a time, the parity of “jewels
            face-up” never changes: starting with 3 face-up (odd), you can never reach 4 face-up (even) — and you can stop thinking
            about moves entirely. When the invariant is too weak to decide everything, it still narrows the search to{" "}
            <Term def="A small set of representative states — one per invariant class — that you can actually simulate or enumerate, instead of the exponential original space.">landmarks</Term>:
            one representative per camp, and you only simulate those.
          </P>
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · the parity argument on a napkin",
      body: (
        <div className="space-y-3">
          <P>
            Four slots, operation: flip two adjacent slots. Start <span className="mono font-bold">U U D D</span> (2 up, even). Target:{" "}
            <span className="mono font-bold">U U U D</span> (3 up, odd).
          </P>
          <TraceTable
            head={["move", "state", "# up", "parity"]}
            rows={[
              ["start", "U U D D", 2, "even"],
              ["flip 2–3", "U D U D", 2, "even"],
              ["flip 1–2", "D U U D", 2, "even"],
              ["any sequence…", "…", "always even", "even"],
            ]}
          />
          <P>
            Every move changes #up by −2, 0, or +2 — parity is preserved, so 3-up is unreachable, full stop. The simulation would have
            wandered forever; the invariant answered in two lines. On the exam, write those two lines <em>first</em> — they are worth
            more than any code.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "The invariant that wasn't",
      body: (
        <div className="space-y-3">
          <BugCard
            title="not-a-proof.txt"
            code={`/* claim: after any move, at least one jewel is up */
tested on: 3 examples.   checked base case: no.
checked preservation:    no.   confidence: high.`}
          >
            <P>
              An invariant is a <em>theorem</em>, and theorems have exactly two obligations: true at the start, preserved by every
              operation. “It held on three examples” satisfies neither — examples can't see the move that breaks it. The discipline:
              write the two checks as literal sentences (“base: initially 2 up, even ✓; step: each flip changes the count by ±2 or 0, so
              parity is preserved ✓”) and refuse to use the invariant until both are written. {it("p2-13").gotcha}
            </P>
          </BugCard>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p2-13" />,
    },
  ],

  "p2-23": [
    {
      kind: "context",
      title: "Why you hand-write a library function",
      body: (
        <div className="space-y-3">
          <P>
            Reimplementing <code className="mono text-[15px]">strcmp</code> is not about needing a strcmp — the library's is faster than
            yours will ever be. It is a drill with a precise target: C strings are{" "}
            <Term def="A run of char terminated by the NUL byte '\\0'. The length is not stored anywhere — every operation walks until it hits the terminator, which is why C string loops all look the same and why overrunning the terminator is the classic C bug.">pointer + NUL terminator</Term>,
            and every string bug you will ever write in C is a misunderstanding of that sentence. Writing the comparison yourself, byte
            by byte, is the fastest way to make the sentence true in your hands.
          </P>
          <P>
            The same drill pays off in Phase 5: <code className="mono text-[15px]">std::string</code> exists precisely because{" "}
            <code className="mono text-[15px]">char[]</code> demands this much care. You can only appreciate (and debug) the abstraction
            once you've lived without it.
          </P>
        </div>
      ),
    },
    {
      kind: "concept",
      title: "The return-value contract",
      body: (
        <div className="space-y-3">
          <P>
            The contract: compare byte by byte until the first difference or a terminator. Return <strong>negative</strong> if the first
            string is lexicographically smaller, <strong>zero</strong> if they are identical, <strong>positive</strong> if it is greater.
            Not −1/0/1 — any value with the right sign. Sorting callbacks (item 18's qsort) consume exactly this contract, so this
            function is a direct deposit into next week's lesson.
          </P>
          <CodeBlock
            title="my-strcmp.c"
            code={`int my_strcmp(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    return (unsigned char)*a - (unsigned char)*b;
}`}
            caption="The loop stops at the first mismatch or the first NUL — whichever the strings offer first. One line decides everything."
          />
          <P>
            Read the loop condition aloud: <em>while a is not the terminator AND the bytes agree, advance both.</em> When it exits,
            either the bytes differ (return their signed difference) or one string ended (its byte is 0, so the difference has exactly
            the right sign: shorter-prefix strings compare smaller). Both cases are handled by the same subtraction — that economy is
            what makes the idiom worth memorizing.
          </P>
        </div>
      ),
    },
    {
      kind: "worked",
      title: "Hand trace · \"abc\" vs \"abd\"",
      body: (
        <div className="space-y-3">
          <TraceTable
            head={["iteration", "*a", "*b", "loop continues?", "pointers"]}
            rows={[
              ["1", "'a' (97)", "'a' (97)", "yes — equal, non-NUL", "both +1"],
              ["2", "'b' (98)", "'b' (98)", "yes", "both +1"],
              ["3", "'c' (99)", "'d' (100)", "NO — bytes differ", "stop"],
            ]}
          />
          <P>
            Return: 99 − 100 = −1 → negative → “abc” &lt; “abd” ✓. Then rerun it in your head for “ab” vs “abc”: the loop exits at *a =
            NUL, and 0 − 99 is negative → the prefix is smaller ✓. Two traces, and the entire semantics of lexicographic order in C are
            yours.
          </P>
        </div>
      ),
    },
    {
      kind: "bug",
      title: "The subtraction that bites back",
      body: (
        <div className="space-y-3">
          <BugCard
            title="signed-char.c"
            code={`return *a - *b;   /* char may be SIGNED on the judge */`}
          >
            <P>
              Whether plain <code className="mono text-[15px]">char</code> is signed is implementation-defined. With signed char, the
              byte 0xE9 (é in Latin-1) reads as −23, and “café” can compare <em>smaller</em> than “cafe” — the ordering silently stops
              being byte order, breaking every sort built on it. The{" "}
              <code className="mono text-[15px]">(unsigned char)</code> casts pin the semantics to what the standard intends.{" "}
              {it("p2-23").gotcha}
            </P>
          </BugCard>
        </div>
      ),
    },
    {
      kind: "retrieval",
      title: "Exit ticket",
      body: <QuizSlot id="p2-23" />,
    },
  ],
};

/* —————————————————— teach-it-back (Feynman) prompts —————————————————— */

export const TEACHBACK: Record<string, { prompt: string; model: string }> = {
  "p1-01": {
    prompt: "Explain to a teammate, in one sentence, why scanf needs the & in “&h”.",
    model: "Because scanf has to write into our variable, and the only way to hand it the location to write to is the variable's address — which is exactly what & produces.",
  },
  "p1-02": {
    prompt: "State the one question a value must pass before you're allowed to throw it away.",
    model: "“Will I ever visit this value again?” If the answer is no, decide everything about it now, keep only the summary, and move on.",
  },
  "p1-03": {
    prompt: "Why does (n + k − 1) / k compute the ceiling of n/k — in one sentence?",
    model: "Adding k−1 pushes any input with a remainder past the next multiple of k, so the floor jumps up by exactly one group — and when n is already a multiple, k−1 isn't enough to cross, so nothing changes.",
  },
  "p1-05": {
    prompt: "In one sentence: when is storing the whole matrix a mistake?",
    model: "When the question only needs one summary per column (or per row): then the matrix is O(R·C) memory answering an O(C) question, and the rows can be streamed and discarded.",
  },
  "p1-06": {
    prompt: "Explain the +1 in “int seen[MAX − MIN + 1]” to someone who keeps getting runtime errors.",
    model: "Indices run 0..size−1, so to legally store the value MAX (after shifting, MAX−MIN) the array needs that index plus the zero slot — size must be MAX−MIN+1, or the largest legal value writes off the end.",
  },
  "p1-07": {
    prompt: "Where does the run-scanning loop lose the last run, and what is the one-line fix?",
    model: "Runs are only recorded when they BREAK, and the final run never breaks inside the loop — so after the loop, compare the still-open run: if (n − start > best) best = n − start.",
  },
  "p1-08": {
    prompt: "Recite the four-question recognition checklist for a new problem.",
    model: "1) What arrives? 2) What single number(s) does the answer boil down to? 3) Do I ever need an old value again — if not, stream it. 4) Is there an algebra shortcut instead of simulation?",
  },
  "p1-10": {
    prompt: "Explain, without formulas, why nesting two n-loops is quadratic.",
    model: "For each of the n turns of the outer loop you do n turns of inner work — n groups of n is n² steps, so doubling the input quadruples the work.",
  },
  "p2-12": {
    prompt: "Why does sizeof(a)/sizeof(a[0]) lie inside a function?",
    model: "Array parameters decay to plain pointers, so sizeof(a) measures the pointer (8 bytes), not the array — the length has to be passed explicitly, which is why the contract includes n.",
  },
  "p2-13": {
    prompt: "What two sentences must you write down before you're allowed to trust an invariant?",
    model: "“Base: it holds in the starting configuration” and “Step: every allowed operation preserves it” — examples are evidence for neither.",
  },
  "p2-14": {
    prompt: "In one sentence: why is sum[a..b] = P[b] − P[a−1] always correct?",
    model: "P[b] is the sum from the start through b, and P[a−1] is the sum from the start through a−1, so subtracting cancels everything before a and leaves exactly a..b — with P[0]=0 absorbing the a=1 case.",
  },
  "p2-17": {
    prompt: "State binary search's invariant and why it's enough to trust the answer.",
    model: "“If the target exists, it is inside [lo..hi]”: it's true initially (the whole array), every probe discards only halves that provably can't contain the target, so when the interval empties, absence is proven — not merely suspected.",
  },
  "p2-23": {
    prompt: "What does strcmp's return-value contract actually promise?",
    model: "Negative if the first string is lexicographically smaller, zero if equal, positive if greater — any magnitude, only the sign is promised, and that sign is determined by the first differing byte (or by the shorter string's NUL).",
  },
};

/* —————————————————— skill statements (ZPD framing) —————————————————— */

export const SKILLS: Record<string, string> = {
  "p1-01": "translate a filter-and-count statement into a 5-minute C program",
  "p1-02": "decide what to store by asking “will I revisit this value?”",
  "p1-03": "replace a simulation with a ceiling-division formula",
  "p1-05": "answer per-column grid questions without storing the grid",
  "p1-06": "turn a small-domain membership question into direct indexing",
  "p1-07": "scan maximal runs without losing the final one",
  "p1-08": "classify an unseen problem with the four-question checklist",
  "p1-10": "read O(·) off a loop structure in seconds",
  "p2-12": "package a loop as a function with an enforceable contract",
  "p2-13": "replace simulation with an invariant argument",
  "p2-14": "answer range-sum queries in O(1) after an O(n) build",
  "p2-17": "run and defend binary search with its invariant",
  "p2-23": "own C-string semantics by writing strcmp from scratch",
};

/* —————————————————— authored intros for key planned drills —————————————————— */

export const DRILL_INTROS: Record<string, string> = {
  "p2-15": "LeetCode 303 is CSES 1646 wearing a different interface: the math is identical, the API is a struct with init and query callbacks. The point is not the problem — it's proving the prefix-sum idea is yours, independent of how the judge phrases it.",
  "p2-16": "The prefix idea climbs a dimension: P[r][c] stores the sum of the whole rectangle from (1,1) to (r,c). Sub-rectangle sums then telescope in 2D with an inclusion–exclusion of four corners — one formula, O(1) per query, and the build is still a single sweep.",
  "p2-18": "qsort is your first encounter with a library function whose brain you supply: the comparator. The drill is mechanical (cast void*, compare, return the sign) but the idea — sorting by ANY key you can describe in a function — is the seed of every greedy that sorts first.",
  "p2-19": "Parallel arrays (names[], phones[]) fall out of sync the moment you reorder one. A struct fuses the fields into one record, so a sort moves name and phone together forever — this is the bridge from 'arrays of ints' to 'arrays of things', which is all Phase 3 data.",
  "p2-20": "The warm-up toy is already on this card. The real lesson adds the argument that makes it rigorous: every pointer move discards a whole row or column of candidate pairs, which is what turns n²/2 comparisons into ≤ 2n.",
  "p2-21": "A sliding window is two pointers with a promise: the right end only grows, the left end only catches up, and between them they sweep every interesting window exactly once. Fixed-size windows are bookkeeping; variable-size ones (shrink until valid) are where the thinking lives.",
  "p2-22": "The most unglamorous, highest-leverage item on this list: a script that runs your solution and a brute force on thousands of tiny random inputs and diffs the outputs. Every hard bug you'd meet in round 1 of the exam gets caught at home, for free, forever.",
  "p3-25": "The off-by-one drill from item 17, promoted to a graded lesson, plus the two variants that actually appear on papers: first index ≥ x and last index ≤ x. Master the three together and binary search stops being a coin flip.",
  "p3-26": "The single most valuable pattern in this syllabus for the easiest-to-medium exam problems: instead of searching a sorted array, binary-search the ANSWER — 'can we finish within time T?' is a yes/no question, and yes/no questions over a monotone predicate are exactly what binary search eats.",
  "p3-27": "Euclid's algorithm is 2,300 years old and still the fastest way to compute a gcd. The drill is the identity gcd(a,b) = gcd(b, a mod b) plus lcm(a,b)·gcd(a,b) = a·b, and the divisibility tricks that let you skip factorization entirely.",
  "p3-28": "The preview toy above already shows the motion. The lesson formalizes it: cross off multiples starting at p² (smaller ones are already gone), stop at √n, and count what survives — O(n log log n) of work for a lifetime of prime questions.",
  "p3-34": "Graphs on the exam are almost always adjacency lists: for each vertex, a growable array of its neighbors. Building one by hand in C — counting edges first, then filling — is the rite of passage before BFS and DFS make any sense at all.",
  "p3-35": "BFS is the shortest-path algorithm for unweighted graphs and grids, and it is exactly the queue-plus-visited kit you'll build: expand layer by layer, and the first time a cell is reached is automatically via a shortest path. CSES Labyrinth is the canonical workout.",
  "p3-36": "DFS is BFS's introspective cousin: same visited array, stack instead of queue, and it naturally enumerates whole connected components in one plunge. CSES Counting Rooms — flood-filling a grid — is the standard first blood.",
  "p3-37": "DP starts as one sentence: don't recompute a subproblem, memoize it. Fibonacci exposes the idea, climbing stairs makes it a pattern, coin change makes it a design method — define the state, write the recurrence, choose memo or table.",
  "p3-38": "Knapsack is the exam's favorite DP costume: items with weights and values, a capacity, maximize. Once you can write its table by hand, LIS and a dozen 'pick a subset under a budget' problems are the same table in different clothes.",
  "p4-40": "Classification is a skill you can practice with the paper face-down on the desk: read all problems, tag each with a technique and a difficulty, order your attack — before writing a single line. The exam rewards the team that chose well, not just coded fast.",
  "p4-46": "The milestone is concrete and binary: a fresh paper, no clock, 5–6 of the easiest problems solved alone. Everything in this notebook exists to make that afternoon boring.",
};

/* —————————————————— quiz mounting —————————————————— */

import { QuizSlot } from "../components/QuizBlock";
