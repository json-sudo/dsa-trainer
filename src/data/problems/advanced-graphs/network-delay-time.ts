import type { Problem } from '../../types'

export const networkDelayTime: Problem = {
  id: 'network-delay-time',
  leetcodeId: 743,
  title: 'Network Delay Time',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'You are given `times` — directed edges `[u, v, w]` meaning a signal takes `w` ms from node `u` to node `v` — with `n` nodes labeled 1..n, and a start node `k`. Return the time for the signal to reach **all** nodes, or `-1` if some node is unreachable. A `MinHeap` utility is available.',
  examples: [
    { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
    { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' },
    { input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1' },
  ],
  constraints: ['1 <= k <= n <= 100', '1 <= times.length <= 6000', '1 <= w <= 100', 'directed, weighted'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a directed *weighted* graph as an edge list, plus a source. Output: the max over nodes of the fastest arrival time — or −1 on unreachability. "All nodes receive it" = the slowest of the shortest paths.',
      rubric: ['Answer = max of single-source shortest paths', 'Weighted + directed both registered'],
      teachingNote:
        'Translate the story to graph vocabulary immediately: "time to reach all" = "maximum single-source shortest-path distance". Once said, the problem names its own algorithm.',
    },
    whatToFind: {
      modelAnswer: 'Single-source shortest paths on a non-negatively weighted digraph, then the maximum of those distances.',
      rubric: ['SSSP identified', 'Non-negative weights noted (Dijkstra applicability)'],
      teachingNote:
        'The decision tree: unweighted → BFS; non-negative weights → Dijkstra; negative edges → Bellman-Ford. Reciting the applicable branch and *why* is most of the interview points.',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 100, E ≤ 6000, weights positive. Dijkstra with a heap: O(E log V) ≈ 6000·7 — trivial. Positive weights are the license for greedy settlement (once popped, a node\'s distance is final).',
      rubric: ['Sizes make O(E log V) trivial', 'Positive weights → greedy settlement soundness'],
      teachingNote:
        '"1 <= w" is doing quiet work: it authorizes Dijkstra. If that line read "-100 <= w", the same problem would require Bellman-Ford. Constraints choose algorithms.',
    },
    bruteForce: {
      modelAnswer:
        'Bellman-Ford-style relaxation: relax every edge n−1 times: O(V·E) = 6×10⁵ — passes here, but does blind full-edge sweeps whether or not anything changed.',
      rubric: ['Repeated full relaxation described', 'States O(V·E)', 'Notes it ignores settledness'],
      teachingNote:
        'Bellman-Ford as "brute force" is a strong move — it is a *correct* algorithm whose waste (re-relaxing settled regions) motivates Dijkstra precisely.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Full sweeps re-relax edges whose source distance hasn\'t changed. With non-negative weights, the unsettled node with the smallest tentative distance can never improve — settle it, relax only *its* edges, repeat. A min-heap serves the next-cheapest node. Pattern: Dijkstra = Heap + BFS-like expansion.',
      rubric: ['Waste: re-relaxing unchanged regions', 'Smallest-tentative-is-final argument (needs w ≥ 0)'],
      acceptedPatterns: ['heap', 'bfs'],
      teachingNote:
        'Dijkstra is "BFS where the queue became a priority queue". If you know why BFS settles nodes in distance order on unweighted graphs, the heap version is the same claim generalized to weights.',
    },
    algorithm: {
      modelAnswer:
        'Adjacency list. dist[] = ∞ except dist[k] = 0. Heap seeded (0, k). Pop (d, u): skip if d > dist[u] (stale); for each edge u→v of weight w, if d + w < dist[v], update and push. Answer = max(dist) or −1 if any ∞. Time O(E log E), space O(V + E).',
      rubric: [
        'Heap loop with stale-entry skip (lazy deletion)',
        'Relaxation condition correct',
        'Max-or-−1 aggregation at the end',
      ],
      teachingNote:
        'JS has no decrease-key, so push duplicates and skip stale pops (`d > dist[u]`) — name this "lazy deletion" and the interviewer knows you\'ve implemented Dijkstra in heap-poor languages before.',
    },
    interviewScript: {
      modelAnswer:
        'This is single-source shortest paths — the answer is the largest of the shortest arrival times. Brute force would be Bellman-Ford\'s blind V·E relaxation sweeps; since weights are non-negative I can do better with Dijkstra: a min-heap always serves the unsettled node with the smallest tentative distance, which is provably final, so each edge relaxes at most once usefully. Time O(E log E), space O(V+E); unreachable nodes leave ∞ → −1.',
      rubric: ['Template followed with the settlement argument', 'Complexity + unreachable case stated'],
      teachingNote:
        'The one-line proof "smallest tentative distance can\'t improve because all weights are non-negative" is the heart of Dijkstra — say it, don\'t just name the algorithm.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Adjacency list from the edge list',
      code: 'const adj: [number, number][][] = Array.from({ length: n + 1 }, () => [])\nfor (const [u, v, w] of times) adj[u].push([v, w])   // directed!',
    },
    {
      label: '2. Distances + a heap seeded with the source',
      code: 'const dist = new Array(n + 1).fill(Infinity)\ndist[k] = 0\nconst heap = new MinHeap<number>()\nheap.push(0, k)   // key = tentative distance, value = node',
    },
    {
      label: '3. Pop cheapest, skip stale entries, relax its edges',
      code: 'while (heap.size > 0) {\n  const d = heap.peekKey()!\n  const u = heap.pop()!\n  if (d > dist[u]) continue     // lazy deletion: an outdated duplicate\n  for (const [v, w] of adj[u]) {\n    if (d + w < dist[v]) {\n      dist[v] = d + w\n      heap.push(dist[v], v)     // push a new (better) entry\n    }\n  }\n}',
    },
    {
      label: '4. The answer is the slowest of the shortest paths',
      code: 'let worst = 0\nfor (let i = 1; i <= n; i++) worst = Math.max(worst, dist[i])\nreturn worst === Infinity ? -1 : worst   // Infinity = someone unreachable',
    },
  ],
  code: {
    signature: 'export function networkDelayTime(times: number[][], n: number, k: number): number {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2, label: 'example' },
      { args: [[[1, 2, 1]], 2, 1], expected: 1, label: 'single edge' },
      { args: [[[1, 2, 1]], 2, 2], expected: -1, label: 'unreachable node' },
      { args: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expected: 3, label: 'shorter two-hop beats direct', hidden: true },
      { args: [[[1, 2, 1], [2, 1, 3]], 2, 2], expected: 3, label: 'directed asymmetry', hidden: true },
      { args: [[[1, 1, 1]], 1, 1], expected: 0, label: 'single node self-loop', hidden: true },
    ],
    referenceSolution:
      'export function networkDelayTime(times: number[][], n: number, k: number): number {\n  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => [])\n  for (const [u, v, w] of times) adj[u].push([v, w])\n  const dist = new Array(n + 1).fill(Infinity)\n  dist[k] = 0\n  const heap = new MinHeap<number>()\n  heap.push(0, k)\n  while (heap.size > 0) {\n    const d = heap.peekKey()!\n    const u = heap.pop()!\n    if (d > dist[u]) continue\n    for (const [v, w] of adj[u]) {\n      if (d + w < dist[v]) {\n        dist[v] = d + w\n        heap.push(dist[v], v)\n      }\n    }\n  }\n  let worst = 0\n  for (let i = 1; i <= n; i++) worst = Math.max(worst, dist[i])\n  return worst === Infinity ? -1 : worst\n}\n',
    complexity: { time: 'O(E log E)', space: 'O(V + E)' },
  },
}
