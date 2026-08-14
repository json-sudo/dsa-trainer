import type { Problem } from '../../types'

export const longestConsecutiveSequence: Problem = {
  id: 'longest-consecutive-sequence',
  leetcodeId: 128,
  title: 'Longest Consecutive Sequence',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given an unsorted array of integers `nums`, return the length of the longest run of consecutive integers present in the array. The array is not sorted and the run does not need to appear in order within it. Your algorithm must run in **O(n)** time.',
  examples: [
    { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The run is [1,2,3,4].' },
    { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', explanation: 'The run is [0,1,2,3,4,5,6,7,8].' },
  ],
  constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an unsorted integer array, possibly with duplicates, up to 10⁵ elements. Output: a single integer — the length of the longest run of consecutive values. Order in the array is irrelevant; only which values are present matters.',
      rubric: ['Notes the array is unsorted and order does not matter', 'Output is a length, and duplicates may appear'],
    },
    whatToFind: {
      modelAnswer:
        'A membership question repeated many times: for the values present, find the longest chain where each value is exactly one more than the last. This is about which numbers exist, not their positions.',
      rubric: ['Frames it as a "which values exist" / membership problem', 'Identifies the chain-of-consecutive-values goal'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ with an explicit O(n) requirement rules out sorting (O(n log n)) as the intended solution, even though sorting would be correct. Values can be very large or negative, so no counting array — a hash set for O(1) membership checks is the fit.',
      rubric: ['Notes the explicit O(n) bound rules out sorting as optimal', 'Value range rules out a counting/bucket array'],
    },
    bruteForce: {
      modelAnswer:
        'Sort the array, then walk through counting consecutive runs (skipping duplicates). O(n log n) time, O(1) or O(n) space depending on sort. Correct, but the sort is more work than the problem\'s O(n) budget allows.',
      rubric: ['Names the sort-then-scan approach', 'States O(n log n) time and identifies it exceeds the required bound'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting does global ordering work just to find local runs — I only need O(1) membership checks, not order. Put everything in a hash set; then for each value, only start counting a run when `value - 1` is absent (a true run start), and count forward while `value + 1` exists. Every element is visited at most twice total. Pattern: Hash Set.',
      rubric: ['Names the waste: sorting for global order when only membership is needed', 'States the "only start at value-1 absent" trick to avoid rescanning runs'],
      acceptedPatterns: ['hash-set'],
    },
    algorithm: {
      modelAnswer:
        'Put all numbers in a Set. For each number n in the set, if n-1 is not in the set, it\'s a run start: count forward from n while n+length is in the set, tracking the max length seen. Skip numbers where n-1 is present (they get counted from their own run start). Time O(n) — each number is visited by the inner loop only as part of its own run — space O(n).',
      rubric: ['Only starts counting from true run starts (n-1 absent)', 'Counts forward with a while loop tracking max length', 'States O(n)/O(n) and explains why the inner loop stays amortized O(n) total'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force is sort then scan for runs — O(n log n), but the problem explicitly asks for O(n), so sorting is off the table. Since I only need to know which values exist, a hash set gives O(1) membership. The key trick: only start counting a run from a number whose predecessor is missing, so I never re-walk the same run twice — that keeps total work linear. Time O(n), space O(n).',
      rubric: ['Follows the script template end-to-end', 'States the run-start trick and the final O(n)/O(n) complexity'],
    },
  },
  code: {
    signature: 'export function longestConsecutive(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4, label: 'example' },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9, label: 'with duplicate' },
      { args: [[]], expected: 0, label: 'empty array' },
      { args: [[1, 2, 0, 1]], expected: 3, label: 'duplicates inside run', hidden: true },
      { args: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7, label: 'negative numbers', hidden: true },
      { args: [[5]], expected: 1, label: 'single element', hidden: true },
    ],
    referenceSolution:
      'export function longestConsecutive(nums: number[]): number {\n  const set = new Set(nums)\n  let longest = 0\n  for (const n of set) {\n    if (set.has(n - 1)) continue\n    let length = 1\n    while (set.has(n + length)) length++\n    longest = Math.max(longest, length)\n  }\n  return longest\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
