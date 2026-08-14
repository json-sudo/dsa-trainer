import type { Problem } from '../../types'

export const threeSum: Problem = {
  id: 'three-sum',
  leetcodeId: 15,
  title: '3Sum',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given an integer array `nums`, return every unique triplet `[a, b, c]` with `a + b + c = 0`. Triplets must not repeat, but may be returned in any order. Elements at three distinct indices form a triplet.',
  examples: [
    {
      input: 'nums = [-1,0,1,2,-1,-4]',
      output: '[[-1,-1,2],[-1,0,1]]',
      explanation: 'The two distinct triplets summing to zero. [-1,0,1] appears once even though -1 occurs twice.',
    },
    { input: 'nums = [0,1,1]', output: '[]' },
    { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
  ],
  constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: one unsorted integer array (n up to 3000, values ±10⁵, duplicates allowed). Output: an array of triplets of *values* — not indices — with no duplicate triplets, order free.',
      rubric: [
        'Notes output is values, not indices — so sorting the input is allowed',
        'Notes the no-duplicate-triplets requirement explicitly',
      ],
      teachingNote:
        'Contrast with Two Sum: there the output was indices, which forbids sorting. Here it\'s values — the moment you say that out loud, sorting becomes a legal and attractive move. Always ask "does the output shape permit reordering the input?"',
    },
    whatToFind: {
      modelAnswer:
        'Find all groups: every distinct value-triple summing to zero. It\'s an exhaustive search with a deduplication constraint, not a single-answer existence check.',
      rubric: ['Identifies "all unique triplets" (exhaustive + dedupe)', 'Distinguishes from single-pair existence'],
      teachingNote:
        '"Return all X" changes the complexity floor: the output itself can be large, so the answer is at least the output size. Dedup requirements almost always mean "sort, then skip equal neighbors".',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 3000: n³ ≈ 2.7×10¹⁰ is far too slow, but n² ≈ 9×10⁶ is comfortable. Budget O(n²) — which is a hint that the intended solution fixes one element and solves a linear subproblem for the rest.',
      rubric: ['Rules out O(n³), accepts O(n²) from n ≤ 3000', 'Reads the budget as "fix one element + linear scan"'],
      teachingNote:
        'When the budget lands on O(n²) for a triple-search, decompose: an O(n²) triple-finder is usually "for each element, run an O(n) pair-finder". You already own the O(n) pair-finder from Two Sum II — sorted two pointers.',
    },
    bruteForce: {
      modelAnswer:
        'Three nested loops over i < j < k testing each sum, collecting triplets in a set keyed by the sorted triple to dedupe. O(n³) time, O(n) space for the dedup set — 2.7×10¹⁰ checks, far over budget.',
      rubric: ['Triple loop + dedup set described', 'States O(n³) and ties it to the bound', 'States space'],
      teachingNote:
        'Even in guided mode, say the brute force fully — including how you would deduplicate. Interviewers often probe the dedup story first, because it is where sloppy solutions break.',
    },
    wasteAndPattern: {
      modelAnswer:
        'After fixing the first element, the inner double loop blindly checks all pairs when the remaining task is exactly "find pairs summing to a known target" — solvable in O(n) on sorted data by walking two pointers inward. Sorting also makes duplicate-skipping trivial. Pattern: Two Pointers (sort first).',
      rubric: [
        'Names the waste: the inner pair-search ignores sorted structure',
        'Reduces to the known sorted-pair-sum subproblem',
      ],
      acceptedPatterns: ['two-pointers'],
      teachingNote:
        'The reduction move — "fix one variable, recognize the rest as a solved problem" — is one of the most reusable interview tricks. 3Sum is literally Two Sum II inside a loop.',
    },
    algorithm: {
      modelAnswer:
        'Sort. For each i (skipping values equal to the previous i to dedupe), set l = i+1, r = n−1. While l < r: sum = nums[i]+nums[l]+nums[r]; if 0, record and advance l past duplicates, decrement r past duplicates; if sum < 0, l++; else r−−. Early-exit when nums[i] > 0. Time O(n²), space O(1) beyond output.',
      rubric: [
        'Sort + fixed-i + inward two pointers with the sum comparison rule',
        'Duplicate skipping at both the i level and the l/r level',
        'States O(n²) time',
      ],
      teachingNote:
        'The three dedup points (i, l, r) are where this problem is failed in interviews. Say each one before coding: "skip equal i, and after recording a hit, advance both pointers past equal values".',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be three nested loops with a dedup set — that\'s O(n³), hopeless at n = 3000. This looks like a two-pointers problem because once I sort and fix the smallest element, the rest is "find a pair with a target sum in a sorted array", which two inward pointers solve in linear time. I\'ll sort, loop the anchor, and sweep pointers, skipping duplicates at every level. Time O(n²), space O(1) extra.',
      rubric: ['Template followed: brute → why slow → reduction insight → plan → complexity', 'Mentions dedup handling'],
      teachingNote:
        'Note the script sells the *reduction*, not the code. Senior candidates name the subproblem they are reusing; that is what "sounding senior" means in practice.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Sort, then anchor the smallest element (skip duplicate anchors)',
      code: 'const sorted = [...nums].sort((a, b) => a - b)\nfor (let i = 0; i < sorted.length - 2; i++) {\n  if (sorted[i] > 0) break                       // anchors past 0 can never sum to 0\n  if (i > 0 && sorted[i] === sorted[i - 1]) continue   // dedup level 1: the anchor\n}',
    },
    {
      label: '2. The rest is Two Sum II: inward pointers on the sorted suffix',
      code: 'let l = i + 1\nlet r = sorted.length - 1\nwhile (l < r) {\n  const sum = sorted[i] + sorted[l] + sorted[r]\n  if (sum < 0) l++        // need bigger\n  else if (sum > 0) r--   // need smaller\n}',
    },
    {
      label: '3. On a hit: record, then skip equal values on BOTH sides',
      code: 'out.push([sorted[i], sorted[l], sorted[r]])\nl++\nr--\nwhile (l < r && sorted[l] === sorted[l - 1]) l++   // dedup level 2\nwhile (l < r && sorted[r] === sorted[r + 1]) r--   // dedup level 3',
    },
  ],
  code: {
    signature: 'export function threeSum(nums: number[]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], label: 'example' },
      { args: [[0, 1, 1]], expected: [], label: 'no solution' },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]], label: 'all zeros' },
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]], label: 'duplicate zero triplets', hidden: true },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]], label: 'two triplets sharing anchor', hidden: true },
      { args: [[1, 2, 3]], expected: [], label: 'all positive', hidden: true },
    ],
    referenceSolution:
      'export function threeSum(nums: number[]): number[][] {\n  const sorted = [...nums].sort((a, b) => a - b)\n  const out: number[][] = []\n  for (let i = 0; i < sorted.length - 2; i++) {\n    if (sorted[i] > 0) break\n    if (i > 0 && sorted[i] === sorted[i - 1]) continue\n    let l = i + 1\n    let r = sorted.length - 1\n    while (l < r) {\n      const sum = sorted[i] + sorted[l] + sorted[r]\n      if (sum === 0) {\n        out.push([sorted[i], sorted[l], sorted[r]])\n        l++\n        r--\n        while (l < r && sorted[l] === sorted[l - 1]) l++\n        while (l < r && sorted[r] === sorted[r + 1]) r--\n      } else if (sum < 0) {\n        l++\n      } else {\n        r--\n      }\n    }\n  }\n  return out\n}\n',
    complexity: { time: 'O(n²)', space: 'O(1) extra (output excluded)' },
  },
}
