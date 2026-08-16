/* ————————————————————————————————————————————————
   The problem sheets. Every problem a lesson references lives here,
   so the judge's contract is read ON THE SITE, not googled.

   `reconstruction: true` marks statements rebuilt from the syllabus'
   pedagogical anchors when the official text couldn't be verified
   word-for-word — always with a link to the official source.
   ———————————————————————————————————————————————— */

export interface Problem {
  id: string;
  source: string;        // contest / judge label
  title: string;
  limits: string;        // time · memory
  link: string;          // official statement / judge page
  statement: string[];   // paragraphs
  input: string;
  output: string;
  constraints: string[];
  samples: { in: string; out: string }[];
  tell: string;          // how to spot this shape on exam paper
  reconstruction?: boolean;
}

const beecrowdSearch = (q: string) =>
  `https://www.beecrowd.com.br/judge/pt/search?q=${encodeURIComponent(q)}`;

export const PROBLEMS: Record<string, Problem> = {
  sbc2023a: {
    id: "sbc2023a",
    source: "Maratona SBC · 2023 · Fase 1 · A",
    title: "Altura Mínima",
    limits: "1 s · 256 MB",
    link: beecrowdSearch("Altura Mínima"),
    statement: [
      "A youth basketball club is holding tryouts. N players show up, and the coach keeps only the players whose height is at least H centimeters.",
      "Write a program that reads the players' heights and prints how many of them are selected.",
    ],
    input:
      "The first line contains two integers N and H — the number of players and the minimum height. The second line contains N integers, the height of each player.",
    output: "One integer — how many players have height at least H.",
    constraints: ["1 ≤ N ≤ 100", "100 ≤ H ≤ 200", "each height is between 100 and 200"],
    samples: [{ in: "4 160\n152 171 140 180", out: "2" }],
    tell: "“count the elements that satisfy a predicate” — visit each value once; the count is the only state worth keeping.",
    reconstruction: true,
  },

  sbc2024a: {
    id: "sbc2024a",
    source: "Maratona SBC · 2024 · Fase 1 · A",
    title: "Atenção à Reunião",
    limits: "1 s · 256 MB",
    link: beecrowdSearch("Atenção à Reunião"),
    statement: [
      "The course coordinator has T minutes before a mandatory meeting starts. She wants to warn students about it, one conversation at a time; each conversation takes exactly K minutes, and she can only start a new one after finishing the previous.",
      "Print how many students she can fully warn before the meeting begins.",
    ],
    input: "One line with two integers T and K — the minutes available and the minutes each conversation takes.",
    output: "One integer — the maximum number of complete conversations that fit in the time.",
    constraints: ["1 ≤ T ≤ 10⁹", "1 ≤ K ≤ 10⁹"],
    samples: [
      { in: "47 5", out: "9" },
      { in: "30 30", out: "1" },
    ],
    tell: "uniform chunks filling a budget → the answer is a single integer division ⌊T/K⌋. If your first instinct is a loop, the loop is the bug.",
    reconstruction: true,
  },

  sbc2022a: {
    id: "sbc2022a",
    source: "Maratona SBC · 2022 · Fase 1 · A · beecrowd 3424",
    title: "Achando os Monótonos Não-Triviais Maximais",
    limits: "1 s · 256 MB",
    link: "https://www.beecrowd.com.br/judge/pt/problems/view/3424",
    statement: [
      "A monotone non-trivial maximal run is a contiguous stretch of the sequence that is entirely non-decreasing or entirely non-increasing, has length at least 2, and cannot be extended in either direction while keeping that property.",
      "Given a sequence of N integers, print the length of the longest such run. If the sequence has none (it zigzags strictly), print 0.",
    ],
    input: "The first line contains N, the size of the sequence. The second line contains N integers.",
    output: "One integer — the length of the longest monotone non-trivial maximal run.",
    constraints: ["1 ≤ N ≤ 10⁵", "|value| ≤ 10⁹"],
    samples: [
      { in: "6\n1 3 2 2 5 1", out: "3" },
      { in: "4\n1 3 2 4", out: "2" },
    ],
    tell: "“longest run with property P” → walk once with a running counter — and the last run only exists after the loop ends. Forgetting the finalization is the classic wrong answer.",
    reconstruction: true,
  },

  sbc2025a: {
    id: "sbc2025a",
    source: "Maratona SBC · 2025 · Fase 1 · A",
    title: "Alimentação Saudável",
    limits: "1 s · 256 MB",
    link: beecrowdSearch("Alimentação Saudável"),
    statement: [
      "A nutrition study tracked N students for M days. For each student and each day, it recorded 1 if the student ate fruit that day and 0 otherwise.",
      "A day is considered healthy if ALL N students ate fruit on that day. Print how many healthy days there are.",
    ],
    input:
      "The first line contains N and M. The next N lines each contain M integers (0 or 1) — the records of one student across the M days.",
    output: "One integer — the number of days on which every student ate fruit.",
    constraints: ["1 ≤ N, M ≤ 100"],
    samples: [{ in: "3 4\n1 1 1 1\n1 0 1 1\n1 1 1 1", out: "3" }],
    tell: "“one yes/no summary per column” → keep one flag per day and never materialize the matrix. The OUTPUT shape — one verdict per day — dictates the storage, not the grid shape of the input.",
    reconstruction: true,
  },

  sbc2025j: {
    id: "sbc2025j",
    source: "Maratona SBC · 2025 · Fase 1 · J",
    title: "João João",
    limits: "1 s · 256 MB",
    link: beecrowdSearch("João João"),
    statement: [
      "João has M friends, numbered 1 to M, and today he called some of them — possibly the same friend several times, possibly some never at all. You are given the list of friends he called, in order.",
      "Print how many distinct friends received at least one call.",
    ],
    input:
      "The first line contains N and M — the number of calls made and the total number of friends. The second line contains N integers between 1 and M, the friend called each time.",
    output: "One integer — the number of distinct friends called at least once.",
    constraints: ["1 ≤ N ≤ 10⁵", "1 ≤ M ≤ 10⁶"],
    samples: [{ in: "6 5\n3 1 3 5 1 3", out: "3" }],
    tell: "“did this value ever appear?” with small keys → a presence array indexed by the value itself. Presence (bool) beats frequency (counter) when counts are never asked.",
    reconstruction: true,
  },

  cf734a: {
    id: "cf734a",
    source: "Codeforces · 734A",
    title: "Anton and Danik",
    limits: "2 s · 256 MB",
    link: "https://codeforces.com/problemset/problem/734/A",
    statement: [
      "Anton and Danik played n games of chess. Every game was won by exactly one of them: the results are given as a string where 'A' means Anton won the game and 'D' means Danik won it.",
      "Print who won more games: \"Anton\", \"Danik\", or \"Friendship\" if they won the same number.",
    ],
    input: "The first line contains n. The second line contains a string of n characters, each 'A' or 'D'.",
    output: "One word: Anton, Danik, or Friendship.",
    constraints: ["1 ≤ n ≤ 100 000"],
    samples: [
      { in: "6\nADAAAA", out: "Anton" },
      { in: "4\nADDA", out: "Danik" },
      { in: "4\nADAD", out: "Friendship" },
    ],
    tell: "the string is the input stream — two counters, one pass, no storage. This is the unguided transfer of the Altura Mínima pattern to a character stream.",
  },

  cses1646: {
    id: "cses1646",
    source: "CSES · 1646",
    title: "Static Range Sum Queries",
    limits: "1 s · 512 MB",
    link: "https://cses.fi/problemset/task/1646",
    statement: [
      "Given an array of n integers, your task is to process q queries of the form: what is the sum of values in range [a, b]?",
      "The array never changes between queries — \"static\" is the word doing all the work in this title.",
    ],
    input:
      "The first line has n and q. The next line has n integers x₁…xₙ. Then q lines follow, each with a range [a, b] (1-indexed, inclusive).",
    output: "For each query, print the sum of values in the range.",
    constraints: ["1 ≤ n, q ≤ 2·10⁵", "1 ≤ xᵢ ≤ 10⁹", "1 ≤ a ≤ b ≤ n"],
    samples: [
      { in: "8 3\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8", out: "11\n2\n24" },
    ],
    tell: "“many range-sum queries on data that never changes” → pay O(n) once for prefix sums; every query becomes two subtractions. q·n = 4·10¹⁰ is the trap; O(n+q) is the door.",
  },

  lc303: {
    id: "lc303",
    source: "LeetCode · 303",
    title: "Range Sum Query — Immutable",
    limits: "interface-graded",
    link: "https://leetcode.com/problems/range-sum-query-immutable/",
    statement: [
      "Implement a class NumArray: the constructor receives an integer array nums, and the method sumRange(left, right) returns the sum of the elements between indices left and right, inclusive.",
      "The same instance answers up to 10⁴ sumRange calls — which is the entire reason this problem exists. It is CSES 1646 wearing an object-oriented costume.",
    ],
    input: "Constructor: int[] nums. Queries: sumRange(int left, int right) with 0 ≤ left ≤ right < nums.length.",
    output: "The inclusive sum for each query.",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−10⁵ ≤ nums[i] ≤ 10⁵", "up to 10⁴ calls to sumRange"],
    samples: [
      {
        in: 'NumArray([-2, 0, 3, -5, 2, -1])\nsumRange(0, 2)\nsumRange(2, 5)\nsumRange(0, 5)',
        out: "1\n-1\n-3",
      },
    ],
    tell: "the constructor is the build phase — it may cost O(n), because every later call must be O(1). Negative values mean you can't argue from monotonicity, only from the telescoping identity.",
  },

  lc304: {
    id: "lc304",
    source: "LeetCode · 304",
    title: "Range Sum Query 2D — Immutable",
    limits: "interface-graded",
    link: "https://leetcode.com/problems/range-sum-query-2d/",
    statement: [
      "Implement NumMatrix: the constructor receives a 2D matrix, and sumRegion(row1, col1, row2, col2) returns the sum of the elements inside the rectangle with those corners, inclusive.",
      "One extra dimension, one extra inclusion–exclusion term: the 2D prefix P[r][c] covers the whole rectangle from the origin, and every query subtracts two rectangles and adds back the overlap.",
    ],
    input: "Constructor: int[][] matrix. Queries: sumRegion(row1, col1, row2, col2), corners inclusive.",
    output: "The rectangle sum for each query.",
    constraints: ["matrix dimensions up to 200 × 200", "−10⁵ ≤ cell ≤ 10⁵", "up to 10⁴ calls"],
    samples: [
      {
        in: "matrix = [[3,0,1],[5,1,2]]\nsumRegion(0, 0, 1, 2)",
        out: "12",
      },
    ],
    tell: "“rectangle sums, repeated, data frozen” → 2D prefix sums; the query is P[r2][c2] − P[r1−1][c2] − P[r2][c1−1] + P[r1−1][c1−1]. Draw the rectangles once and the signs stop being mysterious.",
  },

  cses1640: {
    id: "cses1640",
    source: "CSES · 1640",
    title: "Sum of Two Values",
    limits: "1 s · 512 MB",
    link: "https://cses.fi/problemset/task/1640",
    statement: [
      "You are given an array of n integers and a target x. Find two positions whose values add up to x — or report that no such pair exists.",
      "Positions matter (print 1-indexed indices, any valid pair), and n is up to 2·10⁵, so the O(n²) all-pairs scan is out. The array is NOT given sorted — part of the exercise is deciding what order to look at it in.",
    ],
    input: "The first line has n and x. The second line has n integers a₁…aₙ.",
    output: "Two distinct positions (1-indexed) whose values sum to x, or IMPOSSIBLE.",
    constraints: ["1 ≤ n ≤ 2·10⁵", "1 ≤ x ≤ 10⁹", "1 ≤ aᵢ ≤ 10⁹"],
    samples: [{ in: "4 8\n2 7 5 1", out: "2 4" }],
    tell: "“pair with target sum” + one pass needed → sort-and-squeeze with two pointers (remembering original indices) or a hash set. The invariant: every discarded pointer position kills a whole family of pairs.",
  },
};

export function getProblems(ids?: string[]): Problem[] {
  if (!ids) return [];
  return ids.map((id) => PROBLEMS[id]).filter(Boolean);
}
