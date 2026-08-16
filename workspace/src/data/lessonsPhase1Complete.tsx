import React from "react";
import type { Step } from "./lessonKit";
import { P, Sub, Code, Trace, Gotcha, Key, Recall, Note, Chain } from "./lessonKit";
import { QuizBlock } from "../components/QuizBlock";
import type { Quiz } from "./curriculum";

/* Complete lessons for Phase 1 — the missing foundations.
   These teach what the curriculum promises but had no content. */

const Q101: Quiz = {
  q: "In 'count how many heights are ≥ H', which variable holds the answer?",
  options: ["n (the count of inputs)", "hmin (the threshold)", "ok (the running count)", "h (the current height)"],
  answer: 2,
  explain: "ok accumulates +1 for each qualifying input. n is just the loop bound, hmin is the threshold, h is temporary.",
};

const Q102: Quiz = {
  type: "input",
  q: "If you store all n heights in an array when you only need to count them once, what is the memory complexity?",
  inputAnswer: 0,
  inputHint: "Big-O notation: O(?) where ? is the number of elements stored.",
  explain: "O(n) — one int per input. The streaming version uses O(1) — three scalars regardless of n.",
};

const Q103: Quiz = {
  q: "Floor division n/k counts what?",
  options: ["how many numbers ≤ n are divisible by k", "the remainder when dividing n by k", "how many times k fits completely into n", "both first and third"],
  answer: 3,
  explain: "Both! ⌊n/k⌋ literally means 'how many complete copies of k fit in n', which equals 'how many multiples of k exist in [1..n]'.",
};

const Q105: Quiz = {
  q: "Input is 10⁴ rows × 10² columns; you need one boolean summary per column. Minimum storage?",
  options: ["10⁶ ints (the whole matrix)", "10² ints/bools (one per column)", "10⁴ ints (one per row)", "a single int"],
  answer: 1,
  explain: "One accumulator per column = m = 10² entries. The matrix streams through without being stored.",
};

const Q106: Quiz = {
  q: "Which needs a frequency array (counts) vs presence array (0/1)?",
  options: ["'Did id 42 appear?'", "'How many distinct ids appeared?'", "'Which id appears most often?'", "'Is any id repeated?'"],
  answer: 2,
  explain: "Finding the maximum-frequency id requires actual counts. The others are yes/no presence questions.",
};

const Q107: Quiz = {
  q: "Why does maximal-run scanning need code AFTER the loop?",
  options: ["because the loop might not run", "because the last run never meets a differing neighbor to close it", "because best must be initialized", "because strings have a null terminator"],
  answer: 1,
  explain: "A run closes when the next element differs. The final run reaches end-of-string without seeing a different neighbor, so nothing closed it inside the loop.",
};

const Q108: Quiz = {
  type: "input",
  q: "String is 'AAAAADDDD'. After scanning, what are the counts for A and D?",
  inputAnswer: 5,
  inputHint: "The question asks for the count of A's (or D's — they're equal). Count the letters.",
  explain: "Five A's, five D's. Two counters, one pass, O(1) extra memory beyond the string itself.",
};

const Q110: Quiz = {
  q: "Nested loops for(i<n) for(j<m) do what to the operation count?",
  options: ["add: n + m", "multiply: n × m", "take the maximum: max(n,m)", "exponentiate: n^m"],
  answer: 1,
  explain: "Each outer iteration runs the full inner loop. Total body executions = n × m. This is why O(n²) appears everywhere with grids.",
};

