import type { Step } from "./lessonKit";
import { P, Code, Trace, Gotcha, Key, Recall, Note, Sub, Chain } from "./lessonKit";

/* Phase V, part 2 — items 53–56: the containers that generalize Phase-I
   arrays, the restricted interfaces that encode algorithms, binary search
   for free, and the capstone rewrite. */

export const LESSONS_P5B: Record<string, Step[]> = {

  /* ————— 53 · map / set ————— */
  "p5-53": [
    { kind: "context", title: "Direct indexing, generalized",
      body: (<div className="space-y-3">
        <P>Lesson 6's presence array is a lookup table with a luxurious assumption baked in: keys are small, dense, non-negative integers, so a key <em>is</em> an array index. The moment keys stop cooperating — names, product codes, IDs up to 10¹⁸, negative values — the array trick collapses. <code>map</code> is the generalization: a lookup table indexed by <em>anything comparable</em>, at the price of O(log n) per operation instead of O(1). Same minimum-state ideas, same presence-vs-frequency distinction (lesson 6's core) — only the key domain widens.</P>
        <Key>A map is "array indexed by anything": map&lt;Key, Value&gt; with presence (does this key exist?) and frequency (value = count) as the same two shapes you already know — just O(log n) instead of O(1).</Key>
      </div>) },
    { kind: "concept", title: "map's contract, derived from its skeleton",
      body: (<div className="space-y-3">
        <P><code>map&lt;Key,Value&gt;</code> is internally a balanced binary search tree of (key, value) pairs, kept sorted by key at all times. Every operation follows from that one fact:</P>
        <Chain items={[
          <span><strong>O(log n) insert/lookup</strong> — a tree of n nodes is log n deep; each operation walks one root-to-leaf path.</span>,
          <span><strong>Iteration is sorted by key, for free</strong> — an inorder walk of the tree. If a problem says "print counts in lexicographic order", a plain map <em>already did the sorting</em> while you were inserting. This is the feature people miss for years.</span>,
          <span><strong><code>m[key]</code> creates if missing</strong> — because operator[] must return a reference to a value, and a missing key has none, so a default (0, "", false) is invented on the spot. Great for counting (<code>m[word]++</code> starts at 0); a silent memory leak if you only meant to <em>look up</em>.</span>,
        ]} />
        <Code title="map-basics.cpp" code={`map<string, int> freq;          // frequencies, lesson 6 shape
string w;
while (cin >> w) freq[w]++;     // first sighting auto-starts at 0

freq.size();                    // how many DISTINCT keys — lesson 6's other shape
freq.count("ana");              // 1 if present, 0 if not — lookup WITHOUT creating
freq.find("ana") != freq.end(); // the iterator version; ->second reaches the value

for (auto &[word, k] : freq)    // visits keys in sorted order — free
    cout << word << " " << k << "\\n";`} />
        <P><code>set&lt;Key&gt;</code> is the value-less sibling: keys only, same tree, same sorted iteration. It's the presence array generalized — membership, distinctness, sorted distinct enumeration. Lesson 6's "which ids appeared at all" becomes <code>set&lt;long long&gt; seen;</code> when ids can be 10¹⁸.</P>
      </div>) },
    { kind: "concept", title: "unordered_ variants, and the honest choice table",
      body: (<div className="space-y-3">
        <P><code>unordered_map</code>/<code>unordered_set</code> replace the tree with a hash table: expected O(1) per operation, but <em>no order</em> — iteration order is arbitrary hash noise. Now you own three lookup structures, and choosing among them is a two-question decision:</P>
        <Trace
          head={["keys are…", "need sorted iteration?", "use"]}
          rows={[
            ["small, dense ints (≤ ~10⁷)", "—", "plain array — lesson 6, fastest possible, O(1) real"],
            ["anything, yes", "yes", "map / set — O(log n), sorted for free"],
            ["anything, no", "no", "unordered_map / unordered_set — O(1) expected"],
          ]} />
        <P>Derive the ordering of that table, don't memorize it: an array beats everything when applicable (no hashing, no tree, one memory hop), so it's checked first; sortedness is a real feature you either need or don't; unordered is what's left. Contest wisdom: when in doubt, use the plain <code>map</code> — the log factor almost never matters at 10⁵, the sorted iteration rescues you in problems you didn't plan for, and its worst case is guaranteed rather than merely expected.</P>
        <Note>One adversarial footnote: unordered_map's "expected O(1)" assumes keys hash well. On integers, some judges feed anti-hash inputs that force collisions into O(n) per operation — rare, but the reason veterans keep plain arrays and plain maps in the toolbox. You don't need to know the custom-hash fix (out of scope); you need to know the escape hatch exists.</Note>
      </div>) },
    { kind: "worked", title: "João João with hostile keys",
      body: (<div className="space-y-3">
        <P>Take lesson 6's João João and imagine the IDs are up to 10¹⁸ — the presence array dies on arrival. The rewrite is mechanical once the structure choice is made:</P>
        <Code title="joao-joao-1e18.cpp" code={`unordered_map<long long, int> cnt;   // frequency shape, hostile keys
long long id;
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    cin >> id;
    cnt[id]++;                        // auto-creates at 0, then counts
}
// "did any id appear twice?" — lesson 6's question, generalized:
bool dup = false;
for (auto &[id, k] : cnt)
    if (k >= 2) dup = true;
cout << (dup ? "yes" : "no") << "\\n";`} />
        <P>Notice what <em>didn't</em> change: the streaming loop, the frequency-then-scan structure, the presence-vs-frequency reasoning. Only the key→slot machinery moved, from "the key is the index" to "the container finds the slot". That separation — algorithm shape vs. lookup mechanism — is exactly the modularity this whole phase is installing.</P>
      </div>) },
    { kind: "bug", title: "The two map traps",
      body: (<div className="space-y-3">
        <Gotcha title="lookup that creates">
          <code>if (m[key] == 0)</code> on a missing key <em>inserts</em> the key (with value 0) before comparing — so your map quietly fills with every key you ever looked up. In a tight loop over a big key space, that's memory and time death. Lookups without insertion use <code>m.count(key)</code> or <code>m.find(key)</code>. Creation-on-purpose (<code>m[key]++</code>) stays; creation-by-accident goes.
        </Gotcha>
        <P>And the ordering assumption: writing code that depends on unordered_map's iteration order — say, printing "the first key" — works on your samples and reorders itself on the judge's machine. If order matters in the output, the structure choice was wrong: that's a <code>map</code>'s job.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="The three-structure decision: what two questions choose between array, map, and unordered_map? What does m[key] do when key is missing, and which calls look up without creating? What free feature does plain map's iteration have?" /> },
  ],

  /* ————— 54 · queue, stack, priority_queue ————— */
  "p5-54": [
    { kind: "context", title: "Restriction as a feature",
      body: (<div className="space-y-3">
        <P>After two lessons of containers that give you everything (vector: any access, anytime), this one inverts the idea: <code>queue</code>, <code>stack</code>, and <code>priority_queue</code> deliberately <em>hide</em> most operations. A queue lets you push at the back and pop from the front — nothing else. That's not a limitation; it's the algorithm's discipline made unbreakable by the compiler. BFS <em>is</em> FIFO processing; DFS <em>is</em> LIFO; greedy-with-priorities <em>is</em> repeated extraction of the best element. When the container only allows the legal moves, half your implementation bugs become uncompilable.</P>
        <Key>Each container is an algorithm with the other operations deleted: queue = BFS's FIFO, stack = DFS's LIFO, priority_queue = "always take the best next".</Key>
      </div>) },
    { kind: "concept", title: "The three interfaces, ten lines total",
      body: (<div className="space-y-3">
        <Code title="the-trio.cpp" code={`queue<int> q;                 // FIFO: first in, first out
q.push(x);                    // add at back
q.front();                    // look at front (doesn't remove)
q.pop();                      // remove front  — look, THEN remove: two steps
q.empty();                    // always check before front/pop!

stack<int> st;                // LIFO: last in, first out
st.push(x);  st.top();  st.pop();  st.empty();   // same shape, different end

priority_queue<int> pq;       // "best first" — and best means LARGEST by default
pq.push(x);  pq.top();  pq.pop();  pq.empty();`} />
        <P>Two universal rules cover all three: there is no <em>get</em>-and-remove in one call (peek with <code>front</code>/<code>top</code>, then <code>pop</code>), and touching an empty container is undefined behavior — every real loop guards with <code>empty()</code> first. Those two rules are the entire "API discipline"; everything else is which end is which.</P>
        <Gotcha title="priority_queue is a MAX-heap">
          <code>priority_queue&lt;int&gt;</code> puts the <em>largest</em> element on top — the opposite of what "priority" suggests to most people, and the source of a legendary wrong-answer class. You want smallest-first (Dijkstra, "cheapest task next")? Invert the comparison: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>. The middle parameter is storage plumbing the declaration requires; the <code>greater</code> at the end is the actual flip. Memorize the full line once, by understanding: it says "a priority queue of ints, stored in a vector, ordered by greater".
        </Gotcha>
      </div>) },
    { kind: "worked", title: "Labyrinth's BFS, hand-rolled vs. container",
      body: (<div className="space-y-3">
        <P>Lesson 35's BFS needed a FIFO of cells. In C you hand-built it: an array of cells, a <code>head</code> index, a <code>tail</code> index, manual wraparound discipline. The same algorithm with <code>queue</code>:</P>
        <Code title="bfs-queue.cpp" code={`queue<pair<int,int>> q;                    // cells waiting to expand
q.push({sr, sc});
dist[sr][sc] = 0;

while (!q.empty()) {
    auto [r, c] = q.front();               // peek the oldest cell
    q.pop();                               // then remove it — FIFO by construction
    for (auto [dr, dc] : vector<pair<int,int>>{{1,0},{-1,0},{0,1},{0,-1}}) {
        int nr = r + dr, nc = c + dc;
        if (in bounds && grid[nr][nc] != '#' && dist[nr][nc] == -1) {
            dist[nr][nc] = dist[r][c] + 1; // correctness rides on FIFO order
            q.push({nr, nc});
        }
    }
}`} />
        <P>Diff it against your lesson-35 C version. What vanished: the cell array, the head/tail bookkeeping, the <em>entire class of ring-buffer bugs</em> (forgot to advance head, advanced it twice, array sized n instead of n·m). What survived: every semantic line — the -1 unvisited sentinel, mark-when-enqueue (never when-dequeue), the four directions, distance riding the queue's order. The container didn't make BFS easier to think about; it made BFS harder to break. That's the trade being purchased.</P>
        <Note>What the queue stores matters: here it's (row, col) pairs — tiny, cheap to copy. Store indices or coordinates, never big objects; the container copies on push, and a struct with arrays inside turns every push into a memcpy.</Note>
      </div>) },
    { kind: "concept", title: "Where the stack already lives — and where it becomes explicit",
      body: (<div className="space-y-3">
        <P>You've been using a stack since day one without naming it: <strong>every function call</strong> pushes a frame (locals, return address) and pops it on return — which is precisely why lesson 36's recursive DFS "just works" and why blowing the call stack on 10⁶-deep recursion is a real failure mode. The explicit <code>stack</code> shows up when you want that discipline <em>in your data</em> rather than in the runtime:</P>
        <Chain items={[
          <span><strong>Iterative DFS</strong> — push a cell, pop the newest, push its neighbors: depth-first order by construction, immune to call-stack depth limits. The recursive and iterative versions visit in slightly different orders; both are correct DFS.</span>,
          <span><strong>Matching structures</strong> — parentheses, undo history, "most recent wins" bookkeeping: anywhere the honest answer to "which element matters now?" is <em>the most recently added one</em>, a stack is the shape.</span>,
        ]} />
        <P>And <code>priority_queue</code>'s exam future, named so you recognize it: Dijkstra (out of this sprint's scope) is exactly lesson 35's BFS with the FIFO queue swapped for a smallest-distance-first priority queue. When you eventually meet it, the only new sentence is "the queue now reorders by distance" — everything else you already own.</P>
      </div>) },
    { kind: "bug", title: "Container failure modes",
      body: (<div className="space-y-3">
        <Gotcha title="front/top before the empty check">
          <code>q.front()</code> on an empty queue is undefined behavior — usually a silent garbage value, occasionally a crash two functions away. The guard is non-negotiable: <code>while (!q.empty())</code> wraps every peek-and-pop loop. This is the queue version of lesson 49's unsigned trap: a mistake the type system cannot see, so the ritual must.
        </Gotcha>
        <P>And the subtle ordering one: popping and pushing in the wrong order inside a greedy loop — e.g., extracting the "best" element <em>before</em> inserting the elements it releases. Walk one iteration by hand (the Phase-I tracing habit, still the cheapest debugger you own) whenever a loop mixes pushes and pops.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="For each of the three containers: which end do you add at, which do you take from, and which algorithm is it the shape of? What does priority_queue<int> put on top, and what's the exact declaration for smallest-first?" /> },
  ],

  /* ————— 55 · lower_bound / upper_bound ————— */
  "p5-55": [
    { kind: "context", title: "The off-by-one, handled once and forever",
      body: (<div className="space-y-3">
        <P>Lessons 17 and 25 taught you binary search the honest way: the invariant, the shrinking interval, the three student submissions where two were wrong. That labor was necessary — you should be able to write the loop cold — but in a contest you should almost never <em>ship</em> a hand-rolled binary search when a sorted-array query is all you need. <code>lower_bound</code> and <code>upper_bound</code> are the standard library's binary search: tested by a decade of adversarial use, written once, correct forever. Your job shifts from implementing the loop to knowing the contract precisely.</P>
        <Key>On a sorted range: lower_bound(x) = first position whose element is ≥ x; upper_bound(x) = first position whose element is &gt; x. Both return "one past the end" when no such position exists. Sorted input is the caller's job — the functions don't check.</Key>
      </div>) },
    { kind: "concept", title: "The contract, drawn",
      body: (<div className="space-y-3">
        <P>One picture makes both functions permanent. Take the sorted array and a query x; each function points at a <em>position</em> (an iterator — a pointer, for arrays), never at "found/not found":</P>
        <Code title="the-picture.txt" code={`index:    0   1   2   3   4   5   6   7
value:    2   5   5   5   8   9  12  15
                          x = 5

lower_bound(5) → index 1   (first element >= 5:  the 5's START)
upper_bound(5) → index 4   (first element > 5:   just PAST the 5's)

lower_bound(6) → index 4   (no 6 exists — first element >= 6 is the 8)
lower_bound(1) → index 0   (everything is >= 1)
lower_bound(99) → index 8  (== end: no such element)`} />
        <P>Everything useful falls out of arithmetic on those two positions:</P>
        <Chain items={[
          <span><strong>Does x exist?</strong> <code>lower_bound</code> finds a position; x exists iff that position isn't <code>end</code> <em>and</em> the element there actually equals x. (lower_bound(6) returned the 8's slot — position exists, value doesn't.)</span>,
          <span><strong>How many x?</strong> <code>upper_bound(x) − lower_bound(x)</code> — the block of x's starts at the lower position and ends just before the upper one. On the picture: 4 − 1 = 3 fives. Two function calls, no scan.</span>,
          <span><strong>First element ≥ x (the answer-checking query)?</strong> That's lower_bound's <em>definition</em> — lesson 26's "can we finish in time T?" checks become one call each inside the binary-searched answer.</span>,
        ]} />
      </div>) },
    { kind: "worked", title: "Queries for free",
      body: (<div className="space-y-3">
        <P>The full idiom, on both vectors and raw arrays — because a pointer <em>is</em> an iterator, so the same calls work on the C arrays you already own:</P>
        <Code title="queries.cpp" code={`vector<int> v = {2, 5, 5, 5, 8, 9, 12, 15};   // sorted — YOUR responsibility

// 1. index of first element >= 6:
int i = lower_bound(v.begin(), v.end(), 6) - v.begin();   // i == 4

// 2. does 7 exist?
auto it = lower_bound(v.begin(), v.end(), 7);
bool has7 = (it != v.end() && *it == 7);                  // false

// 3. count of 5's:
int c = upper_bound(v.begin(), v.end(), 5)
      - lower_bound(v.begin(), v.end(), 5);               // c == 3

// raw arrays: identical calls, pointers as iterators
int a[8] = {2, 5, 5, 5, 8, 9, 12, 15};
int *p = lower_bound(a, a + 8, 6);                        // p == a + 4
bool found = (p != a + 8 && *p == 6);`} />
        <P>The <code>− v.begin()</code> move converts an iterator into an index — pointer subtraction, O(1). And notice query 2's double check: the position from lower_bound is real whenever it isn't <code>end</code>, but <em>the value at it</em> only equals x when x actually exists. Forgetting the <code>*it == x</code> half is the most common lower_bound wrong answer — it's the difference between "where x would go" and "where x is".</P>
      </div>) },
    { kind: "concept", title: "The sortedness contract, and where these meet lesson 26",
      body: (<div className="space-y-3">
        <P>One non-negotiable: both functions assume the range is sorted and <strong>do not verify it</strong>. On unsorted input they return plausible-looking garbage — the binary search version of lesson 17's sorted-input bug, now with less code and therefore less suspicion. Sorting once (O(n log n)) before a batch of queries is the same "pay once, ask forever" economy as lesson 14's prefix sums; the pattern repeats because it's the same pattern: <em>preprocess a static structure, answer fast forever</em>.</P>
        <P>The forward connection, so you recognize it: lesson 26 (binary search on the answer) feeds a candidate answer T into a "can we finish in time T?" check. When that check itself is "is there an element ≥ T in this sorted array?" — or "how many elements ≤ T?" — the check is one lower_bound call, and the outer binary search over T stays your hand-rolled one (the predicate is custom, so the loop must be too). Standard-library search for standard queries; hand-rolled search for custom predicates. Knowing which is which is the skill this lesson actually installs.</P>
      </div>) },
    { kind: "bug", title: "The two confusions",
      body: (<div className="space-y-3">
        <Gotcha title="lower vs upper, swapped">
          "First ≥ x" vs "first &gt; x" — one symbol apart, completely different positions whenever x exists multiple times. The mnemonic that survives pressure: <em>lower</em> points at the <em>low</em> end of the x-block, <em>upper</em> just past its <em>upper</em> end. When x is absent they agree — which is why tests with all-distinct values pass and the real data doesn't.
        </Gotcha>
        <P>And the end-iterator confusion: <code>lower_bound</code> returning <code>end</code> is not an error — it's the correct answer to "every element is &lt; x". Code that dereferences without the <code>!= end</code> check works until the very query where everything is smaller… which on a contest paper is always the last test case.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="On {2,5,5,5,8,9,12,15}: what index does lower_bound(5) return, and upper_bound(5)? How do you count x's in two calls? And: lower_bound returned a valid iterator — what extra check decides whether x actually exists?" /> },
  ],

  /* ————— 56 · the capstone rewrite ————— */
  "p5-56": [
    { kind: "context", title: "The phase's proof",
      body: (<div className="space-y-3">
        <P>Eight lessons of "same idea, less typing" is an argument; this lesson is the evidence. You're going to rewrite three old solutions — 2023 A (streaming, lesson 1–2), CSES 1646 (prefix sums, lesson 14), and Labyrinth (BFS, lesson 35) — in C++17, and hold the before/after side by side. The measurable: lines of mechanical boilerplate that evaporate. The real result: the visceral confirmation that <em>not one semantic decision changed</em> — every minimum-state choice, every invariant, every off-by-one defense was about the algorithm, never about the language. That confirmation is what makes you fluent in both on exam day.</P>
        <P>One protocol rule, because it decides what you learn: <strong>rewrite from the algorithm, not from the C code.</strong> Line-by-line translation practices reading C; writing "count inputs above a threshold, streaming" fresh in C++ practices owning the idea. Close the old file. Re-derive. Then diff.</P>
        <Key>The rewrites are a controlled experiment: change the language, hold the algorithm fixed, and observe that the accepted answer is identical. Anything that changes semantically is a bug, not a translation.</Key>
      </div>) },
    { kind: "handson", title: "Rewrite 1 — 2023 A, streaming",
      body: (<div className="space-y-3">
        <Code title="rewrite-1.cpp" code={`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, hmin, ok = 0;
    cin >> n >> hmin;
    for (int i = 0; i < n; i++) {
        int h; cin >> h;
        ok += (h >= hmin);        // streaming: h lives for one iteration
    }
    cout << ok << "\\n";
}`} />
        <P>Against the C original: the format string, the <code>&amp;</code>, the <code>scanf</code> return check — gone. The decision that mattered in lesson 2 (don't store the array) is untouched and, in a way, more visible: the loop body is now <em>only</em> the algorithm. Eleven lines, and seven of them are the IO header you write once per file.</P>
      </div>) },
    { kind: "handson", title: "Rewrite 2 — CSES 1646, prefix sums",
      body: (<div className="space-y-3">
        <Code title="rewrite-2.cpp" code={`int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q;
    cin >> n >> q;
    vector<long long> P(n + 1);       // the n+1 is the WHOLE lesson: P[0] = 0
    P[0] = 0;
    for (int i = 1; i <= n; i++) {
        int x; cin >> x;
        P[i] = P[i - 1] + x;          // the O(n) bill, paid once
    }
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << P[b] - P[a - 1] << "\\n";   // O(1), forever; a-1 is the only trap
    }
}`} />
        <P>The C version needed <code>#define MAXN 200002</code> and a global <code>long long P[MAXN]</code> — a size guess welded to the top of the file. Here the container sizes itself from the input (<code>n + 1</code>, derived, not guessed), and the <code>long long</code> overflow defense from lesson 14 lives in one type annotation instead of a comment you hope someone reads. The math — <code>P[b] − P[a−1]</code> — is character-for-character the exam's actual content, and it never cared which language carried it.</P>
      </div>) },
    { kind: "handson", title: "Rewrite 3 — Labyrinth, BFS",
      body: (<div className="space-y-3">
        <Code title="rewrite-3.cpp" code={`int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;
    vector<string> grid(n);                // the grid IS n strings — no char[][MAXM]
    for (auto &row : grid) cin >> row;

    vector<vector<int>> dist(n, vector<int>(m, -1));   // -1 = unvisited
    queue<pair<int,int>> q;                            // FIFO = BFS's discipline
    // find 'A', seed it:
    for (int r = 0; r < n; r++)
        for (int c = 0; c < m; c++)
            if (grid[r][c] == 'A') { dist[r][c] = 0; q.push({r, c}); }

    const int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
            if (grid[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;   // mark WHEN ENQUEUED — lesson 35's rule
            q.push({nr, nc});
        }
    }
    // answer: dist at 'B' (or -1) — printing left to you, it's one line
}`} />
        <P>This is the one where the diff is dramatic. The C version carried: a <code>char grid[MAXN][MAXM]</code>, a hand-rolled cell queue array with head/tail indices, a <code>struct Cell</code> or two parallel index queues, and bounds checks with macros or long conditions. Here: <code>vector&lt;string&gt;</code> reads the grid in two lines, <code>queue&lt;pair&lt;int,int&gt;&gt;</code> <em>is</em> the FIFO (head/tail cannot be mismanaged because they don't exist), and structured bindings unpack the cell. What survived — every line that matters: the -1 sentinel, mark-when-enqueue, the four-direction loop, distance propagation. The algorithm is identical; the surface it stands on just stopped wobbling.</P>
      </div>) },
    { kind: "concept", title: "What the three diffs prove",
      body: (<div className="space-y-3">
        <P>Line up the three rewrites and sort every changed line into exactly two columns:</P>
        <Trace
          head={["mechanical (language)", "semantic (algorithm)"]}
          rows={[
            ["scanf/printf → cin/cout + fast-IO header", "streaming vs storing (rewrite 1): unchanged"],
            ["#define MAXN + global array → vector sized from input", "P[0]=0, P[b]−P[a−1], long long (rewrite 2): unchanged"],
            ["head/tail ring buffer → queue<pair<int,int>>", "mark-when-enqueue, -1 sentinel, 4 directions (rewrite 3): unchanged"],
          ]} />
        <P>The right column is empty of changes — and that emptiness is the phase's theorem. Every hour of Phases I–IV was spent on the right column; Phase V was always going to be a weekend of the left one, learned once. If any rewrite tempted you to change the right column ("while I'm here, maybe store the array…"), that temptation is the exam trap wearing a costume: <em>translation rewrites the spelling, never the idea.</em></P>
        <P>Where this leaves you: C for understanding what the machine does, C++17 for typing less of it under a clock — and the algorithm, which was the point all along, fluent in both.</P>
      </div>) },
    { kind: "retrieval", title: "Final check",
      body: <Recall prompt="For each rewrite, name one mechanical change and confirm the semantic core it left alone. Then the phase's theorem in one sentence: when translating between languages, what is allowed to change — and what never is?" /> },
  ],
};
