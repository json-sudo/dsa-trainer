import type { Problem } from '../../types'

export const findMinimumInRotatedSortedArray: Problem = {
  id: 'find-minimum-in-rotated-sorted-array',
  leetcodeId: 153,
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'binary-search',
  authored: true,
  statement:
    'A sorted array of **distinct** integers was rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`). Given the rotated array `nums`, return its minimum element in O(log n) time.',
  examples: [
    { input: 'nums = [3,4,5,1,2]', output: '1' },
    { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
    { input: 'nums = [11,13,15,17]', output: '11', explanation: 'Rotated n times — still sorted.' },
  ],
  constraints: ['1 <= nums.length <= 5000', 'distinct values', 'sorted then rotated 1..n times', 'O(log n) required'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a distinct-valued array that is sorted-then-rotated (possibly rotated fully, i.e. still sorted). Output: the minimum value. The rotation point is where the minimum lives.',
      rubric: ['Notes possibly-zero effective rotation', 'Minimum = rotation point identified'],
    },
    whatToFind: {
      modelAnswer: 'Locate the unique "cliff" — the one position where order resets. A boundary search in an almost-sorted structure.',
      rubric: ['Frames it as finding the single order-break boundary', 'Uniqueness from distinctness'],
    },
    constraintsHint: {
      modelAnswer:
        'O(log n) is demanded outright, so the structure must support halving despite the rotation. Key: comparing nums[mid] with nums[hi] always reveals which half contains the cliff.',
      rubric: ['Explicit O(log n) mandate noted', 'Identifies mid-vs-right comparison as the oracle'],
    },
    bruteForce: {
      modelAnswer: 'Scan for the minimum: O(n), O(1). Trivially correct, ignores the structure, violates the required bound.',
      rubric: ['Linear min scan', 'Notes contract violation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan ignores that each half of any range is itself sorted-or-rotated: if nums[mid] > nums[hi], the cliff is right of mid; otherwise it is at mid or left. One comparison discards half the array. Pattern: Binary Search (boundary variant).',
      rubric: ['Waste: linear scan of a halvable structure', 'States the mid>right ⇒ go right rule'],
      acceptedPatterns: ['binary-search'],
    },
    algorithm: {
      modelAnswer:
        'lo = 0, hi = n−1. While lo < hi: mid = ⌊(lo+hi)/2⌋; if nums[mid] > nums[hi], lo = mid + 1 (cliff strictly right); else hi = mid (mid could be the min). Return nums[lo]. Compare against hi, never lo — the left comparison is ambiguous. Time O(log n), space O(1).',
      rubric: [
        'Compares mid to the right end (not left) with the two moves',
        'hi = mid keeps mid as a min candidate',
        'States O(log n)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'A linear minimum scan is O(n), but the array is sorted-with-one-cliff and the problem demands O(log n). Comparing the middle to the right end is unambiguous: greater means the cliff — and the minimum — is to the right; otherwise it\'s at mid or left. I\'ll binary-search that boundary. Time O(log n), space O(1).',
      rubric: ['Template followed with the unambiguous-comparison insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function findMin(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[3, 4, 5, 1, 2]], expected: 1, label: 'example' },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0, label: 'longer rotation' },
      { args: [[11, 13, 15, 17]], expected: 11, label: 'no effective rotation' },
      { args: [[1]], expected: 1, label: 'single element', hidden: true },
      { args: [[2, 1]], expected: 1, label: 'two elements rotated', hidden: true },
      { args: [[5, 6, 7, 8, 9, 1]], expected: 1, label: 'min at last index', hidden: true },
    ],
    referenceSolution:
      'export function findMin(nums: number[]): number {\n  let lo = 0\n  let hi = nums.length - 1\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2)\n    if (nums[mid] > nums[hi]) lo = mid + 1\n    else hi = mid\n  }\n  return nums[lo]\n}\n',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
}
