import type { Problem } from '../../types'

export const subsetsIi: Problem = {
  id: 'subsets-ii',
  leetcodeId: 90,
  title: 'Subsets II',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'backtracking',
  authored: true,
  statement:
    'Given an integer array `nums` that **may contain duplicates**, return all possible subsets (the power set), in any order, with no duplicate subsets in the output.',
  examples: [
    { input: 'nums = [1,2,2]', output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]' },
    { input: 'nums = [0]', output: '[[],[0]]' },
  ],
  constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'nums may contain duplicate values'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10 integers that may repeat. Output: all subsets, any order, but as a *set* of subsets — no two output arrays may represent the same multiset of elements, even though the underlying array has duplicate values.',
      rubric: ['Notes duplicates are allowed in the input', 'Output must be duplicate-free as sets of subsets'],
    },
    whatToFind: {
      modelAnswer:
        'The same include/exclude enumeration as plain Subsets, but with an added dedup constraint: two different index-choices that produce the same value-sequence must collapse into one output entry.',
      rubric: ['Frames it as Subsets plus a dedup requirement', 'Distinguishes index-level choices from value-level equality'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10 → still a 2ⁿ ≈ 1024 enumeration budget, same as plain Subsets. The constraint that actually matters here is "may contain duplicates" — it is a correctness signal, not a performance one, so the fix belongs inside the generation loop, not in post-processing speed.',
      rubric: ['Reads n ≤ 10 as the same enumeration license as Subsets', 'Identifies duplicates as a correctness (not perf) concern'],
    },
    bruteForce: {
      modelAnswer:
        'Run the plain Subsets backtracking (choose/recurse/un-choose over every index) and stuff every generated subset into a set keyed by a sorted/stringified representation to filter duplicates after the fact. O(2ⁿ·n) generation plus O(2ⁿ·n log n) to dedup — correct, but it does a lot of throwaway work generating subsets it then discards.',
      rubric: ['Generate-then-dedup-via-set approach described', 'States it wastes work producing subsets it later discards'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Post-hoc deduplication builds duplicate subsets fully before discovering they are duplicates. If `nums` is sorted first, duplicate subsets always arise from picking the same repeated value at the same recursion depth as a sibling call already explored — so skip a candidate index i (i > start) whenever nums[i] === nums[i-1]; that prunes the duplicate branch before it is ever built. Pattern: Backtracking (with sort + same-depth skip).',
      rubric: ['Names the waste: full duplicate subsets built and only filtered afterward', 'Proposes sort + skip-equal-sibling-at-same-depth pruning'],
      acceptedPatterns: ['backtracking'],
    },
    algorithm: {
      modelAnswer:
        'Sort nums first so equal values become adjacent. dfs(start, path): record a copy of path; for i from start to n−1: if i > start and nums[i] === nums[i−1], skip (this candidate was already explored as a sibling at this depth) — otherwise push nums[i], dfs(i+1), pop. Start dfs(0, []). Time O(2ⁿ·n) worst case, space O(n) for the path (plus sort O(n log n)).',
      rubric: [
        'Sorts nums before recursing',
        'Skip condition is i > start && nums[i] === nums[i-1] (sibling-level, not path-level)',
        'States roughly O(2ⁿ·n) time / O(n) auxiliary space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'This is plain Subsets with duplicate values in the input. Generating everything and deduping with a set afterward works but wastes effort building subsets it then throws away. Instead I\'ll sort nums so equal values sit together, then in the backtracking loop skip any index i > start where nums[i] equals nums[i-1] — that means "I already explored picking this value as a sibling at this depth, skip it" — which prunes duplicate subsets before they\'re ever built. Time O(2ⁿ·n), space O(n) beyond the output.',
      rubric: ['Names the generate-then-filter waste versus pruning', 'States the sort + same-depth-skip rule precisely'],
    },
  },
  code: {
    signature: 'export function subsetsWithDup(nums: number[]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]], label: 'example' },
      { args: [[0]], expected: [[], [0]], label: 'single element' },
      { args: [[1, 1]], expected: [[], [1], [1, 1]], label: 'all duplicates' },
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], label: 'no duplicates (same as Subsets)', hidden: true },
      {
        args: [[4, 4, 4, 1, 4]],
        expected: [
          [], [1], [1, 4], [1, 4, 4], [1, 4, 4, 4], [1, 4, 4, 4, 4],
          [4], [4, 4], [4, 4, 4], [4, 4, 4, 4],
        ],
        label: 'heavy duplication',
        hidden: true,
      },
      { args: [[-1, -1]], expected: [[], [-1], [-1, -1]], label: 'negative duplicates', hidden: true },
    ],
    referenceSolution:
      'export function subsetsWithDup(nums: number[]): number[][] {\n  const sorted = [...nums].sort((a, b) => a - b)\n  const out: number[][] = []\n  const path: number[] = []\n  const dfs = (start: number) => {\n    out.push([...path])\n    for (let i = start; i < sorted.length; i++) {\n      if (i > start && sorted[i] === sorted[i - 1]) continue\n      path.push(sorted[i])\n      dfs(i + 1)\n      path.pop()\n    }\n  }\n  dfs(0)\n  return out\n}\n',
    complexity: { time: 'O(2ⁿ · n)', space: 'O(n) recursion (output excluded)' },
  },
}
