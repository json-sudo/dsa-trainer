import type { Problem } from '../../types'

export const rottingOranges: Problem = {
  id: 'rotting-oranges',
  leetcodeId: 994,
  title: 'Rotting Oranges',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'graphs',
  authored: true,
  statement:
    'In an `m × n` grid, `0` is empty, `1` is a fresh orange, `2` is a rotten orange. Every minute, fresh oranges 4-adjacent to a rotten one rot. Return the minutes until no fresh orange remains, or `-1` if some can never rot.',
  examples: [
    { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' },
    { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'The bottom-left orange is unreachable.' },
    { input: 'grid = [[0,2]]', output: '0' },
  ],
  constraints: ['1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a small grid with empties, fresh, and rotten oranges. Output: minutes to full rot, −1 if unreachable fresh oranges exist, 0 if nothing fresh at the start.',
      rubric: ['All three sentinel outcomes (t, −1, 0) named', 'Simultaneous spreading per minute understood'],
    },
    whatToFind: {
      modelAnswer:
        'The time for a simultaneous multi-source spread to cover everything — i.e. the maximum over fresh oranges of the distance to their *nearest* rotten source.',
      rubric: ['Reformulates as max of nearest-source distances', 'Simultaneity = multi-source'],
    },
    constraintsHint: {
      modelAnswer:
        '≤ 100 cells — anything passes; the structure is the lesson. "Spreads per minute, all at once" is distance-by-levels: minute k rot = cells at BFS distance k from the initial rotten set.',
      rubric: ['Minute-equals-level identification', 'Notes size is irrelevant'],
    },
    bruteForce: {
      modelAnswer:
        'Literal simulation: each minute, scan the whole grid for fresh cells adjacent to rot, mark them, repeat until stable: O(minutes × m·n) with a full scan per minute.',
      rubric: ['Per-minute full rescan simulation', 'States O(t·m·n)', 'Correct but rescans'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Each scan revisits mostly-unchanged cells — only the *frontier* (last minute\'s newly rotten) can infect anyone. Track just the frontier in a queue seeded with all initially rotten oranges: exactly multi-source BFS, minutes = levels. Pattern: BFS.',
      rubric: ['Waste: rescanning static cells vs frontier-only work', 'Multi-source queue with level counting'],
      acceptedPatterns: ['bfs'],
    },
    algorithm: {
      modelAnswer:
        'Enqueue all rotten cells; count fresh ones. BFS by levels: pop a level, rot fresh 4-neighbors (decrement fresh count, enqueue), minutes++ per non-empty level processed. Return minutes if fresh = 0, else −1; handle the zero-fresh start (0). Time O(m·n), space O(m·n).',
      rubric: [
        'Multi-source seeding + fresh counter',
        'Level-batched loop with minutes counted per level',
        'Both sentinels (−1, immediate 0) handled',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be simulating minute by minute with full-grid rescans — only the frontier matters each minute, the rest is static. Simultaneous spread from several sources is multi-source BFS: seed the queue with every rotten orange, expand level by level, and the number of levels that rot someone is the answer; leftover fresh oranges mean −1. Time O(m·n), space O(m·n).',
      rubric: ['Template followed with the frontier/multi-source insight', 'Sentinel cases mentioned'],
    },
  },
  code: {
    signature: 'export function orangesRotting(grid: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4, label: 'example' },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, label: 'unreachable orange' },
      { args: [[[0, 2]]], expected: 0, label: 'no fresh oranges' },
      { args: [[[1]]], expected: -1, label: 'fresh with no source', hidden: true },
      { args: [[[2, 2], [1, 1]]], expected: 1, label: 'two sources same minute', hidden: true },
      { args: [[[0]]], expected: 0, label: 'empty grid', hidden: true },
    ],
    referenceSolution:
      'export function orangesRotting(grid: number[][]): number {\n  const m = grid.length\n  const n = grid[0].length\n  const queue: [number, number][] = []\n  let fresh = 0\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) queue.push([r, c])\n      else if (grid[r][c] === 1) fresh++\n    }\n  }\n  if (fresh === 0) return 0\n  let minutes = 0\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]\n  let frontier = queue\n  while (frontier.length > 0 && fresh > 0) {\n    const next: [number, number][] = []\n    for (const [r, c] of frontier) {\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr\n        const nc = c + dc\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2\n          fresh--\n          next.push([nr, nc])\n        }\n      }\n    }\n    if (next.length > 0) minutes++\n    frontier = next\n  }\n  return fresh === 0 ? minutes : -1\n}\n',
    complexity: { time: 'O(m·n)', space: 'O(m·n)' },
  },
}
