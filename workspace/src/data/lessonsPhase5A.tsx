import type { Step } from "./lessonKit";
import { P, Code, Trace, Gotcha, Key, Recall, Note, Sub, Chain, Term } from "./lessonKit";

/* Phase V, part 1 — the C++17 transition, items 48–52.
   Teaching contract for the whole phase: NOTHING semantic is new. Every
   lesson is "the idea you already own, spelled with less typing" — the
   work is in the spelling, the cost model, and the new failure modes. */

export const LESSONS_P5A: Record<string, Step[]> = {

  /* ————— 48 · iostream + fast IO ————— */
  "p5-48": [
    { kind: "context", title: "Same job, no format strings",
      body: (<div className="space-y-3">
        <P>Every C program you've written starts the same way: <code>scanf("%d", &amp;n)</code> — a format string you must keep in sync with the variable's type by hand, and an <code>&amp;</code> you must not forget. C++ streams delete that whole class of bug: <code>cin &gt;&gt; n</code> reads an <code>int</code> because <code>n</code> <em>is</em> an <code>int</code>. The type travels with the variable, so there is nothing to desynchronize. That's the entire pitch — and it's worth switching for, because format-string mismatches are silent-corruption bugs, the worst kind under exam pressure.</P>
        <P>There is one real cost: by default, C++ streams are slower than scanf/printf. Not because they're badly written, but because they're doing two extra jobs you don't need in a contest. This lesson is mostly about understanding those two jobs, because the famous two-line "fast IO" fix is just switching them off — and you should never paste a fix you can't explain.</P>
      </div>) },
    { kind: "concept", title: "cin and cout, from first principles",
      body: (<div className="space-y-3">
        <Code title="hello.cpp" code={`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;               // reads an int: no format string, no &
    long long big;
    cin >> big;             // reads a long long: same syntax, different type
    string s;
    cin >> s;               // reads one whitespace-delimited word
    cout << n << " " << big << "\\n";
}`}
      caption="The >> operator is overloaded per type: the compiler picks the right reader from the variable's type. That's the whole mechanism." />
        <P>Three behaviors to internalize, because they differ from scanf:</P>
        <Chain items={[
          <span><strong>Whitespace skipping.</strong> <code>cin &gt;&gt; x</code> skips leading spaces/newlines automatically — you never fight the leftover-newline problem scanf's <code>"%c"</code> has. (Strings with spaces are the exception — see lesson 50.)</span>,
          <span><strong>Stream state.</strong> When input runs out or a read fails, <code>cin</code> doesn't crash — it sets a fail flag and every later read silently fails too. <code>while (cin &gt;&gt; x)</code> is therefore the idiomatic read-until-EOF loop: it stops exactly when reading stops working. That one line replaces every <code>scanf(...) == 1</code> check you ever wrote.</span>,
          <span><strong>Output is buffered.</strong> <code>cout</code> accumulates text in a buffer and flushes it in bulk. <code>"\\n"</code> just adds a character; <code>endl</code> adds a character <em>and forces a flush</em>. Hold that distinction — it's the subject of the speed section.</span>,
        ]} />
      </div>) },
    { kind: "concept", title: "Why streams are slow by default — and the two switches",
      body: (<div className="space-y-3">
        <P>The two default jobs that cost you time:</P>
        <Chain items={[
          <span><strong>Synchronization with C's stdio.</strong> By default, cin/cout and scanf/printf share one consistent view of the input/output streams, so you can mix them freely. Keeping them consistent requires coordination on (almost) every operation. In a contest you never mix them — so turn the coordination off: <code>ios::sync_with_stdio(false);</code></span>,
          <span><strong>The cin→cout tie.</strong> By default, reading from <code>cin</code> first flushes <code>cout</code>'s buffer, so that a prompt appears before input is read. Useful for interactive terminals; pointless when the judge feeds you a file. Untie it: <code>cin.tie(nullptr);</code></span>,
        ]} />
        <P>Both switches are one-time, program-start operations. With them off, cin/cout match scanf/printf on realistic contest inputs — and <code>"\\n"</code> (no flush) keeps the output buffered. This is the standard header block; memorize it by understanding, then it's yours forever:</P>
        <Code title="contest-header.cpp" code={`#include <bits/stdc++.h>   // every standard header, one line
using namespace std;

int main() {
    ios::sync_with_stdio(false);  // stop syncing with C stdio
    cin.tie(nullptr);             // stop flushing cout on every cin
    // ... your solution
}`}
      caption="bits/stdc++.h is a GCC extension that includes the whole standard library. Not portable to the real world — perfect for the judge." />
        <Gotcha title="endl is a flush in a trench coat">
          <code>endl</code> = newline + flush. One flush is invisible; 10⁵ of them in a hot output loop are a wall of forced writes — enough to turn an accepted solution into a time-limit one. The rule is absolute: in contest code, <code>"\\n"</code> everywhere, <code>endl</code> never. If you want the mnemonic: <em>endl = end line and flush; you asked for it, you pay for it.</em>
        </Gotcha>
      </div>) },
    { kind: "worked", title: "Lesson 1, re-spelled",
      body: (<div className="space-y-3">
        <P>The honest test of this lesson: re-spell the very first program (lesson 1's read-loop-count) and confirm nothing semantic changed:</P>
        <Code title="altura-minima.cpp" code={`int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, hmin, ok = 0;
    cin >> n >> hmin;            // two reads, one line — cin chains
    for (int i = 0; i < n; i++) {
        int h;
        cin >> h;                // streaming: no array, same as lesson 2
        if (h >= hmin) ok++;
    }
    cout << ok << "\\n";
}`} />
        <P>Count what vanished: the format string, the <code>&amp;</code>, the return-value check (the stream state handles it), and the array from lesson 1's first draft. Count what survived: <em>everything semantic</em> — the streaming discipline, the <code>&gt;=</code> boundary, the running count. That ratio — zero semantic change, several mechanical risks deleted — is the entire C++ phase in one program.</P>
      </div>) },
    { kind: "bug", title: "The two transition traps",
      body: (<div className="space-y-3">
        <Gotcha>Mixing scanf/printf with cin/cout <em>after</em> disabling sync. With the sync off, the two systems have separate buffers and no agreed ordering — output can appear out of order, input can vanish. The rule: one IO family per program, chosen in minute one.</Gotcha>
        <P>And the subtler one: disabling sync, then wondering why <code>cout</code> output appears "late" when debugging interactively. It isn't lost — it's buffered, and your terminal won't show it until a flush. For debugging only, <code>cout &lt;&lt; flush</code> (or a strategic <code>endl</code>) makes it appear; the judge never needs this because the buffer flushes at program exit.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Write the two fast-IO lines from memory, and for each one: what default job does it switch off, and why was that job there in the first place? Then: endl vs '\n' — what's the difference in one sentence?" /> },
  ],

  /* ————— 49 · vector ————— */
  "p5-49": [
    { kind: "context", title: "The MAXN guess, retired",
      body: (<div className="space-y-3">
        <P>Every C program in this notebook carries two self-inflicted wounds: <code>int a[MAXN]</code> with a MAXN you guessed from the constraints (too small → corruption; too big → wasted or stack-overflowed), and a hand-carried <code>n</code> that must travel everywhere the array goes, because the array doesn't know its own length. <code>vector</code> fixes both at once: it owns its memory, grows as needed, and <code>.size()</code> means the length lives <em>inside</em> the container. The minimum-state ideas of Phase I survive untouched — only the bookkeeping disappears.</P>
        <Key>A vector is an array that knows its own length and can grow. Everything you know about arrays applies; everything you hated about managing them doesn't.</Key>
      </div>) },
    { kind: "concept", title: "The everyday API, learned against lesson 6",
      body: (<div className="space-y-3">
        <P>Rewrite the presence-array idea (lesson 6 — direct indexing by small dense keys) and read the API off the diff:</P>
        <Code title="presence.cpp" code={`vector<int> seen(1001, 0);   // 1001 zeros — sized at creation, like int seen[1001] = {0}

vector<int> ids;             // starts empty; grows as you push
ids.push_back(x);            // append — the array grows itself
ids.size();                  // the length, always accurate, no parallel n
ids[3];                      // index exactly like a C array
ids.back();                  // last element (ids[ids.size()-1], shorter)
ids.pop_back();              // remove last
for (int v : ids) cout << v << " ";   // range-for: "for each element", no index`} />
        <P>Two constructor forms, used for different jobs — confusing them is the classic first-week vector bug, so get the distinction now:</P>
        <Trace
          head={["code", "result", "use when"]}
          rows={[
            ["vector<int> v;", "empty, size 0", "you'll push_back as data arrives (streaming into storage)"],
            ["vector<int> v(n);", "n elements, all 0", "the size is known upfront (presence array, distances)"],
            ["vector<int> v(n, 7);", "n elements, all 7", "known size + non-zero default (unvisited = -1)"],
          ]} />
        <P>And <code>reserve(k)</code> is a third, quieter tool: it pre-allocates room for k elements without creating them, so the coming push_backs never have to grow. Use it when the final size is known but you still want to push — it's an optimization, never a correctness tool.</P>
      </div>) },
    { kind: "concept", title: "Why push_back is O(1) — the doubling argument",
      body: (<div className="space-y-3">
        <P>A vector that "grows as needed" sounds like it should be slow: growing means allocating a bigger block and copying everything over. So why is <code>push_back</code> advertised as O(1)? Derive it, because the argument is a pattern you'll reuse (it's amortized analysis, the same thinking that makes lesson 28's sieve O(n log log n) instead of O(n²)):</P>
        <Chain items={[
          <span>When the block is full, the vector allocates a new block of <strong>double</strong> the capacity and copies the old elements over. Expensive — but rare.</span>,
          <span>Count the copies over n pushes: the block grows 1 → 2 → 4 → 8 → …, so the copying happens at pushes 1, 2, 4, 8, …, and each time copies at most the current size. Total copies ≈ 1 + 2 + 4 + … + n ≈ 2n.</span>,
          <span>2n copies for n pushes is 2 copies <em>per push on average</em> — a constant. So push_back is O(1) <strong>amortized</strong>: individual pushes occasionally spike, the average never does.</span>,
        ]} />
        <P>The doubling factor is the whole trick — growing by a constant <em>amount</em> instead of a constant <em>factor</em> would make the total quadratic. When you write <code>reserve(n)</code> before a known-size loop, you're just telling the vector "the doubling game ends before it starts".</P>
      </div>) },
    { kind: "bug", title: "The unsigned trap and the unchecked bracket",
      body: (<div className="space-y-3">
        <Gotcha title="size() − 1 when the vector is empty">
          <code>size()</code> returns <code>size_t</code> — an <em>unsigned</em> type. So <code>for (int i = 0; i &lt; v.size() - 1; i++)</code> on an empty vector computes <code>0 - 1</code> in unsigned arithmetic, which wraps to ~4 billion, and your "empty" loop runs four billion times. The fixes: compare against <code>(int)v.size()</code>, or rewrite the bound as <code>i + 1 &lt; (int)v.size()</code>, or store <code>int n = v.size();</code> once. Unsigned wraparound is the single most common vector bug in contest code — meet it once here, never in a submission.
        </Gotcha>
        <Gotcha title="[] doesn't check">
          <code>v[10]</code> on a 5-element vector is undefined behavior — usually not a crash, just quietly wrong memory. <code>v.at(10)</code> throws instead. In contests, [] is standard (the check costs time) and the defense is the same as in C: the index math is your responsibility, hand-trace it (lesson 41, beat 4). The vector removed the length bookkeeping, not the thinking.
        </Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What do vector<int> v; and vector<int> v(n); create, respectively? Sketch the doubling argument for amortized O(1) push_back in three lines. And: what does v.size() - 1 do when v is empty, and why?" /> },
  ],

  /* ————— 50 · std::string ————— */
  "p5-50": [
    { kind: "context", title: "The terminator, retired",
      body: (<div className="space-y-3">
        <P>Phase I's string work (lessons 7–9) was built on <code>char s[MAXN]</code>: a buffer you sized by guess, a <code>'\\0'</code> terminator you had to respect in every loop, and library calls (<code>strlen</code>, <code>strcmp</code>) that re-scan or compare bytewise with no idea of length. <code>std::string</code> is a vector of characters with a personality: it knows its size, compares with <code>==</code>, concatenates with <code>+</code>, and slices with <code>substr</code>. Your run-scanning loops from lesson 7 port over <em>line for line</em> — only the scaffolding changes.</P>
      </div>) },
    { kind: "concept", title: "The API that replaces the C string library",
      body: (<div className="space-y-3">
        <Trace
          head={["C (what you wrote)", "C++ (what you'll write)", "note"]}
          rows={[
            ["strlen(s)", "s.size()", "O(1) — the string stores its length"],
            ["strcmp(a, b) == 0", "a == b", "real comparison, not an int code"],
            ["strcpy / strcat", "a = b; a += b", "assignment copies correctly by itself"],
            ["s[i] == '\\0' loop test", "i < (int)s.size()", "no terminator to remember"],
            ["scanf(\"%s\", s) + MAXN guess", "cin >> s", "grows to fit any word"],
            ["—", "s.substr(i, k)", "the k characters starting at i (copies)"],
            ["strstr", "s.find(t)", "position or string::npos"],
          ]} />
        <P>One input idiom is new and exam-critical: <code>cin &gt;&gt; s</code> reads a <em>word</em> (stops at whitespace). To read a whole line — spaces included — use <code>getline(cin, s)</code>. And that's where the one real trap lives.</P>
        <Gotcha title="the newline left behind">
          After <code>cin &gt;&gt; n</code>, the newline you pressed to submit the number is still sitting in the input buffer. A following <code>getline(cin, s)</code> reads up to the next newline — which is <em>immediately</em> — and hands you an empty string. Derive it once and it's obvious: <code>&gt;&gt;</code> stops <em>at</em> whitespace, getline stops <em>after</em> it. The fix, used everywhere: <code>cin.ignore();</code> between the <code>&gt;&gt;</code> and the <code>getline</code> — it throws away exactly one character, the leftover newline.
        </Gotcha>
      </div>) },
    { kind: "worked", title: "Anton and Danik, ported verbatim",
      body: (<div className="space-y-3">
        <P>Lesson 8's two-counter scan, re-spelled. Find the line that changed semantically — there isn't one:</P>
        <Code title="anton.cpp" code={`int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, a = 0, d = 0;
    string s;
    cin >> n >> s;              // reads the whole word; no buffer size to guess
    for (char c : s) {          // range-for: no index, no terminator check
        if (c == 'A') a++;
        else          d++;
    }
    if (a > d)      cout << "Anton\\n";
    else if (d > a) cout << "Danik\\n";
    else            cout << "Friendship\\n";
}`} />
        <P>What vanished: the <code>char s[MAXN]</code> guess, the <code>s[i]</code>/terminator loop discipline, the <code>&amp;</code> and the format string. What survived: the streaming minimum-state idea — two counters, no array — which was never about C in the first place. That's the phase's thesis in twelve lines.</P>
        <Note>The same portability holds for lesson 7's maximal-run scan: <code>for (int i = 0; i &lt; (int)s.size(); i++)</code> replaces the terminator loop, and the post-loop finalization — the most-forgotten line in Phase 1 — stays exactly where it was. Containers change; invariants don't.</Note>
      </div>) },
    { kind: "bug", title: "String failure modes",
      body: (<div className="space-y-3">
        <Gotcha>substr in a hot loop. <code>s.substr(i, k)</code> <em>copies</em> k characters into a new string — inside an O(n) loop that's O(n·k) of hidden work. If you only need to look at characters, index them (<code>s[i]</code>, O(1)); reserve substr for when you genuinely need the piece as its own string.</Gotcha>
        <P>And the getline trap's evil twin: using <code>getline</code> after <code>getline</code> works fine, then mixing one <code>cin &gt;&gt;</code> into the middle of the file and wondering why the <em>next</em> getline came back empty. Pick an input style per problem — all-token (<code>&gt;&gt;</code>) or all-line (<code>getline</code>) — and if you must mix, the <code>ignore()</code> goes at every boundary, not just the first.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="cin >> s vs getline(cin, s) — what does each read? Explain the leftover-newline trap in two sentences, and name the fix. Which lesson-8 idea survived the port unchanged?" /> },
  ],

  /* ————— 51 · sort + lambdas ————— */
  "p5-51": [
    { kind: "context", title: "The boilerplate, retired",
      body: (<div className="space-y-3">
        <P>Lesson 18 taught you <code>qsort</code> honestly: <code>void*</code> parameters, casts inside the comparator, the sign-of-the-difference return, and the <code>a - b</code> overflow trap near INT_MAX. All of it exists because C has no way to know your array's type. C++ does — so <code>std::sort</code> deletes the entire ceremony: no casts, no void*, and a comparator that returns a plain <code>true</code>/<code>false</code>. The one idea that mattered in lesson 18 — <em>the sort is fixed; only the comparison changes</em> — survives as the whole lesson.</P>
      </div>) },
    { kind: "concept", title: "sort's contract, and the lambda in one breath",
      body: (<div className="space-y-3">
        <Code title="sort-basics.cpp" code={`vector<int> v = {5, 2, 8, 1};
sort(v.begin(), v.end());          // ascending: uses < on ints
// v == {1, 2, 5, 8}

int a[4] = {5, 2, 8, 1};
sort(a, a + 4);                    // arrays work too: pointers ARE iterators

sort(v.begin(), v.end(), greater<int>());   // descending, standard recipe`}
      caption="sort's range is [begin, end): the end position is one-past-the-last element and never touched. For arrays, a + 4 is exactly that." />
        <P>The default needs no comparator because <code>int</code>, <code>string</code>, and <code>pair</code> already know <code>&lt;</code> — and that default <code>&lt;</code> is doing more than you think (pairs compare lexicographically; lesson 52 cashes that in). When the default isn't your order, you pass a <strong>lambda</strong> — a function written inline where the argument goes:</P>
        <Code title="lambda-anatomy.cpp" code={`sort(v.begin(), v.end(), [](int x, int y) { return x > y; });
//                       └─────┬─────┘ └────┬───┘ └───┬───┘
//                        parameters       body    "x before y when x > y"
//                        (capture list empty here: [] )`} />
        <P>Read a comparator as answering one question — <em>"in the final order, does x come before y?"</em> — and every sort bug becomes a mis-answered question. The three recipes you'll actually use in contests:</P>
        <Code title="the-three-recipes.cpp" code={`// 1. structs by a field (the lesson-19 phone book, minus the casts)
struct Person { string name; int age; };
vector<Person> people = {{"ana", 30}, {"bob", 22}, {"cy", 27}};
sort(people.begin(), people.end(),
     [](const Person &a, const Person &b) { return a.age < b.age; });
// → bob(22), cy(27), ana(30)

// 2. by x, break ties by y — the lexicographic idiom
struct P { int x, y; };
vector<P> pts = {{3, 9}, {1, 5}, {3, 2}};
sort(pts.begin(), pts.end(), [](const P &a, const P &b) {
    if (a.x != b.x) return a.x < b.x;
    return a.y < b.y;
});   // → (1,5) (3,2) (3,9): x decides, y breaks the tie

// 3. descending by second field only
sort(v.begin(), v.end(), [](const auto &a, const auto &b) {
    return a.second > b.second;
});   // 'auto' parameters: one lambda, any pair-like type`} />
        <P>Recipe 2 deserves a stare: <em>if the primary keys differ, they decide; otherwise the secondary keys decide.</em> That's exactly how a dictionary orders words, and it generalizes to any number of fields by chaining more <code>if</code>s. Write it in that shape every time — the clever one-liner versions are where tie-breaking bugs breed.</P>
      </div>) },
    { kind: "concept", title: "What sort costs, and the one guarantee it doesn't give",
      body: (<div className="space-y-3">
        <P><code>std::sort</code> is O(n log n) — introsort, a quicksort/heapSort hybrid that can't be provoked into quadratic behavior, which is more than raw quicksort promised you in lesson 18. Two footnotes that win real points:</P>
        <Chain items={[
          <span><strong>It's not stable.</strong> Equal elements may end up in any relative order. If ties must preserve input order (common when you sorted by a key but still need "first come, first served"), use <code>stable_sort</code> — same syntax, O(n log n) with a bigger constant.</span>,
          <span><strong>You only need the k-th element? <code>nth_element</code> is O(n).</strong> It rearranges so position k holds the k-th smallest, everything before is ≤, everything after ≥. "Find the median" just got ten times cheaper than a full sort.</span>,
        ]} />
        <Sub>Why the question must be "strictly before" — derived, not decreed</Sub>
        <P>
          A comparator is a promise that your elements <em>can be ranked</em>, and rankings have a minimal logic: if A is before B,
          then B is not before A. Now write the classic bug, <code>{"return a.age <= b.age;"}</code>, and interrogate it with two
          people of the <strong>same</strong> age: asked "is Ana before Bob?" it computes 25 ≤ 25 → yes. Asked "is Bob before Ana?"
          it computes 25 ≤ 25 → also yes. Your function just promised two mutually exclusive things, so no arrangement of Ana and Bob
          satisfies your answers — the sort is being asked to realize an impossible ranking, and it will do <em>something</em>:
          scramble the order, loop forever, or crash, depending on internals you can't see. The technical name for the promise is{" "}
          <Term def="A comparison rule that never contradicts itself: never both 'a before b' and 'b before a', and if a is before b and b before c, then a is before c. It's exactly the logic a real ranking has — 'strict' because an element is never before itself.">strict weak ordering</Term>,
          and it sounds scarier than it is: it just means your answers behave like a real ranking. The practical rule falls straight
          out of the Ana/Bob crash: the question you answer is always the <em>strict</em> one — "strictly before?" — so{" "}
          <code>&lt;</code> (or <code>&gt;</code> for descending) is not a style choice, it's the only answer that can't contradict
          itself on equal elements.
        </P>
        <Gotcha title="the comparator that lies">
          Before writing any comparator, ask: could my rule ever say "a before b" <em>and</em> "b before a" for some pair — including
          pairs that look equal? If yes, no sorted order exists that satisfies it, and the failure will look like a bug in the sort.
          It isn't. It's yours.
        </Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What question does a comparator answer? Write recipe 2 (by x, ties by y) from memory. What's the difference between sort and stable_sort, and what does nth_element give you that sort doesn't?" /> },
  ],

  /* ————— 52 · pair, tuple, structured bindings ————— */
  "p5-52": [
    { kind: "context", title: "Parallel arrays, finally illegal",
      body: (<div className="space-y-3">
        <P>Lesson 19 killed parallel arrays with <code>struct</code>: related fields travel together. <code>pair</code> is the same idea for the throwaway case — two values that belong together but don't deserve a named type. Its superpower isn't the grouping, it's the <em>free lexicographic comparison</em>: pairs already know how to be sorted, and half of all contest sorting problems are secretly "put two numbers in a pair and let the standard library do the thinking".</P>
        <Key>pair bundles two values and inherits lexicographic order: (a,b) &lt; (c,d) means a &lt; c, or a == c and b &lt; d. Sorting pairs IS sorting by first key with tie-breaking by second — for free.</Key>
      </div>) },
    { kind: "concept", title: "The two workhorses",
      body: (<div className="space-y-3">
        <Sub>Workhorse 1 — "sort by x, ties by y" without a comparator</Sub>
        <Code title="pair-sort.cpp" code={`vector<pair<int,int>> pts;      // (x, y)
pts.push_back({3, 9});          // brace-init: cleaner than make_pair
pts.push_back({1, 5});
pts.push_back({3, 2});
sort(pts.begin(), pts.end());   // no comparator needed!
// now: (1,5) (3,2) (3,9)  — x ascending, ties broken by y`} />
        <P>Lesson 51's recipe 2, done by the type system. The discipline is positional: <em>whatever must sort first goes in .first</em>. If you need "sort by y, ties by x", store (y, x). If you need descending-first, either flip the sign or add the one comparator from lesson 51 — the pair still does the tie-breaking.</P>
        <Sub>Workhorse 2 — keeping the index through the sort</Sub>
        <Code title="value-index.cpp" code={`// "which position held the k-th smallest value?"
vector<pair<int,int>> vi;               // (value, original index)
for (int i = 0; i < n; i++) {
    int x; cin >> x;
    vi.push_back({x, i});
}
sort(vi.begin(), vi.end());
int answer_index = vi[k - 1].second;    // sorting moved values; the index rode along`} />
        <P>This is the fix for every problem where sorting would destroy the answer's location — and there is one on nearly every paper. The moment a problem says "sort" and also asks "which position / which day / which person", reach for the (value, index) pair before writing anything.</P>
      </div>) },
    { kind: "concept", title: "Taking pairs apart: structured bindings",
      body: (<div className="space-y-3">
        <P><code>.first</code>/<code>.second</code> everywhere gets noisy fast. C++17 structured bindings unpack a pair (or tuple, or small struct) into named variables in one line:</P>
        <Code title="bindings.cpp" code={`for (auto [value, idx] : vi)            // copy: fine for reading
    cout << value << " was at " << idx << "\\n";

for (auto &[value, idx] : vi)           // reference: changes write back
    value *= 2;

auto [x, y] = pts[0];                   // unpack outside loops too`} />
        <P>Note the <code>&amp;</code>: without it you unpack a <em>copy</em> (cheap, read-only intent); with it you unpack references and edits land in the container. Default to the copy form; add the <code>&amp;</code> only when you mean to modify — same "const unless writing" discipline as lesson 12.</P>
        <P><code>tuple</code> is the same idea past two fields: <code>tuple&lt;int,int,int&gt;</code>, unpacked with <code>auto [a, b, c]</code>, compared lexicographically just like pairs. Honest advice: tuples are great up to three fields; at four, a named <code>struct</code> (lesson 19) reads better and costs nothing. The pair, though, you will use daily.</P>
      </div>) },
    { kind: "bug", title: "The ordering assumptions",
      body: (<div className="space-y-3">
        <Gotcha title="sorting pairs 'by second'">Sorting a <code>vector&lt;pair&lt;int,int&gt;&gt;</code> with no comparator sorts by <em>first</em> — always, no exceptions, the type says so. "But I wanted to sort by second" means you should have stored (second, first), not that the sort misbehaved. When the sample passes and the real test doesn't, check which field is in .first before anything else.</Gotcha>
        <P>And the tie-breaking surprise in the other direction: pairs compare the second field <em>only when the firsts are equal</em> — so (3,2) &lt; (3,9) but also (3,99) &lt; (4,1). If you wanted "smaller sum first", a pair can't express that at all — that's a comparator job (lesson 51). The pair gives you lexicographic order; it does not give you arbitrary order for free.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="When is (a,b) < (c,d) true? A problem asks 'after sorting by score, which student index is k-th' — what do you store in the pair, and which field is the answer? Copy-binding vs reference-binding: one line each." /> },
  ],
};
