/* ————————————————————————————————————————————————
   Maratona Lab · full syllabus
   Goal: independently solve 5–6 of the easiest problems
   from a recent Maratona SBC first-phase exam, untimed.
   ———————————————————————————————————————————————— */

export type Status = "done" | "wip" | "planned";
export type LessonKind = "lab" | "recap" | "drill";

export interface Quiz {
  q: string;
  explain: string;
  /* "mc" (default): pick the right option. "input": produce the number from
     memory — true recall, no options to eliminate your way through. */
  type?: "mc" | "input";
  options?: string[];
  answer?: number;
  inputAnswer?: number;
  inputHint?: string;
}

export interface Item {
  id: string;
  num: number;
  title: string;
  artifact: string;
  status: Status;
  kind: LessonKind;
  minutes: number;
  summary: string;
  code?: string;
  codeTitle?: string;
  codeCaption?: string;
  gotcha?: string;
  quiz?: Quiz;
  willLearn?: string[];
  codePair?: { c: string; cpp: string; note: string };
  /* problem sheets rendered inside this lesson (keys of PROBLEMS) */
  problems?: string[];
}

export interface Phase {
  n: number;
  numeral: string;
  title: string;
  days: string;
  bigIdea: string;
  accent: string;
  items: Item[];
}

export const PHASES: Phase[] = [
  {
    n: 1,
    numeral: "I",
    title: "Represent only what matters",
    days: "Days 1–3",
    bigIdea: "The shape of the input does not dictate the shape of your storage. Decide the minimum state you must keep.",
    accent: "var(--green)",
    items: [
      {
        id: "p1-01", num: 1, title: "Statement → C: read, loop, count", artifact: "Maratona 2023 A · Altura Mínima", problems: ["sbc2023a"],
        status: "done", kind: "recap", minutes: 25,
        summary:
          "The first translation skill: read the statement, extract the input shape and the actual question, then write the smallest loop that answers it. Here: N heights and a minimum bar H — count how many clear it.",
        code: `#include <stdio.h>

int main(void) {
    int n, hmin, h, ok = 0;
    scanf("%d %d", &n, &hmin);
    for (int i = 0; i < n; i++) {
        scanf("%d", &h);
        if (h >= hmin) ok++;
    }
    printf("%d\\n", ok);
    return 0;
}`,
        codeTitle: "altura-minima.c",
        codeCaption: "Three scalars, one loop, one comparison. The whole problem fits in O(1) memory.",
        gotcha:
          "“At least H” includes H itself — the >= is doing real work. One swapped symbol and the judge answers WA while your code still “works” on your sample.",
        quiz: {
          q: "The statement says players with height at least H pass. Which test matches?",
          options: ["h > hmin", "h >= hmin", "h == hmin", "h < hmin"],
          answer: 1,
          explain: "“At least H” means H or more, so h >= hmin. Boundary words (at least, at most, strictly) are half the problem.",
        },
      },
      {
        id: "p1-02", num: 2, title: "Streaming input: never store what you only visit once",
        artifact: "2023 A rewritten without the array", problems: ["sbc2023a"], status: "done", kind: "lab", minutes: 20,
        summary:
          "Take item 1 and delete the array. If a value is read, used, and never needed again, it doesn't deserve storage — memory drops from O(n) to O(1) and the code gets shorter.",
      },
      {
        id: "p1-03", num: 3, title: "Algebra beats simulation · integer floor division",
        artifact: "Maratona 2024 A · Atenção à Reunião", problems: ["sbc2024a"], status: "done", kind: "recap", minutes: 25,
        summary:
          "Counting by looping is simulation; counting by dividing is algebra. Floor division n/k already means “how many multiples of k fit in 1..n” — the truncation is the answer, not an error to fix.",
        code: `/* how many multiples of k in [1..n]? don't loop — divide */
long long up_to(long long n, long long k) {
    return n / k;
}

/* how many multiples of k in [a..b]?
   multiples up to b, minus the ones before a */
long long in_range(long long a, long long b, long long k) {
    return b / k - (a - 1) / k;
}`,
        codeTitle: "floor-division.c",
        codeCaption: "O(1) per query. The loop version is O(n) and times out for n = 10⁹; this one doesn't care how big n is.",
        gotcha:
          "Integer division truncates toward zero on positive operands — exactly the floor you want. The trap is writing n/k + 1 “to be safe”: that counts a multiple that isn't there.",
        quiz: {
          type: "input",
          q: "How many multiples of 7 are there in [1, 100]?",
          inputAnswer: 14,
          inputHint: "⌊100/7⌋ — the largest k with 7k ≤ 100.",
          explain: "100 / 7 = 14 (since 7 × 14 = 98 ≤ 100 < 105). Floor division did the counting for you.",
        },
      },
      {
        id: "p1-04", num: 4, title: "Row/column discipline in nested loops", artifact: "drill",
        status: "done", kind: "recap", minutes: 15,
        summary:
          "One convention, forever: i walks rows (0..n-1), j walks columns (0..m-1). The loops themselves are trivial — the discipline is never swapping i and j inside the body.",
        code: `for (int i = 0; i < n; i++) {        /* row    i */
    for (int j = 0; j < m; j++) {    /* column j */
        scanf("%d", &x);
        /* x belongs to row i, column j — no exceptions */
    }
}`,
        codeTitle: "discipline.c",
        gotcha:
          "Swapped i/j compiles, runs, and even passes the samples when the matrix is nearly square. It's a silent transposition — comment the loops and never break the convention.",
        quiz: {
          q: "With i < n outer and j < m inner, the value read at (i, j) belongs to…",
          options: ["row i, column j", "row j, column i", "it depends on n and m", "diagonal i+j"],
          answer: 0,
          explain: "Outer loop = row, inner loop = column, always. The convention exists so you never have to think about it again.",
        },
      },
      {
        id: "p1-05", num: 5, title: "One summary per column · the matrix you never store",
        artifact: "Maratona 2025 A · Alimentação saudável", problems: ["sbc2025a"], status: "done", kind: "recap", minutes: 25,
        summary:
          "The input looks like a matrix, but the question only asks about columns. So keep m running flags and let the matrix stream past — you never needed it.",
        code: `int ok[101];                        /* ok[j] = day j still healthy */
int x;
for (int j = 0; j < m; j++) ok[j] = 1;
for (int i = 0; i < n; i++)          /* each student… */
    for (int j = 0; j < m; j++) {    /* …each day     */
        scanf("%d", &x);
        ok[j] = ok[j] && x;          /* AND summary lives here */
    }                                /* the matrix never does */
int healthy = 0;
for (int j = 0; j < m; j++) healthy += ok[j];`,
        codeTitle: "healthy-days.c",
        codeCaption: "n×m values in, m flags out. Storage: O(m), not O(n·m).",
        gotcha:
          "Index the accumulator with j, not i — and size it by columns (m), not rows. Reading the question as “matrix problem” instead of “column summaries” is what invites the 2D array.",
        quiz: {
          q: "Input is 10⁴ rows × 10² columns; you only need one summary per column (a flag, count, or sum). Minimum storage is…",
          options: ["10⁶ ints (the matrix)", "10² ints (one per column)", "10⁴ ints (one per row)", "a single int"],
          answer: 1,
          explain: "One running summary per column: m = 10² ints. The matrix itself is never materialized.",
        },
      },
      {
        id: "p1-06", num: 6, title: "Presence vs. frequency arrays · direct indexing",
        artifact: "Maratona 2025 J · João João", problems: ["sbc2025j"], status: "done", kind: "recap", minutes: 20,
        summary:
          "“Has it appeared?” and “how many times?” are different questions that both use an array indexed by the value itself. Presence writes a 1; frequency adds 1. The operator is the whole distinction.",
        code: `int seen[1001] = {0};          /* presence: 0 or 1 only */
for (int i = 0; i < n; i++) {
    scanf("%d", &id);
    seen[id] = 1;              /* duplicates collapse  */
}
int distinct = 0;
for (int v = 0; v <= 1000; v++)
    distinct += seen[v];`,
        codeTitle: "presence.c",
        codeCaption: "The value IS the index — no searching, no sorting, O(1) per update.",
        gotcha:
          "seen[id] = 1 answers “distinct”; seen[id]++ answers “how many”. Same shape, different operator. Also: size the array by the VALUE RANGE (here 1000), not by n.",
        quiz: {
          q: "Which question needs a frequency array rather than a presence array?",
          options: ["how many distinct ids appeared", "did any id appear twice", "which id appears the most", "is id 42 present at all"],
          answer: 2,
          explain: "Finding the maximum count requires actual counts. The other three are all yes/no presence questions.",
        },
      },
      {
        id: "p1-07", num: 7, title: "Strings, maximal runs, and finalization after the loop",
        artifact: "Maratona 2022 A · Achando os Monótonos", problems: ["sbc2022a"], status: "done", kind: "recap", minutes: 30,
        summary:
          "A maximal run only ends when the next character differs — so the last run never ends inside the loop. The pattern: extend-or-reset inside, one final closing comparison after.",
        code: `int best = 0, cur = 1;
for (int i = 1; i < n; i++) {
    if (s[i] == s[i - 1])
        cur++;                 /* extend the run */
    else {
        if (cur > best) best = cur;   /* close it */
        cur = 1;                      /* start new */
    }
}
if (cur > best) best = cur;    /* the run the loop never closed */`,
        codeTitle: "longest-run.c",
        codeCaption: "Two variables of state. Everything else is input.",
        gotcha:
          "Drop the line after the loop and a string like \"aaa\" reports best = 0. The finalization line is the most-forgotten line in Phase 1.",
        quiz: {
          q: "s = \"aaa\" and the post-loop finalization is deleted. What does the code print?",
          options: ["3", "0", "1", "it crashes"],
          answer: 1,
          explain: "The comparison never fires (no differing neighbor), so best is never updated and stays 0. The run existed; nothing ever closed it.",
        },
      },
      {
        id: "p1-08", num: 8, title: "Unguided retrieval · Anton and Danik",
        artifact: "Codeforces 734A", problems: ["cf734a"], status: "done", kind: "recap", minutes: 15,
        summary:
          "Close the notes. A string of n game results, each 'A' or 'D'; count both and compare. Solved from memory of the shape, not from copying code — retrieval is the exercise.",
        code: `char s[100002];
int n, a = 0, d = 0;
scanf("%d %s", &n, s);
for (int i = 0; i < n; i++) {
    if (s[i] == 'A') a++;
    else             d++;
}
if (a > d)      puts("Anton");
else if (d > a) puts("Danik");
else            puts("Friendship");`,
        codeTitle: "anton-danik.c",
        gotcha:
          "Read n but iterate until the '\\0' terminator and a trailing-space input ruins your day. Either trust n, or trust the terminator — pick one per problem.",
        quiz: {
          q: "Why is there no array of counts per position here?",
          options: [
            "because C has no arrays",
            "each character is classified once, so two counters capture everything",
            "because the string is too long to store",
            "because 'A' and 'D' are the only letters",
          ],
          answer: 1,
          explain: "Each character is visited once and immediately turned into +1 for one of two totals. Minimum state, again.",
        },
      },
      {
        id: "p1-09", num: 9, title: "Transfer · longest winning streak", artifact: "custom variant",
        status: "done", kind: "recap", minutes: 15,
        summary:
          "The run machinery from item 7 in a new costume: longest consecutive run of 'W' in a results string. Transfer — retelling the pattern in different clothes — is the test that you own it.",
        code: `int best = 0, cur = 0;
for (int i = 0; i < n; i++) {
    if (s[i] == 'W') cur++;
    else             cur = 0;   /* streak broken */
    if (cur > best)  best = cur;
}`,
        codeTitle: "streak.c",
        codeCaption: "Notice the variant: closing here is per-position, so no post-loop line is needed. Same pattern, different closing rule.",
        quiz: {
          q: "The minimum state for a longest-streak scan is…",
          options: ["an array of all streaks", "two integers: cur and best", "the string plus a hashmap", "a recursive call per streak"],
          answer: 1,
          explain: "cur and best. Everything else is just input passing through — the Phase 1 big idea in two variables.",
        },
      },
      {
        id: "p1-10", num: 10, title: "Complexity · reading O(·) off the loop structure",
        artifact: "complexity-basics.html", status: "done", kind: "lab", minutes: 25,
        summary:
          "Nested loops multiply, sequential loops add, halving loops are logarithmic. Learn to look at the braces and name the growth before running anything.",
      },
      {
        id: "p1-11", num: 11, title: "Day 1 review · spaced retrieval", artifact: "—",
        status: "done", kind: "recap", minutes: 20,
        summary:
          "No new code today. Re-derive items 1–9 from a blank editor, then diff against the originals. Retrieval — struggling to recall before re-reading — is what converts short-term familiarity into long-term pattern.",
        gotcha:
          "Re-reading feels productive and teaches almost nothing. If the recall attempt didn't hurt a little, the session didn't count.",
        quiz: {
          q: "Which Phase 1 pattern needs a finalization step AFTER the loop?",
          options: ["presence arrays", "streaming counters", "maximal runs", "floor division"],
          answer: 2,
          explain: "Maximal runs only close when the next element differs — the last run outlives the loop and must be closed by hand.",
        },
      },
    ],
  },
  {
    n: 2,
    numeral: "II",
    title: "Reliable implementation tools",
    days: "Days 4–6",
    bigIdea: "Stop rewriting the same loop. Package it, test it, precompute it.",
    accent: "var(--orange)",
    items: [
      {
        id: "p2-12", num: 12, title: "Functions, contracts, array parameters, const",
        artifact: "longest-run refactor", status: "done", kind: "recap", minutes: 25,
        summary:
          "The longest-run scan will appear in a dozen problems — so it becomes a function with a contract: what it expects, what it promises, and a const that makes the promise compile-time.",
        code: `/* contract: length of the longest run of equal
   chars in s[0..n-1].  s is read-only. */
int longest_run(const char *s, int n) {
    if (n <= 0) return 0;
    int best = 1, cur = 1;
    for (int i = 1; i < n; i++) {
        cur = (s[i] == s[i - 1]) ? cur + 1 : 1;
        if (cur > best) best = cur;
    }
    return best;
}`,
        codeTitle: "run.c",
        gotcha:
          "Arrays decay to pointers when passed — the function cannot see the length, so the length travels as its own parameter. const is the contract made visible: look, don't touch.",
        quiz: {
          q: "What does const char *s promise to the caller?",
          options: [
            "the string is copied on entry",
            "the function won't modify the string through s",
            "the string is immutable everywhere in the program",
            "the string has constant length",
          ],
          answer: 1,
          explain: "const on the parameter binds only this function: it may read through s, never write through it. The caller's array stays safe.",
        },
      },
      {
        id: "p2-13", num: 13, title: "Landmarks and invariants instead of simulation",
        artifact: "Maratona 2024 E · Estojo de Joias", status: "done", kind: "recap", minutes: 30,
        summary:
          "When simulating every step is too slow, stop visiting steps. Record only where things CHANGE (landmarks) and rebuild state by sweeping; or find the quantity that never changes (invariant) and compute with that.",
        code: `/* k intervals flip positions [l..r].
   Simulating costs O(k * len).  Landmark view:
   only the interval ENDS are interesting. */
int diff[MAXN + 2] = {0};
for (int i = 0; i < k; i++) {
    diff[l[i]]++;        /* flipping starts here */
    diff[r[i] + 1]--;    /* flipping stops here  */
}
int flips = 0;
for (int x = 0; x <= n; x++) {
    flips += diff[x];    /* running sum = true state */
    /* parity of flips decides the final answer */
}`,
        codeTitle: "landmarks.c",
        codeCaption: "Mark the changes, sweep once. O(k + n) instead of O(k·len).",
        gotcha:
          "The diff array stores where the state CHANGES, not the state itself — beginners read diff[x] as “the answer at x”. Rebuilding state is always a running sum over landmarks. (Sound familiar? It's a preview of prefix sums.)",
        quiz: {
          q: "10⁵ intervals, each up to 10⁵ long. Simulating is ~10¹⁰ operations. The landmark sweep is…",
          options: ["O(k + n)", "O(k · n)", "O(n²)", "O(k log n)"],
          answer: 0,
          explain: "Two writes per interval (2k), one sweep over n. Landmarks compress time itself.",
        },
      },
      {
        id: "p2-14", num: 14, title: "Prefix sums · O(1) range queries after O(n) build",
        artifact: "CSES 1646 · Static Range Sum Queries", problems: ["cses1646"], status: "wip", kind: "lab", minutes: 40,
        summary:
          "Precompute P[i] = a₁ + … + aᵢ once; then any range sum [l..r] collapses to P[r] − P[l−1]. Pay O(n) at build time, answer every query in O(1). The workhorse of “many queries, never changes”.",
      },
      {
        id: "p2-15", num: 15, title: "Prefix-sum transfer · a different interface",
        artifact: "LeetCode 303 · Range Sum Query · Immutable", problems: ["lc303"], status: "planned", kind: "drill", minutes: 25,
        summary:
          "The judge changes costume — a struct with a constructor and a query method instead of stdin/stdout — but the invariant is identical. Transfer day: same P[], new wrapper.",
        willLearn: [
          "Wrap P[] behind init/query functions (the C version of a class)",
          "Why P[0] = 0 exists: so sum[1..r] needs no special case",
          "The l−1 edge: l = 1 must hit P[0], never P[−1]",
        ],
      },
      {
        id: "p2-16", num: 16, title: "2D prefix sums · submatrix sums", artifact: "LeetCode 304", problems: ["lc304"],
        status: "planned", kind: "drill", minutes: 35,
        summary:
          "The same trick one dimension up: P[i][j] accumulates the rectangle (1,1)..(i,j). Build with inclusion–exclusion, query with inclusion–exclusion — four corners, O(1).",
        willLearn: [
          "Build: P[i][j] = a[i][j] + P[i-1][j] + P[i][j-1] − P[i-1][j-1]",
          "Query: subtract two strips, add back the double-subtracted corner",
          "Drawing the rectangles — the algebra is just the picture",
        ],
      },
      {
        id: "p2-17", num: 17, title: "Searching + running time · linear, binary, O/Ω/Θ",
        artifact: "test 0012 · lab 0013", status: "wip", kind: "lab", minutes: 40,
        summary:
          "Scanning n elements is Θ(n); halving the search space per probe is Θ(log n). Watch both pointers move on a sorted array until the invariant does the work for you.",
      },
      {
        id: "p2-18", num: 18, title: "qsort and comparison functions", artifact: "sort ints, then sort by custom key",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "C's qsort sorts anything you can compare: hand it the element size and a comparator that answers “is a before b?”. First integers, then records by a chosen field.",
        willLearn: [
          "The qsort(base, n, size, cmp) contract and the int cmp(const void*, const void*) signature",
          "Returning negative / zero / positive — and why cmp returning a−b overflows on ints",
          "Sorting the same array by different keys just by swapping comparators",
        ],
      },
      {
        id: "p2-19", num: 19, title: "struct · killing parallel arrays", artifact: "phone book v2 · sort records by field",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "Parallel arrays (names[i], phones[i], ages[i]) are three ways to be off-by-one. A struct binds the fields into one record, and qsort + a comparator sorts records by any field.",
        willLearn: [
          "struct Person { char name[32]; long phone; int age; }; and arrays of it",
          "Comparators that reach into the struct: ((const Person*)a)->age",
          "Why swapping records swaps all fields at once — no more desync",
        ],
      },
      {
        id: "p2-20", num: 20, title: "Two pointers", artifact: "CSES · Sum of Two Values", problems: ["cses1640"], status: "planned", kind: "drill",
        minutes: 30,
        summary:
          "On a sorted array, one pointer at each end: too small → advance left; too big → retreat right. Each step discards a row of candidates, so n² pairs collapse to O(n) probes.",
        willLearn: [
          "Why sorting is the price of admission",
          "The discard argument: every move eliminates many pairs at once",
          "Recovering original indices after sorting (store them before you sort)",
        ],
      },
      {
        id: "p2-21", num: 21, title: "Sliding window · fixed and variable size", artifact: "LeetCode 209 · max-sum window of size k",
        status: "planned", kind: "drill", minutes: 35,
        summary:
          "A window [l..r] that only moves right: add at r, evict at l. Fixed-size windows are subtraction; variable-size windows are an invariant (“while the window is invalid, shrink”).",
        willLearn: [
          "Fixed k: maintain the window sum in O(1) per slide",
          "Variable: the two conditions that make l-moves safe (monotonicity)",
          "Smallest subarray with sum ≥ S — LeetCode 209 end to end",
        ],
      },
      {
        id: "p2-22", num: 22, title: "Testing discipline · stress testing", artifact: "build stress.sh", status: "planned", kind: "drill",
        minutes: 35,
        summary:
          "The contest bug is never in the sample. Build a generator, a slow-but-obviously-correct brute force, and a loop that diffs them on thousands of tiny random cases until something breaks.",
        willLearn: [
          "The three-piece stress kit: gen.c, brute.c, fast.c",
          "stress.sh: loop { generate → run both → diff → shout on mismatch }",
          "Boundary cases first: n = 1, n = 0, all equal, sorted, reverse-sorted",
        ],
      },
      {
        id: "p2-23", num: 23, title: "Write your own strcmp and string utilities", artifact: "drill",
        status: "planned", kind: "drill", minutes: 25,
        summary:
          "Rebuild the basics by hand — strcmp, strlen, a digit-parser — until the '\\0' terminator is muscle memory. You can't trust what you can't rebuild.",
        willLearn: [
          "strcmp: walk both strings, return the first difference",
          "Why returning s1[i] − s2[i] is subtly wrong for chars",
          "A safe atoi: sign, digits, and stopping at the first non-digit",
        ],
      },
      {
        id: "p2-24", num: 24, title: "Phase 2 review · mixed retrieval set", artifact: "—",
        status: "planned", kind: "drill", minutes: 40,
        summary:
          "A shuffled set drawn from items 12–23, solved without notes: one prefix-sum query, one comparator, one two-pointer run, one stress-test transcript. Pass it and Phase 3 unlocks.",
        willLearn: ["Mixed retrieval across all Phase 2 tools", "Self-grading against model solutions", "Naming the tool each problem needed — before coding"],
      },
    ],
  },
  {
    n: 3,
    numeral: "III",
    title: "Core contest patterns",
    days: "Days 7–13",
    bigIdea: "Recognize which of ~10 shapes a problem is, before writing anything.",
    accent: "var(--blue)",
    items: [
      {
        id: "p3-25", num: 25, title: "Binary search on a sorted array · off-by-one drills",
        artifact: "CSES · LeetCode 704", status: "planned", kind: "drill", minutes: 35,
        summary:
          "The mechanics you met in item 17, hardened: lo ≤ hi vs lo < hi, mid = lo + (hi−lo)/2, and which update rule keeps the invariant alive. Drilled until every variant can be justified line by line.",
        willLearn: [
          "Three correct templates and what invariant each one maintains",
          "First position ≥ x and last position ≤ x as search targets",
          "A battery of n = 0, 1, 2 edge cases against each template",
        ],
      },
      {
        id: "p3-26", num: 26, title: "Binary search on the answer — the big one",
        artifact: "CSES Factory Machines · LC 875 Koko Eating Bananas", status: "planned", kind: "drill", minutes: 45,
        summary:
          "Stop searching arrays; search the answer itself. If “can we finish within budget x?” is monotone in x (yes…yes…no…no), binary search finds the threshold — a whole problem class falls to one predicate.",
        willLearn: [
          "Writing the monotone predicate: feasible(x) in O(n)",
          "Choosing the search interval [lo, hi] from the statement",
          "Factory Machines and Koko, end to end",
        ],
      },
      {
        id: "p3-27", num: 27, title: "GCD, LCM, Euclid · divisibility tricks", artifact: "CF 800–1000 pair",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "gcd(a,b) = gcd(b, a mod b) until one side is zero — O(log) and older than most countries. lcm rides on top: a·b/gcd, computed in the overflow-safe order.",
        willLearn: ["Euclid by hand on (1071, 462) until it's obvious", "lcm = a / gcd * b — divide FIRST to dodge overflow", "When “gcd of everything” is the whole problem"],
      },
      {
        id: "p3-28", num: 28, title: "Primes · trial division and the sieve of Eratosthenes",
        artifact: "count primes ≤ N", status: "planned", kind: "drill", minutes: 35,
        summary:
          "Trial division checks one number in O(√n) — fine for a few numbers. The sieve marks all composites up to N in one O(N log log N) sweep, crossing multiples from p² onward.",
        willLearn: ["Why checking divisors past √n is redundant", "Starting the crossing at p·p — smaller multiples are already dead", "Sieve once, answer many queries"],
      },
      {
        id: "p3-29", num: 29, title: "Modular arithmetic basics · overflow safety", artifact: "drill",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "(a + b) mod m, (a · b) mod m — take the remainder early and often. The discipline: never let an intermediate value near INT_MAX survive a multiplication.",
        willLearn: ["The three rules: mod distributes over +, −, ×", "long long as the default working type", "Why (a mod m)·(b mod m) mod m is always safe when m < 2³¹"],
      },
      {
        id: "p3-30", num: 30, title: "Simple combinatorics · nCr and counting pairs",
        artifact: "CF 800–1000", status: "planned", kind: "drill", minutes: 35,
        summary:
          "“How many pairs/ways/subsets…” rarely wants enumeration — it wants a formula. n choose 2 is n(n−1)/2; build Pascal's triangle when the modulus is small.",
        willLearn: ["Counting pairs by value buckets instead of O(n²) scans", "nCr mod m with Pascal's triangle", "Complementary counting: total minus bad"],
      },
      {
        id: "p3-31", num: 31, title: "Simulation and state machines, done cleanly", artifact: "Maratona problem · TBD",
        status: "planned", kind: "drill", minutes: 35,
        summary:
          "Some problems just ARE the process. The skill is structure: an explicit state variable, one event per loop iteration, and the state machine drawn before the code is written.",
        willLearn: ["Naming the states before coding them", "One iteration = one event, no hidden double-steps", "When simulation is right and when it's a trap"],
      },
      {
        id: "p3-32", num: 32, title: "Greedy · exchange arguments, when it's safe",
        artifact: "CF 900–1100", status: "planned", kind: "drill", minutes: 40,
        summary:
          "Greedy is a bet that local choices stay optimal. The exchange argument is how you check the bet: take any optimal solution, swap toward your greedy choice, show nothing got worse.",
        willLearn: ["The three-sentence exchange argument template", "Counterexample hunting before proving", "Classic traps where the greedy instinct fails"],
      },
      {
        id: "p3-33", num: 33, title: "Sorting as preprocessing for greedy", artifact: "activity-selection style",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "Most safe greedies live on sorted input: earliest finish time, smallest first, largest first. Sorting is the preprocessing that makes the greedy choice obvious — and provable.",
        willLearn: ["Activity selection by earliest end, with the exchange proof", "Choosing the sort key IS choosing the greedy rule", "Interval stabbing / minimum points as a second instance"],
      },
      {
        id: "p3-34", num: 34, title: "Graph representation · adjacency list in C", artifact: "build it by hand",
        status: "planned", kind: "drill", minutes: 30,
        summary:
          "No vector yet, no problem: an array of head pointers plus an edge pool (to[], next[], head[]) builds an adjacency list by hand — the classic forward-star layout, O(V + E) memory.",
        willLearn: ["The forward-star: head[v], to[e], nxt[e], and add_edge()", "Why arrays-of-arrays waste memory on sparse graphs", "Reading m edges and building both directions"],
      },
      {
        id: "p3-35", num: 35, title: "BFS · shortest paths in unweighted graphs and grids",
        artifact: "CSES · Labyrinth", status: "planned", kind: "drill", minutes: 45,
        summary:
          "A queue, a visited array, and levels: BFS visits vertices in distance order, so the first arrival IS the shortest path. On grids, the four neighbors are the whole adjacency list.",
        willLearn: ["The queue discipline: push on discovery, mark on push", "dist[] doubles as visited[] (−1 = unseen)", "Reconstructing the path with parent pointers — Labyrinth end to end"],
      },
      {
        id: "p3-36", num: 36, title: "DFS · connected components and flood fill", artifact: "CSES · Counting Rooms",
        status: "planned", kind: "drill", minutes: 40,
        summary:
          "Go deep, mark as you go, backtrack when stuck: every unmarked start opens a new component. Flood fill on a grid is DFS with four neighbors and a color instead of a counter.",
        willLearn: ["Recursive DFS and its stack-depth limit on big grids", "Iterative DFS with an explicit stack as the safe form", "Counting Rooms: one sweep, one counter"],
      },
      {
        id: "p3-37", num: 37, title: "Intro DP 1 · 1D, memoization vs. tabulation",
        artifact: "Fibonacci → climbing stairs → coin change", status: "planned", kind: "drill", minutes: 45,
        summary:
          "DP = recursion + memory. Define the state, write the recurrence, then choose: top-down with a memo table, or bottom-up filling an array in dependency order. Same math, two directions.",
        willLearn: ["State first: “dp[i] = answer for the prefix of length i”", "Fibonacci three ways: naive, memoized, tabulated — time each", "Climbing stairs and minimum coin change as recurrences"],
      },
      {
        id: "p3-38", num: 38, title: "Intro DP 2 · knapsack shapes and LIS", artifact: "CSES · Book Shop",
        status: "planned", kind: "drill", minutes: 50,
        summary:
          "Two dimensions of state: items × budget. dp[i][w] = best value using the first i items with budget w; take-it-or-leave-it is the whole recurrence. LIS is the same habit with one axis.",
        willLearn: ["The take/leave recurrence and its base cases", "Rolling the 2D table down to 1D (iterate w backwards!)", "Book Shop end to end, then LIS in O(n²) and O(n log n)"],
      },
      {
        id: "p3-39", num: 39, title: "Phase 3 review · mixed classification quiz", artifact: "—",
        status: "planned", kind: "drill", minutes: 40,
        summary:
          "Twenty short statements, zero code: name the pattern (greedy / BFS / DP / binary search on answer / …) and the first move. Classification speed is what separates 2 solved from 5.",
        willLearn: ["Pattern-naming under time pressure", "The 60-second read: constraints → shape → tool", "Building your personal pattern cheat-sheet"],
      },
    ],
  },
  {
    n: 4,
    numeral: "IV",
    title: "Exam conversion",
    days: "Days 14–21",
    bigIdea: "Turn all of the above into points on a real exam paper.",
    accent: "var(--orange)",
    items: [
      {
        id: "p4-40", num: 40, title: "Classify a whole exam without coding", artifact: "Maratona 2022 set",
        status: "planned", kind: "drill", minutes: 60,
        summary:
          "Read every problem of the 2022 first phase. For each: tag the technique, rate the difficulty, and rank the attack order. No compiler allowed — this trains the 10-minute triage that decides real contests.",
        willLearn: ["Constraints-first reading: n ≤ 10⁵ screams O(n log n)", "Tag → difficulty → attack-order, per problem", "Choosing the 6, and choosing their order"],
      },
      {
        id: "p4-41", num: 41, title: "Untimed solo attempt · the 6 easiest", artifact: "Maratona 2022",
        status: "planned", kind: "drill", minutes: 180,
        summary:
          "Your chosen six, alone, untimed but uninterrupted. Full submissions to the judge. The score is data, not verdict — every WA is a line for the upsolve list.",
        willLearn: ["Pacing without a clock: commit to an order and keep it", "Writing what you'd tell a teammate at each stuck moment", "Collecting the failure log for item 42"],
      },
      {
        id: "p4-42", num: 42, title: "Editorial-guided upsolve of what failed", artifact: "Maratona 2022",
        status: "planned", kind: "drill", minutes: 120,
        summary:
          "Everything unsolved gets finished after reading the editorial — and then re-solved from scratch a day later. An upsolved problem you can't reproduce solo wasn't upsolved, just read.",
        willLearn: ["Reading an editorial for the IDEA, then closing it", "The 24-hour blank-page reproduction", "Filing each failure under its pattern, not its story"],
      },
      {
        id: "p4-43", num: 43, title: "Repeat the cycle · 2023", artifact: "Maratona 2023",
        status: "planned", kind: "drill", minutes: 240,
        summary: "Classify → attempt the 6 → upsolve, on the 2023 first phase. Second lap of the cycle; the triage should already feel faster.",
        willLearn: ["Full cycle, second pass", "Comparing triage quality against the 2022 attempt"],
      },
      {
        id: "p4-44", num: 44, title: "Repeat the cycle · 2024", artifact: "Maratona 2024",
        status: "planned", kind: "drill", minutes: 240,
        summary: "Third lap on 2024. By now the classification tags should be written before the second read-through ends.",
        willLearn: ["Full cycle, third pass", "Tracking per-problem read time across years"],
      },
      {
        id: "p4-45", num: 45, title: "Repeat the cycle · 2025", artifact: "Maratona 2025",
        status: "planned", kind: "drill", minutes: 240,
        summary: "Fourth lap on the most recent phase-1 set — the closest proxy to the exam you'll actually sit.",
        willLearn: ["Full cycle on the freshest paper", "Noting which Phase 3 patterns actually appeared"],
      },
      {
        id: "p4-46", num: 46, title: "Milestone check · 5–6 solved untimed on a fresh set", artifact: "—",
        status: "planned", kind: "drill", minutes: 240,
        summary:
          "The goal, measured: a set you haven't seen, untimed, solo — five or six accepted. Pass and the sprint's promise is kept; miss and the failure log says exactly which phase to revisit.",
        willLearn: ["Fresh-set protocol: no hints, no notes, real judge", "The pass/fail ledger against the original goal"],
      },
      {
        id: "p4-47", num: 47, title: "Only after the milestone · one 5-hour timed mock", artifact: "—",
        status: "planned", kind: "drill", minutes: 300,
        summary:
          "Speed is a separate skill and comes last. One full-length timed mock to feel real pacing — deliberately withheld until untimed solving is reliable, so pressure never teaches panic.",
        willLearn: ["Contest pacing: order, skip rules, submission rhythm", "What timed practice does (and doesn't) measure"],
      },
    ],
  },
  {
    n: 5,
    numeral: "V",
    title: "C++17 transition",
    days: "after item 24",
    bigIdea: "The same ideas, less typing. Only start once the C fundamentals are reliable.",
    accent: "var(--green)",
    items: [
      {
        id: "p5-48", num: 48, title: "iostream · cin/cout and fast IO", status: "planned", kind: "drill",
        artifact: "hello, C++", minutes: 20,
        summary:
          "cin/cout replace scanf/printf — friendlier, slower by default. One line (sync_with_stdio(false) + untie) buys the speed back; it goes at the top of every contest file from now on.",
        willLearn: ["ios::sync_with_stdio(false); cin.tie(nullptr); — memorize it", "When endl's flush costs you the time limit", "Reading until EOF with while (cin >> x)"],
      },
      {
        id: "p5-49", num: 49, title: "vector · the array that resizes", status: "planned", kind: "drill",
        artifact: "rewrite the presence array", minutes: 25,
        summary:
          "Everything Phase 1 did with int a[MAXN] and a hand-carried n, vector<int> does with .size(), .push_back(), and no MAXN guess. The minimum-state ideas survive unchanged — only the container grows up.",
        willLearn: [
          "push_back / size / index — the whole everyday API",
          "vector<vector<int>> for the matrices you finally may store",
          "Reserve when the final size is known upfront",
        ],
        codePair: {
          c: `int a[MAXN], n = 0;
a[n++] = x;          /* add */
for (int i = 0; i < n; i++) ...`,
          cpp: `vector<int> a;
a.push_back(x);      /* add */
for (int v : a) ...`,
          note: "Same streaming habit; the length now travels with the array.",
        },
      },
      {
        id: "p5-50", num: 50, title: "std::string vs. char[]", status: "planned", kind: "drill",
        artifact: "rewrite Anton and Danik", minutes: 20,
        summary:
          "No more buffer sizes, no more '\\0' bookkeeping: s.size(), s[i], s == \"Anton\" all just work. The run-scanning loops from Phase 1 port line for line.",
        willLearn: ["size(), indexing, comparison, substr", "getline(cin, s) for lines with spaces", "Porting the longest-run scan verbatim"],
      },
      {
        id: "p5-51", num: 51, title: "sort + lambdas · qsort boilerplate, retired",
        status: "planned", kind: "drill", artifact: "sort records by field", minutes: 25,
        summary:
          "One header, one call, and the comparator lives inline as a lambda — no casts, no const void*, no three-line function for a one-line rule. Sorting becomes something you do mid-thought.",
        willLearn: [
          "sort(v.begin(), v.end()) and reverse-order with greater<>()",
          "Lambdas: [](const P& a, const P& b) { return a.end < b.end; }",
          "Stable order and tie-breaking inside the comparator",
        ],
        codePair: {
          c: `int cmp(const void *a, const void *b) {
    const Person *p = a, *q = b;
    return p->end - q->end;
}
qsort(arr, n, sizeof *arr, cmp);`,
          cpp: `sort(v.begin(), v.end(), [](const P& a, const P& b) {
    return a.end < b.end;
});`,
          note: "The comparator shrank from a function to a clause.",
        },
      },
      {
        id: "p5-52", num: 52, title: "pair, tuple, structured bindings", status: "planned", kind: "drill",
        artifact: "keep indices while sorting", minutes: 20,
        summary:
          "pair<int,int> is the two-pointer's memory: value and original index travel together through the sort. Structured bindings ([v, i] : vec) unpack them without .first/.second noise.",
        willLearn: ["pair for value+index records — item 20's missing piece", "Lexicographic comparison for free", "auto [val, idx] unpacking in range-for"],
      },
      {
        id: "p5-53", num: 53, title: "map / set · and the unordered variants", status: "planned", kind: "drill",
        artifact: "presence arrays, generalized", minutes: 30,
        summary:
          "The presence/frequency arrays of item 6, freed from the value-range restriction: keys can be huge, negative, or strings. Ordered (log n per op) or unordered (expected O(1)) — choose by whether you'll iterate in order.",
        willLearn: [
          "freq[x]++ on a map — default-constructed zeros",
          "set for “distinct, and I'll walk them sorted”",
          "unordered_map's worst case, and when it bites",
        ],
        codePair: {
          c: `int freq[1001] = {0};   /* keys: 0..1000 only */
freq[id]++;`,
          cpp: `map<long long, int> freq;  /* any key */
freq[id]++;`,
          note: "Same operator, same idea — the domain just stopped mattering.",
        },
      },
      {
        id: "p5-54", num: 54, title: "queue, stack, priority_queue · BFS and greedy, shortened",
        status: "planned", kind: "drill", artifact: "rewrite Labyrinth", minutes: 25,
        summary:
          "The hand-rolled queue from item 35 becomes queue<int> with push/front/pop; the “always take the smallest” greedy becomes priority_queue. Data structures you built by hand, now one include away.",
        willLearn: ["queue for BFS — push on discovery, exactly as before", "stack for iterative DFS", "priority_queue (max-heap by default — the eternal gotcha)"],
      },
      {
        id: "p5-55", num: 55, title: "lower_bound / upper_bound · binary search for free",
        status: "planned", kind: "drill", artifact: "first ≥ x queries", minutes: 20,
        summary:
          "The off-by-one drills of item 25, outsourced: lower_bound(v.begin(), v.end(), x) returns the first position ≥ x with the invariant already proven by the committee. You keep the understanding; it keeps the bugs.",
        willLearn: ["Iterator return values — subtract v.begin() for an index", "lower vs upper: ≥ x vs > x", "Counting in-range values as upper − lower"],
      },
      {
        id: "p5-56", num: 56, title: "Rewrite three old solutions · feel the difference",
        artifact: "2023 A · prefix sums · Labyrinth", status: "planned", kind: "drill", minutes: 60,
        summary:
          "Pick three accepted C solutions — a streaming counter, a prefix-sum solver, a BFS — and rewrite them in C++17. Line counts drop, ideas stay identical. That's the whole transition in one sitting.",
        willLearn: ["Side-by-side diffing of your own old code", "Spotting the ideas that survived untouched", "Declaring the C++ era open"],
      },
    ],
  },
];

