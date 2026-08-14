import type { Problem } from '../../types'

export const numberOfIslands: Problem = {
  id: 'number-of-islands',
  leetcodeId: 200,
  title: 'Number of Islands',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'graphs',
  authored: true,
  statement:
    'Given an `m × n` grid of `"1"` (land) and `"0"` (water), return the number of **islands** — maximal groups of land cells connected horizontally or vertically.',
  examples: [
    { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: '2' },
    { input: 'grid = [["1","0","1","0"]]', output: '2' },
  ],
  constraints: ['1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a character grid up to 300×300 (9×10⁴ cells). Output: one integer — the count of connected land components under 4-adjacency (no diagonals).',
      rubric: ['4-adjacency (no diagonals) confirmed', 'Count of components, not their sizes'],
      teachingNote:
        'Grids are graphs in disguise: cells are vertices, adjacency is edges. Say that conversion out loud at the I/O step — it reframes the whole problem into known territory.',
    },
    whatToFind: {
      modelAnswer: 'Count connected components in an implicit graph. Group identification where only the number of groups matters.',
      rubric: ['Connected-components framing', 'Count-only output noted'],
      teachingNote:
        '"Maximal group of connected X" = component. Counting components has one canonical recipe: iterate all vertices, flood from each unvisited one, count the floods.',
    },
    constraintsHint: {
      modelAnswer:
        '9×10⁴ cells → an O(cells) traversal is required and sufficient. Recursion depth can reach 9×10⁴ on a fully-land grid — worth mentioning the iterative-stack alternative.',
      rubric: ['O(m·n) budget stated', 'Recursion-depth caveat on large solid regions'],
      teachingNote:
        'On grid problems, always translate the bound to *total cells* — 300×300 sounds small until a recursive flood on all-land hits stack limits. Naming that risk is a senior habit.',
    },
    bruteForce: {
      modelAnswer:
        'For each land cell, determine which island it belongs to by re-exploring from scratch and comparing against previously seen regions: repeated full floods, O((m·n)²) worst case.',
      rubric: ['Per-cell re-exploration described', 'States the quadratic blowup'],
      teachingNote:
        'The honest brute force here is awkward to even state — that awkwardness is informative. When "check each item against all groups" sounds painful, component-marking is usually the fix.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Re-exploring re-walks cells whose island membership was already decided — a flood from one cell *fully determines* its entire component in one pass. Flood once per unvisited land cell, marking as you go; the number of floods is the answer. Pattern: DFS (BFS equally valid).',
      rubric: ['Waste: revisiting already-classified cells', 'One-flood-per-component counting'],
      acceptedPatterns: ['dfs', 'bfs'],
      teachingNote:
        'DFS vs BFS is a free choice for component counting — say so, and pick by mechanics (DFS is shorter; BFS avoids deep recursion). Showing you know when the choice is arbitrary is itself signal.',
    },
    algorithm: {
      modelAnswer:
        'For each cell: if "1", increment the count and flood (DFS) from it, overwriting visited land with "0" (or a visited set). The flood recurses into 4 neighbors within bounds that are "1". Every cell is visited O(1) times. Time O(m·n), space O(m·n) worst-case stack.',
      rubric: [
        'Count-and-flood loop with in-place sink or visited set',
        'Bounds + land checks in the flood',
        'States O(m·n) time and worst-case space',
      ],
      teachingNote:
        'Sinking visited land to "0" doubles as the visited set — elegant, but say explicitly that you\'re mutating the input and would ask the interviewer if that\'s acceptable.',
    },
    interviewScript: {
      modelAnswer:
        'The grid is an implicit graph — cells as vertices, 4-adjacency as edges — and islands are its connected components. Rather than re-deriving membership per cell, I\'ll scan the grid and flood-fill from every unvisited land cell, sinking cells as I visit them; each flood is one island. Time O(m·n), space O(m·n) worst case for the flood. BFS instead of DFS if stack depth worries us at 300×300.',
      rubric: ['Template followed with the grid-as-graph conversion', 'Flood-count plan and complexity stated'],
      teachingNote:
        'This script opens with the *reframe* ("the grid is a graph") — for grid problems that single sentence does more senior-signaling than any code.',
    },
  },
  incrementalBuild: [
    {
      label: '1. The flood: stop conditions first, mark on entry',
      code: "const sink = (r: number, c: number) => {\n  if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return\n  grid[r][c] = '0'   // sinking visited land doubles as the visited set",
    },
    {
      label: '2. Recurse into all four neighbors',
      code: "  sink(r + 1, c)\n  sink(r - 1, c)\n  sink(r, c + 1)\n  sink(r, c - 1)\n}",
    },
    {
      label: '3. Count one island per flood started',
      code: "let count = 0\nfor (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (grid[r][c] === '1') {\n      count++        // a fresh unvisited land cell = a new island\n      sink(r, c)     // consume its whole component\n    }\n  }\n}",
    },
  ],
  code: {
    signature: 'export function numIslands(grid: string[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [[['1', '1', '0'], ['1', '0', '0'], ['0', '0', '1']]],
        expected: 2,
        label: 'example',
      },
      { args: [[['1', '0', '1', '0']]], expected: 2, label: 'single row' },
      { args: [[['0', '0'], ['0', '0']]], expected: 0, label: 'all water' },
      { args: [[['1', '1'], ['1', '1']]], expected: 1, label: 'all land', hidden: true },
      {
        args: [[['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]],
        expected: 5,
        label: 'diagonals are not connected',
        hidden: true,
      },
      { args: [[['1']]], expected: 1, label: 'single land cell', hidden: true },
    ],
    referenceSolution:
      "export function numIslands(grid: string[][]): number {\n  const m = grid.length\n  const n = grid[0].length\n  const sink = (r: number, c: number) => {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return\n    grid[r][c] = '0'\n    sink(r + 1, c)\n    sink(r - 1, c)\n    sink(r, c + 1)\n    sink(r, c - 1)\n  }\n  let count = 0\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++\n        sink(r, c)\n      }\n    }\n  }\n  return count\n}\n",
    complexity: { time: 'O(m·n)', space: 'O(m·n) worst-case recursion' },
  },
}
