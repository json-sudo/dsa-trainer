import type { Problem } from '../../types'

export const maxAreaOfIsland: Problem = {
  id: 'max-area-of-island',
  leetcodeId: 695,
  title: 'Max Area of Island',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'graphs',
  authored: true,
  statement:
    'Given an `m × n` binary grid (`1` = land, `0` = water), return the area (cell count) of the largest island under 4-directional connectivity, or `0` if there is no land.',
  examples: [
    { input: 'grid = [[1,1,0],[1,0,0],[0,0,1]]', output: '3' },
    { input: 'grid = [[0,0,0]]', output: '0' },
  ],
  constraints: ['1 <= m, n <= 50', 'grid[i][j] is 0 or 1'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a 0/1 grid up to 50×50. Output: the maximum component size (0 for no land) — sizes now matter, not just the count.',
      rubric: ['Max component *size* (vs counting components)', 'Zero for all-water'],
    },
    whatToFind: {
      modelAnswer: 'A max over per-component aggregates: measure each connected component\'s size, keep the largest.',
      rubric: ['Per-component aggregate + global max', 'Component identification still the core'],
    },
    constraintsHint: {
      modelAnswer: '2500 cells — O(m·n) flood-fill territory with no recursion-depth worries at this size.',
      rubric: ['O(m·n) budget', 'Notes depth is safe here'],
    },
    bruteForce: {
      modelAnswer: 'For every land cell, flood its component from scratch to measure it: components re-measured once per member cell → O((m·n)²) worst case.',
      rubric: ['Per-cell re-flood described', 'Quadratic waste stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Each component is re-measured |component| times, but one flood already yields the full size. Flood each component once from its first unvisited cell, returning the visited count. Pattern: DFS (with size return).',
      rubric: ['Waste: repeated measurement of one component', 'Single flood returns the size'],
      acceptedPatterns: ['dfs'],
    },
    algorithm: {
      modelAnswer:
        'For each unvisited land cell: dfs(r,c) sinks the cell and returns 1 + sum of the four neighbor calls (0 for water/out-of-bounds). Track the max of the flood results. Time O(m·n), space O(m·n) worst-case recursion.',
      rubric: ['Size-returning DFS (1 + neighbor sums)', 'Sink-or-visited-set marking', 'States O(m·n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be re-flooding a component from every one of its cells to measure it — quadratic. One flood per component suffices if the DFS *returns* its size: each call contributes 1 plus its neighbors\' contributions, and I take the max over the floods. Time O(m·n), space O(m·n) worst case.',
      rubric: ['Template followed with the size-returning-DFS refinement', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function maxAreaOfIsland(grid: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[1, 1, 0], [1, 0, 0], [0, 0, 1]]], expected: 3, label: 'example' },
      { args: [[[0, 0, 0]]], expected: 0, label: 'no land' },
      { args: [[[1]]], expected: 1, label: 'single land cell' },
      { args: [[[1, 1], [1, 1]]], expected: 4, label: 'whole grid island', hidden: true },
      {
        args: [[[1, 0, 1, 1], [1, 0, 0, 1], [0, 0, 1, 1]]],
        expected: 5,
        label: 'two islands, larger wins',
        hidden: true,
      },
      {
        args: [[[1, 0], [0, 1]]],
        expected: 1,
        label: 'diagonal not connected',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function maxAreaOfIsland(grid: number[][]): number {\n  const m = grid.length\n  const n = grid[0].length\n  const flood = (r: number, c: number): number => {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== 1) return 0\n    grid[r][c] = 0\n    return 1 + flood(r + 1, c) + flood(r - 1, c) + flood(r, c + 1) + flood(r, c - 1)\n  }\n  let best = 0\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) best = Math.max(best, flood(r, c))\n    }\n  }\n  return best\n}\n',
    complexity: { time: 'O(m·n)', space: 'O(m·n) worst-case recursion' },
  },
}
