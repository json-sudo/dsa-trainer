import type { Problem } from '../../types'

export const alienDictionary: Problem = {
  id: 'alien-dictionary',
  leetcodeId: 269,
  title: 'Alien Dictionary',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'advanced-graphs',
  authored: true,
  statement:
    'A list of `words` is sorted lexicographically by an **unknown** alphabet. Derive a valid letter ordering and return it as a string. Return `""` if no valid ordering exists (contradiction, or a word preceding its own prefix). If several orderings are valid, return the lexicographically-smallest-by-normal-alphabet one (this makes the answer unique for testing).',
  examples: [
    { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
    { input: 'words = ["z","x"]', output: '"zx"' },
    { input: 'words = ["z","x","z"]', output: '""', explanation: 'z before x and x before z — contradiction.' },
  ],
  constraints: ['1 <= words.length <= 100', '1 <= words[i].length <= 100', 'lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: words sorted by a hidden alphabet. Output: one valid alphabet order (tie-broken alphabetically for uniqueness), "" when contradictory or when a longer word precedes its own prefix. Only letters that appear should be output.',
      rubric: ['Both invalid cases named (cycle, prefix violation)', 'Output limited to appearing letters'],
    },
    whatToFind: {
      modelAnswer:
        'Extract ordering constraints (first differing character between adjacent words ⇒ an edge) and produce a total order consistent with them — ordering under prerequisites.',
      rubric: ['Adjacent-pair first-difference extraction', 'Recognizes ordering-under-constraints'],
    },
    constraintsHint: {
      modelAnswer:
        'Tiny volumes (10⁴ chars, ≤26 letters). The structure is the tell: pairwise precedence constraints + "impossible if contradictory" = a DAG question; a cycle is exactly a contradiction.',
      rubric: ['Constraints-as-edges, ≤26 nodes', 'Cycle ⇔ impossible identified'],
    },
    bruteForce: {
      modelAnswer:
        'Try letter permutations and test whether each sorts the word list correctly: 26! is absurd even restricted to appearing letters — pure non-starter.',
      rubric: ['Permutation testing named', 'Factorial blowup stated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Permutations ignore that constraints are *local* (one edge per adjacent word pair) and composable: a graph walk can build the order directly instead of guessing it. Kahn\'s algorithm: repeatedly emit a node with zero in-degree, decrementing its neighbors — with a min-choice tie-break for uniqueness. Pattern: BFS (topological sort).',
      rubric: ['Waste: guessing global orders vs composing local edges', 'Kahn zero-in-degree emission described'],
      acceptedPatterns: ['bfs'],
    },
    algorithm: {
      modelAnswer:
        'Build the graph: for each adjacent pair, find the first differing char → edge u→v (dedup); if no difference and the first word is longer → "". Kahn: in-degrees, start set = zero-in-degree letters (pick smallest each step for determinism), emit and decrement. If emitted < letter count → cycle → "". Time O(total chars + 26²), space O(26²).',
      rubric: [
        'Edge extraction with the prefix-violation check',
        'Kahn loop with cycle detection via emitted count',
        'Deterministic tie-break mentioned',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be testing letter permutations against the sort order — factorial, hopeless. Each adjacent word pair contributes one local constraint (its first differing letter), and a consistent global order over a constraint DAG is exactly topological sort: I\'ll build edges, then run Kahn\'s algorithm, where failing to emit every letter means a cycle — a contradiction — and a word preceding its own prefix is invalid outright. Time linear in total characters (alphabet ≤ 26).',
      rubric: ['Template followed with local-constraints-compose insight', 'Both failure modes in the plan'],
    },
  },
  code: {
    signature: 'export function alienOrder(words: string[]): string {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [['wrt', 'wrf', 'er', 'ett', 'rftt']], expected: 'wertf', label: 'example' },
      { args: [['z', 'x']], expected: 'zx', label: 'single edge' },
      { args: [['z', 'x', 'z']], expected: '', label: 'contradiction cycle' },
      { args: [['abc', 'ab']], expected: '', label: 'word before its own prefix', hidden: true },
      { args: [['a', 'b', 'ca', 'cc']], expected: 'abc', label: 'unconstrained letters alphabetical', hidden: true },
      { args: [['zy', 'zx']], expected: 'yxz', label: 'constraint deep in words', hidden: true },
    ],
    referenceSolution:
      "export function alienOrder(words: string[]): string {\n  const adj = new Map<string, Set<string>>()\n  const inDeg = new Map<string, number>()\n  for (const w of words) {\n    for (const ch of w) {\n      if (!adj.has(ch)) {\n        adj.set(ch, new Set())\n        inDeg.set(ch, 0)\n      }\n    }\n  }\n  for (let i = 0; i + 1 < words.length; i++) {\n    const a = words[i]\n    const b = words[i + 1]\n    let j = 0\n    while (j < a.length && j < b.length && a[j] === b[j]) j++\n    if (j === b.length && a.length > b.length) return ''\n    if (j < a.length && j < b.length) {\n      const u = a[j]\n      const v = b[j]\n      if (!adj.get(u)!.has(v)) {\n        adj.get(u)!.add(v)\n        inDeg.set(v, inDeg.get(v)! + 1)\n      }\n    }\n  }\n  const ready = [...inDeg.entries()].filter(([, d]) => d === 0).map(([ch]) => ch).sort()\n  let out = ''\n  while (ready.length > 0) {\n    const ch = ready.shift()!\n    out += ch\n    for (const nb of [...adj.get(ch)!].sort()) {\n      inDeg.set(nb, inDeg.get(nb)! - 1)\n      if (inDeg.get(nb) === 0) {\n        ready.push(nb)\n        ready.sort()\n      }\n    }\n  }\n  return out.length === adj.size ? out : ''\n}\n",
    complexity: { time: 'O(total chars + A²)', space: 'O(A²)' },
  },
}
