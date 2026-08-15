import type { Problem } from '../../types'

export const swimInRisingWater: Problem = {
  id: 'swim-in-rising-water',
  leetcodeId: 778,
  title: 'Swim in Rising Water',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'You are given an `n x n` grid where `grid[i][j]` is the elevation at cell `(i, j)`; all elevations are a permutation of `0..n*n-1`. You start at `(0, 0)` and want to reach `(n-1, n-1)`. At time `t`, you may move to any of the 4-directionally adjacent cells whose elevation is `<= t` (you can also wait at your current cell as time rises, as long as it stays reachable). Return the minimum time `t` such that a path from `(0,0)` to `(n-1,n-1)` exists.',
  examples: [
    { input: 'grid = [[0,2],[1,3]]', output: '3', explanation: 'At t=3 all cells are submerged/passable and a path exists; no smaller t connects (0,0) to (1,1).' },
    {
      input: 'grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]',
      output: '16',
    },
    { input: 'grid = [[0]]', output: '0', explanation: 'Start already equals destination.' },
  ],
  constraints: ['n == grid.length == grid[i].length', '1 <= n <= 50', '0 <= grid[i][j] < n^2', 'grid is a permutation of [0, n^2 - 1]'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an n×n grid of elevations, a permutation of 0..n²-1 (n up to 50, so up to 2500 cells). Output: the minimum time t at which a 4-directionally connected path from (0,0) to (n-1,n-1) exists, using only cells with elevation ≤ t.',
      rubric: ['States the answer is a minimum threshold time, not a path length', 'Notes elevations are a permutation (all distinct) up to n² cells'],
    },
    whatToFind: {
      modelAnswer:
        'The minimum "bottleneck" — the smallest possible value of the maximum elevation along any path from start to end. Every path has a bottleneck (its highest cell); we want the path whose bottleneck is smallest, and the answer is that bottleneck value.',
      rubric: ['Reframes the answer as "minimize the maximum elevation along a path" (a minimax path)', 'Distinguishes this from ordinary shortest-path (sum of weights)'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 50 → up to 2500 cells. Binary searching t and BFS/DFS-flood-filling reachability from (0,0) at each candidate t costs O(n² log(n²)) — perfectly fine. A Dijkstra/Prim-style single-pass heap expansion achieves the same O(n² log n) without an explicit binary search, expanding cells in increasing order of the bottleneck-so-far.',
      rubric: ['Notes binary search over t combined with flood-fill reachability is feasible at this size', 'Connects the minimax structure to a Dijkstra/Prim-like heap expansion as an alternative'],
    },
    bruteForce: {
      modelAnswer:
        'Binary search on the answer t: for a candidate t, flood-fill (BFS/DFS) from (0,0) using only cells with elevation ≤ t and check whether (n-1,n-1) is reached; binary search the smallest such t over the range [0, n²-1]. O(n² log(n²)) time, O(n²) space. Correct, but re-does a full flood-fill from scratch at every candidate t, most of which overlaps heavily with the previous fill.',
      rubric: ['Describes binary search on t plus flood-fill feasibility check', 'States O(n² log n) time and notes the repeated-flood-fill overhead'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Binary search re-explores almost the same reachable region from scratch at every candidate t, discarding all that work between guesses. A single heap-driven expansion avoids re-doing work entirely: always expand the frontier cell with the smallest elevation next (like Dijkstra/Prim), and track the running maximum elevation seen along the best expansion order — that running max only grows through the cells that actually needed to be crossed, so it lands on the true bottleneck in one pass. Pattern: Heap (Dijkstra/Prim-style minimax expansion); binary search is the alternate accepted framing.',
      rubric: ['Names the waste: repeated from-scratch flood-fills across binary-search iterations', 'Proposes a single min-heap expansion tracking a running bottleneck instead'],
      acceptedPatterns: ['heap', 'binary-search'],
    },
    algorithm: {
      modelAnswer:
        'Push `(grid[0][0], row=0, col=0)` into a `MinHeap<{ row: number; col: number }>` keyed by elevation, and mark (0,0) visited. Maintain `ans = 0`. Loop while the heap is non-empty: pop the cell with the smallest elevation, set `ans = max(ans, thatCell\'s elevation)` (the bottleneck so far); if this cell is (n-1, n-1), return `ans`. Otherwise, for each unvisited 4-directional neighbor, mark it visited and push it keyed by its OWN elevation (not combined with ans — the min-heap ordering by raw elevation already guarantees cells are expanded in the order that yields the correct running bottleneck, the same argument that justifies Prim\'s MST). Each cell is pushed and popped at most once. Time O(n² log n), space O(n²).',
      rubric: [
        'Heap keyed by each cell\'s own raw elevation (not accumulated with the running max)',
        'Tracks ans as the max elevation popped so far and returns it upon popping the destination',
        'Marks cells visited on push (not on pop) so each cell enters the heap at most once',
      ],
    },
    interviewScript: {
      modelAnswer:
        'The answer is the smallest possible bottleneck (max elevation) along any path from (0,0) to (n-1,n-1) — a minimax path problem. Brute force is binary search on t plus a flood-fill feasibility check per candidate — O(n² log n) but redoing overlapping work each guess. A single Prim/Dijkstra-style heap expansion avoids that: always pop the globally lowest-elevation frontier cell next, track the running max elevation popped, and stop the moment I pop the destination — that\'s the answer. Time O(n² log n), space O(n²).',
      rubric: ['Follows the template end-to-end', 'States the minimax-path framing and final complexity'],
    },
  },
  code: {
    signature:
      'export function swimInWater(grid: number[][]): number {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[0, 2], [1, 3]]], expected: 3, label: 'example: 2x2 grid' },
      {
        args: [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]],
        expected: 16,
        label: 'example: 5x5 spiral grid',
      },
      { args: [[[0]]], expected: 0, label: 'single cell, start equals destination' },
      { args: [[[0, 1], [2, 3]]], expected: 3, label: 'direct path forces passing through the max cell', hidden: true },
      { args: [[[3, 2], [0, 1]]], expected: 3, label: 'destination itself has the highest elevation', hidden: true },
      {
        args: [[[0, 1, 2], [3, 4, 5], [8, 7, 6]]],
        expected: 6,
        label: '3x3 grid where a detour avoids the largest values',
      },
    ],
    referenceSolution:
      'export function swimInWater(grid: number[][]): number {\n  const n = grid.length\n  const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false))\n  const heap = new MinHeap<{ row: number; col: number }>()\n  heap.push(grid[0][0], { row: 0, col: 0 })\n  visited[0][0] = true\n  let ans = 0\n  const dirs = [\n    [-1, 0],\n    [1, 0],\n    [0, -1],\n    [0, 1],\n  ]\n  while (heap.size > 0) {\n    const elevation = heap.peekKey()!\n    const { row, col } = heap.pop()!\n    ans = Math.max(ans, elevation)\n    if (row === n - 1 && col === n - 1) return ans\n    for (const [dr, dc] of dirs) {\n      const nr = row + dr\n      const nc = col + dc\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc]) {\n        visited[nr][nc] = true\n        heap.push(grid[nr][nc], { row: nr, col: nc })\n      }\n    }\n  }\n  return ans\n}\n',
    complexity: { time: 'O(n^2 log n)', space: 'O(n^2)' },
  },
}