/* ————— helpers ————— */
export const ALL_ITEMS: Item[] = PHASES.flatMap((p) => p.items);

export function getItem(id: string): { item: Item; phase: Phase } | null {
  for (const phase of PHASES) {
    const item = phase.items.find((i) => i.id === id);
    if (item) return { item, phase };
  }
  return null;
}

export function phaseStats(phase: Phase) {
  const done = phase.items.filter((i) => i.status === "done").length;
  const wip = phase.items.filter((i) => i.status === "wip").length;
  return { done, wip, total: phase.items.length, frac: done / phase.items.length };
}

export const GLOBAL_STATS = (() => {
  const done = ALL_ITEMS.filter((i) => i.status === "done").length;
  const wip = ALL_ITEMS.filter((i) => i.status === "wip").length;
  return { done, wip, total: ALL_ITEMS.length };
})();

export function nextItem(id: string): Item | null {
  const idx = ALL_ITEMS.findIndex((i) => i.id === id);
  return idx >= 0 && idx < ALL_ITEMS.length - 1 ? ALL_ITEMS[idx + 1] : null;
}
export function prevItem(id: string): Item | null {
  const idx = ALL_ITEMS.findIndex((i) => i.id === id);
  return idx > 0 ? ALL_ITEMS[idx - 1] : null;
}
