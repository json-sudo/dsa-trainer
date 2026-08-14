import type { Problem } from '../../types'

export const containsDuplicate: Problem = {
  id: 'contains-duplicate',
  leetcodeId: 217,
  title: 'Contains Duplicate',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given an integer array `nums`, return `true` if any value appears **at least twice**, and `false` if every element is distinct.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: 'true' },
    { input: 'nums = [1,2,3,4]', output: 'false' },
    { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an unordered array of ints. Output: a single boolean — does any value repeat. No indices or which value needed, just existence of a repeat.',
      rubric: ['States output is a plain existence boolean', 'Notes order/position is irrelevant'],
      teachingNote:
        'Say out loud that the answer discards position information — that\'s the tell that a set, not an index-preserving structure, is the target data structure.',
    },
    whatToFind: {
      modelAnswer: 'Whether the array has a duplicate — i.e., whether |set(nums)| < nums.length.',
      rubric: ['Reduces to a distinctness / set-size check', 'No need to identify which value repeats'],
      teachingNote: 'Reframing "has a duplicate" as "set size shrank" is what makes the hash-set solution obvious a step early.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 1e5, values span the full int range (no bounded-range counting-array trick). O(n log n) sort or O(n) hash set both fit comfortably; hash set also avoids mutating input order.',
      rubric: ['Notes value range rules out a counting array', 'States sort O(n log n) vs hash set O(n) trade-off'],
      teachingNote: 'Wide value range is a constraint doing quiet work: it rules out counting sort/bucket tricks and pushes toward a hash set or an actual sort.',
    },
    bruteForce: {
      modelAnswer: 'Compare every pair: for i, for j > i, check nums[i] === nums[j]. O(n²) time, O(1) space.',
      rubric: ['Nested-loop pairwise comparison', 'States O(n²)'],
      teachingNote: 'Always state the brute force even when it\'s obvious — it\'s the baseline the pattern step measures waste against.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The nested loop re-scans the whole array from scratch for every element to ask "have I seen this before?" — a question a hash set answers in O(1) with memory of everything seen so far. Pattern: Hash Set for membership/seen-before tracking.',
      rubric: ['Waste: repeated re-scanning for "seen before"', 'Names hash set as O(1) membership check'],
      acceptedPatterns: ['hash-set'],
      teachingNote: '"Have I seen this before?" asked repeatedly is the single strongest tell for a hash set — flag that phrase whenever it shows up in a problem statement.',
    },
    algorithm: {
      modelAnswer:
        'Walk the array once, maintaining a Set of values seen so far. For each num, if it\'s already in the set return true immediately; otherwise add it. Return false if the loop completes. Time O(n), space O(n).',
      rubric: ['Single pass with early-exit on hit', 'Adds to set only after the check', 'States O(n)/O(n)'],
      teachingNote: 'State the check-then-add order explicitly — it signals you\'ve actually traced the loop rather than pattern-matched "use a hash set" from memory.',
    },
    interviewScript: {
      modelAnswer:
        'The output is just "does a duplicate exist", so I only need membership, not counts or positions. Brute force pairwise comparison is O(n²); a hash set lets me ask "seen before?" in O(1), so one pass with a set seen so far gives O(n) time, O(n) space, returning true the moment I hit a repeat.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'This is the shortest possible full interview script — good problem to drill the template\'s cadence without content getting in the way.',
    },
  },
  incrementalBuild: [
    {
      label: '1. A set to remember what we\'ve seen',
      code: 'const seen = new Set<number>()',
    },
    {
      label: '2. Walk once, check before insert',
      code: 'for (const num of nums) {\n  if (seen.has(num)) return true   // seen it already — duplicate found\n  seen.add(num)\n}',
    },
    {
      label: '3. No early return means everything was distinct',
      code: 'return false',
    },
  ],
  code: {
    signature: 'export function containsDuplicate(nums: number[]): boolean {\n\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3, 1]], expected: true, label: 'example with duplicate' },
      { args: [[1, 2, 3, 4]], expected: false, label: 'all distinct' },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, label: 'many duplicates' },
      { args: [[1]], expected: false, label: 'single element', hidden: true },
      { args: [[-5, 0, 5, -5]], expected: true, label: 'negative values', hidden: true },
      { args: [[7, 7]], expected: true, label: 'two identical elements', hidden: true },
    ],
    referenceSolution:
      'export function containsDuplicate(nums: number[]): boolean {\n  const seen = new Set<number>()\n  for (const num of nums) {\n    if (seen.has(num)) return true\n    seen.add(num)\n  }\n  return false\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
