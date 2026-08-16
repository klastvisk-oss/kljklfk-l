import React from "react";
import type { Step } from "./lessonKit";
import { P, Sub, Code, Trace, Gotcha, Key, Recall, Note, Chain } from "./lessonKit";
import { QuizBlock } from "../components/QuizBlock";
import type { Quiz } from "./curriculum";

/* Deep lessons for the Phase 1 gaps. Pedagogy: derive, don't declare —
   concrete pain → the minimal idea → verify on a trace → name the exact
   failure → recall. */

const Q104: Quiz = {
  q: "In for (i = 0; i < n; i++) for (j = 0; j < m; j++) scanf(\"%d\", &a[i][j]) — which letter indexes the row?",
  options: ["i — the outer loop", "j — the inner loop", "whichever is smaller", "it depends on n and m"],
  answer: 0,
  explain: "Outer loop = row, inner loop = column, always. The convention exists so the decision is made once, forever.",
};

const Q109: Quiz = {
  type: "input",
  q: "Hand-run the two-counter scan on LWWWLWWWWL. What longest winning streak does it report?",
  inputAnswer: 4,
  inputHint: "Walk left to right: cur grows on W, resets on L; best remembers the biggest cur.",
  explain: "Runs of W have lengths 3 and 4 (separated by single L's). best ends at 4.",
};

const Q111: Quiz = {
  q: "Which Phase 1 pattern needs a finalization step AFTER the loop, because its last run never meets a differing neighbour?",
  options: ["presence arrays", "streaming counters", "maximal runs", "floor division"],
  answer: 2,
  explain: "A run only closes when the next element differs. The final run outlives the loop, so you close it by hand afterwards.",
};

