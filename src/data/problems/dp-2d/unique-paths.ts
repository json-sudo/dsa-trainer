import type { Problem } from '../../types'

export const uniquePaths: Problem = {
  id: 'unique-paths',
  leetcodeId: 62,
  title: 'Unique Paths',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'A robot starts at the top-left corner of an `m x n` grid and can only move **right** or **down**. Return the number of distinct paths to the bottom-right corner.',
  examples: [
    { input: 'm = 3, n = 7', output: '28' },
    { input: 'm = 3, n = 2', output: '3', explanation: 'Right→Down→Down, Down→Right→Down, Down→Down→Right.' },
  ],
  constraints: ['1 <= m, n <= 100', 'answer fits in a 32-bit integer'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: grid dimensions m (rows) and n (columns). Output: the count of distinct monotone (right/down only) paths from (0,0) to (m-1,n-1). No obstacles here — a pure counting grid.',
      rubric: ['Grid dims mapped to rows/cols correctly', 'Movement restricted to right/down noted'],
      teachingNote:
        'Confirm the move set out loud (right and down only, never left or up) — it is what makes this countable in closed form / DP at all, unlike a general grid walk.',
    },
    whatToFind: {
      modelAnswer:
        'The number of ways to reach any cell (i, j) equals the ways to reach it from above plus the ways to reach it from the left — every path to (i,j) arrives via exactly one of those two neighbors.',
      rubric: ['States the additive neighbor recurrence', 'Notes the two arrival directions are disjoint and exhaustive'],
      teachingNote:
        'Same "decompose by the last move" lever as 1D DP problems, just with two predecessor cells instead of two predecessor indices — grid DP is 1D DP with an extra axis.',
    },
    constraintsHint: {
      modelAnswer:
        'm, n ≤ 100 → grid has ≤ 10,000 cells, trivially small. A full O(m·n) DP table is cheap in both time and memory here, but it is worth naming that only the previous row is ever read, which motivates rolling it down to O(n) space.',
      rubric: ['Notes O(m*n) is trivial at this size', 'Flags that space can still be optimized regardless'],
      teachingNote:
        'Small constraints don\'t excuse skipping the space optimization in an interview — showing you *can* compress even when you don\'t strictly have to is a strong signal.',
    },
    bruteForce: {
      modelAnswer:
        'Recurse from (0,0): paths(i,j) = paths(i+1,j) + paths(i,j+1), base case at the target cell. Correct, but revisits the same (i,j) through many different route combinations — O(2^(m+n)) without memoization.',
      rubric: ['Recursive recurrence stated correctly', 'Names exponential blowup from re-visited cells'],
      teachingNote:
        'Ask the candidate to sketch two different paths that both pass through the same interior cell — that\'s the concrete proof of overlapping subproblems, not just an assertion.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The number of ways to reach a given cell is identical no matter which earlier path got you there — recomputing it per path is pure waste. Fill a table dp[i][j] = dp[i-1][j] + dp[i][j-1] bottom-up, once per cell. Pattern: 2D DP grid table.',
      rubric: ['Waste: recomputing an identical per-cell value along every path', 'Proposes bottom-up table fill'],
      acceptedPatterns: ['dp'],
      teachingNote:
        'This is the canonical "memoize a grid" story — worth explicitly contrasting with 1D DP: the state now has two coordinates, but the caching principle is unchanged.',
    },
    algorithm: {
      modelAnswer:
        'Since dp[i][j] only depends on the row above and the current row so far, keep a single length-n array. Initialize row = [1, 1, ..., 1] (first row: only one way, straight across). For each subsequent row, update row[j] += row[j-1] left to right (row[j] currently holds "from above", adding row[j-1] adds "from the left"). Return row[n-1]. O(m·n) time, O(n) space.',
      rubric: ['Rolling single-row array replaces the full 2D table', 'In-place left-to-right update reasoning correct', 'States O(m*n)/O(n)'],
      teachingNote:
        'The in-place trick (row[j] += row[j-1]) is subtle: row[j] still holds last row\'s value *until* it\'s overwritten, and left-to-right order guarantees row[j-1] is already this row\'s updated value when it\'s read. Walk through one row by hand.',
    },
    interviewScript: {
      modelAnswer:
        'Every path to (i,j) arrives from above or from the left, so dp[i][j] = dp[i-1][j] + dp[i][j-1], with the first row and column both all 1s. Naive recursion revisits shared cells exponentially; a full 2D table fixes that in O(m·n). Since each row only needs the row above, I collapse it to one rolling array of length n, updating left to right in place. O(m·n) time, O(n) space.',
      rubric: ['Template followed: recurrence, table, then space-optimized rolling array', 'Complexity stated'],
      teachingNote:
        'Landing explicitly on "O(n) not O(m·n) space" at the end is the differentiator between a pass and a strong pass on this problem.',
    },
  },
  incrementalBuild: [
    {
      label: '1. First row: only one way to reach any cell in it',
      code: 'const row = new Array(n).fill(1)   // straight across — one path each',
    },
    {
      label: '2. Full 2D idea first (for intuition): dp[i][j] = dp[i-1][j] + dp[i][j-1]',
      code: '// conceptually: dp[i][j] = dp[i-1][j] + dp[i][j-1]\n// but row above == row before this iteration overwrites it in place',
    },
    {
      label: '3. Roll the table down: reuse one array, update left to right',
      code: 'for (let i = 1; i < m; i++) {\n  for (let j = 1; j < n; j++) {\n    row[j] += row[j - 1]   // row[j] = from above (stale) + from left (fresh)\n  }\n}',
    },
    {
      label: '4. Bottom-right corner is the last cell of the final row',
      code: 'return row[n - 1]',
    },
  ],
  code: {
    signature: 'export function uniquePaths(m: number, n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [3, 7], expected: 28, label: 'example m=3,n=7' },
      { args: [3, 2], expected: 3, label: 'example m=3,n=2' },
      { args: [1, 1], expected: 1, label: 'single cell' },
      { args: [1, 10], expected: 1, label: 'single row', hidden: true },
      { args: [10, 1], expected: 1, label: 'single column', hidden: true },
      { args: [7, 3], expected: 28, label: 'transposed grid matches m=3,n=7', hidden: true },
    ],
    referenceSolution:
      'export function uniquePaths(m: number, n: number): number {\n  const row = new Array(n).fill(1)\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      row[j] += row[j - 1]\n    }\n  }\n  return row[n - 1]\n}\n',
    complexity: { time: 'O(m * n)', space: 'O(n)' },
  },
}
