import type { Problem } from '../../types'

export const searchInsertPosition: Problem = {
  id: 'search-insert-position',
  leetcodeId: 35,
  title: 'Search Insert Position',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'binary-search',
  authored: true,
  statement:
    'Given a sorted array of **distinct** integers `nums` and a `target`, return the index of `target` if present; otherwise return the index where it would be inserted to keep the array sorted. Required: O(log n) runtime.',
  examples: [
    { input: 'nums = [1,3,5,6], target = 5', output: '2' },
    { input: 'nums = [1,3,5,6], target = 2', output: '1' },
    { input: 'nums = [1,3,5,6], target = 7', output: '4' },
  ],
  constraints: ['1 <= nums.length <= 10^4', 'distinct, sorted ascending', '-10^4 <= nums[i], target <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a sorted, duplicate-free array and a target. Output: one index — either the match position or the insertion point (0..n inclusive; the answer can be n).',
      rubric: ['Notes sorted + distinct', 'Insertion point can equal n (past the end)'],
    },
    whatToFind: {
      modelAnswer:
        'The first index whose value is ≥ target — one formulation covers both the found and not-found cases. A position search, i.e. lower bound.',
      rubric: ['Unifies both cases as "first index with value ≥ target"', 'Names it a position/lower-bound search'],
    },
    constraintsHint: {
      modelAnswer: 'The problem explicitly demands O(log n); sorted input is the structure that makes halving sound. n is small, but the requirement fixes the technique.',
      rubric: ['Reads the explicit O(log n) mandate', 'Sorted = the halving license'],
    },
    bruteForce: {
      modelAnswer: 'Scan left to right for the first value ≥ target: O(n) time, O(1) space. Correct, but violates the required O(log n).',
      rubric: ['Linear first-≥ scan', 'States O(n) and the contract violation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan inspects elements the ordering already vouches for: comparing the middle once tells me which half the boundary is in, eliminating the other half wholesale. Pattern: Binary Search (lower bound).',
      rubric: ['Waste: inspecting elements sortedness can eliminate', 'Halving toward the boundary'],
      acceptedPatterns: ['binary-search'],
    },
    algorithm: {
      modelAnswer:
        'lo = 0, hi = n (note: n, not n−1 — the insertion point may be past the end). While lo < hi: mid = ⌊(lo+hi)/2⌋; if nums[mid] >= target, hi = mid; else lo = mid + 1. Return lo. Time O(log n), space O(1).',
      rubric: ['hi initialized to n to allow insertion at the end', 'Lower-bound loop with correct branches', 'States O(log n)'],
    },
    interviewScript: {
      modelAnswer:
        'A linear scan for the first value ≥ target is O(n), but the problem requires O(log n) and the array is sorted. This is a lower-bound binary search: the predicate "value ≥ target" is monotone across a sorted array, so I can halve toward its first true position, with hi starting at n so an insert-at-end falls out naturally. Time O(log n), space O(1).',
      rubric: ['Template followed with lower-bound framing', 'Insert-at-end edge mentioned'],
    },
  },
  code: {
    signature: 'export function searchInsert(nums: number[], target: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 3, 5, 6], 5], expected: 2, label: 'exact match' },
      { args: [[1, 3, 5, 6], 2], expected: 1, label: 'insert between' },
      { args: [[1, 3, 5, 6], 7], expected: 4, label: 'insert at end' },
      { args: [[1, 3, 5, 6], 0], expected: 0, label: 'insert at front', hidden: true },
      { args: [[5], 5], expected: 0, label: 'single element match', hidden: true },
      { args: [[-10, -5, 0, 3], -7], expected: 1, label: 'negatives', hidden: true },
    ],
    referenceSolution:
      'export function searchInsert(nums: number[], target: number): number {\n  let lo = 0\n  let hi = nums.length\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2)\n    if (nums[mid] >= target) hi = mid\n    else lo = mid + 1\n  }\n  return lo\n}\n',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
}
