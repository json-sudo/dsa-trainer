import type { Problem } from '../../types'

export const longestIncreasingPathInAMatrix: Problem = {
  id: 'longest-increasing-path-in-a-matrix',
  leetcodeId: 329,
  title: 'Longest Increasing Path in a Matrix',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'dp-2d',
  authored: true,
  statement:
    'Given an `m x n` integer matrix, find the length of the longest strictly increasing path, where from any cell you may move in one of the 4 directions (up, down, left, right), and each step must move to a cell with a strictly greater value than the current one. You may not move diagonally or move outside the matrix.',
  examples: [
    { input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', output: '4', explanation: 'One longest path is [1,2,6,9].' },
    { input: 'matrix = [[3,4,5],[3,2,6],[2,2,1]]', output: '4', explanation: 'One longest path is [3,4,5,6].' },
    { input: 'matrix = [[1]]', output: '1' },
  ],
  constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 200', '0 <= matrix[i][j] <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an m×n grid of integers (up to 200×200 = 40,000 cells). Output: the length (cell count) of the longest strictly increasing path reachable by 4-directional moves, where "increasing" applies value-to-value, not to positions.',
      rubric: ['States output is a path length (cell count), not the path itself', 'Notes strictly increasing values, 4-directional adjacency only'],
    },
    whatToFind: {
      modelAnswer:
        'For every cell, the longest strictly increasing path starting there; the answer is the maximum over all cells. This is a longest-path problem on an implicit DAG: since every move strictly increases value, there are no cycles, so "longest path from each node" is well-defined and can be reused.',
      rubric: ['Frames it as max over all starting cells of "longest increasing path from here"', 'Notes the strict-increase rule makes the move graph acyclic (a DAG)'],
    },
    constraintsHint: {
      modelAnswer:
        '40,000 cells; naive DFS from every cell re-explores overlapping increasing chains repeatedly, potentially exponential. Because a cell\'s longest-increasing-path-length depends only on its neighbors\' values (never on how we arrived), it can be memoized — computed once per cell, giving O(rows·cols) overall.',
      rubric: ['Notes plain DFS from every cell can blow up (exponential/overlapping work)', 'Identifies the memoization opportunity: a cell\'s answer depends only on the matrix, not the path taken to reach it'],
    },
    bruteForce: {
      modelAnswer:
        'From every cell, DFS outward following only strictly-increasing neighbors, tracking the depth reached, and take the max depth found from any starting cell over the whole grid. Correct, but the same cell can be revisited and re-explored from many different starting points, wasting massive repeated work — worst case exponential.',
      rubric: ['Describes DFS from every cell without memoization', 'Notes the exponential/repeated-work blowup from overlapping subpaths'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The DFS re-solves "longest increasing path starting at cell (i,j)" over and over, once for every different starting cell whose path happens to pass through (i,j) — but that sub-answer never changes; it depends only on (i,j)\'s value and its neighbors\' values, never on how we got there. Cache it: `memo[i][j]` = longest increasing path starting at (i,j), computed once and reused for every future DFS that reaches (i,j). Pattern: DFS + memoization (DP over an implicit DAG).',
      rubric: ['Names the waste: recomputing the same starting-cell answer from multiple different DFS calls', 'Proposes memoizing per-cell results since they never depend on the calling path'],
      acceptedPatterns: ['dfs', 'dp'],
    },
    algorithm: {
      modelAnswer:
        'Maintain `memo: number[][]` initialized to 0 (0 = not yet computed). `dfs(i, j)`: if `memo[i][j] !== 0`, return it. Otherwise start `best = 1` (the cell alone); for each of the 4 neighbors `(ni, nj)` in bounds with `matrix[ni][nj] > matrix[i][j]`, set `best = max(best, 1 + dfs(ni, nj))`. Store `memo[i][j] = best` and return it. Run `dfs(i, j)` over every cell and return the overall maximum. Each cell\'s DFS body executes exactly once thanks to memoization; total work is O(rows·cols) with O(rows·cols) space for the memo table plus O(rows·cols) worst-case recursion depth.',
      rubric: [
        'Memoizes per-cell results and returns immediately on a cache hit',
        'Only recurses into strictly-greater-valued neighbors',
        'Takes the max of dfs(i,j) over all starting cells as the final answer',
      ],
    },
    interviewScript: {
      modelAnswer:
        'The answer is the max over all cells of the longest strictly increasing path starting there — and because every move increases value, the move graph is acyclic, so that\'s well defined per cell. Brute-force DFS from every cell re-explores the same downstream sub-paths repeatedly. Since a cell\'s answer never depends on how we arrived — only on its own value and its neighbors\' values — I memoize it: DFS with a memo table, recursing only into strictly-greater neighbors, caching 1 + max of neighbor results. Run that from every cell and take the max. Time O(rows·cols), space O(rows·cols).',
      rubric: ['Follows the template end-to-end', 'States the DAG/memoization justification and final complexity'],
    },
  },
  code: {
    signature: 'export function longestIncreasingPath(matrix: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[9, 9, 4], [6, 6, 8], [2, 1, 1]]], expected: 4, label: 'example: path [1,2,6,9]' },
      { args: [[[3, 4, 5], [3, 2, 6], [2, 2, 1]]], expected: 4, label: 'example: path [3,4,5,6]' },
      { args: [[[1]]], expected: 1, label: 'single cell' },
      { args: [[[1, 2], [4, 3]]], expected: 4, label: 'full 2x2 spiral increasing loop', hidden: true },
      { args: [[[7, 7, 7], [7, 7, 7], [7, 7, 7]]], expected: 1, label: 'all equal values, no valid move', hidden: true },
      { args: [[[1, 2, 3, 4, 5]]], expected: 5, label: 'single row strictly increasing', hidden: true },
    ],
    referenceSolution:
      'export function longestIncreasingPath(matrix: number[][]): number {\n  const rows = matrix.length\n  const cols = matrix[0].length\n  const memo: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0))\n  const dirs = [\n    [-1, 0],\n    [1, 0],\n    [0, -1],\n    [0, 1],\n  ]\n\n  function dfs(i: number, j: number): number {\n    if (memo[i][j] !== 0) return memo[i][j]\n    let best = 1\n    for (const [di, dj] of dirs) {\n      const ni = i + di\n      const nj = j + dj\n      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && matrix[ni][nj] > matrix[i][j]) {\n        best = Math.max(best, 1 + dfs(ni, nj))\n      }\n    }\n    memo[i][j] = best\n    return best\n  }\n\n  let ans = 1\n  for (let i = 0; i < rows; i++) {\n    for (let j = 0; j < cols; j++) {\n      ans = Math.max(ans, dfs(i, j))\n    }\n  }\n  return ans\n}\n',
    complexity: { time: 'O(rows * cols)', space: 'O(rows * cols)' },
  },
}
