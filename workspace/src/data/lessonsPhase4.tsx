import type { Step } from "./lessonKit";
import { P, Code, Trace, Gotcha, Key, Recall, Note, Sub, Chain } from "./lessonKit";

/* Phase IV — exam conversion. These are session-lessons: the skill being
   taught is turning 39 concepts into points on a real paper. Long on
   purpose: the protocol IS the content. */

export const LESSONS_P4: Record<string, Step[]> = {

  /* ————— 40 · classify a whole exam without coding ————— */
  "p4-40": [
    { kind: "context", title: "The ten minutes that decide the exam",
      body: (<div className="space-y-3">
        <P>A Maratona first-phase paper has around a dozen problems, and the points are <strong>fungible</strong> — problem A is worth exactly what problem K is worth. So the exam is not "solve problems in order"; it is a <em>selection</em> problem: find your 5–6 fastest points before you write a single line of code. Teams that skip this step end up anchored to whatever problem they happened to read first — often a hard one — and discover the easy points two hours too late.</P>
        <P>This is why classification is a separate, trained skill and not something you do "while reading". You are going to practice it on the 2022 paper — but the method generalizes to every paper you will ever open. And the rule that makes it trainable: <strong>no code during classification</strong>. The moment you start implementing, you stop surveying.</P>
        <Key>Classification is a selection problem: survey everything, tag each problem with a shape you know, then choose an attack order. Points are points — go get the cheap ones first.</Key>
      </div>) },
    { kind: "concept", title: "The three passes",
      body: (<div className="space-y-3">
        <P>Do the paper in three passes, each with one job. Resist merging them — merged passes are how teams miss the easy K because they were busy admiring the hard A.</P>
        <Chain items={[
          <span><strong>Pass 1 — read everything, solve nothing.</strong> Read all twelve statements fully, including input/output formats and constraints. Your only output: a one-line summary per problem in your own words. If you can't summarize it in one line, you don't understand it yet — re-read, don't guess.</span>,
          <span><strong>Pass 2 — tag the shape.</strong> For each problem ask: <em>which lesson is this?</em> "Count filtered inputs" is lesson 1. "Range sums on static data" is lesson 14. "Shortest path in a grid" is lesson 35. Write the lesson number down. A problem with no tag is a problem you may not be able to solve — that's valuable information, not a failure.</span>,
          <span><strong>Pass 3 — order the attack.</strong> Sort your tagged problems by (confidence you can solve it) ÷ (estimated time). That ratio is your attack order. The goal for the first hour: bank 2–3 sure points and know exactly what you'll do next.</span>,
        ]} />
        <P>Notice what pass 2 does: it converts a scary unknown ("twelve problems!") into a shortlist of shapes you've already solved. This is the entire payoff of Phases I–III — you built a vocabulary of ~15 shapes so that pass 2 takes seconds per problem instead of minutes.</P>
      </div>) },
    { kind: "worked", title: "A classification, done out loud",
      body: (<div className="space-y-3">
        <P>Here's what a finished classification looks like on a practice paper. Every row is one sentence plus a tag — no more. If a row takes longer than ~2 minutes, put a "?" in the tag column and move on; you're surveying, not solving.</P>
        <Trace
          head={["problem", "one-line summary", "shape tag", "lesson", "guess"]}
          rows={[
            ["A", "count heights ≥ H among n people", "count filtered input", "1", "easy ✓"],
            ["B", "sum of subarray ranges, many queries, array never changes", "prefix sums", "14", "easy ✓"],
            ["C", "can two people meet given schedules", "interval overlap", "33", "medium"],
            ["D", "cheapest way to buy exactly k items with bundles", "knapsack shape", "38", "hard"],
            ["E", "minimum boxes so no color repeats in one", "pigeonhole / greedy", "32", "medium"],
            ["F", "shortest moves through a maze grid", "BFS on grid", "35", "medium ✓"],
          ]} />
        <P>Reading the attack order off that table: A and B are near-certain and fast — do them first, in that order. F is a shape you own (lesson 35) and BFS on a grid is mechanical once tagged — third. C and E are attempts; D is a maybe-only-if-time-remains. That decision took ten minutes and just saved you from opening the exam by wrestling the knapsack.</P>
        <Note>The ✓ marks are <em>your</em> confidence, not the problem's objective difficulty. The exam doesn't care what's "supposed to be easy" — it cares what is easy <strong>for you, today</strong>, given the shapes you've installed.</Note>
      </div>) },
    { kind: "concept", title: "Difficulty is not what it looks like",
      body: (<div className="space-y-3">
        <P>Beginners estimate difficulty from the wrong signals. Calibrate with these instead:</P>
        <Chain items={[
          <span><strong>Statement length is almost useless.</strong> A long story often wraps a one-line counting argument (lesson 1 shape); a short statement can hide a nasty invariant. Judge the <em>shape</em>, not the prose.</span>,
          <span><strong>Position is a weak hint, not a rule.</strong> Problem A is usually easy — but "usually" means it's fine to skip A and open with B if B is tagged and A isn't. The 2022 paper's A is a run-scanning problem (lesson 7); if runs weren't your strongest shape, opening with a different sure point was correct.</span>,
          <span><strong>Sample count is a real signal.</strong> Many sample cases usually means the intended solution has fiddly cases — budget time accordingly. One or two samples usually means a clean idea.</span>,
          <span><strong>Hand-checkable samples is a green flag.</strong> If you can verify the sample by hand in thirty seconds, you can debug your solution fast. If you can't, expect a painful debug even if the idea is right.</span>,
        ]} />
        <P>And one meta-signal above all: <strong>does the tag come to mind within seconds?</strong> Instant tag → attempt. Tag after thought → attempt with a time cap. No tag → park it. Your tag speed is a calibrated instrument by now — trust it.</P>
      </div>) },
    { kind: "bug", title: "How classification actually fails",
      body: (<div className="space-y-3">
        <Gotcha>Starting to code during pass 1. You read a problem, see the solution, and start writing — from that moment you've abandoned the survey. Ten minutes later you've solved one problem and still don't know what else is on the paper. The fix is physical: pen on paper, keyboard closed, until all twelve rows exist.</Gotcha>
        <Gotcha title="the other two failures">Anchoring: falling for the first problem you understand and ranking everything relative to it, so a trivial untagged problem never gets its row. And topic-naming instead of shape-tagging: "this is a graph problem" tells you nothing actionable; "shortest path, unweighted, grid → BFS" tells you exactly what to write. Tag the shape.</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Name the three passes and the single rule that keeps them separate. Then: what three signals tell you a problem is easy for YOU (not 'easy in general')?" /> },
  ],

  /* ————— 41 · untimed solo attempt at the 6 easiest ————— */
  "p4-41": [
    { kind: "context", title: "Why untimed, and why solo",
      body: (<div className="space-y-3">
        <P>You classified the 2022 paper in the last lesson. Now you attempt your six, alone, with the clock off. Both conditions matter, for opposite reasons. <strong>Solo</strong> because on the day you need to know what <em>you</em> can produce — a teammate can't carry your half of a pair-programmed solution into the real exam. <strong>Untimed</strong> because this session is <em>learning</em> practice, not <em>performance</em> practice: you're building the retrieval pathways, and pressure before mastery just teaches you to panic-skip steps you haven't made automatic yet. The timed mock (lesson 47) exists for performance — and it comes only after the milestone.</P>
        <P>The six problems are the ones your classification ranked highest. Not "the six easiest on the paper" as some editorial says — the six easiest <em>for you</em>. That distinction is the whole game of this exam.</P>
        <Key>Untimed + solo + your six: the conditions are the lesson. You are practicing retrieval of the full loop — statement to accepted submission — without interference.</Key>
      </div>) },
    { kind: "concept", title: "The per-problem loop, in full",
      body: (<div className="space-y-3">
        <P>Each of the six gets the same five-beat loop. Write the loop down once and reuse it verbatim — the ritual is what keeps you from skipping the beats that catch bugs.</P>
        <Chain items={[
          <span><strong>Contract.</strong> Re-read the statement and state it as: input (types, ranges), output (exactly what), and the <em>constraints</em>. The constraints line is where the complexity budget lives — lesson 10 in disguise.</span>,
          <span><strong>Budget.</strong> From n (and q, and time limit) derive the maximum operations allowed — ~10⁸ per second is the rule of thumb. Then check your tagged technique fits: n = 2·10⁵ with 2·10⁵ queries means O(n·q) is dead and O(n + q) (prefix sums) is required.</span>,
          <span><strong>Plan in one sentence.</strong> "Prefix array P, answer P[r]−P[l−1]." If the sentence needs an "and then…", you have two plans — split them. A one-sentence plan is testable in your head against the sample before you type.</span>,
          <span><strong>Code, then trace by hand.</strong> Write the code, then run the first sample <em>on paper</em>, variable by variable (the Trace-table habit from Phase I). Half of all wrong submissions die here, for free.</span>,
          <span><strong>Edges, then submit.</strong> Walk your edge list: smallest input, largest input, all-equal elements, already-sorted / reverse-sorted, the boundary words from the statement ("at least", "strictly"). Only then submit.</span>,
        ]} />
        <P>That's ~25 focused minutes per problem for six problems — a full, honest study day. Speed comes later, from repetition of exactly this loop, not from rushing it now.</P>
      </div>) },
    { kind: "worked", title: "Beat 2 in action: reading a budget",
      body: (<div className="space-y-3">
        <P>The budget beat deserves a concrete walkthrough because it's where shape-tags turn into actual algorithm choices. Read the constraints line the way a judge reads it:</P>
        <Trace
          head={["constraints", "budget", "what survives"]}
          rows={[
            ["n ≤ 100", "~10⁸ ops", "anything — even O(n⁴); don't be clever"],
            ["n ≤ 5,000", "~10⁸ ops", "O(n²) comfortably; O(n² log n) borderline"],
            ["n ≤ 2·10⁵", "~10⁸ ops", "O(n log n) or O(n); O(n²) is a guaranteed TLE"],
            ["n ≤ 2·10⁵, q ≤ 2·10⁵", "~10⁸ ops", "per-query work must be O(log n) or O(1)"],
            ["n ≤ 10⁹", "—", "no loop over n at all — closed form or log steps"],
          ]} />
        <P>The last row is the one that separates the exams: an n up to 10⁹ is the problem-setter <em>telling you</em> the answer is a formula or a logarithmic process (lessons 3 and 26). When you see it in beat 2, you've already eliminated every simulate-the-input approach — before writing anything.</P>
      </div>) },
    { kind: "concept", title: "The stuck protocol",
      body: (<div className="space-y-3">
        <P>Even your best six will include a moment where you're stuck. Decide the protocol <em>before</em> the session, because the wrong protocol is chosen by panic: twenty silent minutes staring at the screen, then reading the editorial, then feeling like a fraud. Instead:</P>
        <Chain items={[
          <span><strong>0–20 min stuck:</strong> re-read the statement (most "impossible" problems are misread constraints), re-derive the budget, hand-trace the sample looking for the invariant you assumed wrong.</span>,
          <span><strong>20–35 min stuck:</strong> write down the two candidate shapes and what would make each one fail. Forcing the failure analysis usually surfaces the trick — and if it doesn't, you now have a precise question for the upsolve.</span>,
          <span><strong>35 min:</strong> park it. Write one line: where you are and what you tried. Move to the next of your six. Return at the end if time remains. The park-note makes lesson 42 dramatically more productive.</span>,
        ]} />
        <P>Sunk cost is the enemy of a six-problem session: every extra ten minutes on a parked problem is stolen from a problem you <em>could</em> have banked.</P>
      </div>) },
    { kind: "bug", title: "The three session-killers",
      body: (<div className="space-y-3">
        <Gotcha>Peeking at the editorial mid-attempt, "just to check the direction". You've now converted a retrieval session into a recognition session — the exact opposite of what builds exam strength. The editorial is for lesson 42, period.</Gotcha>
        <Gotcha title="the other two">Skipping the hand-trace because the code "obviously works" — it is not obvious, and the trace is the cheapest debugging you will ever buy. And submitting without the edge walk: the sample is written to be passed; the hidden tests are written to catch exactly the edges you didn't check.</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Recite the five beats of the per-problem loop. Then: what are the three time thresholds of the stuck protocol, and what do you write down when you park a problem?" /> },
  ],

  /* ————— 42 · editorial-guided upsolve ————— */
  "p4-42": [
    { kind: "context", title: "The exam measured you; the upsolve teaches you",
      body: (<div className="space-y-3">
        <P>Here's the uncomfortable truth about competitive programming: <strong>almost no learning happens during the contest</strong>. The contest measures what you already had. The learning happens in the upsolve — the deliberate re-engagement with every problem that beat you, now that the pressure is off. Teams that contest without upsolving plateau at their current level forever; a single disciplined upsolve session extracts more growth than three more contests.</P>
        <P>Your upsolve targets are: the problems from your six that failed, plus any parked problem where your park-note says the shape was right. Not the whole paper — upsolving everything is a classic guilt ritual that teaches little because most of it was never in your reach today.</P>
        <Key>An upsolve is not reading the editorial and nodding. It is: extract the key idea, close the page, finish the problem yourself, then diagnose why the idea wasn't yours yet.</Key>
      </div>) },
    { kind: "concept", title: "How to read an editorial without being poisoned by it",
      body: (<div className="space-y-3">
        <P>Editorials are written for people who already almost solved the problem — they compress away exactly the part you need. So read them <em>defensively</em>, in two stages:</P>
        <Chain items={[
          <span><strong>Stage 1 — hunt the insight, stop at the insight.</strong> Read until you can name the key move in one sentence: "oh — it's a prefix sum over the diff array" or "the answer is monotone in k, so binary search it". The moment you have that sentence, <strong>close the editorial</strong>. Do not read their code yet.</span>,
          <span><strong>Stage 2 — finish it yourself.</strong> With only the insight sentence, go run your full five-beat loop (lesson 41) on the problem: budget, plan, code, hand-trace, edges. You will hit implementation details the editorial glossed over — good, those details are where the real learning lives.</span>,
          <span><strong>Stage 3 — diff, then file.</strong> Only now open their solution. Compare approaches. Where theirs is cleaner, ask <em>what tag would have made me see it</em> — that tag goes into your classification vocabulary for lesson 40.</span>,
        ]} />
        <P>Reading the whole editorial first and then "implementing it" is the most common upsolve failure: it feels productive, produces a green submission, and teaches almost nothing, because you never had to <em>retrieve</em> anything. The green bar is not the point. The retrieval is the point.</P>
      </div>) },
    { kind: "concept", title: "The failure taxonomy — know which bucket you fell in",
      body: (<div className="space-y-3">
        <P>Every failed problem belongs to exactly one of three buckets, and each bucket has a different remedy. Labeling honestly is the core skill of the upsolve — "I'm bad at this" is not a diagnosis, it's a mood.</P>
        <Trace
          head={["bucket", "signature", "remedy"]}
          rows={[
            ["misread", "your solution solves a slightly different problem; sample #2 already contradicted you", "slow down beat 1; re-write the contract by hand before planning"],
            ["wrong shape", "the technique you reached for cannot meet the budget; the editorial's insight is a shape you sort-of know", "re-drill that lesson's retrieval prompts; add its exam-tell to your tags"],
            ["implementation bug", "right shape, right plan, wrong code — often an off-by-one you'd have caught by hand-tracing", "make the hand-trace non-negotiable; add the specific edge to your edge list forever"],
          ]} />
        <P>Notice the asymmetry: <em>misread</em> and <em>implementation</em> failures are fixable with process changes you control tomorrow. <em>Wrong shape</em> failures are the only ones that need new teaching — which is what this notebook is for. If your upsolve log shows mostly wrong-shape failures, you're under-drilled on Phases II–III; if mostly implementation failures, you're skipping beats 4 and 5.</P>
      </div>) },
    { kind: "worked", title: "The upsolve log",
      body: (<div className="space-y-3">
        <P>Keep one table per exam cycle, forever. It becomes the most honest document of your preparation — and the night before the real exam, re-reading your own failure log beats re-reading any lesson.</P>
        <Trace
          head={["problem", "bucket", "root cause, one sentence", "drill"]}
          rows={[
            ["2022-C", "wrong shape", "saw 'intervals' but not 'sort by end time'", "lesson 33 retrieval, twice this week"],
            ["2022-E", "implementation", "closed the last run only inside the loop", "add 'finalize after loop' to my edge list"],
            ["2022-K", "misread", "budget said n ≤ 10⁹; I looped over n anyway", "re-read constraints in red pen before planning"],
          ]} />
        <P>The "drill" column is the point of the whole table: every row ends in a concrete, scheduled action. An upsolve log without actions is a diary.</P>
      </div>) },
    { kind: "bug", title: "Upsolve failure modes",
      body: (<div className="space-y-3">
        <Gotcha>Upsolving the same day, exhausted, at midnight. Insight extraction needs a fresh head — schedule the upsolve for the next morning, when the contest memory is warm but the fatigue is gone.</Gotcha>
        <Gotcha title="the other two">Copying the editorial's code character by character to get the green. You've practiced typing, not problem solving — and you'll recognize nothing next time. And upsolving beyond your six-plus-parked set: diminishing returns, real fatigue, and it crowds out the drills that would actually move your classification speed.</Gotcha>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="What are the three stages of defensive editorial reading, and at what exact moment do you close the page? Name the three failure buckets and one remedy for each." /> },
  ],

  /* ————— 43 · the cycle on 2023 ————— */
  "p4-43": [
    { kind: "context", title: "Second paper, less hand-holding",
      body: (<div className="space-y-3">
        <P>The 2022 cycle taught you the protocol. The 2023 cycle tests whether the protocol is yours: same three lessons — classify (40), attempt your six (41), upsolve (42) — on a paper whose tricks you haven't dissected yet. Expect it to feel different, not harder: every paper has its own personality, and learning to read a new personality quickly is itself an exam skill.</P>
        <P>One warning before you start: the trap of the second paper is <strong>autopilot</strong> — running the passes by rote while your attention is elsewhere. Classification only works if pass 1 is genuinely fresh reading. If you catch yourself writing tags before finishing a statement, stop and re-read.</P>
      </div>) },
    { kind: "concept", title: "Scouting report: what 2023 leans on",
      body: (<div className="space-y-3">
        <P>You already know two anchors of this paper from Phase I, which tells you a lot about its personality:</P>
        <Chain items={[
          <span><strong>Problem A is Altura Mínima</strong> — count how many of n heights clear a bar (lessons 1–2). It's the canonical warm-up shape, which means the paper opens gently and expects you to bank it in minutes. If your classification doesn't rank it first, re-check your tags before trusting anything else.</span>,
          <span><strong>The streaming angle is live.</strong> Lesson 2 exists because 2023-A can be solved without storing the array. Papers that admit a streaming solution often have sibling problems with the same minimum-state flavor — during pass 2, actively ask "do I need to keep this input, or just visit it?" on every problem.</span>,
          <span><strong>Expect the medium problems to reuse Phase-II shapes.</strong> If the paper's easy problems are counting/streaming, its medium tier is very likely prefix sums, sorting, or two pointers — the shapes that sit one step up the same ladder. Tag those fast and attempt them before anything exotic.</span>,
        ]} />
        <P>That's the whole scouting method: take what you know about the paper, infer what its medium tier probably is, and let your classification confirm or correct the inference. Never arrive with a fixed plan — arrive with hypotheses.</P>
      </div>) },
    { kind: "worked", title: "The cycle, scheduled",
      body: (<div className="space-y-3">
        <P>Run the cycle across three sittings, not one marathon — separation is what keeps each phase honest:</P>
        <Trace
          head={["sitting", "length", "job", "artifact"]}
          rows={[
            ["1 · classify", "20–30 min", "passes 1–3 on 2023, no code open", "12-row tag table with attack order"],
            ["2 · attempt", "2.5–3 h", "your six, five-beat loop each, untimed solo", "submissions + park-notes"],
            ["3 · upsolve", "next morning, 1–2 h", "failed six + parked, defensive editorial reading", "upsolve log rows with drills"],
          ]} />
        <P>Compare your 2023 tag table with your 2022 one before the attempt sits down: same tags appearing? That's your stable vocabulary. New tags? Those are the lessons this paper is about to teach you — note them, they'll show up in the log.</P>
      </div>) },
    { kind: "bug", title: "Repetition failure modes",
      body: (<div className="space-y-3">
        <Gotcha>Grading yourself against 2022 ("I solved 4 last time, so 4 is fine"). The papers are different; the only valid comparison is process fidelity — did you run all three passes, all five beats, a real upsolve? Points follow process, at this stage, not the other way around.</Gotcha>
        <P>And its twin: treating a better score as proof you can skip the upsolve. The upsolve is where the 2023-specific shapes enter your vocabulary — skipping it means the 2024 cycle starts from the same place this one did.</P>
      </div>) },
    { kind: "retrieval", title: "Before you open the paper",
      body: <Recall prompt="Without notes: the three passes, the five beats, the three upsolve stages. If any of the three lists is fuzzy, re-read lessons 40–42 first — running the cycle on a fuzzy protocol just practices the fuzz." /> },
  ],

  /* ————— 44 · the cycle on 2024 ————— */
  "p4-44": [
    { kind: "context", title: "Third paper: the algebra paper",
      body: (<div className="space-y-3">
        <P>By now the protocol should feel like yours, which means this cycle's job shifts: 2024 is where you test <em>flexibility</em>. Its known anchors lean on the algebraic side of Phase I–II — noticing when a problem wants a formula, not a simulation, is the meta-skill this paper rewards.</P>
        <P>The autopilot warning from lesson 43 doubles here. Third time through a routine is exactly when attention drifts — and a drifted pass 1 produces confident wrong tags, the most expensive error in classification.</P>
      </div>) },
    { kind: "concept", title: "Scouting report: what 2024 leans on",
      body: (<div className="space-y-3">
        <Chain items={[
          <span><strong>Problem A is Atenção à Reunião</strong> — an integer-division problem (lesson 3): the answer is a floor of a quotient, and the trap is the tempting-but-wrong "+1 to be safe". If your tag table puts a simulation approach on it, re-derive before coding: simulate the sample, notice the pattern, then ask what single expression produces it.</span>,
          <span><strong>Problem E is Estojo de Joias</strong> — landmarks instead of simulation (lesson 13). This is the paper signaling that its medium tier punishes O(n·k) simulation of many intervals. When pass 2 shows you intervals or ranges with big bounds, your hand should move toward "where does the state CHANGE?" before "how do I simulate it?".</span>,
          <span><strong>The unifying tell: large bounds + simple answers.</strong> Whenever 2024 hands you n or coordinates up to 10⁹ with an answer that's a single number, it is advertising lesson 3 and lesson 26 territory — closed forms and binary search on the answer. Train yourself to feel that combination as a pattern, not a coincidence.</span>,
        ]} />
      </div>) },
    { kind: "worked", title: "Running the cycle, third time",
      body: (<div className="space-y-3">
        <P>Same three sittings as lesson 43 — classify, attempt, upsolve — with two upgrades specific to your third cycle:</P>
        <Chain items={[
          <span><strong>Time your classification.</strong> You're allowed to care about speed now: passes 1–3 should fit in ~15 minutes. If they don't, your tag retrieval is slow — that's a Phase-III drill problem, not a 2024 problem.</span>,
          <span><strong>Cross-file your logs.</strong> After the upsolve, merge the 2022/2023/2024 logs and re-bucket every row. Watch the bucket ratios migrate: implementation failures should be shrinking (process is sticking); wrong-shape failures should be concentrating on specific lessons (your curriculum for next week writes itself).</span>,
        ]} />
        <P>The merged log is the most honest study plan you will ever own. Trust it over any instinct about what to review.</P>
      </div>) },
    { kind: "bug", title: "The confident-wrong trap",
      body: (<div className="space-y-3">
        <Gotcha>Tagging from pattern-matching on problem titles or shapes of previous years instead of reading this statement. Papers know their predecessors; problem setters actively write problems that look like last year's easy problem and aren't. The statement is the only authority — re-read it every pass.</Gotcha>
        <P>Concretely: if a 2024 problem looks exactly like Altura Mínima, verify the counting rule word by word ("at least" vs "strictly more than" has flipped outcomes before). Five slow seconds in pass 1 save a wrong submission and its penalty.</P>
      </div>) },
    { kind: "retrieval", title: "Before you open the paper",
      body: <Recall prompt="What two 2024 problems do you already know, and which lesson is each one? What does 'large bounds + simple answer' tell you to try first? And what two upgrades does the third cycle add?" /> },
  ],

  /* ————— 45 · the cycle on 2025 ————— */
  "p4-45": [
    { kind: "context", title: "Fourth paper: the arrays-in-disguise paper",
      body: (<div className="space-y-3">
        <P>The 2025 cycle is the last rehearsal before the milestone, so it carries an extra job: <strong>calibrating your own readiness signal</strong>. By now the protocol is automatic; what you're testing is whether your tag vocabulary covers a fresh paper's personality without a scouting report to lean on.</P>
        <P>This paper's known anchors sit squarely in the "arrays in disguise" family — the Phase-I skill of seeing that a problem is about indexers, not about the story it tells.</P>
      </div>) },
    { kind: "concept", title: "Scouting report: what 2025 leans on",
      body: (<div className="space-y-3">
        <Chain items={[
          <span><strong>Problem A is Alimentação saudável</strong> — one summary per column, the matrix you never store (lesson 5). The tell is in the ask: per-column answers from row-streamed input. If pass 2 tags it "2D array", re-read the output format — the output is one number per column, and that decides the storage, not the input's shape.</span>,
          <span><strong>Problem J is João João</strong> — presence vs frequency, direct indexing (lesson 6). The tell: IDs as small integers and a question about "which ones appeared / how many times". The moment keys are small and dense, an array indexed by key beats every other structure — speed and simplicity together.</span>,
          <span><strong>The unifying tell: the output shape dictates the state.</strong> Both anchors reward asking "what does the answer look like?" before "what does the input look like?" — one answer per column → an array of per-column summaries (here: healthy flags); membership per ID → a presence array. Carry that question into every 2025 problem in pass 2.</span>,
        ]} />
      </div>) },
    { kind: "worked", title: "The cycle, with a readiness meter",
      body: (<div className="space-y-3">
        <P>Run the standard three sittings, but attach three measurements — these are the inputs to your milestone decision in lesson 46:</P>
        <Trace
          head={["measure", "how", "readiness reading"]}
          rows={[
            ["classification time", "clock passes 1–3", "< 15 min → vocabulary is fluent"],
            ["six selection accuracy", "after the attempt: how many of your six were truly your best six", "≥ 5 of 6 → selection instinct is calibrated"],
            ["failure bucket ratio", "from the upsolve log", "implementation ≤ wrong-shape → process is holding"],
          ]} />
        <P>None of these are scores — they're dials. Three dials in the green zone means lesson 46 is a formality; any dial in the red means you know exactly which phase to re-drill before the milestone, instead of guessing.</P>
      </div>) },
    { kind: "bug", title: "Last-rehearsal failure modes",
      body: (<div className="space-y-3">
        <Gotcha>Treating 2025 as "just another cycle" and skipping the measurements. The cycle without measurements produces a feeling ("I think I'm ready") instead of evidence — and feelings evaporate under exam conditions. Write the three numbers down.</Gotcha>
        <P>And the opposite error: letting one bad sitting panic you into re-drilling everything. One dial red is a diagnosis, not a verdict — fix that one dial, re-measure, move on.</P>
      </div>) },
    { kind: "retrieval", title: "Before you open the paper",
      body: <Recall prompt="Which two 2025 problems do you know, and what is the shared tell that spots their family? What three numbers will this cycle produce for the milestone decision?" /> },
  ],

  /* ————— 46 · milestone check ————— */
  "p4-46": [
    { kind: "context", title: "The gate",
      body: (<div className="space-y-3">
        <P>Everything so far has been training with the lights on: scouting reports, untimed sittings, editorial safety nets. The milestone removes the nets on purpose. You take a <strong>fresh</strong> paper — one you have never classified, never seen tags for — and solve 5–6 of its easiest problems, untimed, alone, using nothing but what's installed. Pass, and you've proven the actual goal of this entire notebook: <em>independent</em> conversion of easy problems into points. Fail, and you've bought the most valuable diagnostic of the sprint, because it tells you exactly which independence is missing.</P>
        <P>Two integrity rules, because the milestone is only worth what it measures: the paper must be genuinely fresh (a year you haven't cycled — or a regional from another state), and you don't look up anything during it. Notes, lessons, editorials: all closed. The milestone tests retrieval, and retrieval can't be faked retroactively.</P>
        <Key>Pass = 5–6 solved, untimed, alone, fresh paper, nothing open. The number is less important than the independence — four solved with total ownership beats six solved by pattern-matching hints you half-remember.</Key>
      </div>) },
    { kind: "concept", title: "The protocol",
      body: (<div className="space-y-3">
        <P>It's the lessons 40–42 protocol, run cold, plus instrumentation:</P>
        <Chain items={[
          <span><strong>Classify, cold.</strong> Passes 1–3, no scouting report, no prior tags. Time it. This is the cleanest measurement of your vocabulary you'll ever get — every tag that surfaces is genuinely yours.</span>,
          <span><strong>Attempt your six.</strong> Five-beat loop per problem, park-notes when stuck. Record start/end time per problem — not to pressure yourself, but because the time-per-solved data is what makes a failure interpretable later.</span>,
          <span><strong>Count honestly.</strong> A problem counts only if your submission would be accepted: sample-verified, edges walked, no "it basically works". The milestone is about exam reality, and exam reality has hidden tests.</span>,
        ]} />
        <P>No upsolve on milestone day. Let the failures sit untouched until the diagnosis below — upsolving first would contaminate the diagnostic with hindsight.</P>
      </div>) },
    { kind: "worked", title: "Reading the result",
      body: (<div className="space-y-3">
        <P>Whatever the count, the interpretation runs through two axes — and each corner prescribes a different next week:</P>
        <Trace
          head={["result", "signature", "next move"]}
          rows={[
            ["pass, fast", "5–6 solved, classification < 15 min", "book lesson 47 — the timed mock"],
            ["pass, slow", "5–6 solved but classification dragged or problems took 40+ min each", "mock is fine to attempt; drill classification speed and the five-beat ritual in parallel"],
            ["fail on shapes", "solved < 5 and the upsolve-bound log says wrong-shape", "re-drill the named Phase II–III lessons; repeat the milestone in one week"],
            ["fail on execution", "right tags, plans written, died in code or edges", "slow the beats down: hand-trace and edge-walk become mandatory rituals; repeat in one week"],
          ]} />
        <P>Notice both failure rows end in "repeat in one week" with a <em>specific</em> drill. The milestone is a compass, not a verdict — its whole value is in which row you land on.</P>
      </div>) },
    { kind: "bug", title: "Gaming the gate",
      body: (<div className="space-y-3">
        <Gotcha>Picking the friendliest available paper, or one you've half-seen. A gamed pass is worse than an honest fail: it sends you to the timed mock carrying a false readiness signal, and timed practice on top of false confidence is where bad exam habits get cemented.</Gotcha>
        <P>And the kinder cousin of the same bug: doing the milestone "just to see" with notes open beside the screen. If the conditions aren't the conditions, the number is noise. Set the phone in another room, close the notebook, earn the number.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="State the pass criterion in full — all five conditions. Then: for each of the four result rows, what is the next move?" /> },
  ],

  /* ————— 47 · the timed mock ————— */
  "p4-47": [
    { kind: "context", title: "Performance practice, at last",
      body: (<div className="space-y-3">
        <P>You passed the milestone, which means the retrieval pathways exist. Now — and only now — you practice <em>performance</em>: five hours, real clock, real stakes-feeling, one full paper. The ordering matters more than it sounds. Timed practice before mastery trains you to skip the hand-trace, abandon the edge-walk, and panic-select problems — encoding exactly the habits the untimed months were built to install. Timed practice after mastery does the opposite: it stress-tests the protocol and shows you where it bends.</P>
        <P>You're a team of one, which makes this mock harder than the real exam in one way (no one to parallelize with) and easier in another (no coordination overhead). The protocol below turns the solitude into a structure instead of a handicap.</P>
        <Key>The mock doesn't teach new problem solving — it teaches pacing, selection under pressure, and recovery. Those are separate skills, and they only exist when a clock is running.</Key>
      </div>) },
    { kind: "concept", title: "The five-hour structure",
      body: (<div className="space-y-3">
        <P>Solo mock, three roles, rotated on a timer. The rotation is the trick: it stops the classic solo failure of coding for three hours straight while the planner starves.</P>
        <Trace
          head={["window", "role", "job"]}
          rows={[
            ["0:00–0:30", "planner", "full classification of the paper; attack order fixed; easy points identified"],
            ["0:30–1:30", "coder", "bank the 2–3 sure points from the order; submit early"],
            ["1:30–4:30", "coder + planner alternating 40 min", "work down the order; planner windows re-rank remaining problems with fresh eyes"],
            ["4:30–5:00", "reviewer", "re-check all unsubmitted work; submit anything complete; no new problems"],
          ]} />
        <P>The last thirty minutes are sacred. A working solution that never gets submitted scores exactly zero — and the reviewer window exists because "I'll submit it in a minute" is the sentence that kills more mock points than any algorithm. In the real exam, this window is also when you re-verify that every submission used the right file and the right language — boring, exam-winning boring.</P>
      </div>) },
    { kind: "concept", title: "Pressure rules, decided in advance",
      body: (<div className="space-y-3">
        <P>Under a real clock, decisions made in the moment are made by adrenaline. Decide these now, while calm, and obey the paper version of you:</P>
        <Chain items={[
          <span><strong>The 25-minute rule:</strong> no plan progress in 25 minutes → park, note, next problem. Tighter than the untimed 35-minute rule on purpose: the clock changed the economics.</span>,
          <span><strong>Submit at first green.</strong> A solution that passes the samples gets submitted immediately, even if you intend to "clean it up". You can always resubmit an improved version; you can't resubmit time.</span>,
          <span><strong>Debug on paper first.</strong> Wrong answer? Print the code (yes, physically, or open a blank editor and retype the suspect loop) and trace by hand before touching the keyboard. Editor-staring is how forty minutes evaporate.</span>,
          <span><strong>Never abandon a problem with work on it.</strong> Park-note = plan + what failed + next idea. A future you — even twenty minutes later — restarts from the note instead of from zero.</span>,
        ]} />
      </div>) },
    { kind: "worked", title: "The post-mortem",
      body: (<div className="space-y-3">
        <P>The mock is worth precisely one artifact: its post-mortem, written the same evening while the scars are fresh. Every problem gets a row — including the ones you solved, because "solved slowly" hides the same information as "failed":</P>
        <Trace
          head={["problem", "expected", "result", "gap", "fix"]}
          rows={[
            ["A", "solved, 10 min", "solved, 35 min", "re-read statement twice; missed constraint", "budget beat: read constraints in red pen"],
            ["C", "solved, 20 min", "WA ×2 then solved, 50 min", "off-by-one on range end; no hand-trace", "trace beat is non-negotiable under clock too"],
            ["G", "attempt", "parked at 25 min, never returned", "planner never re-ranked; order stale by hour 3", "planner windows actually rotate"],
          ]} />
        <P>Read the fix column aloud. If a fix is a feeling ("be faster"), it's not a fix — rewrite it as a rule or a drill until it's executable. Your second mock, a week or two later, exists to measure whether those fixes held.</P>
      </div>) },
    { kind: "retrieval", title: "Check it stuck",
      body: <Recall prompt="Recite the four windows of the five-hour structure and the four pressure rules. Why does the timed mock come after the milestone and never before?" /> },
  ],
};
