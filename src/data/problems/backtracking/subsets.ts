import type { Problem } from '../../types'

export const subsets: Problem = {
  id: 'subsets',
  leetcodeId: 78,
  title: 'Subsets',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'backtracking',
  authored: true,
  statement: 'Given an array `nums` of **unique** integers, return all possible subsets (the power set), in any order, without duplicates.',
  examples: [
    { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
    { input: 'nums = [0]', output: '[[],[0]]' },
  ],
  constraints: ['1 <= nums.length <= 10', 'unique integers', '-10 <= nums[i] <= 10'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 10 unique integers. Output: all 2ⁿ subsets including the empty one, any order. The output *is* the work — 1024 arrays at most.',
      rubric: ['Power set incl. empty subset', 'Output size 2ⁿ acknowledged'],
      teachingNote:
        'When the requested output is exponential, complexity discussion changes character: you can\'t beat the output size. State that upfront — "the answer has 2ⁿ entries, so 2ⁿ is the floor".',
    },
    whatToFind: {
      modelAnswer: 'Enumerate every combination of include/exclude decisions — a generation task over independent binary choices.',
      rubric: ['Per-element include/exclude framing', 'Generation (not search/count) named'],
      teachingNote:
        'Subsets = n independent yes/no decisions. Seeing enumeration problems as *decision sequences* is the mental move that makes backtracking mechanical instead of magical.',
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10 → 2¹⁰ = 1024 subsets: the bound exists to permit exhaustive generation. Uniqueness removes any dedup concern.',
      rubric: ['Tiny n read as the enumeration license', 'Uniqueness → no dedup logic'],
      teachingNote:
        'n ≤ 10, n ≤ 15, n ≤ 20 are enumeration bounds (2ⁿ ≈ 10³, 3×10⁴, 10⁶). Recognizing budget-by-exponent is a skill; build the lookup table in your head.',
    },
    bruteForce: {
      modelAnswer:
        'Iterate the 2ⁿ bitmasks 0..2ⁿ−1; for each, collect nums[i] where bit i is set. O(2ⁿ·n) — actually optimal here, just a different style from recursion.',
      rubric: ['Bitmask enumeration described', 'Notes it is already optimal', 'States O(2ⁿ·n)'],
      teachingNote:
        'For subsets, "brute force" and "optimal" coincide — the interesting comparison is bitmask vs recursive style. Backtracking is preferred because it generalizes (Subsets II, Combination Sum need pruning that masks can\'t express cleanly).',
    },
    wasteAndPattern: {
      modelAnswer:
        'Nothing to eliminate — every subset is demanded — so the "waste" question becomes a *structure* question: which enumeration style extends to cousins (dedup, sum constraints, pruning)? The choose → recurse → un-choose skeleton does. Pattern: Backtracking.',
      rubric: ['Recognizes no pruning is possible (all outputs needed)', 'Chooses backtracking for its extensibility'],
      acceptedPatterns: ['backtracking'],
      teachingNote:
        'This guided problem exists to install the skeleton: path.push(x) → recurse → path.pop(). Subsets is the cleanest possible specimen — learn the dance here, reuse it in every harder cousin.',
    },
    algorithm: {
      modelAnswer:
        'dfs(start, path): record a copy of path; for i from start to n−1: push nums[i], dfs(i+1, path), pop. Start dfs(0, []). Every node in the recursion tree emits one subset. Time O(2ⁿ·n) (copying), space O(n) for the path.',
      rubric: [
        'Record-at-every-node variant (no explicit include/exclude branch needed)',
        'Push/recurse/pop discipline with the copy on record',
        'States O(2ⁿ·n)/O(n)',
      ],
      teachingNote:
        'Two classic shapes exist: record-at-every-node (shown) and binary include/exclude branching. Both are correct; pick one and be consistent. The copy on record ([...path]) is the bug interviewers watch for.',
    },
    interviewScript: {
      modelAnswer:
        'The output is the power set — 2ⁿ entries — so exponential time is the floor, and n ≤ 10 confirms enumeration is intended. I could iterate bitmasks, but I\'ll use the backtracking skeleton — choose, recurse, un-choose — because it extends directly to the follow-ups this family always has (duplicates, sum targets, pruning). Each recursion node records its path as one subset. Time O(2ⁿ·n), space O(n) beyond the output.',
      rubric: ['Names the output-size floor', 'Justifies backtracking over bitmask by extensibility'],
      teachingNote:
        'When the brute force is optimal, your script should *say so* and justify the structure choice instead — that\'s what there is to demonstrate on this problem.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Shared mutable path + the recursion skeleton',
      code: 'const out: number[][] = []\nconst path: number[] = []       // the current partial subset\nconst dfs = (start: number) => {\n  // "start" prevents revisiting earlier elements -> no duplicate subsets\n}',
    },
    {
      label: '2. Every recursion node IS a subset — record a copy',
      code: 'out.push([...path])   // copy! path keeps mutating after this line',
    },
    {
      label: '3. Choose → recurse → un-choose',
      code: 'for (let i = start; i < nums.length; i++) {\n  path.push(nums[i])   // choose\n  dfs(i + 1)           // recurse on the elements after i\n  path.pop()           // un-choose: restore for the next branch\n}',
    },
  ],
  code: {
    signature: 'export function subsets(nums: number[]): number[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], label: 'example' },
      { args: [[0]], expected: [[], [0]], label: 'single element' },
      { args: [[1, 2]], expected: [[], [1], [2], [1, 2]], label: 'two elements' },
      {
        args: [[-1, 5]],
        expected: [[], [-1], [5], [-1, 5]],
        label: 'negative values',
        hidden: true,
      },
      {
        args: [[1, 2, 3, 4]],
        expected: [
          [], [1], [2], [3], [4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4],
          [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4], [1, 2, 3, 4],
        ],
        label: 'sixteen subsets',
        hidden: true,
      },
    ],
    referenceSolution:
      'export function subsets(nums: number[]): number[][] {\n  const out: number[][] = []\n  const path: number[] = []\n  const dfs = (start: number) => {\n    out.push([...path])\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i])\n      dfs(i + 1)\n      path.pop()\n    }\n  }\n  dfs(0)\n  return out\n}\n',
    complexity: { time: 'O(2ⁿ · n)', space: 'O(n) recursion (output excluded)' },
  },
}
