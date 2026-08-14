import type { Problem } from '../../types'

export const cloneGraph: Problem = {
  id: 'clone-graph',
  leetcodeId: 133,
  title: 'Clone Graph',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'graphs',
  authored: true,
  statement:
    'Given a node of a **connected undirected graph** (nodes hold `val` and a `neighbors` array), return a **deep copy** of the graph: all-new node objects with identical structure. The scaffold in the editor converts the test\'s adjacency list into real node objects, calls your `clone`, verifies no original node was reused, and re-serializes the result.',
  examples: [
    { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]', explanation: 'Same shape, entirely new nodes.' },
    { input: 'adjList = [[]]', output: '[[]]', explanation: 'One node, no neighbors.' },
    { input: 'adjList = []', output: '[]' },
  ],
  constraints: ['0 <= number of nodes <= 100', '1 <= node.val <= 100', 'connected, undirected, no self-loops or parallel edges'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: one entry node of an object graph (possibly null). Output: a structurally identical graph of *new* objects — returning any original node is wrong even if values match.',
      rubric: ['Deep-copy (new objects) requirement stated', 'Null/empty graph case'],
    },
    whatToFind: {
      modelAnswer:
        'A construct task with aliasing: every original node maps to exactly one clone, and cycles mean I will re-encounter nodes — the old→new correspondence must be remembered.',
      rubric: ['One-to-one old→new mapping named', 'Cycles force revisit handling'],
    },
    constraintsHint: {
      modelAnswer:
        '≤ 100 nodes — size is irrelevant; the constraint that bites is "undirected" (every edge is a 2-cycle), so naive recursion without memory loops forever.',
      rubric: ['Identifies the infinite-recursion hazard from cycles', 'Size not the issue'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively clone each neighbor without tracking what\'s been cloned: on the first undirected edge A—B the recursion ping-pongs A→B→A→… — non-terminating. The "brute force" here is simply *incorrect*, which is the point.',
      rubric: ['Shows why memoryless recursion diverges', 'Recognizes correctness (not speed) is the obstacle'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The failed recursion re-clones nodes it has already cloned (infinitely so, on cycles). Remember every clone in a map keyed by the original node (or its val): re-encountering a node returns its existing clone, turning cycles into simple lookups. Pattern: DFS + Hash Map (visited-with-payload).',
      rubric: ['Re-cloning identified as the waste/divergence', 'Map old→clone as both visited-set and cache'],
      acceptedPatterns: ['dfs', 'hash-map'],
    },
    algorithm: {
      modelAnswer:
        'map: original → clone. clone(node): if null → null; if mapped, return the mapping; create the clone, register it in the map *before* recursing, then clone each neighbor into its neighbors array. Registering-before-recursing is what breaks the cycle. Time O(V+E), space O(V).',
      rubric: [
        'Map checked first, clone registered before neighbor recursion',
        'Explains why early registration terminates cycles',
        'States O(V+E)/O(V)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Naive recursive copying diverges here: undirected edges are cycles, so A clones B which clones A forever. The fix is a hash map from original to clone acting as visited-set-with-payload: register each clone before recursing into neighbors, and any re-encounter returns the existing clone. One DFS then copies every node and edge exactly once. Time O(V+E), space O(V).',
      rubric: ['Template adapted: correctness obstacle → map fix', 'Register-before-recurse detail stated'],
    },
  },
  code: {
    signature:
      'interface GraphNode { val: number; neighbors: GraphNode[] }\n\n// Harness scaffold — builds nodes from the adjacency list, calls your clone,\n// rejects reused originals, and re-serializes. Implement clone() below.\nexport function cloneGraph(adjList: number[][]): number[][] {\n  const originals: GraphNode[] = adjList.map((_, i) => ({ val: i + 1, neighbors: [] }))\n  adjList.forEach((nbrs, i) => {\n    originals[i].neighbors = nbrs.map((v) => originals[v - 1])\n  })\n  const entry = originals.length > 0 ? originals[0] : null\n  const cloned = clone(entry)\n  if (originals.length === 0) return cloned === null ? [] : [[-1]]\n  if (cloned === null) return [[-2]]\n  const originalSet = new Set(originals)\n  const seen = new Map<number, GraphNode>()\n  const queue: GraphNode[] = [cloned]\n  while (queue.length > 0) {\n    const node = queue.shift()!\n    if (seen.has(node.val)) continue\n    if (originalSet.has(node)) return [[-1]] // reused an original node!\n    seen.set(node.val, node)\n    for (const nb of node.neighbors) if (!seen.has(nb.val)) queue.push(nb)\n  }\n  return adjList.map((_, i) => {\n    const node = seen.get(i + 1)\n    return node ? node.neighbors.map((nb) => nb.val).sort((a, b) => a - b) : [-3]\n  })\n}\n\nfunction clone(node: GraphNode | null): GraphNode | null {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]], label: 'example square' },
      { args: [[[]]], expected: [[]], label: 'single node no edges' },
      { args: [[]], expected: [], label: 'empty graph' },
      { args: [[[2], [1]]], expected: [[2], [1]], label: 'two-node edge', hidden: true },
      {
        args: [[[2, 3, 4], [1, 3], [1, 2], [1]]],
        expected: [[2, 3, 4], [1, 3], [1, 2], [1]],
        label: 'hub with triangle',
        hidden: true,
      },
    ],
    referenceSolution:
      'interface GraphNode { val: number; neighbors: GraphNode[] }\n\nexport function cloneGraph(adjList: number[][]): number[][] {\n  const originals: GraphNode[] = adjList.map((_, i) => ({ val: i + 1, neighbors: [] }))\n  adjList.forEach((nbrs, i) => {\n    originals[i].neighbors = nbrs.map((v) => originals[v - 1])\n  })\n  const entry = originals.length > 0 ? originals[0] : null\n  const cloned = clone(entry)\n  if (originals.length === 0) return cloned === null ? [] : [[-1]]\n  if (cloned === null) return [[-2]]\n  const originalSet = new Set(originals)\n  const seen = new Map<number, GraphNode>()\n  const queue: GraphNode[] = [cloned]\n  while (queue.length > 0) {\n    const node = queue.shift()!\n    if (seen.has(node.val)) continue\n    if (originalSet.has(node)) return [[-1]]\n    seen.set(node.val, node)\n    for (const nb of node.neighbors) if (!seen.has(nb.val)) queue.push(nb)\n  }\n  return adjList.map((_, i) => {\n    const node = seen.get(i + 1)\n    return node ? node.neighbors.map((nb) => nb.val).sort((a, b) => a - b) : [-3]\n  })\n}\n\nfunction clone(node: GraphNode | null): GraphNode | null {\n  const map = new Map<GraphNode, GraphNode>()\n  const dfs = (n: GraphNode | null): GraphNode | null => {\n    if (!n) return null\n    const existing = map.get(n)\n    if (existing) return existing\n    const copy: GraphNode = { val: n.val, neighbors: [] }\n    map.set(n, copy)\n    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb)!)\n    return copy\n  }\n  return dfs(node)\n}\n',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
  },
}
