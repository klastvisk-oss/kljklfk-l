import type { Step } from "./lessonKit";
import { P, Code, Trace, Gotcha, Key, Recall, Note, Sub, Chain } from "./lessonKit";

/* Real, self-contained lessons for Phase 1 gaps + Phase 2 tools.
   Each teaches its concept from nothing, shows working C, names the
   killer mistake, and ends in recall. */

export const LESSONS_A: Record<string, Step[]> = {

  /* ————— 4 · row/column discipline ————— */
  "p1-04": [
    { kind: "context", title: "Why nested loops trip everyone",
      body: (<div className="space-y-3">
        <P>A matrix problem hands you <em>n</em> rows and <em>m</em> columns. The loop nest that reads it looks trivial, and that is exactly why it is dangerous: swapping <code>i</code> and <code>j</code> compiles, runs, and only fails silently when <em>n ≠ m</em>. The fix is not carelessness-proofing — it is adopting one convention and never breaking it.</P>
        <Key>Outer loop is the row (<code>i</code>), inner loop is the column (<code>j</code>), and the element you read at <code>(i, j)</code> belongs to row <code>i</code>, column <code>j</code>. Always.</Key>
      </div>) },
    { kind: "worked", title: "Reading an n × m matrix, the disciplined way",
      body: (<div className="space-y-3">
        <Code title="read-matrix.c" code={`int a[100][100];
int n, m;
scanf("%d %d", &n, &m);
for (int i = 0; i < n; i++)        /* i = row, 0..n-1   */
    for (int j = 0; j < m; j++)    /* j = col, 0..m-1   */
        scanf("%d", &a[i][j]);     /* row i, column j   */`}
          caption="Two separate bounds — n for rows, m for columns. Writing m in both is the classic copy-paste bug." />
        <P>Read the inner loop body literally: <code>a[i][j]</code> is the element in <strong>row i</strong>, <strong>column j</strong>. If you can say that sentence without hesitation, the convention is installed.</P>
      </div>) },
    { kind: "bug", title: "The silent transposition",
      body: (<div className="space-y-3">
        <Gotcha>Bound both loops by <code>n</code> (or both by <code>m</code>), or index <code>a[j][i]</code> while iterating <code>i</code> outer. On a square sample matrix both versions print the same thing — you only find out on a rectangular test.</Gotcha>
        <P>Defence: comment the loops (<code>/* i = row */</code>), and when you sum a column you iterate rows in the <em>inner</em> loop… which is the subject of lesson 5. The two lessons are one idea: <strong>know which index is which before you write the body.</strong></P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Without looking: in for(i<n) for(j<m) scanf(&a[i][j]), which index is the row and which is the column — and what happens if you write m in the outer bound when n ≠ m?" /> },
  ],

  /* ————— 9 · transfer: longest winning streak ————— */
  "p1-09": [
    { kind: "context", title: "Same pattern, new clothes",
      body: (<div className="space-y-3">
        <P>You solved the maximal-run problem in lesson 7. This lesson changes only the surface: instead of a string of letters you get a string of game results (<code>W</code>/<code>L</code>), and instead of "longest run of equal letters" you want "longest winning streak". If you reach for a totally new approach, the pattern hasn't transferred yet — the whole point of this drill.</P>
        <Key>A streak is a maximal run. Scan once, keep two counters (<code>cur</code> and <code>best</code>), close the run when it breaks, and close the last run after the loop.</Key>
      </div>) },
    { kind: "worked", title: "The two-counter scan",
      body: (<div className="space-y-3">
        <Code title="streak.c" code={`char s[100005];
scanf("%s", s);
int cur = 0, best = 0;
for (int i = 0; s[i]; i++) {
    if (s[i] == 'W') { cur++; if (cur > best) best = cur; }
    else             { cur = 0; }      /* the run broke */
}
printf("%d\\n", best);`}
          caption="Here the run breaks on any non-W, so the 'close' is a reset. No post-loop line needed because best is updated inside." />
        <P>Compare with lesson 7's version, which updated <code>best</code> only when the run <em>ended</em> and therefore needed a finalisation after the loop. Both are correct; they just close the run at different moments. Knowing both closing styles is the transfer.</P>
      </div>) },
    { kind: "bug", title: "Forgetting the reset",
      body: (<div className="space-y-3">
        <Gotcha>Omitting <code>cur = 0</code> on a loss. Then <code>cur</code> never restarts and you count W's across separate streaks — <code>WWLWW</code> reports 4 instead of 2.</Gotcha>
        <P>Test yourself on <code>WWLWW</code> and <code>LWLWL</code> before trusting the code. Tracing a 5-character input by hand is a 30-second habit that catches this class of bug every time.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What two variables does a longest-streak scan keep, and on what event does each one change?" /> },
  ],

  /* ————— 11 · day-1 review ————— */
  "p1-11": [
    { kind: "context", title: "Why this review exists",
      body: (<div className="space-y-3">
        <P>Re-reading feels like studying and teaches almost nothing. Retrieval — pulling the idea out of your head with the page covered — is what converts a worked example into a skill you can use under time pressure. This page is ten retrieval prompts covering lessons 1–10. Answer each before expanding anything.</P>
        <Key>If the recall attempt didn't hurt a little, the session didn't count.</Key>
      </div>) },
    { kind: "concept", title: "The ten prompts",
      body: (<div className="space-y-3">
        <P>1. What three variables are enough to count inputs above a threshold? (n, h, ok — lesson 2)</P>
        <P>2. ⌊100/7⌋ counts what? (multiples of 7 in [1,100] — lesson 3)</P>
        <P>3. In <code>for(i&lt;n) for(j&lt;m)</code>, which index is the row? (i — lesson 4)</P>
        <P>4. You need one summary per column of a huge matrix. How many ints do you store? (m — lesson 5)</P>
        <P>5. "Did this id appear at all" vs "which id appears most" — presence or frequency? (presence; frequency — lesson 6)</P>
        <P>6. Why does a maximal-run scan need a line after the loop? (the last run never meets a differing neighbour — lesson 7)</P>
        <P>7. Anton and Danik: why two counters and no array? (each char is classified once — lesson 8)</P>
        <P>8. What two counters does a longest-streak scan keep? (cur, best — lesson 9)</P>
        <P>9. Nested loops do what to the running time? (multiply — lesson 10)</P>
        <P>10. A variable doubled each turn means the loop is…? (logarithmic — lesson 10)</P>
      </div>) },
    { kind: "retrieval", title: "Score yourself honestly",
      body: <Recall prompt="How many of the ten could you answer in under five seconds? Anything slower than that gets re-read today, not tomorrow." /> },
  ],

  /* ————— 15 · prefix-sum transfer (LeetCode 303) ————— */
  "p2-15": [
    { kind: "context", title: "Same idea, a different interface",
      body: (<div className="space-y-3">
        <P>CSES 1646 reads all queries up front. LeetCode 303 wraps the same idea in an object: you build once, then answer <code>sumRange(l, r)</code> calls one at a time. Nothing about the math changes — <code>P[r] − P[l−1]</code> — only the shape of the code. Transfer means recognising the identical skeleton under new clothing.</P>
        <Key>Build the prefix array in the constructor; each query is two array reads and a subtraction, forever.</Key>
      </div>) },
    { kind: "worked", title: "The C that the C++ class wraps",
      body: (<div className="space-y-3">
        <Code title="range-sum.c" code={`int P[10001];      /* P[0] = 0, P[i] = a0+...+a(i-1) */

void build(int *a, int n) {
    P[0] = 0;
    for (int i = 0; i < n; i++) P[i + 1] = P[i] + a[i];
}

int sumRange(int l, int r) {   /* inclusive l..r */
    return P[r + 1] - P[l];
}`}
          caption="Watch the index shift: P[i+1] holds the sum of the first i+1 elements, so inclusive range l..r is P[r+1] − P[l]." />
        <P>Trace it on <code>a = [-2, 0, 3]</code>: <code>P = [0, -2, -2, 1]</code>. Then <code>sumRange(0,2) = P[3] − P[0] = 1</code>, <code>sumRange(1,2) = P[3] − P[1] = 3</code>. The off-by-one lives entirely in how you align <code>P</code> to <code>a</code> — pick one alignment and never mix two.</P>
      </div>) },
    { kind: "bug", title: "Mixing two alignments",
      body: (<div className="space-y-3">
        <Gotcha>Building <code>P</code> with one convention (e.g. <code>P[i]</code> = sum of first <code>i</code> elements) but querying with another (<code>P[r] − P[l]</code> as if <code>P</code> were 1-based). It passes small samples and fails on range boundaries.</Gotcha>
        <P>Write the meaning of <code>P[i]</code> as a comment the moment you declare it, and derive the query formula from that comment. Derive, don't remember.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="If P[i] is the sum of the first i elements (P[0]=0), what is the inclusive sum of a[l..r] in terms of P?" /> },
  ],

  /* ————— 16 · 2D prefix sums (LeetCode 304) ————— */
  "p2-16": [
    { kind: "context", title: "From a line to a rectangle",
      body: (<div className="space-y-3">
        <P>Now the queries are rectangles, not intervals: sum of the submatrix from <code>(r1,c1)</code> to <code>(r2,c2)</code>. The 1D trick generalises with one extra idea — <strong>inclusion–exclusion</strong>: add two big prefixes, subtract the overlap you counted twice.</P>
        <Key>Define <code>P[i][j]</code> = sum of the rectangle from (0,0) to (i−1,j−1). Then any submatrix is a combination of four corner values of P.</Key>
      </div>) },
    { kind: "worked", title: "Build and query",
      body: (<div className="space-y-3">
        <Code title="prefix2d.c" code={`long long P[301][301];   /* P[0][*] = P[*][0] = 0 */

/* build: P[i][j] = rect (0,0)..(i-1,j-1) */
for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    P[i][j] = a[i-1][j-1] + P[i-1][j] + P[i][j-1] - P[i-1][j-1];

/* query rect (r1,c1)..(r2,c2), 0-based inclusive */
long long rect(int r1, int c1, int r2, int c2) {
  return P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1];
}`}
          caption="The build's −P[i-1][j-1] removes the overlap added twice; the query's +P[r1][c1] puts back the corner subtracted twice." />
        <Trace head={["", "build", "query"]} rows={[
          ["overlap", "− P[i−1][j−1]", "+ P[r1][c1]"],
          ["why", "added twice by the two adds", "subtracted twice by the two subs"],
        ]} />
        <P>Both corrections are the same inclusion–exclusion move, mirrored. Say out loud <em>why</em> each sign is what it is — if you can, the formula is yours, not memorised.</P>
      </div>) },
    { kind: "bug", title: "Dropping a sign",
      body: (<div className="space-y-3">
        <Gotcha>Writing the query as <code>P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1]</code> with no <code>+ P[r1][c1]</code>. Every rectangle that doesn't touch the origin is then missing its top-left corner.</Gotcha>
        <P>Always verify on a 1×1 rectangle away from the origin — it's the smallest case that exercises all four terms.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="In the 2D query formula, why is the last term added, not subtracted?" /> },
  ],

  /* ————— 18 · qsort + comparators ————— */
  "p2-18": [
    { kind: "context", title: "What does a sort actually need from you?",
      body: (<div className="space-y-3">
        <P>Half of Phase 3 — greedy, two pointers, binary search — starts with the words "first, sort". So sorting stops being a topic and becomes plumbing: you should never write a sort loop again, because <code>qsort</code> in <code>stdlib.h</code> already knows how to move elements in O(n log n). But here is the question that makes the whole design click: <em>qsort can move your data, but can it understand it?</em> No. It has no idea what an "age" or a "name" or a "priority" is. It can shuffle bytes, but the one thing it cannot do is <strong>decide which of two elements goes first</strong> — that decision requires meaning, and meaning lives in your problem, not in the library.</P>
        <P>So the division of labor is forced: the library owns the <em>moving</em> (the hard part, solved once for everyone), and you own the <em>meaning</em>, delivered through one tiny interface — a function qsort calls, again and again, with exactly one question: <strong>of these two elements, which comes first?</strong> That function is the comparator, and this lesson is entirely about answering that question honestly.</P>
      </div>) },
    { kind: "concept", title: "The sign convention, derived from the question",
      body: (<div className="space-y-3">
        <P>C's interface for the answer is an integer with three zones, and each zone is one of the three possible answers to "which comes first?":</P>
        <Chain items={[
          <span><strong>Negative:</strong> "the first element goes before the second."</span>,
          <span><strong>Zero:</strong> "they're tied — either order is fine."</span>,
          <span><strong>Positive:</strong> "the second goes before the first."</span>,
        ]} />
        <P>Why a sign and not a yes/no? Because the sort also needs to know about <em>ties</em> — a yes/no answer can't say "it doesn't matter", and some sorts use ties to decide when to stop shuffling. Three zones, three honest answers, nothing more. The convention feels arbitrary until you notice it's exactly what subtraction already does: if a &lt; b, then a − b is negative — "a goes first" ✓. So for integers, <code>return a − b;</code> <em>looks</em> like the perfect comparator. It isn't, and the reason is arithmetic, not style — see the bug step. The sign convention survives; the subtraction doesn't.</P>
        <Key>{"A comparator is your answer to qsort's one question — which of these two goes first? — encoded as negative / zero / positive. The sort never changes; only your answer does. That separation is the entire skill: every 'sort by …' problem is the same qsort call with a different answer function."}</Key>
      </div>) },
    { kind: "worked", title: "Two comparators, one sort",
      body: (<div className="space-y-3">
        <Code title="qsort.c" code={`#include <stdlib.h>

/* answer: ascending — the familiar order */
int ascending(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    return (a > b) - (a < b);    /* 1, -1, or 0 — the three zones */
}

/* same data, opposite answer: descending */
int descending(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    return (b > a) - (b < a);    /* the roles are simply swapped */
}

qsort(arr, n, sizeof(int), ascending);     /* [2, 5, 8] */
qsort(arr, n, sizeof(int), descending);    /* [8, 5, 2] */`}
          caption="The two calls differ only in the answer function — the moving is untouched. In lesson 19 the elements become records and the comparator reads a field instead of an int; the zones stay identical." />
        <P>Trace what the convention does on [5, 2, 8]: whatever strategy qsort uses internally, every move it makes is justified by an answer from your function — cmp(5,2) = +1 says 2 goes first, cmp(2,8) = −1 says 2 stays first, cmp(5,8) = −1 says 5 before 8. The sorted array [2, 5, 8] is the only arrangement consistent with all your answers. You never told the sort <em>how</em> to sort; you told it what "sorted" <em>means</em>, and it did the rest.</P>
      </div>) },
    { kind: "bug", title: "Two ways a comparator lies",
      body: (<div className="space-y-3">
        <Gotcha title="the arithmetic lie: return a − b">Take a = 2·10⁹ (near INT_MAX) and b = −2·10⁹. The truth is "a goes first", a positive answer… but a − b = 4·10⁹ doesn't fit in an int — it wraps to a <em>negative</em> number, and your function just told qsort that b goes first. One overflow, and every comparison involving extremes answers backwards. The (a&gt;b) − (a&lt;b) construction can't lie: each comparison is 0 or 1, the difference is −1, 0, or 1, and no intermediate value ever leaves the safe range.</Gotcha>
        <P>The second lie is subtler: <strong>inconsistency</strong>. A comparator is a promise that your "goes first" relation behaves like a real ranking — if A before B and B before C, then A before C. A comparator built on something fuzzy (say, "sort by rounded value, but break ties by memory address") can say A &lt; B, B &lt; C, and C &lt; A at different moments. Then no sorted arrangement <em>exists</em> that satisfies your answers, and qsort — which assumes one does — produces arbitrary output, differing by input, machine, and mood. Before writing a comparator, ask the one question that keeps it honest: "could my rule ever contradict itself across three elements?"</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="What is the single question qsort asks your comparator, and what do the three answer zones mean? Then explain return a−b's failure on (2·10⁹, −2·10⁹) step by step, and state the consistency question you ask before trusting any comparator." /> },
  ],

  /* ————— 19 · struct, killing parallel arrays ————— */
  "p2-19": [
    { kind: "context", title: "Watch a phone book lie to you",
      body: (<div className="space-y-3">
        <P>The natural first phone book is three arrays: <code>name[1000][50]</code>, <code>age[1000]</code>, <code>phone[1000][20]</code> — person <em>i</em>'s data at index <em>i</em> in all three. Now do the most ordinary thing imaginable: sort the people by age, using lesson 18's qsort on the <code>age</code> array. It works. Ages come out ordered. And your phone book is now <strong>fiction</strong>: <code>age[0]</code> is the youngest age, but <code>name[0]</code> is still whoever was first in the input — the sort moved the ages and left the names and phones behind. Person 7's age now belongs to person 9, and nothing — no compiler, no runtime, no test on sorted-by-name data — will ever tell you.</P>
        <P>That is the whole problem in one scene: the three arrays <em>agree</em> about who is who only by a convention that every single operation must manually honor — move one, move all three, in lockstep, forever. One swap function, one sort, one filter, and the convention is one forgotten loop away from breaking. The fix is not more vigilance. It's making the disagreement <strong>impossible to represent</strong>.</P>
      </div>) },
    { kind: "concept", title: "Glue the fields into one value",
      body: (<div className="space-y-3">
        <P>A <code>struct</code> is exactly that glue: it declares that a name, an age, and a phone number are <em>one thing</em> — one value that lives in one place. From then on there is no operation that moves an age without its person, because "an age by itself" no longer exists in the program. Sorting the array of structs moves whole records: the ages get reordered and the names and phones ride along, not because you remembered, but because there is nothing else they <em>can</em> do.</P>
        <Key>A struct groups related fields into a single value, so related data can never drift apart — the synchronization the parallel arrays demanded by convention is now guaranteed by the type.</Key>
        <P>Notice what this does to lesson 18: qsort didn't change at all. It still only knows how to move fixed-size chunks and still asks your comparator which goes first. The only difference is that the chunk is now a whole person — <code>sizeof(Person)</code> bytes — and the comparator reads a field instead of a bare int. Struct + comparator compose: <em>any</em> collection of records can be sorted by <em>any</em> field, with one sort call and one small function.</P>
      </div>) },
    { kind: "worked", title: "Phone book v2",
      body: (<div className="space-y-3">
        <Code title="phonebook.c" code={`typedef struct {
    char name[50];
    int  age;
    char phone[20];
} Person;

Person people[1000];
int n;

int by_age(const void *x, const void *y) {
    const Person *a = x, *b = y;
    return (a->age > b->age) - (a->age < b->age);
}

qsort(people, n, sizeof(Person), by_age);  /* whole records move */`}
          caption="sizeof(Person) — not sizeof(int). The third qsort argument is the size of one element, and with a struct it's the whole record." />
        <P>Notice the comparator now casts to <code>Person*</code> and reads a field. This is exactly lesson 18's comparator, pointed at a struct. The two lessons compose: struct + comparator = sort records by any field.</P>
      </div>) },
    { kind: "bug", title: "sizeof(int) on a struct array",
      body: (<div className="space-y-3">
        <Gotcha>Passing <code>sizeof(int)</code> (or the element size of an old parallel array) to qsort for a struct array. qsort then moves undersized chunks and silently corrupts every record.</Gotcha>
        <P>Rule: the third argument is always <code>sizeof(arr[0])</code>. Write it that way and it can never be the wrong type again.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What goes wrong with parallel arrays when you sort by one of them, and what single qsort argument must you change when the array holds structs?" /> },
  ],

  /* ————— 20 · two pointers (CSES 1640) ————— */
  "p2-20": [
    { kind: "context", title: "An n² question with an n answer",
      body: (<div className="space-y-3">
        <P>"Do two elements sum to X?" invites checking all pairs — n²/2 of them. But if the array is <strong>sorted</strong>, the two ends tell you something: the smallest+largest sum brackets everything. Too small? The left element can't pair with <em>anything</em> left of the right pointer, so advance left. Too big? Retreat right. Each comparison kills a whole row or column of candidate pairs at once.</P>
        <Key>Two pointers on a sorted array: i at the start, j at the end; move i up when the sum is too small, j down when too big. At most 2n probes instead of n²/2.</Key>
      </div>) },
    { kind: "handson", title: "Squeeze it yourself",
      body: (<div className="space-y-3">
        <P>On the next page, a live toy runs the exact argument. Watch which pointer moves on each step and convince yourself it never skips a valid pair.</P>
      </div>) },
    { kind: "worked", title: "The code",
      body: (<div className="space-y-3">
        <Code title="two-sum.c" code={`int i = 0, j = n - 1;
while (i < j) {
    int s = a[i] + a[j];
    if      (s == x) { found; break; }
    else if (s <  x) i++;   /* a[i] too small for everything */
    else             j--;   /* a[j] too big for everything   */
}`}
          caption="The loop is i < j, not i <= j — an element can't pair with itself." />
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Why is it safe to advance i when a[i]+a[j] < X — what whole set of pairs did you just rule out?" /> },
  ],

  /* ————— 21 · sliding window ————— */
  "p2-21": [
    { kind: "context", title: "Don't re-add what didn't change",
      body: (<div className="space-y-3">
        <P>"Maximum sum of a contiguous window of size k" done naively re-sums each window: O(n·k). But consecutive windows overlap in k−1 elements — only one enters and one leaves. Keep a running sum, add the newcomer, drop the leaver, and every window costs O(1). That is the <strong>fixed-size sliding window</strong>.</P>
        <Key>A sliding window maintains an aggregate incrementally: as the window moves one step, update by the two elements that changed, not by recomputing.</Key>
      </div>) },
    { kind: "worked", title: "Max-sum window of size k",
      body: (<div className="space-y-3">
        <Code title="window.c" code={`long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];     /* first window */
long long best = sum;
for (int i = k; i < n; i++) {
    sum += a[i];        /* element enters  */
    sum -= a[i - k];    /* element leaves  */
    if (sum > best) best = sum;
}`}
          caption="a[i] enters, a[i−k] leaves. The window [i−k+1 .. i] is always exactly k wide." />
        <P>The <em>variable-size</em> variant (e.g. "smallest window with sum ≥ S") grows the right end until the condition holds, then shrinks the left end — same incremental idea, two independent pointers. That's the next step.</P>
      </div>) },
    { kind: "worked", title: "Variable size · LC 209, minimum window with sum ≥ S",
      body: (<div className="space-y-3">
        <P>Now the window has no fixed width: find the <em>shortest</em> contiguous window whose sum is at least S (or report none). The two ends move <strong>independently</strong>, each only forward, and each move is still an O(1) update of the running sum:</P>
        <Code title="min-window.c" code={`int l = 0;
long long sum = 0;
int best = n + 1;                 /* "no window found" sentinel */

for (int r = 0; r < n; r++) {
    sum += a[r];                  /* grow the right end */
    while (sum >= S) {            /* condition holds: try to shrink */
        if (r - l + 1 < best) best = r - l + 1;
        sum -= a[l];              /* drop the left element */
        l++;
    }
}
if (best == n + 1) best = 0;      /* the statement's "none" answer */`}
          caption="r walks once, l walks once — 2n pointer moves total, so O(n) despite the nested while. The inner loop only runs while the window is good." />
        <Trace
          head={["r", "a[r]", "window [l..r]", "sum", "action", "best"]}
          rows={[
            [0, 2, "[0..0]", 2, "2 < 7, grow", "—"],
            [1, 3, "[0..1]", 5, "5 < 7, grow", "—"],
            [2, 1, "[0..2]", 6, "6 < 7, grow", "—"],
            [3, 2, "[0..3]", 8, "≥7 → record 4; drop 2", 4],
            [4, 4, "[1..4]", 10, "≥7 → record 4; drop 3; still ≥7 → record 3; drop 1", 3],
            [5, 3, "[3..5]", 9, "≥7 → record 3; drop 2; 7 ≥ 7 → record 2; drop 4", 2],
          ]} />
        <P>That trace is on the classic sample <code>a = [2,3,1,2,4,3], S = 7</code> — answer 2, the window <code>[4,3]</code>. The discipline to own: <em>grow until the condition holds, then shrink while it holds</em>, recording at every shrink. If your inner loop instead shrinks until the condition <em>breaks</em>, you'll record windows that no longer qualify — run this one trace and the asymmetry is obvious.</P>
      </div>) },
    { kind: "bug", title: "Off-by-one on the leaving element",
      body: (<div className="space-y-3">
        <Gotcha>Subtracting <code>a[i−k+1]</code> or <code>a[i−1]</code> instead of <code>a[i−k]</code>. The window quietly changes width and every answer after the first is wrong — but the first window is right, so samples pass.</Gotcha>
        <P>Print the window bounds for a tiny input (n=5, k=3) and check each is exactly k wide.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="When a fixed window of size k slides one step right, which two array elements change the running sum, and by what sign?" /> },
  ],

  /* ————— 22 · stress testing ————— */
  "p2-22": [
    { kind: "context", title: "The judge won't tell you which test failed",
      body: (<div className="space-y-3">
        <P>A wrong answer on test 47 of 60 tells you nothing. A stress tester tells you everything: it generates thousands of tiny random inputs, runs your solution <em>and</em> a slow-but-obviously-correct brute force on each, and shows you the first input where they disagree — small enough to trace by hand. This is the single highest-leverage debugging habit in competitive programming.</P>
        <Key>Stress test = generator + brute force + your solution, diffed on random small inputs, until they disagree.</Key>
      </div>) },
    { kind: "worked", title: "A minimal stress.sh",
      body: (<div className="space-y-3">
        <Code title="stress.sh" code={`#!/bin/bash
for i in $(seq 1 1000); do
  ./gen $i > in.txt        # seeded generator
  ./sol  < in.txt > a.txt  # your solution
  ./brute < in.txt > b.txt # obvious slow version
  if ! cmp -s a.txt b.txt; then
    echo "MISMATCH on:"; cat in.txt; break
  fi
done`}
          caption="The generator takes the loop index as a seed so a failing case is reproducible." />
        <P>The brute force is allowed to be O(n³) — it only runs on tiny inputs. Its job is to be <em>obviously correct</em>, not fast. When the two disagree, you now own a 6-element failing input instead of a mystery.</P>
      </div>) },
    { kind: "bug", title: "Testing only the samples",
      body: (<div className="space-y-3">
        <Gotcha>Submitting after passing the two given examples. Samples are chosen to illustrate the statement, not to find your bugs — boundary and adversarial cases (n=1, all equal, already sorted, maximum n) live elsewhere.</Gotcha>
        <P>Before every submit: one boundary case, one adversarial case, and a stress run. Thirty seconds that catch the bugs the judge would have found anyway.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Name the three programs a stress tester runs, and why the brute force is allowed to be slow." /> },
  ],

  /* ————— 23 · write your own strcmp ————— */
  "p2-23": [
    { kind: "context", title: "Own the tools you call",
      body: (<div className="space-y-3">
        <P><code>strcmp</code>, <code>strlen</code>, <code>strcpy</code> are one loop each. Writing them yourself once removes all mystery from C strings: a string is just a char array that ends at <code>'\\0'</code>, and every string operation is a walk that stops there. This drill builds the three from scratch.</P>
        <Key>A C string is a char array terminated by '\\0'. strlen walks to the terminator; strcmp walks until two chars differ or both end; strcpy walks copying the terminator too.</Key>
      </div>) },
    { kind: "worked", title: "Three loops",
      body: (<div className="space-y-3">
        <Code title="mystrings.c" code={`int my_strlen(const char *s) {
    int n = 0;
    while (s[n]) n++;               /* stop at '\\0' */
    return n;
}

int my_strcmp(const char *a, const char *b) {
    int i = 0;
    while (a[i] && a[i] == b[i]) i++;
    return (unsigned char)a[i] - (unsigned char)b[i];
}

void my_strcpy(char *dst, const char *src) {
    int i = 0;
    while ((dst[i] = src[i])) i++;  /* copies '\\0' too */
}`}
          caption="The cast to unsigned char in strcmp matters: plain char may be signed, and a byte ≥128 would compare backwards." />
        <Trace head={["i", "a[i]", "b[i]"]} rows={[
          [0, 'c', 'c'], [1, 'a', 'a'], [2, 't', 'r'],
        ]} />
        <P>On "cat" vs "car", the loop stops at i=2 ('t' vs 'r') and returns a positive value. Walk it once by hand — that walk is the entire concept.</P>
      </div>) },
    { kind: "bug", title: "Forgetting the terminator",
      body: (<div className="space-y-3">
        <Gotcha>In strcpy, stopping <em>before</em> copying <code>'\\0'</code> — the destination isn't a string, and the next strlen reads past the buffer. Or in strcmp, comparing signed chars so high bytes invert the order.</Gotcha>
        <P>Every string function you write gets tested on the empty string <code>""</code> and on two equal strings. Those two cases exercise the terminator logic directly.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What single character marks the end of a C string, and which of the three functions must copy it into the destination?" /> },
  ],

  /* ————— 24 · phase 2 review ————— */
  "p2-24": [
    { kind: "context", title: "Phase 2 in six questions",
      body: (<div className="space-y-3">
        <P>Phase 2's big idea: stop rewriting the same loop — package it, test it, precompute it. These six retrieval prompts cover the whole phase. Answer before looking back; the goal is speed, because speed is what survives into the exam room.</P>
      </div>) },
    { kind: "concept", title: "The six prompts",
      body: (<div className="space-y-3">
        <P>1. What does <code>P[r+1] − P[l]</code> compute, and why is P built once? (inclusive range sum; O(1) per query — 15)</P>
        <P>2. In the 2D query, why is <code>+P[r1][c1]</code> added? (it was subtracted twice — 16)</P>
        <P>3. What sign convention does a qsort comparator use? (&lt;0 before, 0 equal, &gt;0 after — 18)</P>
        <P>4. What does a struct eliminate? (parallel arrays drifting out of sync — 19)</P>
        <P>5. On a sorted array, why does two pointers advance only one pointer per step? (each step discards a whole row/column of pairs — 20)</P>
        <P>6. What three programs does a stress tester diff? (generator-driven solution vs brute force — 22)</P>
      </div>) },
    { kind: "retrieval", title: "Ready for Phase 3?",
      body: <Recall prompt="All six in under ten seconds each? If yes, Phase 3's patterns (which all begin with 'sort' or 'precompute') are built on solid ground. If not, revisit the flagged lesson today." /> },
  ],
};
