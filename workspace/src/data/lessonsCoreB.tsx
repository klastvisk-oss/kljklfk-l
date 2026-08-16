import type { Step } from "./lessonKit";
import { P, Code, Trace, Gotcha, Key, Recall, Note, Sub, Chain } from "./lessonKit";

/* Real, self-contained lessons for Phase 3 — the core contest patterns.
   The phase's big idea: recognise which of ~10 shapes a problem is,
   BEFORE writing anything. Each lesson teaches one shape end to end. */

export const LESSONS_B: Record<string, Step[]> = {

  /* ————— 25 · binary search on a sorted array ————— */
  "p3-25": [
    { kind: "context", title: "The sorted array is information — spend it",
      body: (<div className="space-y-3">
        <P>Lesson 17 established the payoff: on a sorted array, one comparison against the middle element throws away half the candidates, so ⌈log₂ n⌉ probes replace n. The lab let you <em>watch</em> that happen. This lesson does something stronger than handing you a correct loop to copy: it <strong>derives</strong> the loop, line by line, from a single sentence you get to choose. When you're done, there will be nothing to memorize, because every line will be the only line it could be.</P>
        <P>One decision up front, because it shapes everything: we won't search for "is x present?". We'll solve a slightly richer question — <strong>the first index i with a[i] ≥ x</strong> (the "lower bound" of x). Presence falls out of it for free (find the first ≥ x, then check whether that cell actually equals x), and — more importantly — this formulation has an answer for <em>every</em> x, even one larger than the whole array. You'll see in a moment why that matters.</P>
      </div>) },
    { kind: "concept", title: "Choose the invariant; the code writes itself",
      body: (<div className="space-y-3">
        <P>An invariant is a sentence you promise is true <em>before</em> the loop, keep true <em>through</em> every iteration, and can cash in <em>after</em> the loop. Ours is:</P>
        <Key>The answer — the first index with a[i] ≥ x — is always somewhere in [lo, hi).</Key>
        <P>Notice the shape of the interval: <strong>lo is inclusive, hi is exclusive</strong>. Why half-open instead of the more familiar [lo..hi]? Because the answer can legitimately be <code>n</code> — "no element reaches x, so the first ≥ x would sit one past the end". An inclusive <code>hi</code> can't express <code>n</code> without a special case; the half-open interval swallows it silently. This one choice deletes an entire family of edge-case bugs before we've written a line.</P>
        <Sub>Line 1: the initialization</Sub>
        <P>Before any probe, every position 0..n is a candidate, so the invariant demands <code>lo = 0, hi = n</code>. That's not a convention — it's the only pair that makes our sentence true at the start.</P>
        <Sub>Line 2: the probe</Sub>
        <P>Look at the middle: <code>mid = lo + (hi − lo) / 2</code>. (Written as <code>lo + (hi − lo)/2</code> rather than <code>(lo + hi)/2</code> so that lo + hi can never overflow — for n up to 2·10⁹ the sum of two indices would exceed int. The habit costs nothing.)</P>
        <Sub>Lines 3–4: the two branches, forced by the invariant</Sub>
        <P>Case one: <code>a[mid] ≥ x</code>. Then mid itself qualifies — it <em>is</em> a candidate for "first index ≥ x", so we must not throw it away. But everything to its right is ≥ a[mid] ≥ x and comes later, so none of it can be the <em>first</em>. The answer is in <code>[lo, mid]</code> — in our half-open language, <code>hi = mid</code>. Not mid − 1: that would discard a live candidate, violating the promise.</P>
        <P>Case two: <code>a[mid] &lt; x</code>. Then mid fails the test, and — here is the only place sortedness is used — everything to its <em>left</em> is ≤ a[mid] &lt; x and fails too. The entire stretch [lo..mid] is dead; the answer is in <code>[mid+1, hi)</code>, so <code>lo = mid + 1</code>.</P>
        <P>Both assignments were dictated by one question: <em>which half can still contain the first ≥ x?</em> No branch was chosen for style. That is the whole algorithm.</P>
        <Sub>Line 5: termination, and what the end means</Sub>
        <P>Does the interval shrink every turn? When <code>lo &lt; hi</code>, mid lands strictly below hi (integer division rounds down), so <code>hi = mid</code> shrinks it; and <code>lo = mid + 1</code> moves lo strictly right. The candidate count drops every iteration, so the loop must end — and it can only end with <code>lo == hi</code>, an empty interval. Cashing in the invariant: the answer was in [lo, hi) the whole time, the true answer never left, and there is exactly one position consistent with an empty interval — <code>lo</code> itself. Return it. When x beats the whole array, the branches push lo all the way to n, and the function correctly reports "the first ≥ x would be one past the end".</P>
      </div>) },
    { kind: "worked", title: "The derived code, then a hand-run",
      body: (<div className="space-y-3">
        <Code title="bsearch.c" code={`int first_ge(int *a, int n, int x) {
    /* smallest index i with a[i] >= x, or n if none.
       invariant: the answer is in [lo, hi) */
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= x) hi = mid;      /* mid qualifies: keep it, kill the right */
        else             lo = mid + 1;  /* mid fails: kill it and the left */
    }
    return lo;
}

/* "is x present?" falls out of it: */
int i = first_ge(a, n, x);
int present = (i < n && a[i] == x);`}
          caption="Every line traces back to the invariant sentence. If a line ever looks optional, re-derive it — it isn't." />
        <P>Run it by hand on <code>a = [2, 5, 5, 5, 8, 9, 12, 15]</code> with <code>x = 5</code>, tracking the invariant instead of the variables:</P>
        <Trace head={["probe", "a[mid]", "verdict", "candidates [lo, hi)"]} rows={[
          ["start", "—", "—", "[0, 8) — all eight"],
          ["mid 4", "8 ≥ 5", "keep left half + mid", "[0, 4)"],
          ["mid 2", "5 ≥ 5", "mid qualifies; first is at or left of it", "[0, 2)"],
          ["mid 1", "5 ≥ 5", "same", "[0, 1)"],
          ["mid 0", "2 < 5", "0 and left are dead", "[1, 1) — empty"],
        ]} />
        <P>lo = hi = 1: the first 5 is at index 1 ✓. Watch what the trace shows: the equal elements 5,5,5 at indices 1–3 never confused us, because the question "first ≥" has exactly one answer and the invariant tracked it. Presence of 5 follows: a[1] == 5 → present. Presence of 6: first_ge returns 4 (the 8's slot), a[4] ≠ 6 → absent. One function, every query about a sorted array.</P>
      </div>) },
    { kind: "bug", title: "Off-by-ones are broken promises",
      body: (<div className="space-y-3">
        <P>Here is the reframe that retires the entire bug family: <strong>an off-by-one in binary search is not a typo — it's the invariant being violated</strong>, and you can catch it by asking one question per branch: "could the true answer be in the part I just threw away?"</P>
        <Gotcha>Writing <code>hi = mid − 1</code> in the <code>a[mid] ≥ x</code> branch. When mid itself is the answer (say x equals a[mid] and everything left is smaller), you just discarded the answer while claiming to preserve it. The code will miss boundary hits — and lab 0017's drill tab B is exactly this student, failing on t = 2 and t = 110.</Gotcha>
        <Gotcha title="the twin">Writing <code>lo = mid</code> in the failing branch: mid failed, yet stays a candidate, and when hi = lo + 1 the interval stops shrinking — the loop spins forever (drill tab C). The invariant question catches it instantly: "am I keeping a known-dead position?" — and the termination question ("did the candidate set strictly shrink?") catches the rest.</Gotcha>
        <P>So before you ever run binary search code — yours or a teammate's — read it as a proof: state the invariant, check the initialization, check each branch preserves it, check the shrinking, check the cash-in. Five sentences, thirty seconds, and the three classic bugs have nowhere left to hide.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="Without looking: state the invariant sentence, then re-derive both branch assignments from it — for each, say which positions you may throw away and why sortedness lets you. Finally: what does lo == hi mean, and what is returned when x exceeds every element?" /> },
  ],

  /* ————— 26 · binary search on the answer ————— */
  "p3-26": [
    { kind: "context", title: "The array doesn't exist — search the answer instead",
      body: (<div className="space-y-3">
        <P>Lesson 25 searched a sorted array you were handed. Now the cruel twist the exam loves: <em>there is no array</em>. The problem asks for the smallest number with a property — "the minimum time to finish k products", "the slowest pace that still arrives on time" — and the "array" you'd like to search is the set of all candidate answers, which can have a billion entries. You cannot list it. You cannot sort it. But here is the observation that unlocks the whole family: <strong>you don't need the array — you only need to be able to test a candidate</strong>.</P>
        <P>Binary search never actually looked at the array; it asked yes/no questions about it ("is the answer ≤ mid?") and used the answers to halve the search space. If some other yes/no question has the right shape, the exact same machinery works. This lesson is about recognizing that shape — and proving to yourself that it's there before you trust it.</P>
      </div>) },
    { kind: "concept", title: "The shape: one threshold, two worlds",
      body: (<div className="space-y-3">
        <P>Picture the candidate answers on a number line and mark each one <em>feasible</em> (yes, it works) or <em>infeasible</em> (no). The shape that makes binary search valid is: there is a single threshold T* such that <strong>everything below T* is infeasible and everything at or above is feasible</strong>:</P>
        <Code title="the-shape.txt" code={`answer:   0  1  2  3  4  5  6  7  8  9 10 ...
feasible: N  N  N  N  N  Y  Y  Y  Y  Y  Y ...
                             ↑
                        T* = 5: the answer is the FIRST yes`} />
        <P>Compare that picture with lesson 25. It is the <em>same picture</em>: "first index where the cell is ≥ x" became "first candidate where the answer is yes". So: <strong>binary search on the answer is lesson 25 with the array replaced by a question</strong>. The invariant becomes "the first yes is in [lo, hi)"; the probe tests a[mid] ≥ x... no — tests <em>feasible(mid)</em>; the branches are identical. Nothing new to learn, only something new to <em>check</em>.</P>
        <Key>The whole technique is one obligation: prove your yes/no question is monotone — that "yes" at some candidate forces "yes" at every larger candidate. Once that's true, the threshold exists, and lesson 25 finds it.</Key>
        <P>Why does the proof obligation matter so much? Because the machinery runs happily on a <em>non</em>-monotone question and returns confident garbage. If the line were N N Y N Y N Y, "halving" would discard the half containing the real threshold — the algorithm has no way to notice. Monotonicity isn't a formality; it is the <em>only</em> thing standing between you and a wrong answer that passes your samples.</P>
      </div>) },
    { kind: "worked", title: "Factory machines — by hand first, code second",
      body: (<div className="space-y-3">
        <P><em>Factory Machines</em> (CSES 1620): n machines, machine i produces one product every t[i] seconds, all starting together. Smallest time T that yields k products total? Don't reach for code yet — take a tiny instance and feel the threshold: machines <code>t = [3, 5, 7]</code>, need <code>k = 10</code> products.</P>
        <P>Given a candidate T, each machine's contribution is ⌊T / t[i]⌋ (floor division — lesson 3: it counts completed products, because a half-finished one doesn't count). So:</P>
        <Trace head={["candidate T", "⌊T/3⌋", "⌊T/5⌋", "⌊T/7⌋", "total", "feasible?"]} rows={[
          ["7", 2, 1, 1, 4, "no"],
          ["14", 4, 2, 2, 8, "no"],
          ["15", 5, 3, 2, 10, "yes"],
          ["16", 5, 3, 2, 10, "yes"],
        ]} />
        <P>Look down the feasible column: no, no, yes, yes — and once more time is available, every machine has produced <em>at least</em> as much, so a "yes" can never turn back into a "no". <strong>That sentence is the monotonicity proof for this problem</strong>, one line long. The threshold is T* = 15, and binary search would have found it in ~4 probes among the 16 candidates instead of testing all of them.</P>
        <P>Now the bounds. lo = 0 (T = 0 makes nothing — always safely infeasible). For hi, derive a value you can <em>prove</em> feasible: the worst case is the slowest machine doing all k products alone — k · max(t). For our instance that's 10 · 7 = 70, safely above 15. For the real constraints (k, t[i] ≤ 10⁹) the worst case is 10⁹ · 10⁹ = 10¹⁸, which is exactly why published solutions write <code>hi = 1e18</code> — it isn't folklore, it's the slowest-machine-alone bound, and it fits in a long long (max ≈ 9.2·10¹⁸) with room for the arithmetic below.</P>
        <Code title="machines.c" code={`/* feasible(T): can the factory make k products in T seconds? */
long long made(long long T, long long *t, int n, long long k) {
    long long s = 0;
    for (int i = 0; i < n; i++) {
        s += T / t[i];
        if (s >= k) return s;   /* stop early: at T ~ 1e18 the full sum
                                   could exceed long long, and we only
                                   ever compare it to k */
    }
    return s;
}

/* lesson 25, with "a[mid] >= x" replaced by "made(mid) >= k" */
long long lo = 0, hi = 1e18;         /* first yes is in [lo, hi) */
while (lo < hi) {
    long long mid = lo + (hi - lo) / 2;
    if (made(mid, t, n, k) >= k) hi = mid;    /* mid feasible: keep it */
    else                         lo = mid + 1;/* mid infeasible: kill it */
}
/* lo == T* — the first feasible time */`}
          caption="Diff this against lesson 25's code: one line changed — the predicate. The invariant, the branches, the termination argument are all identical, which is the point." />
      </div>) },
    { kind: "worked", title: "Same shape, new costume: Koko's bananas",
      body: (<div className="space-y-3">
        <P>To prove the pattern is portable, here's LeetCode 875 in one breath: piles of p[i] bananas, h hours, Koko eats at a constant k per hour and picks one pile per hour (a partly eaten pile pauses until the next hour). Smallest k that finishes in time? Candidates are speeds; the question "can she finish at speed k?" must be monotone — and it is, because eating faster never makes a pile take <em>more</em> hours.</P>
        <P>The only new ingredient is the per-pile hours: a pile of p bananas at speed k takes ⌈p / k⌉ hours — the ceiling, because a remainder still costs a whole hour. You have a ceiling function now, built from lesson 3's floor: <code>⌈p/k⌉ = (p + k − 1) / k</code> in integer arithmetic. Quick check that the trick is honest: p = 7, k = 3 → (7 + 2)/3 = 3 = ⌈7/3⌉ ✓; p = 6, k = 3 → (6 + 2)/3 = 2 = ⌈6/3⌉ ✓ — the +k−1 pushes exact multiples to the next integer boundary only when there's a remainder. Sum those over the piles, compare with h, and you have the predicate. Bounds: lo = 1 (k = 0 never eats), hi = max pile (eating a whole pile per hour always finishes in ≤ n ≤ h hours). Same skeleton; only the feasibility function changed.</P>
      </div>) },
    { kind: "bug", title: "The two ways this dies",
      body: (<div className="space-y-3">
        <Gotcha title="skipping the monotonicity proof">Treating "it feels monotone" as proved. The discipline is one written sentence: <em>"if candidate c works, then any larger candidate works because…"</em> — with a real because. In the factory: more time, each ⌊T/tᵢ⌋ only grows. In Koko: faster eating, each ⌈p/k⌉ only shrinks. If you can't write the because, you don't have the technique — you have a guess wearing its clothes.</Gotcha>
        <P>And the arithmetic assassin: intermediate overflow inside the check. <code>T / t[i]</code> is fine, but summing 10⁵ of those at T near 10¹⁸ can exceed even long long before you compare — which is what the early-return cap in the code prevents. Keep every quantity long long and cap anything compared against k.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="For machines t = [3, 5, 7], k = 10: what is the answer, and what hi would you defend? State the monotonicity sentence for this problem in one line. Then the general recipe: what replaces the array from lesson 25, and what is the single thing you must prove before trusting it?" /> },
  ],

  /* ————— 27 · GCD, LCM, Euclid ————— */
  "p3-27": [
    { kind: "context", title: "The oldest algorithm still on the exam",
      body: (<div className="space-y-3">
        <P>Greatest common divisors hide everywhere on a first-phase paper: reducing fractions to compare them, tiling a a×b rectangle with identical squares, "two buses leave the depot every x and y minutes — when do they coincide?" (that one is lcm). The naive way to compute gcd(a, b) is to try every candidate d from min(a, b) downward and stop at the first that divides both. For a, b up to 10⁹ that is up to a <em>billion</em> trial divisions. Euclid's algorithm does it in about sixty operations — and the reason it works is a single idea small enough that, once you've seen it, you will never need to memorize the algorithm again.</P>
      </div>) },
    { kind: "concept", title: "The idea: the list of common divisors never changes",
      body: (<div className="space-y-3">
        <P>Forget "greatest" for a moment and think about the <em>whole list</em> of common divisors of a and b — every d that divides both. The claim, and it is the entire algorithm, is this: <strong>the pair (a, b) and the pair (b, a − b) have exactly the same list of common divisors.</strong> Two small arguments, each one sentence:</P>
        <Chain items={[
          <span><strong>Left to right.</strong> If d divides both a and b, then a = d·x and b = d·y for some integers, so a − b = d·(x − y) — d divides the difference too. Anything that divided both still divides both.</span>,
          <span><strong>Right to left.</strong> If d divides b and also a − b, then it divides their sum (a − b) + b = a. Anything that divides the new pair divides the old pair.</span>,
        ]} />
        <P>The lists are identical — and if two lists are identical, their greatest elements are identical: <code>gcd(a, b) = gcd(b, a − b)</code>. Nobody decreed this rule; it fell out of what "divides" means. Try it on a pair you can check by hand: gcd(12, 8) — the common divisors of (12, 8) are 1, 2, 4; the common divisors of (8, 4) are 1, 2, 4. Same list, same greatest.</P>
        <Sub>From subtraction to remainder</Sub>
        <P>Subtracting one b at a time is correct but slow: gcd(10⁹ + 7, 1) would subtract a billion times. But notice — subtracting b repeatedly until you can't anymore is precisely the <em>definition</em> of the remainder: a − b − b − … − b (as many as fit) = a mod b. So the same-list argument applied in one batch gives <code>gcd(a, b) = gcd(b, a mod b)</code>. The algorithm is just the insight, with the boring subtractions collapsed.</P>
        <Sub>Why it stops, and why fast</Sub>
        <P>It stops because the second argument <em>strictly decreases</em> (a mod b &lt; b) and never goes negative — you must eventually reach gcd(g, 0), and g is the answer: g divides g, g divides 0 (everything divides 0), and nothing larger than g divides g.</P>
        <P>And it's fast — here is the honest reason, in one case split. Look at a mod b. If b &gt; a/2, then a mod b = a − b &lt; a/2. If b ≤ a/2, then a mod b &lt; b ≤ a/2. Either way, <strong>after two steps the larger number has at least halved</strong>. Halving 10⁹ takes about 30 doublings, so at most ~60 steps — logarithmic, and now you know exactly why.</P>
      </div>) },
    { kind: "worked", title: "Hand-run, then the three-line code",
      body: (<div className="space-y-3">
        <P>Run it on gcd(1071, 462), watching the list-of-divisors idea do the work — each row replaces the pair without changing the answer:</P>
        <Trace head={["(a, b)", "division", "next pair"]} rows={[
          ["(1071, 462)", "1071 = 2·462 + 147", "(462, 147)"],
          ["(462, 147)", "462 = 3·147 + 21", "(147, 21)"],
          ["(147, 21)", "147 = 7·21 + 0", "(21, 0) → done"],
        ]} />
        <P>gcd = 21. Check the claim directly: 1071 = 21 · 51 and 462 = 21 · 22, and 51 and 22 share nothing (51 = 3·17, 22 = 2·11) — so 21 was indeed the greatest. Three divisions, answer in hand; the trial-downward method would have needed ~440.</P>
        <Code title="gcd.c" code={`long long gcd(long long a, long long b) {
    /* invariant: gcd(a,b) never changes; b strictly decreases */
    while (b) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;    /* gcd(g, 0) = g */
}`}
          caption="The loop is the proof in C: each iteration applies the same-list step, and the exit case is the one you can read off by inspection." />
      </div>) },
    { kind: "concept", title: "LCM, derived — not another formula to trust",
      body: (<div className="space-y-3">
        <P>The lcm — smallest positive number divisible by both — has a famous companion formula, and it too can be <em>proved</em> with what you now have, in three steps. Write g = gcd(a, b).</P>
        <Chain items={[
          <span><strong>Step 1 — a/g and b/g are coprime.</strong> If some c &gt; 1 divided both a/g and b/g, then c·g would divide both a and b — a common divisor bigger than g, contradicting g being the <em>greatest</em>. So after dividing out the gcd, nothing is left in common.</span>,
          <span><strong>Step 2 — count multiples of a until one is divisible by b.</strong> Multiples of a are a, 2a, 3a, … The multiple k·a is divisible by b exactly when k·(a/g) is divisible by (b/g) — divide everything by g. Since a/g and b/g are coprime (step 1), that happens exactly when k itself is a multiple of b/g. The <em>smallest</em> such k is b/g.</span>,
          <span><strong>Step 3 — assemble.</strong> lcm = k·a = (b/g)·a = a·b/g. The formula isn't a coincidence of examples; steps 1–2 show it's the only value that can work.</span>,
        ]} />
        <P>And the formula hands you the overflow rule for free: since g divides a <em>exactly</em> (that's what gcd means), compute <code>(a / g) * b</code> — divide first, when the division is provably clean, and the multiplication never inflates past the true answer. The reverse order, <code>a * b / g</code>, can overflow long long on the product even when the final lcm would have fit — you'd be doing exact math on a number that no longer exists.</P>
        <Code title="lcm.c" code={`long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;   /* divide first: exact AND overflow-safe */
}`} />
        <P>Sanity check on numbers you can hold in your head: lcm(4, 6) — g = 2, so 4/2 · 6 = 12 ✓. And the bus problem from the opening: buses every 4 and 6 minutes coincide at 12, 24, 36… exactly the multiples of the lcm. The story and the formula now agree because you built the formula.</P>
      </div>) },
    { kind: "bug", title: "The traps, now with explanations attached",
      body: (<div className="space-y-3">
        <Gotcha><code>lcm = a * b / gcd</code> — the overflow order. Mechanically: the product can exceed 9.2·10¹⁸ while the true lcm fits comfortably, and once the product has wrapped, dividing it by g yields the residue of a wrong number. Since g | a exactly, <code>a / g * b</code> is always legal — the derivation above is why you're allowed to reorder.</Gotcha>
        <P>Two corner cases to decide before the exam decides for you: <code>gcd(0, 0)</code> has no meaningful value (every number divides 0, so there is no greatest) — guard it if zero inputs are legal; and for negatives, <code>a % b</code> in C can return a negative remainder, so take absolute values up front if the statement allows them. Both are one-line defenses you write because you know what breaks, not because a list told you to.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="Explain to a teammate why gcd(a, b) = gcd(b, a mod b) — start from what a common divisor is, no code allowed. Then: why does the loop terminate, why is it logarithmic, and in the lcm formula, why are you allowed to divide before multiplying?" /> },
  ],

  /* ————— 28 · primes, trial division, sieve ————— */
  "p3-28": [
    { kind: "context", title: "Cross out, don't test",
      body: (<div className="space-y-3">
        <P>Testing each number up to N for primality is O(N·√N) — too slow when N is 10⁶ and you need <em>all</em> primes. The sieve of Eratosthenes inverts the work: instead of asking "is p prime?" for each p, you let each prime <em>cross out its multiples</em>. What survives is prime. Total work O(N log log N) — nearly linear.</P>
        <Key>Sieve: start at 2 — 0 and 1 are never prime and never counted. For each unmarked p, cross out p·p, p·p+p, … (smaller multiples already died under smaller primes). Everything left unmarked is prime.</Key>
      </div>) },
    { kind: "handson", title: "Watch the waves",
      body: (<div className="space-y-3">
        <P>On the next page, a live toy runs the sieve one prime at a time. Notice two things: each prime's crossing-out starts at p·p (smaller multiples were already crossed out by smaller primes), and after p exceeds √N nothing new is crossed.</P>
      </div>) },
    { kind: "worked", title: "The code",
      body: (<div className="space-y-3">
        <Code title="sieve.c" code={`#define MAXN 1000001
char composite[MAXN];        /* 0 = prime so far */

for (int p = 2; p * p < MAXN; p++)       /* only up to √N */
    if (!composite[p])
        for (int m = p * p; m < MAXN; m += p)
            composite[m] = 1;            /* start at p·p */

/* count primes ≤ n */
int count = 0;
for (int i = 2; i <= n; i++) if (!composite[i]) count++;`}
          caption="char array, not int — 10⁶ bytes vs 4·10⁶, friendlier to the cache and the memory limit." />
      </div>) },
    { kind: "bug", title: "Starting at 2p, or looping p to N",
      body: (<div className="space-y-3">
        <Gotcha>Starting the inner loop at <code>2p</code> instead of <code>p·p</code> is only a constant-factor waste; but running the outer loop to N instead of √N wastes real time. Worse, forgetting that 1 is not prime, or that the array must be zero-initialised (global/static, or memset).</Gotcha>
        <P>Why start at p·p? Every multiple of p below p·p is p·(something &lt; p), and that smaller factor already crossed it out. Say it once and it's yours.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Why does the sieve's outer loop only need to run to √N, and why does each prime start crossing out at p·p?" /> },
  ],

  /* ————— 29 · modular arithmetic, overflow ————— */
  "p3-29": [
    { kind: "context", title: "Why every answer is 'mod 1e9+7'",
      body: (<div className="space-y-3">
        <P>"Print the answer modulo 10⁹+7." You've seen the line; this lesson makes it stop being a ritual. The reason it exists: counting problems explode (subsets of 10⁵ items, paths on big grids), so the true answer has thousands of digits — unprintable and uncheckable. The problem-setter instead asks for the <em>remainder</em> of the answer after dividing by a large prime, which fits in one integer and still distinguishes right from wrong. Your job is to compute that remainder <em>without ever holding the true answer</em> — because it doesn't fit in any variable you have.</P>
        <P>That job is possible only if remainders behave well under +, ×, and (it turns out) not under ÷. None of those three facts are rules to memorize — each one is two lines of arithmetic you can redo from scratch on exam day, starting from a single definition.</P>
      </div>) },
    { kind: "concept", title: "One definition, and everything falls out",
      body: (<div className="space-y-3">
        <P>The whole theory rests on the <strong>division algorithm</strong>: every integer a can be written uniquely as <code>a = q·m + r</code> with <code>0 ≤ r &lt; m</code>. The remainder r is <code>a mod m</code> — that's the definition, and it's the only fact you're allowed to use.</P>
        <Sub>Why (a + b) mod m = ((a mod m) + (b mod m)) mod m</Sub>
        <P>Write both numbers in the definition's shape: a = q₁m + r₁ and b = q₂m + r₂. Add them: <code>a + b = (q₁ + q₂)·m + (r₁ + r₂)</code>. That's "a multiple of m, plus (r₁ + r₂)" — so the remainder of the sum is whatever remainder (r₁ + r₂) leaves when divided by m. But r₁ + r₂ is not necessarily below m: two remainders can sum to as much as 2m − 2. Hence the <em>second</em> mod on the outside — it isn't decoration, it's there exactly because r₁ + r₂ can overshoot one m. The formula is the division algorithm applied once, with the overshoot handled.</P>
        <Sub>Why the same works for ×</Sub>
        <P>Multiply the two decompositions: <code>a·b = (q₁m + r₁)(q₂m + r₂) = m·(q₁q₂m + q₁r₂ + q₂r₁) + r₁r₂</code>. Again: a multiple of m, plus r₁·r₂ — so the remainder of the product is the remainder of r₁·r₂. The cross terms don't matter; they're all multiples of m. That's the entire proof, and it explains the one numerical detail that makes 10⁹+7 the contest standard: r₁·r₂ can be as large as (m−1)² ≈ 10¹⁸, which <em>just barely fits</em> in a long long (max ≈ 9.2·10¹⁸) — one such product is safe, two unreduced multiplications stacked are not. The modulus was chosen so the formula above fits the machine.</P>
        <Key>Reduce after every + and ×, because the two facts above only promise correctness when the inputs are already remainders. "Reduce early" is not discipline for its own sake — it's the precondition of the arithmetic you're using.</Key>
        <Sub>Why ÷ breaks — with a number in front of you</Sub>
        <P>Division is the exception, and here it is as a concrete crash rather than a warning. Take m = 7: the true arithmetic says 8 / 2 = 4, and 4 mod 7 = 4. Now try doing it "mod-first": 8 mod 7 = 1, 2 mod 7 = 2, and "1 / 2" isn't even an integer. The true answer was 4; the mod-first attempt doesn't exist. The mechanism: division asks "what do I multiply the divisor by to get the dividend?" — and reducing both sides modulo 7 changed that question. (A theory of division under mod does exist — modular inverses — but it needs the modulus prime and its own lesson; it's explicitly out of this sprint's scope. Recognizing "this needs an inverse" and skipping the problem is itself a scoring skill.)</P>
      </div>) },
    { kind: "worked", title: "Hand-run with a small modulus, then the real one",
      body: (<div className="space-y-3">
        <P>To see the mechanism with naked eyes, use m = 97 and sum [50, 60, 40], reducing after every step: 50 → 50 + 60 = 110, overshoot! 110 − 97 = 13 → 13 + 40 = 53. Answer: 53. Now the cheat-check: the true sum is 150, and 150 mod 97 = 53 ✓ — identical, and at no point did you hold a number bigger than 110. That is the whole trick, at a scale your head can audit. The code is the same sequence with m = 10⁹+7:</P>
        <Code title="modsum.c" code={`const long long MOD = 1000000007LL;

/* sum: after each step, sum is already a remainder (< MOD),
   so sum + a[i] < 2·MOD — one subtraction's worth of overshoot */
long long sum = 0;
for (int i = 0; i < n; i++) {
    sum = (sum + a[i] % MOD) % MOD;
}

/* product: both factors < MOD, so the product < MOD² ≈ 1e18
   — fits a long long, and ONLY a long long */
long long prod = 1;
for (int i = 0; i < n; i++)
    prod = (prod * (a[i] % MOD)) % MOD;`}
          caption="Each % is one application of the derived formula — the inner one reduces the input to a remainder, the outer one handles the overshoot. If you can say which fact each % is, the code can't confuse you." />
      </div>) },
    { kind: "bug", title: "Reducing only at the end — what actually goes wrong",
      body: (<div className="space-y-3">
        <Gotcha>Accumulating the raw sum and applying % MOD once after the loop. Mechanically: 200,000 values near 10⁹ sum to ~2·10¹⁴ — past int long before the end, and past long long for products. In C, signed overflow is <em>undefined behavior</em>, but in practice the value wraps to some wrong number n′, and your final n′ mod m is the correct remainder of the <em>wrong number</em>. There is no error, no warning, and no way to tell from the output — the derivation above shows exactly why: the formula was only ever valid with remainders as inputs.</Gotcha>
        <P>Its subtle cousin: keeping everything reduced but doing it in an <code>int</code>. (m−1)² ≈ 10¹⁸ smashes int's 2·10⁹ limit in a single multiplication. The rule "long long for anything touching the modulus" is the arithmetic fact from the ×-proof wearing a hard hat.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="From a = qm + r alone, derive the multiplication rule in three lines, and say where the outer mod comes from. Then: give the m = 7, 8/2 counterexample from memory, and explain in one sentence why 'reduce only at the end' silently produces the remainder of the wrong number." /> },
  ],

  /* ————— 30 · combinatorics, nCr and counting pairs ————— */
  "p3-30": [
    { kind: "context", title: "Count the whole family in one argument",
      body: (<div className="space-y-3">
        <P>"How many pairs (i, j) satisfy …?" is one of the two or three most common questions on an easy paper, and it has a trap built in: the <em>obvious</em> program checks all n²/2 pairs, which dies at n = 2·10⁵. The skill this lesson installs is the alternative — counting an entire family of objects with a single argument, so the program is one line of arithmetic. And the argument is not a bag of formulas; it's one move — <strong>count something two ways</strong> — applied over and over. You're going to see it derive everything below, including the formulas that look like they came from nowhere.</P>
      </div>) },
    { kind: "concept", title: "The handshake: where n(n−1)/2 comes from",
      body: (<div className="space-y-3">
        <P>How many handshakes happen when n people each shake hands with everyone else exactly once? Count the same event two ways. <em>Way one</em>, from each person's point of view: every one of the n people shakes n − 1 hands (everyone but themselves), giving n·(n − 1). <em>Way two</em>, from each handshake's point of view: every handshake involves two people, so it was counted twice in way one — once at each end. Same event, two counts, so n·(n − 1) = 2 · (number of handshakes), and the answer is <code>n(n−1)/2</code>. The ÷2 isn't a rule about pairs; it's the consequence of each object having been counted once per endpoint. You will never forget the /2 again, because you know what it <em>is</em>.</P>
        <P>The same move generalizes to "choose r from n". Count <em>ordered</em> selections first: pick the first element (n choices), the second (n − 1), and so on — n·(n−1)·…·(n−r+1) ways. Now note that every <em>unordered</em> r-element set appears in that count exactly r! times, once for each ordering of its members (that's the handshake's double-counting, with r endpoints instead of 2). Divide it out:</P>
        <Key>C(n, r) = n·(n−1)·…·(n−r+1) / r! — the ordered count, divided by the number of times each set was overcounted. Every "choose" formula you'll ever meet is this sentence in different clothes.</Key>
      </div>) },
    { kind: "worked", title: "Computing it without exploding — and why the loop is exact",
      body: (<div className="space-y-3">
        <P>The raw formula is a programming disaster: 21! ≈ 5.1·10¹⁹ already exceeds long long's 9.2·10¹⁸, so "compute n!, r!, (n−r)! and divide" overflows long before dividing (and under a modulus, lesson 29 says division doesn't even exist). But the two-ways argument hands you a better way: multiply and divide <em>alternately</em>, one factor of the numerator per factor of the denominator:</P>
        <Code title="ncr.c" code={`/* C(n, r) for small r, exact at every step */
long long nCr(long long n, int r) {
    if (r < 0 || r > n) return 0;
    if (r > n - r) r = n - r;          /* C(n,r) = C(n,n−r): fewer steps */
    long long res = 1;
    for (int i = 0; i < r; i++)
        res = res * (n - i) / (i + 1);
    return res;
}`} />
        <P>That integer division looks terrifying — why is there never a remainder? Here's the proof, and it's short: <strong>after i iterations, res equals C(n, i)</strong> — you can check the base (C(n,0) = 1) and the step (multiplying by (n−i)/(i+1) turns C(n,i) into C(n,i+1) by the formula derived above). And C(n, i) <em>counts something</em> — subsets — so it's a whole number at every step. The division is exact because both sides of it are counts of real objects. Not a lucky trick; a theorem you're executing.</P>
        <Trace head={["i", "step", "res", "meaning"]} rows={[
          ["0", "1 · 5 / 1", 5, "C(5,1) = 5 subsets of size 1"],
          ["1", "5 · 4 / 2", 10, "C(5,2) = 10 pairs"],
        ]} />
        <P>That's C(5, 2) = 10 — and since you already believe the handshake (5 people, 4 handshakes each, halved: 5·4/2 = 10), the loop and the argument agree, as they must.</P>
      </div>) },
    { kind: "worked", title: "The shape the exam actually asks: pairs with a property",
      body: (<div className="space-y-3">
        <P>The direct exam translation: "how many pairs of <em>equal</em> elements are in the array?" Group elements by value; a value that occurs f times contributes C(f, 2) = f(f−1)/2 equal pairs (the handshake, again — every two occurrences of the value form one pair). Sum over values. On <code>[1, 3, 3, 1, 3]</code>: value 1 occurs twice → 2·1/2 = 1 pair; value 3 occurs three times → 3·2/2 = 3 pairs. Total 4 — count them by hand if you don't believe it: the two 1s pair up, and the three 3s give (1st,2nd), (1st,3rd), (2nd,3rd). The formula is one frequency pass plus one arithmetic line; the double loop was never needed.</P>
        <P>That's the reflex to install: when the question says "how many pairs", don't reach for two loops — reach for <em>frequencies, then handshake</em>. ("Pairs summing to X" is the one variant that wants two pointers instead — lesson 20 — because equality of values is what makes grouping possible.)</P>
      </div>) },
    { kind: "bug", title: "Two failure modes, both explained now",
      body: (<div className="space-y-3">
        <Gotcha>Factorials-then-divide: n! overflows long long at n ≈ 21 (21! ≈ 5.1·10¹⁹ &gt; 9.2·10¹⁸) — and even where it fits, dividing after overflow has already destroyed the value. The alternating loop avoids both by never holding more than one partial product, and it's exact by the counting argument above.</Gotcha>
        <P>The second: forgetting the ÷2 in a pair count — reporting n(n−1) instead of n(n−1)/2. You can't make this mistake if you remember what the 2 means: every pair was counted from both ends. Whenever a counting answer looks exactly 2× (or r!×) too big, the culprit is almost always an object counted once per member instead of once.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="Derive n(n−1)/2 with the handshake argument, then say in one sentence why C(n, r) divides by r!. Why is the alternating multiply-divide loop guaranteed exact at every step? And: how many equal pairs are in [2, 2, 2, 5, 2]?" /> },
  ],

  /* ————— 31 · simulation and state machines ————— */
  "p3-31": [
    { kind: "context", title: "Some problems just want you to follow the rules",
      body: (<div className="space-y-3">
        <P>A simulation problem describes a process — a robot following commands, a game's turns, a parser — and asks what happens. There is no clever formula; the skill is translating rules into code <em>without dropping a case</em>. The tool that keeps you honest: model the process as a <strong>state machine</strong> — a current state plus explicit transitions — instead of nested ifs that grow until they lie.</P>
        <Key>Make the state a variable (or small struct), make every rule a transition that reads the state and the input and writes the next state. Enumerate transitions in a table before coding.</Key>
      </div>) },
    { kind: "worked", title: "A robot that can't get lost",
      body: (<div className="space-y-3">
        <Code title="robot.c" code={`char cmds[1001];
scanf("%1000s", cmds);        /* e.g. "FFRFL" */

int x = 0, y = 0, dir = 0;   /* 0=N 1=E 2=S 3=W */
int dx[4] = {0, 1, 0, -1};
int dy[4] = {1, 0, -1, 0};

for (char *c = cmds; *c; c++) {
    if      (*c == 'F') { x += dx[dir]; y += dy[dir]; }
    else if (*c == 'R') dir = (dir + 1) % 4;
    else if (*c == 'L') dir = (dir + 3) % 4;   /* == -1 mod 4 */
}`}
          caption="Direction as 0..3 with dx/dy tables turns four special cases into one indexed move. (dir+3)%4 is left-turn without a negative modulo." />
        <P>The state is (x, y, dir). Every command is a transition. Because the transitions are exhaustive (F, R, L) and each reads and writes the state explicitly, there is nowhere for a case to hide.</P>
      </div>) },
    { kind: "bug", title: "The unhandled branch",
      body: (<div className="space-y-3">
        <Gotcha>An if-chain with no <code>else</code> for an input the statement guarantees can occur — e.g. a command you assumed wouldn't appear. The simulation silently skips it. Add a default that aborts loudly during testing so a missed case fails fast instead of wrong.</Gotcha>
        <P>Also: simulate the samples by hand with your exact transition list before coding. Half of simulation bugs are misread statements, caught by a 2-minute hand trace.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What two things make up a state machine, and how does (dir+3)%4 implement a left turn?" /> },
  ],

  /* ————— 32 · greedy, exchange arguments ————— */
  "p3-32": [
    { kind: "context", title: "Greedy is a claim you must prove",
      body: (<div className="space-y-3">
        <P>A greedy algorithm makes the locally-best choice at each step and never looks back. Sometimes that's optimal, sometimes catastrophically not. The difference is a <strong>proof</strong>, and the workhorse proof is the <em>exchange argument</em>: take any optimal solution, and show you can transform it step by step into the greedy one without getting worse. If you can, greedy is optimal.</P>
        <Key>Greedy = claim + proof. The exchange argument: assume an optimal solution differs from greedy at the first place, swap in the greedy choice, and show the result is no worse.</Key>
      </div>) },
    { kind: "worked", title: "Exchange in action: earliest finish",
      body: (<div className="space-y-3">
        <P>Schedule the maximum number of non-overlapping activities. Greedy: always take the activity that finishes earliest. Why is that safe? Take any optimal schedule O. If its first activity isn't the earliest-finisher g, replace it with g. g finishes no later, so it can't collide with anything O's first activity didn't collide with — the schedule stays valid and the same size. Now the first choice matches greedy; repeat on the rest.</P>
        <Code title="exchange.c" code={`/* the greedy loop the argument justifies */
sort by finish time;
int last_end = -INF, count = 0;
for (int i = 0; i < n; i++)
    if (start[i] >= last_end) { count++; last_end = finish[i]; }`} />
        <P>Notice the structure: the <em>code</em> is three lines; the <em>argument</em> is the real content. On the exam, the argument is what tells you the three lines are right.</P>
      </div>) },
    { kind: "bug", title: "Greedy without a counterexample check",
      body: (<div className="space-y-3">
        <Gotcha>Assuming greedy works because it feels right. "Take the shortest activity first" sounds equally plausible — and is wrong. Counterexample, three activities (start, end): L1 = (0, 3), S = (2, 4), L2 = (3, 6). Shortest-first picks S (duration 2), and S overlaps <em>both</em> L1 and L2 — nothing else fits: 1 activity. But L1 and L2 don't overlap each other (L1 ends exactly when L2 begins), so the optimum is 2. Shortest-duration had no exchange argument behind it; one three-element instance killed it.</Gotcha>
        <P>The discipline: state the greedy rule, then spend one minute hunting a counterexample. If you can't find one and you can sketch the exchange, code it.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="In one sentence, what does an exchange argument show, and which activity-selection rule does it justify?" /> },
  ],

  /* ————— 33 · sorting as preprocessing for greedy ————— */
  "p3-33": [
    { kind: "context", title: "Most greedy problems start with a sort",
      body: (<div className="space-y-3">
        <P>Lesson 32's greedy only worked because the activities were processed <em>in finish-time order</em>. That is the pattern: the greedy rule ("take the best available") needs the candidates in the right order to be a simple scan. Sorting is the preprocessing that turns "search all remaining for the best" (O(n) per step, n² total) into "take the next one" (O(1) per step).</P>
        <Key>Sort first, then scan. The comparator encodes the greedy rule (by finish time, by deadline, by ratio) — get the sort key right and the greedy loop is a linear pass.</Key>
      </div>) },
    { kind: "worked", title: "Deadline scheduling",
      body: (<div className="space-y-3">
        <P>Each task takes time t[i] and has deadline d[i]; minimise the maximum lateness. Greedy: process in <strong>deadline order</strong> (earliest deadline first). Sort, simulate, track the worst lateness.</P>
        <Code title="deadlines.c" code={`/* sort indices by deadline (lesson 18 comparator), then: */
long long now = 0, worst = 0;
for (int i = 0; i < n; i++) {
    now += t[ord[i]];
    long long late = now - d[ord[i]];
    if (late > worst) worst = late;
}`}
          caption="Two different problems, two different sort keys: activity selection sorts by finish time, lateness by deadline. The key is part of the greedy claim." />
        <P>The exchange argument here swaps adjacent out-of-order tasks and shows lateness never increases — the same shape of proof as lesson 32, applied to a different key.</P>
      </div>) },
    { kind: "bug", title: "Sorting by the wrong key",
      body: (<div className="space-y-3">
        <Gotcha>Sorting by start time, or by duration, for a problem whose exchange argument needs finish/deadline order. The scan then looks right and counts wrong. The sort key must be the one the proof exchanges on — derive them together.</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Why does sorting turn an O(n²) greedy into an O(n log n) one, and what determines which field you sort by?" /> },
  ],

  /* ————— 34 · graph representation, adjacency list in C ————— */
  "p3-34": [
    { kind: "context", title: "A graph is just neighbours",
      body: (<div className="space-y-3">
        <P>Forget the picture of circles and lines. Computationally, a graph is: for each vertex, a list of its neighbours. That's the <strong>adjacency list</strong>. An adjacency <em>matrix</em> (n×n) is fine for n≤1000, but contest graphs have up to 10⁵ vertices and far fewer edges — a matrix wastes memory and, worse, makes you scan n cells per vertex. The adjacency list stores exactly the edges that exist.</P>
        <Key>Adjacency list = an array of lists, one per vertex, each holding that vertex's neighbours. Memory O(V+E), and iterating a vertex's neighbours costs its degree, not V.</Key>
      </div>) },
    { kind: "worked", title: "Build it by hand in C",
      body: (<div className="space-y-3">
        <Code title="adjlist.c" code={`#define MAXN 100000
#define MAXM 400000

int head[MAXN], nxt[MAXM], to[MAXM], ecount = 0;
/* head[v] = index of v's first edge, or -1.
   MAXM = 2 x (max edges): every undirected edge is stored TWICE */

void init(int n) {
    for (int i = 0; i < n; i++) head[i] = -1;
}

void add_edge(int u, int v) {
    to[ecount]   = v;          /* this edge goes to v   */
    nxt[ecount]  = head[u];    /* link to old first     */
    head[u]      = ecount++;   /* this edge is the head */
}

/* iterate neighbours of u */
for (int e = head[u]; e != -1; e = nxt[e]) {
    int v = to[e];
    printf("%d ", v);   /* visit it — later: push onto a BFS/DFS frontier */
}`}
          caption="The 'head/nxt/to' arrays are a linked list without malloc — the standard contest idiom. Add the reverse edge too if the graph is undirected." />
        <P>Trace <code>add_edge(0,1)</code> then <code>add_edge(0,2)</code>: vertex 0's chain becomes 2 → 1. Walking it yields both neighbours. This one structure powers BFS, DFS, and everything graph-shaped in this phase.</P>
      </div>) },
    { kind: "bug", title: "Forgetting the reverse edge",
      body: (<div className="space-y-3">
        <Gotcha>For an undirected graph, calling <code>add_edge(u,v)</code> once — then DFS from v never sees u. Undirected means <em>two</em> directed edges: add both directions. (And size nxt/to for 2·M.)</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What three arrays make up the head/nxt/to adjacency list, and why is it preferred over an adjacency matrix for large sparse graphs?" /> },
  ],

  /* ————— 35 · BFS ————— */
  "p3-35": [
    { kind: "context", title: "Shortest means 'by layers'",
      body: (<div className="space-y-3">
        <P>In an unweighted graph (or grid), the shortest path from a start is found by <strong>breadth-first search</strong>: visit everything at distance 1, then everything at distance 2, and so on. Because you process vertices in order of distance, the first time you reach a vertex you've found its shortest path. The data structure that enforces that order is a queue: first discovered, first expanded.</P>
        <Key>BFS = queue + visited/dist array. Pop a vertex, push its unvisited neighbours with dist+1. First visit = shortest distance. O(V+E).</Key>
      </div>) },
    { kind: "worked", title: "BFS on a grid (Labyrinth)",
      body: (<div className="space-y-3">
        <Code title="bfs.c" code={`/* GLOBAL (or static), like lesson 6's arrays: at 1000x1000 these are
   4 MB each — far more than the few MB of stack a judge gives you. */
char grid[H][W];                /* '#' = wall */
int dist[H][W];                 /* -1 = unvisited */
int q[H * W], qh = 0, qt = 0;   /* simple array queue */

dist[sr][sc] = 0;
q[qt++] = sr * W + sc;          /* encode cell as one int */

const int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
while (qh < qt) {
    int cell = q[qh++];
    int r = cell / W, c = cell % W;
    for (int d = 0; d < 4; d++) {
        int nr = r + dr[d], nc = c + dc[d];
        if (nr < 0 || nr >= H || nc < 0 || nc >= W) continue;
        if (grid[nr][nc] == '#' || dist[nr][nc] != -1) continue;
        dist[nr][nc] = dist[r][c] + 1;   /* marked at PUSH time */
        q[qt++] = nr * W + nc;
    }
}`}
          caption="The dist array IS the visited array (-1 = unseen) and records the answer. Encoding (r,c) as r·W+c keeps the queue a flat int array." />
        <P>The invariant: the queue always holds vertices in non-decreasing distance order — that's why the first assignment to <code>dist[nr][nc]</code> is the shortest. If you can state that sentence, you understand BFS.</P>
      </div>) },
    { kind: "bug", title: "Marking on pop instead of push",
      body: (<div className="space-y-3">
        <Gotcha>Checking/marking visited when a vertex is <em>popped</em> instead of when it's <em>pushed</em>. Then the same vertex gets queued many times — exponential blowup on dense graphs, and wrong layering. Mark (set dist) the instant you push.</Gotcha>
        <P>Grid edges: rows are H, columns are W; the bounds check is <code>0≤nr&lt;H</code> and <code>0≤nc&lt;W</code>. Mixing H and W in the check is the classic grid bug (lesson 4, again).</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Why does the first time BFS visits a vertex give its shortest distance, and what goes wrong if you mark visited on pop instead of push?" /> },
  ],

  /* ————— 36 · DFS ————— */
  "p3-36": [
    { kind: "context", title: "Go deep, then back up",
      body: (<div className="space-y-3">
        <P>Where BFS spreads by layers, <strong>depth-first search</strong> commits to one path as far as it goes, then backtracks. For "how many connected regions?" or "flood fill this area", DFS is the natural tool: start anywhere unvisited, mark everything reachable, that's one component — repeat. It answers <em>connectivity</em>, not shortest distance (that's BFS).</P>
        <Key>DFS = recursion (or explicit stack) + visited array. Each unvisited start launches a flood that marks one whole component. Count the launches = count the components.</Key>
      </div>) },
    { kind: "worked", title: "Counting rooms (flood fill)",
      body: (<div className="space-y-3">
        <Code title="dfs.c" code={`/* global/static — lesson 6's zero-fill rule applies,
   and big grids don't fit on the stack anyway */
char grid[H][W];
int vis[H][W];

void flood(int r, int c) {
    if (r<0||r>=H||c<0||c>=W) return;      /* off grid */
    if (grid[r][c]=='#' || vis[r][c]) return;
    vis[r][c] = 1;
    flood(r+1,c); flood(r-1,c);
    flood(r,c+1); flood(r,c-1);
}

int rooms = 0;
for (int r = 0; r < H; r++)
  for (int c = 0; c < W; c++)
    if (grid[r][c]=='.' && !vis[r][c]) { flood(r,c); rooms++; }`}
          caption="Every launch of flood() claims exactly one maximal connected region, so the launch count is the answer." />
        <P>Recursion depth can hit ~H·W (a 10⁶-cell open snake). For huge grids, convert to an explicit stack — same visits, no stack overflow. Know when the recursive version is safe (small grids) and when it isn't.</P>
      </div>) },
    { kind: "bug", title: "Visiting the start twice / deep recursion",
      body: (<div className="space-y-3">
        <Gotcha>Forgetting <code>vis[r][c]=1</code> before recursing (infinite mutual recursion between two adjacent floor cells), or trusting recursion on a 10⁶-cell grid (stack overflow). Mark on entry, always.</Gotcha>
        <P>BFS vs DFS reflex: shortest path / fewest steps → BFS. Reachability / counting regions / filling → DFS. Say the reflex out loud; the exam asks it constantly.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Why does counting flood() launches count the connected components, and when must you replace the recursion with an explicit stack?" /> },
  ],

  /* ————— 37 · intro DP 1 ————— */
  "p3-37": [
    { kind: "context", title: "The bug that takes longer than the age of the universe",
      body: (<div className="space-y-3">
        <P>Write the obvious recursive Fibonacci — <code>fib(n) = fib(n−1) + fib(n−2)</code> — and run it for n = 50. It will not finish. Not "slow": the naive version calls fib(2) roughly eight <em>billion</em> times before returning, and the total work doubles with every step of n. This lesson explains exactly where all those calls go, because the explanation is short, and it is the entire idea of dynamic programming.</P>
      </div>) },
    { kind: "concept", title: "Where the work goes: count the calls for fib(5)",
      body: (<div className="space-y-3">
        <P>Unroll the recursion for fib(5) as a tree — every call has two children, one per term it needs:</P>
        <Code title="the-tree.txt" code={`                        fib(5)
                 /                 \\
             fib(4)               fib(3)        <- computed 2nd time
            /      \\              /      \\
        fib(3)     fib(2)      fib(2)    fib(1)
        /    \\     /    \\
    fib(2) fib(1) fib(1) fib(0)`} />
        <P>Count what you see: this diagram contains <strong>15 calls</strong> for an answer that is one addition chain of five numbers. And look at the repetitions — fib(3) appears twice, fib(2) three times, each spawning an identical subtree. The recursion isn't exploring anything new the second time around; it is <em>recomputing answers it already found and threw away</em>. For fib(10) the tree has 177 nodes and fib(2) is computed 34 times; for fib(50) it's about 40 billion nodes. The growth is exponential precisely because each level of the tree doubles the work while solving nothing new.</P>
        <P>So here is the entire insight, unspectacular on purpose: <strong>the only problem is forgetting</strong>. If you wrote each answer down the first time you computed it — fib(2) = 1, once, on paper — then every later request for fib(2) is a page-flip, not a computation. That's it. That is dynamic programming: <em>compute each subproblem once, and store the answer somewhere the future can find it</em>. Everything else in this lesson is bookkeeping around that one idea.</P>
        <Key>DP is recursion plus a notebook. If the same question gets asked twice, write the answer down the first time — every technique below is a way of organizing the notebook.</Key>
      </div>) },
    { kind: "worked", title: "The notebook, two ways to fill it",
      body: (<div className="space-y-3">
        <Sub>Way one — memoization: ask, check the notebook, record</Sub>
        <P>Keep the recursion exactly as it is, but before computing anything, check whether the answer is already written down; after computing, write it down. The tree from above still gets "asked" 15 times, but only 6 of those are real computations — one per distinct value — and the other 9 are page-flips:</P>
        <Code title="fib-memo.c" code={`long long memo[MAXN];   /* the notebook; -1 = page not written yet */

long long fib(int n) {
    if (n < 2) return n;              /* the pages you write by hand */
    if (memo[n] != -1) return memo[n];/* already computed: page-flip */
    memo[n] = fib(n-1) + fib(n-2);    /* compute once... */
    return memo[n];                   /* ...and write it down */
}`} />
        <Sub>Way two — tabulation: fill the notebook forwards</Sub>
        <P>Memoization fills the notebook on demand, in whatever order the questions arrive. But fib(n) only ever needs pages n−1 and n−2 — so you could also just fill the notebook front to back, page 0, 1, 2, …, n. Every page's ingredients are already written by the time you reach it, so no recursion is needed at all. That front-to-back filling is "bottom-up", and it has a lovely bonus: you only ever read the <em>last two pages</em>, so you can throw the notebook away and keep two variables:</P>
        <Code title="fib-tab.c" code={`/* the notebook, compressed to its last two pages */
long long prev = 0, cur = 1;          /* fib(0), fib(1) */
for (int i = 2; i <= n; i++) {
    long long next = prev + cur;      /* page i from pages i-2, i-1 */
    prev = cur;
    cur = next;
}
/* cur is fib(n) */`} />
        <P>Same recurrence, same answers; the three versions differ only in how the notebook is scheduled: O(2ⁿ) calls with no notebook, O(n) with a full one, O(n) time and O(1) space with a two-page one.</P>
        <P>With that under your belt, the standard vocabulary is just labels for things you already did. The <strong>state</strong> is what names a page of the notebook (here: the number n — because fib(n)'s answer depends on nothing else). The <strong>recurrence</strong> is how a page is filled from earlier pages (page n = page n−1 + page n−2). The <strong>base cases</strong> are the pages you write by hand (0 and 1). You don't apply a recipe; you've been using all three since the tree.</P>
      </div>) },
    { kind: "worked", title: "Two disguises of the same notebook",
      body: (<div className="space-y-3">
        <P><strong>Climbing stairs</strong> ("n steps, climb 1 or 2 at a time, how many distinct ways?"): derive the recurrence instead of recognizing it. Look at the <em>last move</em> of any valid climb: it's either a single step — in which case the climb before it reached step n−1 — or a double step, reaching n−2 from below. Those two cases cover everything and can't overlap, so ways(n) = ways(n−1) + ways(n−2), with ways(0) = ways(1) = 1. That's Fibonacci's notebook in a hat and fake mustache. The exam will not tell you; the derivation is how you see through the costume.</P>
        <P><strong>Coin change</strong> ("fewest coins summing to amount A") keeps the notebook but changes the recurrence: the state is the remaining amount a, and the last coin used is one of the denominations c ≤ a, so fewest(a) = 1 + min over coins of fewest(a − c). Notice how the <em>shape of the thinking</em> is identical — "classify by the last decision, reduce to a smaller page" — while the arithmetic changed. That classification move, not any formula, is the transferable skill.</P>
      </div>) },
    { kind: "bug", title: "When the notebook lies: a state that's too small",
      body: (<div className="space-y-3">
        <Gotcha>Naming pages by something that doesn't determine the answer. Imagine doing coin change with pages labeled "how many coins used so far" instead of "amount remaining": two different situations — needing 3 more from [1,5] and needing 7 more from [1,5] — would share the page "2 coins used" while needing different answers. One page, two answers: the notebook lies, and the program produces confident nonsense.</Gotcha>
        <P>The diagnostic is a sentence you can say out loud: <em>"given only the state, is the answer forced?"</em> If two situations share a state but differ in answer, the state is too small — add whatever distinguishes them (that's how knapsack, next lesson, ends up needing two coordinates). And when a DP misbehaves, don't stare at code: fill a small table by hand. A wrong recurrence shows up in the third cell; staring shows up in the third hour.</P>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="In one sentence, why is naive fib(50) hopeless? What is the notebook called in each filling style, and what does each style save? Then derive the climbing-stairs recurrence from the last move — and give an example of a state that's too small, and exactly what goes wrong with it." /> },
  ],

  /* ————— 38 · intro DP 2, knapsack and LIS ————— */
  "p3-38": [
    { kind: "context", title: "One decision per item, and the notebook grows a dimension",
      body: (<div className="space-y-3">
        <P>Lesson 37's notebook had one coordinate: a page per n. Now the question — "under a budget X, choose items to maximize value; each item once" (CSES 1158, <em>Book Shop</em>: books have prices and page counts, maximize pages) — refuses to fit one coordinate, and it's worth seeing why before writing anything. "Max pages with budget w" is not a valid page label: the answer also depends on <em>which books are still on the table</em>. With all five books available, budget 10 buys more than with two books and budget 10. Lesson 37's diagnostic fires — one coordinate, two answers — so the state gets a second coordinate: <strong>dp[i][w] = best value using only the first i items, with budget w</strong>. Two coordinates, answer forced. That moment — the state telling you it's too small — is the same skill as last lesson, now with consequences you can write down.</P>
      </div>) },
    { kind: "concept", title: "The recurrence is a case split, nothing more",
      body: (<div className="space-y-3">
        <P>Fix i and w, and ask the only question that matters: <em>does the optimal choice among the first i items include item i?</em> There are exactly two possibilities, and they're disjoint:</P>
        <Chain items={[
          <span><strong>Skip item i.</strong> Then the best you can do is exactly the best using the first i−1 items with the full budget: <code>dp[i−1][w]</code>.</span>,
          <span><strong>Take item i</strong> (only legal if price[i] ≤ w). You pay price[i], gain value[i], and what remains is the best using the first i−1 items with budget w − price[i]: <code>value[i] + dp[i−1][w − price[i]]</code>.</span>,
        ]} />
        <P>The optimum is the better of the two — that's the entire recurrence: <code>dp[i][w] = max(dp[i−1][w], value[i] + dp[i−1][w−price[i]])</code>. No formula was memorized; you enumerated the cases of one decision. Base: dp[0][w] = 0 for every w (zero items buy zero value). Everything else is table-filling.</P>
      </div>) },
    { kind: "worked", title: "Fill the table by hand — three books, budget 5",
      body: (<div className="space-y-3">
        <P>Books: A costs 2 and gives 3 pages; B costs 3, gives 4; C costs 4, gives 5. Budget X = 5. Each cell is the case split above; watch the "take" column read <em>the previous row</em>, never the current one:</P>
        <Trace head={["i (books allowed)", "w=0", "1", "2", "3", "4", "5"]} rows={[
          ["0 — none", 0, 0, 0, 0, 0, 0],
          ["1 — A(2,3)", 0, 0, 3, 3, 3, 3],
          ["2 — +B(3,4)", 0, 0, 3, 4, 4, 7],
          ["3 — +C(4,5)", 0, 0, 3, 4, 5, 7],
        ]} />
        <P>Read the interesting cells aloud, because they <em>are</em> the algorithm: row 2, w=3 — skip B (keep 3) or take B (4 pages + best of row 1 at w=0, which is 0) → 4. Row 2, w=5 — skip B (keep 3) or take B (4 + best of row 1 at w=2 = 3) → <strong>7: that's A+B</strong>, cost 5. Row 3, w=5 — take C would leave budget 1, worth 0 on row 2 → 5, which loses to skipping → stays 7. Answer: dp[3][5] = 7. If you can narrate that table, the code below is just the table in C.</P>
        <Sub>Why the famous code gets away with one row</Sub>
        <P>Look at the table again: row i reads <em>only</em> row i−1. So you never needed the whole grid — keep one array and overwrite it row by row. But here is the trap that produces the most-memorized rule in DP, and you're about to see why it's true instead of memorizing it: if you overwrite left-to-right (w ascending), then when you compute dp[w] the cell dp[w − price] has <em>already been overwritten this pass</em> — you'd read the new row instead of the old one, i.e. "take item i, having already taken item i". Concretely, with just book A (2, 3) and X = 4, ascending gives dp[4] = dp[2] + 3 = 3 + 3 = 6 — book A purchased twice, pages from nowhere. Overwrite <strong>right-to-left</strong> instead, and every dp[w − price] you read is still last row's value, because you haven't reached it yet. "Iterate w descending" is not a rule — it's "don't read the page you just rewrote".</P>
        <Code title="knapsack.c" code={`/* one row of the table, overwritten right-to-left */
#define MAXX 100001
long long dp[MAXX];    /* global → zeroed; dp[w] = best with budget w */
for (int i = 0; i < n; i++)                 /* next row: allow book i */
    for (int w = X; w >= price[i]; w--)     /* descending: old row stays readable */
        if (dp[w - price[i]] + pages[i] > dp[w])
            dp[w] = dp[w - price[i]] + pages[i];
/* answer = max over dp[0..X] */`}
          caption="And now you know the secret: ascending on purpose gives the UNBOUNDED knapsack (items reusable) — same one line flipped, a different problem entirely." />
      </div>) },
    { kind: "worked", title: "LIS: the same move with a different last decision",
      body: (<div className="space-y-3">
        <P>The longest increasing subsequence asks: delete elements from a[0..n−1] (keeping order) to get the longest strictly increasing sequence. Apply lesson 37's classification move — <em>look at the last element of the answer</em>. Define dp[i] = length of the longest increasing subsequence that <strong>ends exactly at position i</strong>. Its last decision: the element before a[i] in the subsequence is some j &lt; i with a[j] &lt; a[i] — extend that best subsequence by one — or there is no earlier element, and the subsequence is a[i] alone. So dp[i] = 1 + the best dp[j] over valid j (or just 1). The answer is the best ending position — <em>some</em> i, not necessarily the last one:</P>
        <Code title="lis.c" code={`/* dp[i] = longest increasing subsequence ENDING at i */
int dp[5001];
int best = 1;
for (int i = 0; i < n; i++) {
    dp[i] = 1;                        /* the "a[i] alone" case */
    for (int j = 0; j < i; j++)
        if (a[j] < a[i] && dp[j] + 1 > dp[i])
            dp[i] = dp[j] + 1;        /* extend the best valid j */
    if (dp[i] > best) best = dp[i];   /* answer = max over ALL endings */
}`} />
        <P>Why max over all i, and not dp[n−1]? Run [1, 2, 3, 0] in your head: dp = [1, 2, 3, 1] — the best subsequence (1, 2, 3) ends at index 2, and the final 0 can only extend nothing. dp[n−1] = 1 would report an answer of 1 for a sequence containing 1, 2, 3. The ending position is part of the state's freedom, so the answer has to search over it — the same "which page holds the answer?" question you answered in every DP so far.</P>
      </div>) },
    { kind: "bug", title: "Both famous bugs, now with their mechanisms",
      body: (<div className="space-y-3">
        <Gotcha>Ascending budget in 0/1 knapsack — you've seen the mechanism: dp[w − price] is read after being overwritten, so the item silently enters the solution multiple times (the A-twice trace above). If your knapsack answer is "too good", suspect the direction of the inner loop first.</Gotcha>
        <Gotcha title="the twin">Reading dp[n−1] for LIS instead of max(dp) — the [1,2,3,0] trace above is your permanent counterexample. Any DP answer needs the question "which page holds it?" answered explicitly; "the last page" is a guess, not a derivation.</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Re-derive, don't recite",
      body: <Recall prompt="State the knapsack recurrence as a case split about item i. Then explain — no code — why the 1D version must run w downward, using the phrase 'the page you just rewrote'. Finally: define dp[i] for LIS and say why the answer is max(dp), with your counterexample." /> },
  ],

  /* ————— 39 · phase 3 review ————— */
  "p3-39": [
    { kind: "context", title: "Classify before you code",
      body: (<div className="space-y-3">
        <P>Phase 3's payoff is speed of recognition: read a statement, name the shape, reach for the right tool — before writing a line. This review is a classification drill. For each prompt, name the technique first, then check.</P>
        <Key>The exam skill isn't ten algorithms — it's mapping a sentence to one of ten shapes in under a minute.</Key>
      </div>) },
    { kind: "concept", title: "The classification drill",
      body: (<div className="space-y-3">
        <P>1. "Smallest speed to finish all tasks in time" → binary search on the answer (26)</P>
        <P>2. "How many primes ≤ 10⁶" → sieve (28)</P>
        <P>3. "Max number of non-overlapping events" → greedy, sort by finish time (32,33)</P>
        <P>4. "Fewest moves across a grid" → BFS (35)</P>
        <P>5. "How many separate flooded regions" → DFS / flood fill (36)</P>
        <P>6. "Max value under a budget, each item once" → 0/1 knapsack (38)</P>
        <P>7. "Do two numbers in a sorted list sum to X" → two pointers (20)</P>
        <P>8. "Answer many range-sum queries on fixed data" → prefix sums (14)</P>
      </div>) },
    { kind: "retrieval", title: "Are you exam-ready?",
      body: <Recall prompt="Re-run the drill from memory. Every shape named in under a minute each, with the defining keyword that gave it away? That reflex is what Phase 4's real papers will test." /> },
  ],
};
