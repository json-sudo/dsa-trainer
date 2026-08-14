import type { Problem } from '../../types'

export const twoSumII: Problem = {
  id: 'two-sum-ii',
  leetcodeId: 167,
  title: 'Two Sum II (sorted)',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given a **1-indexed** array `numbers` sorted in non-decreasing order and an integer `target`, return the 1-based indices `[i, j]` (i < j) of the two numbers that add up to `target`. Exactly one solution exists, and you must use only constant extra space.',
  examples: [
    { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
    { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' },
    { input: 'numbers = [-1,0], target = -1', output: '[1,2]' },
  ],
  constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'sorted non-decreasing · exactly one solution · O(1) extra space'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a *sorted* 1-indexed integer array and a target. Output: the pair of 1-based indices, smaller first. Sorted input + index output means I must not re-sort (indices are already meaningful) — but the order is already there to exploit.',
      rubric: ['Registers sorted input as the headline fact', 'Notes 1-based index output'],
    },
    whatToFind: {
      modelAnswer: 'Existence with location: the single pair of positions whose values sum to the target — guaranteed unique.',
      rubric: ['Names existence + location of one pair', 'Uses the uniqueness guarantee'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 3×10⁴ makes O(n²) ~10⁹ too slow. The killer constraint is O(1) extra space — that outlaws the Two Sum hash map and forces an in-place technique. Sorted + O(1) space + pair-sum = the textbook two-pointer setup.',
      rubric: ['Notes the explicit O(1)-space requirement rules out the hash map', 'Combines "sorted" + budget into the pointer hint'],
    },
    bruteForce: {
      modelAnswer: 'Nested loops over all pairs i < j checking the sum: O(n²) time, O(1) space. Ignores the sortedness entirely.',
      rubric: ['All-pairs enumeration', 'States O(n²)/O(1)', 'Points out it ignores sorting'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The brute force wastes the sort order: once a pair (l, r) is too big, every pair with a larger right end is also too big — whole swaths of pairs can be discarded at once. Walk one pointer from each end: sum too small → l++ (need bigger), too big → r−− (need smaller). Pattern: Two Pointers.',
      rubric: ['Names the waste: ordering allows bulk elimination of pairs', 'States the pointer movement invariant'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'l = 0, r = n−1. While l < r: s = numbers[l] + numbers[r]. If s === target return [l+1, r+1]; if s < target, l++; else r−−. Each step permanently discards one element, so it terminates in at most n−1 steps. Time O(n), space O(1).',
      rubric: ['Inward walk with the compare-and-move rule', 'Justifies why discarding is safe (sortedness)', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be checking all pairs — O(n²), too slow for 3×10⁴ and it ignores that the array is sorted. A hash map gives O(n) but the problem demands constant space. This looks like two pointers because in sorted data, comparing the end-sum against the target tells me which end is useless. I\'ll walk pointers inward from both ends. Time O(n), space O(1).',
      rubric: ['Template followed, including why the hash map is excluded here', 'Invariant and complexity stated'],
    },
  },
  code: {
    signature: 'export function twoSumSorted(numbers: number[], target: number): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [1, 2], label: 'example' },
      { args: [[2, 3, 4], 6], expected: [1, 3], label: 'ends meet' },
      { args: [[-1, 0], -1], expected: [1, 2], label: 'minimum length + negatives' },
      { args: [[1, 2, 3, 4, 4, 9], 8], expected: [4, 5], label: 'duplicate values pair', hidden: true },
      { args: [[-3, -1, 2, 5, 9], 4], expected: [2, 4], label: 'negative + positive', hidden: true },
      { args: [[1, 1, 1, 1, 1, 9], 10], expected: [1, 6], label: 'answer spans full array', hidden: true },
    ],
    referenceSolution:
      'export function twoSumSorted(numbers: number[], target: number): number[] {\n  let l = 0\n  let r = numbers.length - 1\n  while (l < r) {\n    const sum = numbers[l] + numbers[r]\n    if (sum === target) return [l + 1, r + 1]\n    if (sum < target) l++\n    else r--\n  }\n  return []\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
