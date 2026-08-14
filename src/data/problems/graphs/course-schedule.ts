import type { Problem } from '../../types'

export const courseSchedule: Problem = {
  id: 'course-schedule',
  leetcodeId: 207,
  title: 'Course Schedule',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'graphs',
  authored: true,
  statement:
    'There are `numCourses` courses labeled `0` to `numCourses - 1`. `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return true if you can finish all courses, false otherwise.',
  examples: [
    { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take 0, then 1.' },
    { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: '0 needs 1 and 1 needs 0 — a cycle.' },
  ],
  constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', 'all prerequisite pairs unique'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: numCourses and a list of "a needs b" directed dependency edges. Output: a single boolean — can every course be scheduled at all. This is a feasibility question, not "produce an order" (though the two are equivalent).',
      rubric: ['Directed dependency-edge framing (a needs b, not a↔b)', 'Feasibility (boolean), equivalent to "an ordering exists"'],
      teachingNote:
        'Translate immediately: "b before a" is a directed edge b → a (or a → b, pick one and be consistent) in a dependency graph. The direction convention matters — state which way you\'re building it.',
    },
    whatToFind: {
      modelAnswer: 'Determine whether the directed dependency graph is a DAG — i.e., whether a valid topological order exists, which happens iff there is no cycle.',
      rubric: ['DAG / topological-order framing', 'Feasible iff acyclic, stated as the core equivalence'],
      teachingNote:
        '"Can I finish all courses" = "does this graph have a topological order" = "is this graph acyclic" — three phrasings of one fact. Say all three; it shows you see through to the invariant.',
    },
    constraintsHint: {
      modelAnswer:
        'numCourses <= 2000, edges <= 5000: a linear-in-(V+E) algorithm is comfortably fast, and there\'s no reason to reach for anything beyond one clean traversal — this is a sizing check, not a pressure point.',
      rubric: ['States V+E is small enough for a linear algorithm', 'No exotic optimization implied by the bounds'],
      teachingNote:
        'When bounds are this generous, say so briefly and move to the real question (cycle detection), rather than dwelling on performance that was never in doubt.',
    },
    bruteForce: {
      modelAnswer:
        'Simulate scheduling greedily: repeatedly scan all courses, take any whose prerequisites are already satisfied, remove it, repeat until stuck or done. Each full pass is O(V+E); up to V passes → O(V·(V+E)) — correct but re-scans satisfied courses every round.',
      rubric: ['Repeated-full-scan simulation described', 'States the O(V·(V+E)) cost and the re-scanning waste'],
      teachingNote:
        'This "brute force" is really Kahn\'s algorithm done inefficiently (no queue) — a nice bridge: the fix is purely a data-structure change, not a new idea.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The repeated full scans re-check courses whose in-degree hasn\'t changed since the last pass. Track each course\'s remaining prerequisite count (in-degree) and only revisit a course exactly when its count hits zero — a queue of "just became available" courses does this in one pass. Pattern: BFS (Kahn\'s topological sort); DFS with three-color cycle detection is an equally valid alternative.',
      rubric: ['Waste: re-scanning courses whose in-degree is unchanged', 'Queue-driven in-degree tracking (Kahn\'s) as the fix'],
      acceptedPatterns: ['dfs', 'bfs'],
      teachingNote:
        'Mention DFS coloring (white/gray/black, cycle iff a gray node is revisited) as the alternative — knowing both approaches to cycle detection is worth a sentence even if you implement only one.',
    },
    algorithm: {
      modelAnswer:
        'Build adjacency list from b → a for each [a, b], and inDegree[a]++. Queue all courses with inDegree 0. Pop course u, increment a processed counter, for each neighbor v of u decrement inDegree[v] and enqueue v if it hits 0. After the queue empties, return processed === numCourses.',
      rubric: [
        'Correct edge direction (prereq → dependent) and in-degree setup',
        'Queue-driven processing with decrement-and-enqueue-at-zero',
        'Final check: processed count equals numCourses',
      ],
      teachingNote:
        'The processed-count check is the whole cycle detector: nodes stuck in a cycle never reach in-degree 0, so they\'re never enqueued, so the final count falls short — no separate cycle-detection logic needed.',
    },
    interviewScript: {
      modelAnswer:
        'Finishing all courses is possible exactly when the prerequisite graph is acyclic, so this reduces to cycle detection, or equivalently, checking a topological order exists. Naively re-scanning all courses each round to find newly-available ones is O(V·(V+E)); instead I\'ll track in-degree per course and use a queue — Kahn\'s algorithm — so each course is processed exactly once, right when its last prerequisite clears. If the count of processed courses ends short of numCourses, some courses are stuck in a cycle and can never be scheduled. O(V+E) time and space.',
      rubric: ['States the acyclic-iff-feasible equivalence up front', 'Explains Kahn\'s queue mechanism and the shortfall-implies-cycle argument'],
      teachingNote:
        'The line "if fewer than numCourses get processed, the rest are stuck in a cycle" is the crux — say it explicitly rather than letting the return statement speak for itself.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Adjacency list (prereq -> dependent) and in-degree counts',
      code: 'const adj: number[][] = Array.from({ length: numCourses }, () => [])\nconst inDegree = new Array(numCourses).fill(0)\nfor (const [a, b] of prerequisites) {\n  adj[b].push(a)   // b must come before a\n  inDegree[a]++\n}',
    },
    {
      label: '2. Seed the queue with everything already available',
      code: 'const queue: number[] = []\nfor (let c = 0; c < numCourses; c++) {\n  if (inDegree[c] === 0) queue.push(c)   // no prerequisites left to satisfy\n}',
    },
    {
      label: '3. Process in order; a course frees its dependents only when ready',
      code: 'let processed = 0\nwhile (queue.length > 0) {\n  const u = queue.shift()!\n  processed++\n  for (const v of adj[u]) {\n    if (--inDegree[v] === 0) queue.push(v)   // v just became available\n  }\n}',
    },
    {
      label: '4. Shortfall means some courses never freed up: a cycle',
      code: 'return processed === numCourses',
    },
  ],
  code: {
    signature: 'export function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [2, [[1, 0]]], expected: true, label: 'simple chain' },
      { args: [2, [[1, 0], [0, 1]]], expected: false, label: 'two-course cycle' },
      { args: [1, []], expected: true, label: 'no prerequisites' },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true, label: 'diamond DAG', hidden: true },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, label: 'three-course cycle', hidden: true },
      { args: [5, [[1, 0], [2, 1], [3, 2]]], expected: true, label: 'unrelated course has no prereqs', hidden: true },
    ],
    referenceSolution:
      'export function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  const adj: number[][] = Array.from({ length: numCourses }, () => [])\n  const inDegree = new Array(numCourses).fill(0)\n  for (const [a, b] of prerequisites) {\n    adj[b].push(a)\n    inDegree[a]++\n  }\n  const queue: number[] = []\n  for (let c = 0; c < numCourses; c++) {\n    if (inDegree[c] === 0) queue.push(c)\n  }\n  let processed = 0\n  while (queue.length > 0) {\n    const u = queue.shift()!\n    processed++\n    for (const v of adj[u]) {\n      if (--inDegree[v] === 0) queue.push(v)\n    }\n  }\n  return processed === numCourses\n}\n',
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
  },
}
