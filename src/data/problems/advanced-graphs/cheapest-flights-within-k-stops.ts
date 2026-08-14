import type { Problem } from '../../types'

export const cheapestFlightsWithinKStops: Problem = {
  id: 'cheapest-flights-within-k-stops',
  leetcodeId: 787,
  title: 'Cheapest Flights Within K Stops',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'There are `n` cities and directed `flights` `[from, to, price]`. Return the cheapest price from `src` to `dst` using **at most `k` stops** (i.e. at most k+1 flights), or `-1` if impossible.',
  examples: [
    { input: 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', output: '700' },
    { input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1', output: '200' },
    { input: 'same, k = 0', output: '500' },
  ],
  constraints: ['1 <= n <= 100', '0 <= flights.length <= (n·(n−1)/2)', '0 <= k < n', 'prices positive'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a weighted digraph, source, destination, and a hop budget (k stops = k+1 edges). Output: min cost within the budget or −1. The hop cap changes everything.',
      rubric: ['Hop budget translated to edge count', '−1 sentinel'],
    },
    whatToFind: {
      modelAnswer: 'Cheapest constrained path: minimize cost subject to ≤ k+1 edges — a shortest path in a *state space* of (city, hops used).',
      rubric: ['Names the constraint dimension', 'State = (node, hops) insight'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 100, k < n: even O(k·E) ≈ 100·5000 is tiny. Warning sign: plain Dijkstra is *incorrect* here — a cheaper-but-longer path can block a pricier-but-shorter one that the hop cap needs.',
      rubric: ['Budget trivially satisfied', 'Names why vanilla Dijkstra breaks under hop caps'],
    },
    bruteForce: {
      modelAnswer: 'DFS all paths of length ≤ k+1 from src: branching^k paths — exponential; correct only for tiny k.',
      rubric: ['All-paths enumeration', 'Exponential complexity stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Path enumeration re-explores every way to reach a city with the same hop count — but only the *cheapest* cost per (city, hops) matters. Relax all edges exactly k+1 times from a frozen snapshot (Bellman-Ford limited to k+1 rounds): round i holds the cheapest costs using ≤ i flights. Pattern: DP over rounds — BFS-by-layers with cost table or Heap on (cost, hops) states also accepted.',
      rubric: ['Waste: re-exploring dominated (city,hops) states', 'k+1 bounded relaxation rounds with snapshot'],
      acceptedPatterns: ['bfs', 'heap', 'dp'],
    },
    algorithm: {
      modelAnswer:
        'dist[] = ∞, dist[src] = 0. Repeat k+1 times: next = copy(dist); for each flight (u,v,w): next[v] = min(next[v], dist[u] + w); dist = next. The copy prevents using more than one new edge per round. Return dist[dst] or −1. Time O(k·E), space O(n).',
      rubric: [
        'Snapshot copy each round (the crucial detail)',
        'Exactly k+1 rounds justified',
        'States O(k·E)/O(n)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Enumerating all paths is exponential, and plain Dijkstra is actually wrong here — the hop cap can force a pricier-but-shorter route that a settled cheaper node would hide. The clean model is Bellman-Ford cut to k+1 rounds: after round i, dist holds the cheapest cost using at most i flights, with a per-round snapshot so a round can\'t chain two new edges. Time O(k·E), space O(n).',
      rubric: ['Template followed incl. why-Dijkstra-fails', 'Snapshot detail stated'],
    },
  },
  code: {
    signature:
      'export function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      {
        args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1],
        expected: 700,
        label: 'example',
      },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], expected: 200, label: 'stop allowed' },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], expected: 500, label: 'no stops' },
      { args: [2, [], 0, 1, 1], expected: -1, label: 'no flights at all', hidden: true },
      { args: [1, [], 0, 0, 0], expected: 0, label: 'src equals dst', hidden: true },
      {
        args: [5, [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2], [1, 4, 1], [4, 2, 1]], 0, 2, 2],
        expected: 7,
        label: 'budget forces middle route',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {\n  let dist = new Array(n).fill(Infinity)\n  dist[src] = 0\n  for (let round = 0; round <= k; round++) {\n    const next = [...dist]\n    for (const [u, v, w] of flights) {\n      if (dist[u] !== Infinity && dist[u] + w < next[v]) next[v] = dist[u] + w\n    }\n    dist = next\n  }\n  return dist[dst] === Infinity ? -1 : dist[dst]\n}\n',
    complexity: { time: 'O(k·E)', space: 'O(n)' },
  },
}
