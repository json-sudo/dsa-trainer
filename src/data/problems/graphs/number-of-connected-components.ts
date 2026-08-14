import type { Problem } from '../../types'

export const numberOfConnectedComponents: Problem = {
  id: 'number-of-connected-components',
  leetcodeId: 323,
  title: 'Number of Connected Components',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'graphs',
  authored: true,
  statement:
    'You have a graph of `n` nodes labeled `0` to `n - 1`, given as an edge list `edges` where `edges[i] = [a, b]` is an undirected edge between `a` and `b`. Return the number of connected components in the graph.',
  examples: [
    { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2', explanation: '{0,1,2} and {3,4} are the two components.' },
    { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
  ],
  constraints: ['1 <= n <= 2000', '0 <= edges.length <= min(n*(n-1)/2, 5000)', 'no self-loops, no duplicate edges'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a node count n and an edge list over undirected edges (no self-loops or duplicates). Output: a single integer — how many separate connected groups the n nodes fall into, counting isolated (edgeless) nodes as their own component.',
      rubric: ['Notes the edge-list (not adjacency-matrix) input shape', 'States isolated nodes each count as one component'],
    },
    whatToFind: {
      modelAnswer:
        'A grouping/partition task: assign every node to exactly one connectivity group, then count the groups — not a search for a specific path or a shortest distance.',
      rubric: ['Frames it as partitioning nodes into connectivity groups', 'Distinguishes counting groups from pathfinding'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 2000 and edges ≤ 5000 keeps everything comfortably near-linear — O(n + E) or O((n+E)·α(n)) are both fine. The constraint doesn\'t push toward one specific technique so much as rule out anything quadratic in n per edge.',
      rubric: ['Derives that near-linear O(n+E) is well within budget', 'Notes the bound rules out per-edge O(n) work but doesn\'t single out one algorithm'],
    },
    bruteForce: {
      modelAnswer:
        'Build an adjacency list from the edges, then run DFS/BFS from every unvisited node, marking everything reached and incrementing a counter each time a fresh search starts. O(n + E) time, O(n + E) space — this is already correct and near-optimal, just structured around explicit graph traversal rather than incremental merging.',
      rubric: ['Adjacency-list + DFS/BFS-per-unvisited-node approach described', 'States O(n + E) time/space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'DFS-over-adjacency-list is not wasteful here, but it requires building the full adjacency list before any traversal starts and it isn\'t naturally incremental if edges are added one at a time. Union-Find processes edges directly as they arrive: each edge either merges two components or is a no-op (already same component) — the number of surviving distinct roots after all merges *is* the answer, with no separate traversal phase needed. Pattern: Union-Find (also acceptable: DFS).',
      rubric: ['Notes DFS-over-adjacency-list is correct but requires building the graph structure first / isn\'t incremental', 'Proposes Union-Find merging edges directly with distinct-roots-as-answer'],
      acceptedPatterns: ['dfs', 'union-find'],
    },
    algorithm: {
      modelAnswer:
        'Initialize parent[i] = i for all n nodes (each its own component) and a rank/size array. For each edge [a, b]: find the root of a and of b (with path compression); if the roots differ, union them (by rank/size) and decrement a running component counter that starts at n. After processing all edges, the counter holds the answer — equivalently, count distinct find(i) values across all i. Time O((n + E)·α(n)) ≈ O(n + E), space O(n).',
      rubric: [
        'Initializes n singleton components and unions on each edge only when roots differ',
        'Uses path compression and union by rank/size (or explains the effect)',
        'States near-linear O((n+E)·α(n)) time / O(n) space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'This is a connected-components count, so DFS over an adjacency list — counting how many times a fresh search starts from an unvisited node — is already correct at O(n+E). I\'ll present Union-Find instead since it fits the edge-list input more directly: start with n singleton components, and for each edge union the two endpoints\' components if they\'re not already joined. The number of distinct roots left after processing every edge is the component count. With path compression and union by rank this runs in O((n+E)·α(n)), essentially linear, O(n) space.',
      rubric: ['Mentions DFS-over-adjacency-list as the correct baseline before presenting Union-Find', 'States the union-on-distinct-roots rule and near-linear complexity'],
    },
  },
  code: {
    signature: 'export function countComponents(n: number, edges: number[][]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2, label: 'example two components' },
      { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1, label: 'single chain, one component' },
      { args: [4, []], expected: 4, label: 'no edges, all isolated' },
      { args: [1, []], expected: 1, label: 'single node' },
      { args: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3, label: 'three disjoint pairs', hidden: true },
      { args: [5, [[0, 1], [1, 2], [1, 3], [1, 4]]], expected: 1, label: 'star graph collapses to one component', hidden: true },
      { args: [3, [[0, 1], [1, 2], [0, 2]]], expected: 1, label: 'triangle with redundant merges', hidden: true },
    ],
    referenceSolution:
      'export function countComponents(n: number, edges: number[][]): number {\n  const parent = Array.from({ length: n }, (_, i) => i)\n  const rank = new Array(n).fill(0)\n  let count = n\n\n  const find = (x: number): number => {\n    while (parent[x] !== x) {\n      parent[x] = parent[parent[x]]\n      x = parent[x]\n    }\n    return x\n  }\n\n  const union = (a: number, b: number): void => {\n    const ra = find(a)\n    const rb = find(b)\n    if (ra === rb) return\n    if (rank[ra] < rank[rb]) {\n      parent[ra] = rb\n    } else if (rank[ra] > rank[rb]) {\n      parent[rb] = ra\n    } else {\n      parent[rb] = ra\n      rank[ra]++\n    }\n    count--\n  }\n\n  for (const [a, b] of edges) union(a, b)\n  return count\n}\n',
    complexity: { time: 'O((n + E) · α(n))', space: 'O(n)' },
  },
}