export const LESSONS_P1_COMPLETE: Record<string, Step[]> = {

  /* ————— 1 · Statement → C: read, loop, count ————— */
  "p1-01": [
    { kind: "context", title: "The first translation: words to code",
      body: (<div className="space-y-3">
        <P>Every competitive programming problem starts the same way: a story in natural language, full of people doing things, games being played, heights being measured. Your first skill is <strong>translation</strong> — stripping the story down to its computational skeleton. This lesson uses Maratona 2023 Problem A (Altura Mínima): N people have heights, count how many are at least H tall. That's it. The whole problem.</P>
        <P>The trap beginners fall into: reaching for an array because "there are N inputs". But ask yourself: <em>do I ever need to see a height twice?</em> If the answer is no, the array is baggage. This lesson teaches you to spot that "no" before writing anything.</P>
        <Key>If a value is read, used immediately, and never needed again, it doesn't deserve storage — stream it with a scalar.</Key>
      </div>) },
    { kind: "concept", title: "Extracting the skeleton from the story",
      body: (<div className="space-y-3">
        <P>Read the statement and underline only the <strong>computational facts</strong>:</P>
        <Chain items={[
          <span><strong>Input shape:</strong> two integers N and H, then N integers (heights).</span>,
          <span><strong>Question:</strong> count how many heights satisfy "≥ H".</span>,
          <span><strong>Constraint:</strong> each height is examined exactly once — there's no "go back and check the third person again".</span>,
        ]} />
        <P>That third line is the permission slip: if you never revisit, you never store. The minimum state is three scalars:</P>
        <Trace head={["variable", "meaning", "why it exists"]} rows={[
          ["n", "loop bound", "tells us when to stop"],
          ["hmin", "threshold H", "the comparison target"],
          ["ok", "running count", "accumulates +1 for each qualifier"],
        ]} />
        <P>Notice what's missing: no array, no index variable beyond the loop counter, no history. The entire problem fits in three integers regardless of whether N is 10 or 10 million.</P>
      </div>) },
    { kind: "worked", title: "The code, annotated for the reasoning",
      body: (<div className="space-y-3">
        <Code title="altura-minima.c" code={`#include <stdio.h>

int main(void) {
    int n, hmin, h, ok = 0;
    scanf("%d %d", &n, &hmin);       // read the contract: N people, min height H
    
    for (int i = 0; i < n; i++) {    // visit each person exactly once
        scanf("%d", &h);             // h lives only this iteration
        if (h >= hmin) ok++;         // >= does real work: "at least H" includes H
    }
    
    printf("%d\\n", ok);             // the answer: how many qualified
    return 0;
}`}
          caption="Four lines of logic. The loop body is a sentence: 'if this person qualifies, increment the count.'" />
        <P>Trace it on N=5, H=170, heights=[165, 170, 180, 160, 175]:</P>
        <Trace head={["i", "h read", "h >= 170?", "ok after"]} rows={[
          ["0", "165", "false", "0"],
          ["1", "170", "true (170 ≥ 170)", "1"],
          ["2", "180", "true", "2"],
          ["3", "160", "false", "2"],
          ["4", "175", "true", "3"],
        ]} />
        <P>Output: 3. The boundary case (h = 170 exactly) passed because of <code>&gt;=</code>. Swap it to <code>&gt;</code> and you fail silently — the sample might not include the boundary, but the judge will.</P>
      </div>) },
    { kind: "bug", title: "The swapped symbol and the phantom array",
      body: (<div className="space-y-3">
        <Gotcha title="&gt; vs &gt;=">
          "At least H" includes H. Writing <code>h &gt; hmin</code> rejects anyone exactly at the threshold. The bug passes samples that don't test the boundary and fails on hidden tests. Always ask: "does the boundary itself qualify?"
        </Gotcha>
        <P>The second common mistake: reaching for an array out of habit. You write <code>int heights[10000];</code>, loop to fill it, then loop again to count. It works — and now you've used 10,000× more memory than necessary, with no benefit. Under exam pressure, that extra mental load (bounds, indices, off-by-ones) is what causes real bugs.</P>
        <Note>The discipline: before allocating storage, ask "will I visit this data twice?" If no, stream it. The habit saves memory and cognitive load.</Note>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Without looking: name the three scalars this problem needs, and explain why no array is required. Then: what exact test matches 'at least H'?" />
        <QuizBlock quiz={Q101} />
      </div>) },
  ],

  /* ————— 2 · Streaming input: never store what you only visit once ————— */
  "p1-02": [
    { kind: "context", title: "Deleting the array — a refactor that teaches a principle",
      body: (<div className="space-y-3">
        <P>This lesson is a deliberate rewrite: take the array version of lesson 1 and delete the array. Not because the array version is wrong — it produces the same output — but because the <em>process</em> of deleting it teaches you to recognize when storage is wasted. This is the core Phase 1 idea: <strong>the shape of the input does not dictate the shape of your storage</strong>.</P>
        <P>The array version looks innocent:</P>
        <Code title="altura-with-array.c" code={`int heights[10000];
scanf("%d %d", &n, &hmin);
for (int i = 0; i < n; i++) scanf("%d", &heights[i]);  // store everything
int ok = 0;
for (int i = 0; i < n; i++)                            // second pass
    if (heights[i] >= hmin) ok++;`}
          caption="Two loops, one array. It works. It's also wasteful — and the waste compounds when problems get harder." />
        <Key>If a value is read, used, and never revisited, it doesn't deserve a slot in memory — O(n) storage collapses to O(1).</Key>
      </div>) },
    { kind: "concept", title: "The deletion, step by step",
      body: (<div className="space-y-3">
        <P>Ask: what does the array provide? Random access — the ability to jump back to any element. But this algorithm visits indices 0, 1, 2, …, n−1 in order, exactly once. It never says "go back to index 3". So random access is unused — like buying a car for off-roading and only driving to the grocery store.</P>
        <P>Delete the array and merge the loops:</P>
        <Code title="streaming.c" code={`scanf("%d %d", &n, &hmin);
int ok = 0;
for (int i = 0; i < n; i++) {
    int h;                               // h is born…
    scanf("%d", &h);
    if (h >= hmin) ok++;                 // …used…
}                                        // …and dies each iteration
printf("%d\\n", ok);`}
          caption="The variable h has a lifetime of one loop body. No trace remains — which is exactly what we want." />
        <P>The memory drop is dramatic: from O(n) ints to O(1) scalars. For n = 10⁵, that's 400 KB → 12 bytes. More importantly, the mental model simplifies: no index arithmetic, no bounds checking, no "did I initialize the array?".</P>
      </div>) },
    { kind: "concept", title: "When streaming fails — know the boundary",
      body: (<div className="space-y-3">
        <P>Streaming isn't always possible. It fails when the problem requires:</P>
        <Chain items={[
          <span><strong>Revisiting:</strong> "find the median" — you need all values to sort them.</span>,
          <span><strong>Pairwise comparisons:</strong> "count pairs (i,j) where…" — each element must meet every other.</span>,
          <span><strong>Multiple queries:</strong> "answer Q questions about the same data" — the data must persist across queries.</span>,
        ]} />
        <P>Lesson 1 passes the streaming test because the question is a <strong>single-pass aggregation</strong>: reduce N inputs to one number by applying the same rule to each. Recognizing that pattern — before coding — is the skill.</P>
        <Gotcha title="The false economy">
          Don't stream when you'll need the data twice. Some students, burned by "don't use arrays", avoid them even when the problem demands storage. The rule isn't "never use arrays" — it's "never use an array <em>without a reason</em>".
        </Gotcha>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="What question do you ask before deciding to stream vs. store? Give one example where streaming would fail." />
        <QuizBlock quiz={Q102} />
      </div>) },
  ],

  /* ————— 3 · Algebra beats simulation · integer floor division ————— */
  "p1-03": [
    { kind: "context", title: "Counting without counting",
      body: (<div className="space-y-3">
        <P>Maratona 2024 Problem A (Atenção à Reunião) asks: given a repeating schedule where meetings happen every k days, how many meetings occur in a date range [a, b]? The naive approach simulates: loop from a to b, check divisibility, count. It's O(b−a) — fine for small ranges, fatal when b = 10⁹.</P>
        <P>The algebraic solution is one line: <code>b/k − (a−1)/k</code>. No loop. No iteration. The answer appears instantly regardless of range size. This lesson derives that formula from first principles — not as a trick to memorize, but as the inevitable conclusion of asking "what does division already compute for me?"</P>
        <Key>Floor division ⌊n/k⌋ answers "how many multiples of k exist in [1..n]" — the truncation is the answer, not an error to fix.</Key>
      </div>) },
    { kind: "concept", title: "What ⌊n/k⌋ literally counts",
      body: (<div className="space-y-3">
        <P>Write out multiples of k: k, 2k, 3k, …, mk. The largest multiple ≤ n is mk where m = ⌊n/k⌋. So there are exactly m multiples in [1..n]. That's not a coincidence — it's the definition of integer division.</P>
        <Trace head={["n", "k", "n/k (integer)", "multiples in [1..n]"]} rows={[
          ["10", "3", "3", "3, 6, 9 → count = 3"],
          ["100", "7", "14", "7, 14, …, 98 → count = 14"],
          ["15", "5", "3", "5, 10, 15 → count = 3"],
        ]} />
        <P>Notice: 100/7 = 14.28…, truncated to 14. The fractional part is discarded — and that discard is precisely "ignore the incomplete multiple at the end". Floor division did the counting for free.</P>
      </div>) },
    { kind: "worked", title: "From [1..n] to [a..b]: inclusion-exclusion",
      body: (<div className="space-y-3">
        <P>The problem asks for multiples in [a..b], not [1..n]. Use inclusion-exclusion:</P>
        <Code title="multiples-in-range.c" code={`/* multiples of k in [1..n] */
long long up_to(long long n, long long k) {
    return n / k;            // floor division: the count
}

/* multiples of k in [a..b] = [1..b] minus [1..a-1] */
long long in_range(long long a, long long b, long long k) {
    return up_to(b, k) - up_to(a - 1, k);
}`}
          caption="Subtract the prefix before a. The interval [a..b] is what remains." />
        <P>Example: multiples of 5 in [7..23]. Multiples up to 23: ⌊23/5⌋ = 4 (5,10,15,20). Multiples up to 6: ⌊6/5⌋ = 1 (just 5). Answer: 4 − 1 = 3 (namely 10, 15, 20). Verify by hand — the formula matches.</P>
      </div>) },
    { kind: "bug", title: "The 'be safe' trap",
      body: (<div className="space-y-3">
        <Gotcha title="Adding 1 'to be safe'">
          Writing <code>n/k + 1</code> "to include the edge" invents a multiple that doesn't exist. For n=10, k=3: ⌊10/3⌋ = 3 is correct (3,6,9). Adding 1 claims a fourth multiple — which one? There isn't one. The truncation is correct; "fixing" it breaks it.
        </Gotcha>
        <P>The mirror bug: using floating-point division and rounding. <code>(int)((double)n / k)</code> works for small numbers but risks precision errors near 10¹⁸. Integer division is exact — trust it.</P>
        <Note>Complexity: O(1) per query, regardless of range size. The loop version is O(range) — dead for large inputs. Algebra wins.</Note>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="What does ⌊n/k⌋ count? How do you adapt it for [a..b]? Why is adding 1 wrong?" />
        <QuizBlock quiz={Q103} />
      </div>) },
  ],

  /* ————— 5 · One summary per column · the matrix you never store ————— */
  "p1-05": [
    { kind: "context", title: "The matrix that isn't there",
      body: (<div className="space-y-3">
        <P>Maratona 2025 Problem A (Alimentação Saudável) gives an n×m grid: each row is a student, each column is a day, cell (i,j) = 1 if student i ate healthy on day j. Question: how many days were <em>universally healthy</em> — every student ate well? The input is a matrix. The trap: storing a matrix.</P>
        <P>The insight: the question is about <strong>columns</strong>, not cells. Keep one flag per column ("still healthy?"), stream the rows past, and never materialize the grid. Storage drops from O(n·m) to O(m) — for 10⁴×10², that's 1,000,000 ints → 100.</P>
        <Key>When the question asks for column summaries, store one accumulator per column and let the matrix stream past — you never needed the grid.</Key>
      </div>) },
    { kind: "concept", title: "Which index holds the answer?",
      body: (<div className="space-y-3">
        <P>Read the question: "how many <em>days</em>…" — days are columns (j index). So the answer lives at the column level. Each column needs a running "AND" summary: start true (healthy), AND with each student's value, count how many stay true.</P>
        <Trace head={["column j", "accumulator", "update rule"]} rows={[
          ["0", "ok[0] = 1", "ok[0] = ok[0] && student_0_day_0"],
          ["1", "ok[1] = 1", "ok[1] = ok[1] && student_0_day_1"],
          ["…", "…", "…"],
        ]} />
        <P>Notice: the accumulator is indexed by <code>j</code>, not <code>i</code>. Row index <code>i</code> is transient — it exists only during the current row's processing. Column index <code>j</code> persists across rows because columns are what we're summarizing.</P>
      </div>) },
    { kind: "worked", title: "The code — O(m) storage, O(n·m) time",
      body: (<div className="space-y-3">
        <Code title="healthy-days.c" code={`int ok[101] = {0};           // one flag per column (m ≤ 100)
int x;                          // the streaming cell value

// Initialize: all days start "healthy"
for (int j = 0; j < m; j++) ok[j] = 1;

// Process each student's row
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        scanf("%d", &x);        // cell (i,j) streams past
        ok[j] = ok[j] && x;     // AND summary at column j
    }
}

// Count healthy days
int healthy = 0;
for (int j = 0; j < m; j++) healthy += ok[j];
printf("%d\\n", healthy);`}
          caption="The matrix never exists. Only the column summaries persist." />
        <P>Trace on n=3 students, m=4 days:<br/>
        Student 0: 1 1 0 1<br/>
        Student 1: 1 1 1 1<br/>
        Student 2: 1 0 1 1<br/>
        After row 0: ok = [1,1,0,1]<br/>
        After row 1: ok = [1,1,0,1] (AND with all-1s changes nothing)<br/>
        After row 2: ok = [1,0,0,1] (day 1 died)<br/>
        Answer: 2 days (columns 0 and 3).</P>
      </div>) },
    { kind: "bug", title: "Indexing by the wrong dimension",
      body: (<div className="space-y-3">
        <Gotcha title="Accumulating at ok[i] instead of ok[j]">
          Using the row index <code>i</code> to index the accumulator stores one summary per <em>student</em>, not per <em>day</em>. The code compiles, runs, and answers a different question than asked. Always match the accumulator's index to the question's unit.
        </Gotcha>
        <P>The sizing trap: declaring <code>ok[1000]</code> when m ≤ 100 wastes memory; declaring <code>ok[n]</code> confuses rows with columns. Size by the <em>number of summaries needed</em> — here, m columns.</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="For an n×m grid where you need one summary per column: what is the minimum storage? Which index (i or j) indexes the accumulator, and why?" />
        <QuizBlock quiz={Q105} />
      </div>) },
  ],

  /* ————— 6 · Presence vs. frequency arrays · direct indexing ————— */
  "p1-06": [
    { kind: "context", title: "The value IS the index",
      body: (<div className="space-y-3">
        <P>Maratona 2025 Problem J (João João) asks: given N IDs (each ≤ 1000), did any ID appear twice? The naive approach compares every pair — O(n²), dead for n = 10⁵. The clever approach sorts then scans adjacent — O(n log n), acceptable but overkill. The optimal approach: use the ID itself as an array index.</P>
        <P>This is the "direct indexing" trick: if values are small integers (≤ ~10⁷), allocate an array where position v represents value v. Write to position v when you see value v. Lookup is O(1) — no search, no comparison, just memory access.</P>
        <Key>Direct indexing: when values are small integers, the value v maps to array[v] — O(1) update and lookup, no searching.</Key>
      </div>) },
    { kind: "concept", title: "Presence (0/1) vs. frequency (counts)",
      body: (<div className="space-y-3">
        <P>Two shapes, same machinery:</P>
        <Trace head={["question", "array meaning", "update", "example"]} rows={[
          ["Did v appear?", "seen[v] = 1 if seen, 0 else", "seen[v] = 1", "distinct count"],
          ["How many times?", "count[v] = number of occurrences", "count[v]++", "find duplicates"],
        ]} />
        <P>Presence collapses duplicates: seeing 42 ten times still leaves seen[42] = 1. Frequency accumulates: count[42] = 10. The operator (= vs. ++) is the entire distinction.</P>
        <Code title="presence-vs-frequency.c" code={`int seen[1001] = {0};     // presence: 0 or 1
int freq[1001] = {0};     // frequency: actual counts

// On reading value v:
seen[v] = 1;              // collapse: 1 means "yes, saw it"
freq[v]++;                // accumulate: adds 1 each time

// Distinct count:
int distinct = 0;
for (int v = 0; v <= 1000; v++) distinct += seen[v];

// Most frequent:
int best_v = 0, best_count = 0;
for (int v = 0; v <= 1000; v++)
    if (freq[v] > best_count) { best_count = freq[v]; best_v = v; }`}
          caption="Same structure, different semantics. The array size (1001) comes from the VALUE RANGE, not n." />
      </div>) },
    { kind: "worked", title: "João João solved",
      body: (<div className="space-y-3">
        <P>Problem: N IDs, each ≤ 1000. Did any repeat?</P>
        <Code title="joao-joao.c" code={`int freq[1001] = {0};     // frequency array for values 0..1000
int n, id;
scanf("%d", &n);
for (int i = 0; i < n; i++) {
    scanf("%d", &id);
    freq[id]++;               // accumulate
}

int dup = 0;
for (int v = 0; v <= 1000; v++)
    if (freq[v] >= 2) dup = 1;

printf("%s\\n", dup ? "sim" : "nao");`}
          caption="O(n) to read, O(max_value) to scan. For n = 10⁵ and max_value = 1000, that's ~10⁵ operations total." />
        <P>Alternative: check during insertion — if freq[id] was already ≥ 1 before incrementing, you found a duplicate immediately. Either way, O(n) dominates.</P>
      </div>) },
    { kind: "bug", title: "Sizing by n instead of value range",
      body: (<div className="space-y-3">
        <Gotcha title="int seen[n] when values go to 1000">
          Declaring <code>seen[n]</code> when n = 10 but values reach 1000 causes out-of-bounds writes on value 100. The array size must accommodate the <em>maximum value</em>, not the <em>count of inputs</em>. They're different numbers.
        </Gotcha>
        <P>The fix: read the constraint "each ID ≤ 1000" and size the array as 1001 (0-based, inclusive). If IDs went to 10⁹, direct indexing dies — use a map instead (Phase 5).</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="What's the difference between a presence array and a frequency array? What determines the array size — n or the max value?" />
        <QuizBlock quiz={Q106} />
      </div>) },
  ],

  /* ————— 7 · Strings, maximal runs, and finalization after the loop ————— */
  "p1-07": [
    { kind: "context", title: "The run that never ends",
      body: (<div className="space-y-3">
        <P>Maratona 2022 Problem A (Achando os Monótonos) asks: given a string of letters, find the longest run of identical consecutive characters. Example: "aaabbbaa" → longest run is 3 (aaa or bbb). The pattern generalizes: longest streak of wins, longest flat segment in stock prices, any "maximal consecutive X" question.</P>
        <P>The catch: a run only <em>ends</em> when the next character differs. The final run reaches end-of-string without seeing a different neighbor — so nothing inside the loop ever closes it. The fix: one line of code <strong>after</strong> the loop. Forgetting it is the most common Phase 1 bug.</P>
        <Key>Maximal runs close when the next element differs — so the last run needs explicit finalization after the loop.</Key>
      </div>) },
    { kind: "concept", title: "Two variables: cur and best",
      body: (<div className="space-y-3">
        <P>State the problem as a state machine:</P>
        <Chain items={[
          <span><strong>cur:</strong> length of the run currently being extended.</span>,
          <span><strong>best:</strong> longest run seen so far (the record).</span>,
        ]} />
        <P>Transitions: on each character, either extend the current run (if same as previous) or close it and start fresh (if different). The record updates when a run closes — or, in a variant, as it grows.</P>
        <Trace head={["event", "cur action", "best action"]} rows={[
          ["same as previous", "cur++", "maybe update if cur > best"],
          ["different", "close: compare cur to best, then cur = 1", "update if cur was bigger"],
          ["end of string", "CLOSE THE LAST RUN", "final update"],
        ]} />
        <P>That third row is the lesson. The loop processes characters; the post-loop line processes the run that outlived the loop.</P>
      </div>) },
    { kind: "worked", title: "The code with the critical line",
      body: (<div className="space-y-3">
        <Code title="longest-run.c" code={`char s[100005];
scanf("%s", s);
int n = strlen(s);

if (n == 0) { printf("0\\n"); return 0; }   // edge: empty string

int best = 1, cur = 1;                      // first char starts a run
for (int i = 1; i < n; i++) {               // start at second char
    if (s[i] == s[i - 1]) {
        cur++;                              // extend
    } else {
        if (cur > best) best = cur;         // close the run
        cur = 1;                            // restart at current char
    }
}
if (cur > best) best = cur;                 // THE LINE: close the last run

printf("%d\\n", best);`}
          caption="Line 14 is the most-forgotten line in Phase 1. Without it, 'aaa' reports 0." />
        <P>Trace "aaabbbaa":<br/>
        i=1: s[1]='a'==s[0], cur=2<br/>
        i=2: s[2]='a'==s[1], cur=3<br/>
        i=3: s[3]='b'≠s[2], close: best=3, cur=1<br/>
        i=4: s[4]='b'==s[3], cur=2<br/>
        i=5: s[5]='b'==s[4], cur=3<br/>
        i=6: s[6]='a'≠s[5], close: best stays 3, cur=1<br/>
        i=7: s[7]='a'==s[6], cur=2<br/>
        Loop ends. Line 14: cur=2 ≯ best=3, no change.<br/>
        Output: 3 ✓</P>
      </div>) },
    { kind: "bug", title: "The missing finalization",
      body: (<div className="space-y-3">
        <Gotcha title="Deleting line 14">
          Run "aaa" (n=3): the loop never hits the else branch (no differing neighbor), so best is never updated from its initial value. If best started at 0, output is 0 — catastrophically wrong. The run existed; nothing closed it.
        </Gotcha>
        <P>Variant bug: updating best only inside the else (on close) but forgetting line 14. Same symptom. The discipline: decide your closing rule (close-on-difference or update-as-you-grow) and follow it consistently, including after the loop.</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Why does the last run need post-loop handling? What happens to 'aaa' if that line is deleted?" />
        <QuizBlock quiz={Q107} />
      </div>) },
  ],

  /* ————— 8 · Unguided retrieval · Anton and Danik ————— */
  "p1-08": [
    { kind: "context", title: "Close the notes — solve from memory of the shape",
      body: (<div className="space-y-3">
        <P>Codeforces 734A (Anton and Danik): given a string of 'A' and 'D' game results, count each and declare the winner (or "Friendship" for a tie). No hints, no scaffold — just the pattern you've practiced. This is retrieval practice: the act of recalling the shape from memory strengthens the neural pathway more than re-reading ever could.</P>
        <P>If you instinctively reached for two counters and a single pass, the pattern is installed. If you hesitated, that's valuable data — hesitation means the pattern isn't automatic yet.</P>
        <Key>Retrieval — struggling to recall before looking — converts short-term familiarity into long-term skill.</Key>
      </div>) },
    { kind: "concept", title: "The shape, recalled",
      body: (<div className="space-y-3">
        <P>Ask the Phase 1 questions:</P>
        <Chain items={[
          <span><strong>Do I need to revisit data?</strong> No — each character is classified once.</span>,
          <span><strong>What's the minimum state?</strong> Two counters (a_count, d_count).</span>,
          <span><strong>Any tricky boundaries?</strong> Tie condition — check equality at the end.</span>,
        ]} />
        <P>That's the entire solution. Write it before scrolling.</P>
      </div>) },
    { kind: "worked", title: "The solution — compare to yours",
      body: (<div className="space-y-3">
        <Code title="anton-danik.c" code={`char s[100002];
int n, a = 0, d = 0;
scanf("%d %s", &n, s);

for (int i = 0; i < n; i++) {
    if (s[i] == 'A') a++;
    else             d++;
}

if (a > d)      puts("Anton");
else if (d > a) puts("Danik");
else            puts("Friendship");`}
          caption="Two counters, one pass, three-way comparison at the end. Nothing more." />
        <P>Notice: the loop uses <code>i &lt; n</code>, not <code>s[i] != '\0'</code>. When the statement gives a length, trust it — trailing whitespace in input can break terminator-based loops.</P>
      </div>) },
    { kind: "bug", title: "Off-by-one in the tie",
      body: (<div className="space-y-3">
        <Gotcha title="Using '>' for both branches">
          Writing <code>if (a > d) Anton; else Danik;</code> declares Danik the winner on ties — wrong. The three-way split (>, &lt;, ==) must be explicit. Test the tie case before submitting.
        </Gotcha>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="Without looking: how many counters does this problem need, and what's the final comparison?" />
        <QuizBlock quiz={Q108} />
      </div>) },
  ],

  /* ————— 10 · Complexity · reading O(·) off the loop structure ————— */
  "p1-10": [
    { kind: "context", title: "Look at the braces, name the growth",
      body: (<div className="space-y-3">
        <P>Time complexity isn't a mysterious property you divine — it's visible in the loop structure. This lesson teaches you to look at nested loops and immediately name the growth rate: O(n), O(n²), O(log n), etc. The skill matters because constraints tell you the allowed complexity, and you must match your algorithm to them.</P>
        <Key>Nested loops multiply, sequential loops add, halving loops are logarithmic — read the growth off the braces.</Key>
      </div>) },
    { kind: "concept", title: "The three rules",
      body: (<div className="space-y-3">
        <P><strong>Rule 1: Sequential loops add.</strong></P>
        <Code title="sequential.c" code={`for (int i = 0; i < n; i++) f();    // n calls
for (int i = 0; i < n; i++) g();    // n calls
// Total: n + n = 2n → O(n)`}
          caption="Two separate loops, each O(n). Total is O(n), not O(n²)." />
        
        <P><strong>Rule 2: Nested loops multiply.</strong></P>
        <Code title="nested.c" code={`for (int i = 0; i < n; i++)           // n times
    for (int j = 0; j < m; j++)       // m times per i
        h();                          // body executes n × m times
// Total: O(n × m), O(n²) if n = m`}
          caption="Each outer iteration runs the full inner loop. Multiplication." />
        
        <P><strong>Rule 3: Halving is logarithmic.</strong></P>
        <Code title="halving.c" code={`while (n > 1) {
    n = n / 2;    // or n >>= 1
    work();
}
// Iterations: log₂(n) → O(log n)`}
          caption="Each iteration halves the remaining work. 10⁹ → ~30 iterations." />
      </div>) },
    { kind: "worked", title: "Reading complexity from constraints",
      body: (<div className="space-y-3">
        <P>Constraints tell you the allowed complexity. Rule of thumb: judges allow ~10⁸ operations per second.</P>
        <Trace head={["n constraint", "allowed complexity", "what survives"]} rows={[
          ["n ≤ 100", "O(n³) ~ 10⁶ OK", "even cubic algorithms pass"],
          ["n ≤ 5000", "O(n²) ~ 2.5×10⁷ OK", "quadratic acceptable"],
          ["n ≤ 2×10⁵", "O(n log n) or O(n)", "quadratic (4×10¹⁰) is TLE"],
          ["n ≤ 10⁹", "O(1) or O(log n)", "no linear loops — formula or binary search"],
        ]} />
        <P>See the last row: n = 10⁹ means "don't loop over n". The answer must be a closed-form formula (lesson 3) or logarithmic (lesson 25's binary search). The constraint is a hint.</P>
      </div>) },
    { kind: "bug", title: "Misreading nested vs. sequential",
      body: (<div className="space-y-3">
        <Gotcha title="Thinking two O(n) loops = O(n²)">
          Two separate loops over n are O(n), not O(n²). Nesting — one loop <em>inside</em> another — creates multiplication. Visually: are the braces nested or side-by-side?
        </Gotcha>
        <P>The subtle case: a loop calling a function that itself loops. That's nested even if the braces aren't visually stacked — the call site hides the inner loop.</P>
      </div>) },
    { kind: "retrieval", title: "Exit ticket",
      body: (<div className="space-y-3">
        <Recall prompt="What's the complexity of: (1) two sequential loops over n? (2) nested loops n×m? (3) a loop that halves n each time?" />
        <QuizBlock quiz={Q110} />
      </div>) },
  ],

};
