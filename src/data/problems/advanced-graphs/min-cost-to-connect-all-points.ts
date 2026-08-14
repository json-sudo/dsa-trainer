import type { Problem } from '../../types'

export const minCostToConnectAllPoints: Problem = {
  id: 'min-cost-to-connect-all-points',
  leetcodeId: 1584,
  title: 'Min Cost to Connect All Points',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'Given `points[i] = [xi, yi]`, the cost to connect two points is their Manhattan distance `|xi - xj| + |yi - yj|`. Return the minimum total cost to connect all points so every pair is reachable via some path. A `MinHeap` utility is available.',
  examples: [
    { input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' },
    { input: 'points = [[3,12],[-2,5],[-4,1]]', output: '18' },
  ],
  constraints: ['1 <= points.length <= 1000', '-10^6 <= xi, yi <= 10^6', 'all points distinct', 'edge weight = Manhattan distance, complete graph'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: n points, no edges given — every pair is implicitly connected at cost |Δx|+|Δy|. Output: the minimum total cost so the whole set forms one connected component. "Connect all points cheaply" = build a minimum spanning tree on the implicit complete graph.',
      rubric: ['Recognizes the complete graph is implicit, not given', 'Reframes as MST on that graph'],
      teachingNote:
        'The biggest early trap: there\'s no edge list to read. You must recognize that *every pair* is a candidate edge before any graph algorithm can even start.',
    },
    whatToFind: {
      modelAnswer: 'The minimum spanning tree of the complete graph on n points weighted by Manhattan distance — cheapest edge subset connecting all nodes with no cycles.',
      rubric: ['MST vocabulary used explicitly', 'No-cycles / n−1-edges property implied'],
      teachingNote:
        '"Connect everything as cheaply as possible, no need to keep redundant connections" is the MST definition in plain English — train yourself to hear it in disguised problem statements like this one.',
    },
    constraintsHint: {
      modelAnswer:
        'n <= 1000 → up to ~5×10⁵ implicit edges. Kruskal would need to materialize and sort all pairs: O(n² log n) ≈ 5×10⁵ · 19 ≈ 10⁷ — fine, but wasteful to build. Prim\'s grows the tree from one node and never needs the full edge list explicitly, at O(n²) or O(n² log n) with a heap — also fine, and conceptually simpler here since edges are implicit.',
      rubric: ['Computes edge count order of magnitude (~n²)', 'Notes Prim avoids materializing all edges up front'],
      teachingNote:
        'When edges are implicit (as here) versus given explicitly (Kruskal-friendly), that alone is a hint toward Prim\'s — it grows a frontier and only ever needs "distance from the tree" per unvisited node, never a global edge list.',
    },
    bruteForce: {
      modelAnswer:
        'Generate all n(n−1)/2 edges explicitly, sort them, and union-find greedily accept edges that don\'t form a cycle (Kruskal). Correct, O(n² log n), but pays to materialize and sort ~5×10⁵ edges we could instead discover lazily.',
      rubric: ['Kruskal-with-materialized-edges baseline', 'States O(n² log n) and the up-front materialization cost'],
      teachingNote:
        'Kruskal isn\'t wrong here — it\'s just heavier to set up (union-find, sorting a huge edge list) when the graph is dense and implicit. Naming it as a valid-but-heavier alternative is good calibration.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Materializing and sorting every edge is more than the algorithm needs — at any moment, only each *unvisited* point\'s cheapest connection to the *current tree* matters, not its distance to every other unvisited point. Grow the tree from one point, keep a running "cheapest edge into the tree" per unvisited point, and always take the globally cheapest one next — that\'s Prim\'s, naturally served by a min-heap. Pattern: Heap + Greedy (Prim\'s MST).',
      rubric: ['Waste: computing/sorting all-pairs distances up front', 'Frontier-growth insight: only distance-to-tree per unvisited point matters'],
      acceptedPatterns: ['heap', 'greedy'],
      teachingNote:
        'Prim\'s is "Dijkstra with a different relaxation rule": instead of tracking distance-from-source, track distance-from-tree. If you know Dijkstra\'s heap loop, you already know 90% of Prim\'s structure.',
    },
    algorithm: {
      modelAnswer:
        'inTree = boolean[n], all false. minEdge[i] = distance from point i to the tree, ∞ initially except point 0 implicitly. Heap seeded with (0, 0). Pop (cost, u): skip if inTree[u]; mark inTree[u] = true, add cost to total. For every unvisited v, compute manhattan(u, v); if it improves minEdge[v], update and push (dist, v). Repeat until n points are in the tree. Return total.',
      rubric: [
        'Heap loop with stale-entry skip via inTree check (lazy deletion)',
        'Relaxation recomputes Manhattan distance to the just-added node for every unvisited point',
        'Total accumulates the popped cost each time a new node joins',
      ],
      teachingNote:
        'Since edges are implicit, "relax" here means recomputing Manhattan distance to the *newly added* node for every unvisited point — there\'s no adjacency list to look up, you compute the edge weight on the fly.',
    },
    interviewScript: {
      modelAnswer:
        'This is minimum spanning tree on an implicit complete graph — every pair of points is a candidate edge weighted by Manhattan distance. Kruskal would need to materialize and sort ~n² edges; instead I\'ll grow the tree with Prim\'s: start from any point, maintain each unvisited point\'s cheapest distance to the current tree, and repeatedly pull the globally cheapest one via a min-heap, using lazy deletion to skip stale heap entries for points already absorbed. Each time a point joins, I relax its Manhattan distance against every unvisited point. Total cost accumulates the n−1 edges taken. O(n² log n) time, O(n) space.',
      rubric: ['States the implicit-complete-graph MST framing up front', 'Explains Prim\'s frontier growth and the lazy-deletion heap mechanics'],
      teachingNote:
        'Explicitly contrast Kruskal vs Prim and say *why* Prim wins on a dense implicit graph (no up-front edge materialization) — that comparison is exactly what a strong MST answer demonstrates.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Track tree membership and a heap of candidate edges',
      code: 'const n = points.length\nconst inTree = new Array(n).fill(false)\nconst heap = new MinHeap<number>()\nheap.push(0, 0)   // start growing the tree from point 0, cost 0 to add it',
    },
    {
      label: '2. Pop cheapest; lazy-skip points already absorbed',
      code: 'let total = 0\nlet added = 0\nwhile (added < n) {\n  const cost = heap.peekKey()!\n  const u = heap.pop()!\n  if (inTree[u]) continue        // stale entry: u already joined via a cheaper edge\n  inTree[u] = true\n  total += cost\n  added++\n  // ...\n}',
    },
    {
      label: '3. Relax: recompute Manhattan distance to the node just added',
      code: 'for (let v = 0; v < n; v++) {\n  if (inTree[v]) continue\n  const dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1])\n  heap.push(dist, v)   // may push a worse duplicate -- fine, lazy deletion handles it\n}',
    },
    {
      label: '4. Every point has joined; total is the MST cost',
      code: 'return total',
    },
  ],
  code: {
    signature: 'export function minCostConnectPoints(points: number[][]): number {\n  // MinHeap is available: push(key, value), pop(), peek(), peekKey(), size\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], expected: 20, label: 'example one' },
      { args: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18, label: 'example two' },
      { args: [[[0, 0]]], expected: 0, label: 'single point' },
      { args: [[[0, 0], [1, 0]]], expected: 1, label: 'two points' },
      { args: [[[0, 0], [0, 5], [5, 0], [5, 5]]], expected: 15, label: 'square grid', hidden: true },
      { args: [[[-1000000, -1000000], [1000000, 1000000]]], expected: 4000000, label: 'extreme coordinates', hidden: true },
    ],
    referenceSolution:
      'export function minCostConnectPoints(points: number[][]): number {\n  const n = points.length\n  const inTree = new Array(n).fill(false)\n  const heap = new MinHeap<number>()\n  heap.push(0, 0)\n  let total = 0\n  let added = 0\n  while (added < n) {\n    const cost = heap.peekKey()!\n    const u = heap.pop()!\n    if (inTree[u]) continue\n    inTree[u] = true\n    total += cost\n    added++\n    for (let v = 0; v < n; v++) {\n      if (inTree[v]) continue\n      const dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1])\n      heap.push(dist, v)\n    }\n  }\n  return total\n}\n',
    complexity: { time: 'O(n^2 log n)', space: 'O(n)' },
  },
}
