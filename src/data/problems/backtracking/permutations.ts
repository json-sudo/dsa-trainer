import type { Problem } from '../../types'

export const permutations: Problem = {
  id: 'permutations',
  leetcodeId: 46,
  title: 'Permutations',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'backtracking',
  authored: true,
  statement: 'Given an array `nums` of **distinct** integers, return all possible orderings (permutations), in any order.',
  examples: [
    { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
    { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
  ],
  constraints: ['1 <= nums.length <= 6', 'distinct integers', '-10 <= nums[i] <= 10'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: up to 6 distinct integers. Output: all n! orderings (≤720), any outer order. Output size is factorial — that is the budget.',
      rubric: ['n! output size stated', 'Distinctness removes dedup concerns'],
    },
    whatToFind: {
      modelAnswer: 'Enumerate all orderings — a generation task where each position\'s choice excludes already-used elements (choices are *dependent*, unlike subsets).',
      rubric: ['Generation over orderings', 'Dependency: used elements unavailable'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 6 → 720 permutations of length 6 ≈ 4×10³ cells of output: enumeration explicitly invited. Nothing to optimize past the output size.',
      rubric: ['Reads factorial bound as enumeration license', 'Output-size floor noted'],
    },
    bruteForce: {
      modelAnswer:
        'Generate all nⁿ position assignments and filter those using each element exactly once: O(nⁿ·n) — 46656·6 at n=6, mostly discarded work.',
      rubric: ['All-assignments + validity filter', 'States O(nⁿ)', 'Notes most candidates are invalid'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Invalid assignments are doomed the moment an element repeats, yet the brute force completes them. Track a used set and only branch on unused elements — every path generated is valid. Pattern: Backtracking (choose → recurse → un-choose with a used mask).',
      rubric: ['Waste: completing prefixes with repeats', 'Used-set branching yields only valid paths'],
      acceptedPatterns: ['backtracking'],
    },
    algorithm: {
      modelAnswer:
        'dfs(path, used): if path length = n, record a copy. Else for each i not used: mark, push, recurse, pop, unmark. Time O(n!·n) (copying each result), space O(n) for path + used.',
      rubric: ['Standard skeleton with used[] bookkeeping', 'Copy-on-record noted', 'States O(n!·n)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be generating every length-n assignment and filtering for exactly-once usage — nⁿ candidates, mostly garbage. Since a prefix with a repeat can never recover, I\'ll backtrack with a used set so every branch taken is already valid: choose an unused element, recurse, un-choose. The n! output is the complexity floor; time O(n!·n), space O(n).',
      rubric: ['Template followed with prefix-doom pruning', 'Factorial floor stated'],
    },
  },
  code: {
    signature: 'export function permute(nums: number[]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], label: 'example' },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]], label: 'two elements' },
      { args: [[7]], expected: [[7]], label: 'single element' },
      { args: [[-1, 0, 1]], expected: [[-1, 0, 1], [-1, 1, 0], [0, -1, 1], [0, 1, -1], [1, -1, 0], [1, 0, -1]], label: 'negatives', hidden: true },
      {
        args: [[1, 2, 3, 4]],
        expected: [
          [1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2],
          [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1],
          [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1],
          [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1],
        ],
        label: '24 permutations',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function permute(nums: number[]): number[][] {\n  const out: number[][] = []\n  const path: number[] = []\n  const used = new Array(nums.length).fill(false)\n  const dfs = () => {\n    if (path.length === nums.length) {\n      out.push([...path])\n      return\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue\n      used[i] = true\n      path.push(nums[i])\n      dfs()\n      path.pop()\n      used[i] = false\n    }\n  }\n  dfs()\n  return out\n}\n',
    complexity: { time: 'O(n! · n)', space: 'O(n) recursion (output excluded)' },
  },
}