export const LESSONS_P1: Record<string, Step[]> = {

  /* ————— 4 · row/column discipline ————— */
  "p1-04": [
    { kind: "context", title: "The bug that compiles, runs, and lies",
      body: (<div className="space-y-3">
        <P>Here's a pattern you will see constantly: the easy problems on a Maratona paper hand you a grid — scores per round, lamps per row, meals per day — and the grid arrives as <em>n</em> rows of <em>m</em> numbers. The code that reads it is four lines. And those four lines are where an astonishing number of submissions die, because the failure mode is the worst kind: <strong>silent</strong>.</P>
        <P>Swap <code>i</code> and <code>j</code> and the compiler says nothing. The program runs. On a square sample — 3 rows, 3 columns — it prints exactly the right answer, because a square matrix read sideways is still a matrix of the same numbers. You submit, and the judge answers <em>Wrong Answer</em> on a rectangular test you never tried. Ten minutes gone, and you don't even know what to debug.</P>
        <P>So this lesson is short but non-negotiable: we install one convention, understand <em>why</em> it's the convention, and make the silent case impossible.</P>
      </div>) },
    { kind: "concept", title: "Why i is the row — derived, not memorized",
      body: (<div className="space-y-3">
        <P>Don't memorize "i is the row". Derive it once and it's yours forever. Input arrives the way you read a book: <strong>one line at a time</strong>. The first line of the grid is row 0, the second line is row 1. Your outer loop is the thing that advances <em>between lines</em> — so the outer counter counts rows.</P>
        <P>Inside a line, you read left to right: element 0, element 1, element 2. The inner loop is the thing that advances <em>within a line</em> — so the inner counter counts columns.</P>
        <Trace
          head={["loop", "advances…", "so it counts…", "bound"]}
          rows={[
            ["outer (i)", "between lines", "rows", "n"],
            ["inner (j)", "within a line", "columns", "m"],
          ]}
        />
        <P>And the element you read on turn <code>(i, j)</code> sits at <strong>row i, column j</strong> — <code>a[i][j]</code> — because that's literally the address you described: the i-th line, the j-th entry of that line. The indices in the brackets are a sentence: <em>"line i, seat j"</em>.</P>
        <Key>Outer loop = rows, inner loop = columns, <code>a[i][j]</code> = row i, column j. Say it as a sentence and the convention is self-evident.</Key>
      </div>) },
    { kind: "worked", title: "Reading an n × m grid, with comments that earn their ink",
      body: (<div className="space-y-3">
        <Code title="read-grid.c" code={`int a[500][500];
int n, m;
scanf("%d %d", &n, &m);
for (int i = 0; i < n; i++) {       /* i = row    (0..n-1) */
    for (int j = 0; j < m; j++) {   /* j = column (0..m-1) */
        scanf("%d", &a[i][j]);      /* line i, seat j      */
    }
}`}
          caption="The two bounds are different numbers: n rows, m columns. Writing the same letter in both loops is the copy-paste bug this convention exists to prevent." />
        <P>Trace a tiny input — <code>n = 2, m = 3</code>, values <code>1 2 3 / 4 5 6</code> — and watch the addresses fill in reading order:</P>
        <Trace
          head={["i (row)", "j (col)", "cell filled", "value"]}
          rows={[
            ["0", "0 → 1 → 2", "a[0][0] a[0][1] a[0][2]", "1 2 3"],
            ["1", "0 → 1 → 2", "a[1][0] a[1][1] a[1][2]", "4 5 6"],
          ]}
        />
        <P>The first line of input landed in row 0. Of course it did — that's what "row" means. If you can predict that table without running anything, the convention is installed.</P>
      </div>) },
    { kind: "bug", title: "The silent transposition, with real wreckage",
      body: (<div className="space-y-3">
        <P>Let's break it on purpose, the way it actually breaks in contests. Someone copies the outer loop and forgets to change the bound:</P>
        <Code title="broken.c" code={`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)      /* <-- n again, not m */
        scanf("%d", &a[i][j]);`} />
        <P>With <code>n = 2, m = 3</code> this reads <strong>four</strong> numbers into a grid that has six, leaves <code>a[0][2]</code> and <code>a[1][2]</code> uninitialized, and then computes on garbage. The compiler never complains. The 3×3 sample in the statement passes perfectly.</P>
        <P>The other flavor is subtler — correct bounds, swapped indices:</P>
        <Code title="also-broken.c" code={`for (int i = 0; i < n; i++)         /* i reaches 1 */
    for (int j = 0; j < m; j++)     /* j reaches 2 */
        scanf("%d", &a[j][i]);      /* <-- a[2][0] exists? */`} />
        <P>When <code>j</code> reaches 2, this writes <code>a[2][0]</code> — and here's the nasty part. If the grid array were sized exactly <code>a[n][m]</code>, that's <strong>row 2 of a 2-row array</strong>: a genuine out-of-bounds write, corrupting whatever lives next in memory, with symptoms that surface in unrelated lines of code. With the padded <code>a[500][500]</code> from the snippet there is no crash at all — the write simply lands in the <em>wrong cell</em>, and every later read through the <code>a[i][j]</code> convention silently sees a transposed grid. Two failure modes, one cause, and the compiler is silent in both.</P>
        <Gotcha title="the class of bug">The transposed version passes every square test and fails some rectangular ones — and the failure looks like a logic error somewhere else. Prevention is a convention, not vigilance.</Gotcha>
        <Note>Two habits, forever: comment <code>/* i = row */</code> and <code>/* j = col */</code> on the loop headers the moment you write them, and test at least one case where <code>n ≠ m</code> before submitting any grid code.</Note>
      </div>) },
    { kind: "concept", title: "The convention pays off immediately",
      body: (<div className="space-y-3">
        <P>Here's why this boring lesson sits right before the interesting ones: every grid technique from here on is just a decision about <em>which index the summary lives at</em>.</P>
        <Chain items={[
          <>One summary per <strong>column</strong> — a healthy flag, a count, a sum? The summary is indexed by <code>j</code> — and you'll keep <code>m</code> of them, never the grid (lesson 5).</>,
          <>Is value <code>v</code> present? The summary is indexed by <code>v</code> itself (lesson 6).</>,
          <>Where does a run of equal cells end? You compare neighbours along one index and hold the other fixed (lesson 7).</>,
        ]} />
        <P>In every case the question is the same: <em>which of my two indices is the data, and which is the address of my answer?</em> You can't answer that fluently until row/column is reflexive.</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Say the convention as one sentence. Then: what does the bound-mistake version print on a square sample, and why is that the worst possible behaviour?" />
        <QuizBlock quiz={Q104} />
      </div>) },
  ],

  /* ————— 9 · transfer: longest winning streak ————— */
  "p1-09": [
    { kind: "context", title: "The only test that matters",
      body: (<div className="space-y-3">
        <P>You can solve a problem with the pattern in front of you and still not <em>have</em> the pattern. The real test is transfer: the same idea wearing different clothes, with nobody telling you which idea it is. That's what the exam actually looks like — the statement never says "this is a maximal-run problem".</P>
        <P>So this lesson gives you a new surface on purpose. Instead of letters in a string (lesson 7), you get a season of game results — a string of <code>W</code> and <code>L</code> — and the question is: <strong>what's the longest winning streak?</strong> Before you read another word, stop and ask yourself: what did I keep in lesson 7, and what did each variable mean?</P>
        <Note>If your first instinct was "okay, but this is a <em>streak</em> problem, that's different" — good, that instinct is exactly what this lesson recalibrates. A streak <strong>is</strong> a maximal run. The clothes changed; the skeleton didn't.</Note>
      </div>) },
    { kind: "concept", title: "Re-derive it from nothing",
      body: (<div className="space-y-3">
        <P>Let's rebuild the solution the way you'll have to on exam day — no code, just reasoning. Three questions, in order:</P>
        <Sub>1. What is the answer made of?</Sub>
        <P>A streak is a run of consecutive <code>W</code>'s. The answer is the <em>length of the longest one</em>. So at any moment you care about two numbers: the length of the streak you're <strong>inside right now</strong>, and the longest streak <strong>seen so far</strong>. Two integers. That's the whole memory of the program.</P>
        <Sub>2. When do they change?</Sub>
        <P>Read one character. If it's <code>W</code>, the current streak grows by one — and if it just became the longest, update the record. If it's <code>L</code>, the current streak <strong>dies</strong>: back to zero. That's the entire state machine. Every character causes exactly one of two events.</P>
        <Sub>3. Is there a run left over at the end?</Sub>
        <P>This is the question lesson 7 drilled. In <em>that</em> version, the record only updated when a run <strong>closed</strong> — so the final run, which never closes, needed a line after the loop. Here we update the record <em>as the streak grows</em>, so the last streak is already counted by the time the loop ends. No post-loop line needed. <strong>Same pattern, different closing rule</strong> — and noticing that is the transfer.</P>
        <Key>A longest-streak scan is two integers — <code>cur</code> and <code>best</code> — where <code>cur</code> grows on a hit and resets to zero on a miss.</Key>
      </div>) },
    { kind: "worked", title: "The code, and a full trace",
      body: (<div className="space-y-3">
        <Code title="streak.c" code={`char s[100005];
scanf("%s", s);
int cur = 0, best = 0;
for (int i = 0; s[i]; i++) {
    if (s[i] == 'W') { cur++; if (cur > best) best = cur; }
    else             { cur = 0; }          /* the streak broke */
}
printf("%d\\n", best);`}
          caption="Looping on s[i] (until the terminator) is the C string idiom; you could equally loop i < n if the statement gives a length." />
        <P>Trace <code>WWLWWLWWW</code> and watch the two counters — this is the 30-second habit that makes this class of bug impossible:</P>
        <Trace
          head={["char", "event", "cur", "best"]}
          rows={[
            ["W", "grow", 1, 1],
            ["W", "grow", 2, 2],
            ["L", "reset", 0, 2],
            ["W W", "grow, grow", 2, 2],
            ["L", "reset", 0, 2],
            ["W W W", "grow, grow, grow", 3, 3],
          ]}
        />
        <P>Output: <strong>3</strong>. Notice the record never went backwards, and notice that the <code>L</code>'s did real work — without them, the two winning stretches would merge into a fake streak of five.</P>
      </div>) },
    { kind: "bug", title: "The missing reset — with its exact wrong answer",
      body: (<div className="space-y-3">
        <P>The one mistake this pattern has is deleting the <code>else</code>. Maybe you "simplified" it; maybe you only half-copied lesson 7. The code still compiles and looks almost right:</P>
        <Code title="no-reset.c" code={`if (s[i] == 'W') { cur++; if (cur > best) best = cur; }
/* the else vanished */`} />
        <P>Now run it on <code>WWLWW</code>. The correct answer is <strong>2</strong> (two separate streaks). The broken code reports <strong>4</strong> — it counts the <code>W</code>'s on both sides of the loss as one streak, because nothing ever restarted <code>cur</code>. It's not a crash, not a warning, not even an obviously wrong number. It's the kind of output that passes the sample and dies on test three.</P>
        <Gotcha title="the diagnostic">If a streak/segment answer looks "too big", suspect the closing event. The reset is the whole meaning of "consecutive".</Gotcha>
        <P>And the mirror image: a version that resets but never updates <code>best</code> inside the run will report 0 on <code>"WWW"</code> — the record only ever sees closed runs, and no run here ever closes. Both bugs are the same lesson from opposite sides: <strong>know exactly when your run opens, grows, and closes.</strong></P>
      </div>) },
    { kind: "concept", title: "Edges and variants — the exam will pick one",
      body: (<div className="space-y-3">
        <P>Transfer means the surface keeps changing while the skeleton stays. Three variants worth holding in your head:</P>
        <Chain items={[
          <><strong>All losses</strong> (<code>"LLLL"</code>): <code>cur</code> never grows, <code>best</code> stays 0. Correct — a longest winning streak of zero is a real answer, not an error.</>,
          <><strong>Longest streak of a specific player</strong> in a multiplayer results string: the reset now fires on <em>any</em> character that isn't yours. Same two counters; the reset condition got wider.</>,
          <><strong>"Report the streak's position too"</strong>: add a variable holding where the current streak <em>started</em> (set it when <code>cur</code> goes 0 → 1), and copy it to the record whenever <code>best</code> updates. State grows only as much as the question demands — the Phase 1 big idea, again.</>,
        ]} />
        <Note>The discipline: when a new statement looks familiar, write down the skeleton first ("two counters; grow on X; reset on not-X; best tracks the max"), then adapt only the reset condition and what "grow" means. Never start from the old code and patch it.</Note>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Without looking at the code: on what event does cur change, on what event does best change, and why is there no line after the loop this time?" />
        <QuizBlock quiz={Q109} />
      </div>) },
  ],

  /* ————— 11 · day-1 review ————— */
  "p1-11": [
    { kind: "context", title: "Why re-reading is a trap",
      body: (<div className="space-y-3">
        <P>Let's be honest about what reviewing usually looks like: you scroll back through lessons 1–10, everything looks familiar, you nod, you close the tab, and two days later you can't reconstruct the run-scanning loop from a blank editor. Familiarity is not knowledge. Recognition — <em>"yes, I've seen this"</em> — is the cheapest mental operation there is, and the exam never asks for it.</P>
        <P>The exam asks for <strong>retrieval</strong>: producing the pattern from nothing, under pressure, when nothing is prompting you. And retrieval is also, according to every serious study of learning, the single most effective way to <em>create</em> the memory you're trying to review. The act of struggling to recall is the lesson. Re-reading is what you do afterwards, briefly, only where the struggle failed.</P>
        <Key>This page is ten retrieval prompts, not ten summaries. Answer each one out loud <em>before</em> expanding anything. The struggle is the point.</Key>
      </div>) },
    { kind: "concept", title: "The protocol — three rules",
      body: (<div className="space-y-3">
        <Chain items={[
          <><strong>Cover, then answer.</strong> Read the prompt, look away, say the answer out loud (or write one line). If you peeked, it doesn't count —grade yourself honestly, you're the only one who sees this.</>,
          <><strong>Five seconds or it's not automatic.</strong> On exam day these answers have to arrive before you've finished reading the statement. A correct answer that took a minute of reconstruction is a warning, not a win.</>,
          <><strong>Diagnose, don't despair.</strong> Each miss maps to one missing idea, and the list below tells you which lesson to re-read. One miss = one targeted re-read, today. Not "review everything again".</>,
        ]} />
        <P>That last rule matters more than it sounds. Spaced-retrieval research is unambiguous: a <em>failed</em> recall attempt followed by a short re-read produces stronger memory than a successful one. The miss is doing work for you — but only if you answer the miss with a targeted re-read within the same session.</P>
      </div>) },
    { kind: "concept", title: "The ten prompts — minimum state",
      body: (<div className="space-y-3">
        <P>First cluster: <strong>what do you store?</strong> This is the big idea of Phase 1 — the input's shape does not dictate your memory.</P>
        <Chain items={[
          <><strong>P1.</strong> Counting inputs above a threshold needs exactly which variables? <Note color="var(--green)">Answer: <code>n</code>, the current value, and the running count — three ints, no array (lesson 2).</Note></>,
          <><strong>P2.</strong> "How many of the n players are at least H tall" — what comparison, and why does the <code>=</code> matter? <Note color="var(--green)">Answer: <code>h &gt;= H</code>. "At least" includes H itself; one swapped symbol and every boundary test fails (lesson 1).</Note></>,
          <><strong>P3.</strong> ⌊100 / 7⌋ counts what, exactly? <Note color="var(--green)">Answer: the multiples of 7 in [1, 100] — 14 of them, since 7·14 = 98 ≤ 100 &lt; 105. Division did the counting (lesson 3).</Note></>,
          <><strong>P4.</strong> You need one summary per column of an n × m grid (a flag, a count, a sum — whatever the statement asks). How many ints of summary do you store? <Note color="var(--green)">Answer: m — one running summary per column; the grid itself is never stored (lesson 5).</Note></>,
        ]} />
      </div>) },
    { kind: "concept", title: "The ten prompts — indexing and runs",
      body: (<div className="space-y-3">
        <P>Second cluster: <strong>which index is which, and when do runs close?</strong></P>
        <Chain items={[
          <><strong>P5.</strong> In <code>for(i&lt;n) for(j&lt;m)</code>, which letter is the row — and what's the sentence that makes it obvious? <Note color="var(--green)">Answer: i. The outer loop advances between lines of input; the inner loop advances within a line (lesson 4).</Note></>,
          <><strong>P6.</strong> "Did id 42 appear at all" vs "which id appears the most" — presence array or frequency array, and what operator is the difference? <Note color="var(--green)">Answer: presence uses <code>seen[id] = 1</code>; frequency uses <code>seen[id]++</code>. Same shape, different operator (lesson 6).</Note></>,
          <><strong>P7.</strong> Why does the maximal-run scan need a line <em>after</em> the loop? <Note color="var(--green)">Answer: a run only closes when the next element differs; the final run never meets its closer, so you close it by hand (lesson 7).</Note></>,
          <><strong>P8.</strong> Anton and Danik: why two counters and no array? <Note color="var(--green)">Answer: each character is classified once, into one of two totals. Minimum state again (lesson 8).</Note></>,
        ]} />
      </div>) },
    { kind: "concept", title: "The ten prompts — shape of the loops",
      body: (<div className="space-y-3">
        <P>Third cluster: <strong>read the structure.</strong> The last two prompts are the ones that decide what you attempt on exam day.</P>
        <Chain items={[
          <><strong>P9.</strong> Nested loops do what to running time — and sequential loops? <Note color="var(--green)">Answer: nested multiplies the bounds; sequential adds them (and only the biggest term survives). A constant inner bound vanishes (lesson 10).</Note></>,
          <><strong>P10.</strong> A loop variable that doubles every turn means the loop is…? <Note color="var(--green)">Answer: logarithmic — ⌈log₂ n⌉ turns. Halving/doubling progress is the signature of log (lesson 10).</Note></>,
        ]} />
        <P>Score yourself: <strong>10/10 in under five seconds each</strong> means Phase 1 is installed and you're clear for Phase 2. 8–9 means re-read the flagged lessons today, then re-run this page tomorrow — the second retrieval will feel different. Below 8, slow down: Phase 2 is built on this floor, and the syllabus explicitly says not to move on until it holds.</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Pick the prompt you were slowest on. State its answer again, now, without looking — then name the lesson it belongs to." />
        <QuizBlock quiz={Q111} />
      </div>) },
  ],
};
