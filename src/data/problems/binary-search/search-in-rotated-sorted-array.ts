import type { Problem } from '../../types'

export const searchInRotatedSortedArray: Problem = {
  id: 'search-in-rotated-sorted-array',
  leetcodeId: 33,
  title: 'Search in Rotated Sorted Array',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'binary-search',
  authored: true,
  statement:
    'A sorted array of **distinct** integers was rotated at an unknown pivot. Given the rotated array `nums` and a `target`, return the index of `target`, or `-1` if absent, in O(log n) time.',
  examples: [
    { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
    { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
    { input: 'nums = [1], target = 0', output: '-1' },
  ],
  constraints: ['1 <= nums.length <= 5000', 'distinct values', 'rotated at some pivot', 'O(log n) required'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a rotated sorted array (distinct) and a target. Output: the index or −1. Same structure as find-minimum, but now hunting a *value*, not the cliff.',
      rubric: ['Index-or-−1 output', 'Links to the rotated structure'],
    },
    whatToFind: {
      modelAnswer: 'Existence + location of one value inside a two-segment sorted structure.',
      rubric: ['Existence/location framing', 'Sees the two sorted segments'],
    },
    constraintsHint: {
      modelAnswer:
        'O(log n) is explicit. The saving fact: at any mid, at least one side of the split is a perfectly sorted range — a range check tells me whether target lives there.',
      rubric: ['O(log n) mandate', 'One-side-is-always-sorted observation'],
    },
    bruteForce: {
      modelAnswer: 'Linear scan for the target: O(n), O(1). Ignores structure and violates the bound.',
      rubric: ['Linear scan', 'Contract violation noted'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan wastes the fact that a sorted half can be cleared with two comparisons: if the sorted half\'s range excludes the target, all of it is eliminated at once. Identify the sorted half at each step and keep-or-discard it. Pattern: Binary Search (rotated variant).',
      rubric: ['Waste: not bulk-eliminating the sorted half', 'Keep-or-discard by range check'],
      acceptedPatterns: ['binary-search'],
    },
    algorithm: {
      modelAnswer:
        'lo = 0, hi = n−1. While lo ≤ hi: mid; if nums[mid] === target, return mid. If nums[lo] ≤ nums[mid] (left half sorted): target in [nums[lo], nums[mid]) → hi = mid−1, else lo = mid+1. Otherwise (right half sorted): target in (nums[mid], nums[hi]] → lo = mid+1, else hi = mid−1. Return −1. Time O(log n), space O(1).',
      rubric: [
        'Sorted-half detection via nums[lo] ≤ nums[mid]',
        'Correct inclusive/exclusive range checks on both branches',
        'States O(log n)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'A linear scan is O(n); the problem demands O(log n). Although the array is rotated, one half around any midpoint is always properly sorted, and a two-comparison range check decides whether the target can live there — so I can always discard half. I\'ll binary-search with that case analysis. Time O(log n), space O(1).',
      rubric: ['Template followed with the always-one-sorted-half insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function search(nums: number[], target: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, label: 'example' },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, label: 'absent value' },
      { args: [[1], 0], expected: -1, label: 'single element miss' },
      { args: [[1], 1], expected: 0, label: 'single element hit', hidden: true },
      { args: [[5, 1, 3], 5], expected: 0, label: 'target at pivot edge', hidden: true },
      { args: [[3, 4, 5, 6, 1, 2], 2], expected: 5, label: 'target at end', hidden: true },
    ],
    referenceSolution:
      'export function search(nums: number[], target: number): number {\n  let lo = 0\n  let hi = nums.length - 1\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2)\n    if (nums[mid] === target) return mid\n    if (nums[lo] <= nums[mid]) {\n      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1\n      else lo = mid + 1\n    } else {\n      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1\n      else hi = mid - 1\n    }\n  }\n  return -1\n}\n',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
}
