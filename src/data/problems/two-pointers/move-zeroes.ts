import type { Problem } from '../../types'

export const moveZeroes: Problem = {
  id: 'move-zeroes',
  leetcodeId: 283,
  title: 'Move Zeroes',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given an integer array `nums`, move all `0`s to the end **in place** while keeping the relative order of the non-zero elements. Do this without making a copy of the array.',
  examples: [
    { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
    { input: 'nums = [0]', output: '[0]' },
  ],
  constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1', 'in-place, O(1) extra space expected'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an integer array, possibly already all-zero or zero-free. Output: the same array mutated so non-zeros keep their relative order and all zeros trail — no return value needed, the array itself is the answer.',
      rubric: ['Notes the operation is in-place mutation, not a returned copy', 'Notes relative order of non-zeros must be preserved'],
    },
    whatToFind: {
      modelAnswer: 'A stable partition of the array into "non-zero" and "zero" regions, done without extra storage.',
      rubric: ['Frames it as a stable partition', 'Names "no extra storage" as the binding constraint'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 10⁴ elements with O(1) extra space expected: a single O(n) in-place pass is the target — no auxiliary array to collect non-zeros into before writing back.',
      rubric: ['Derives O(n) time / O(1) space as the target', 'Rules out building a separate output array'],
    },
    bruteForce: {
      modelAnswer: 'Copy all non-zero elements into a new array in order, then pad the remainder with zeros, then copy back over the original. O(n) time, O(n) space — violates the in-place expectation.',
      rubric: ['Names the copy-then-pad approach', 'Flags the O(n) space violation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The second array only exists to stage values before writing them back — but I can write non-zero values directly into the original array as I find them, tracking how far I\'ve written with a second pointer. Two pointers: one scans, one marks the next write slot. Pattern: Two Pointers.',
      rubric: ['Names the waste: staging in a second array before copying back', 'Proposes a read pointer + write pointer over the same array'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'insertPos = 0. Scan i from 0 to n-1: if nums[i] !== 0, swap nums[i] and nums[insertPos], then insertPos++. Swapping (not just overwriting) keeps every element accounted for so the trailing zeros end up correct once the scan finishes. Time O(n), space O(1).',
      rubric: ['Read pointer scans, write pointer (insertPos) only advances on non-zero', 'Uses a swap, not a plain overwrite', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Copying non-zeros into a new array and padding with zeros works but needs O(n) extra space, which the problem rules out. The staging array is redundant — I can write non-zero values back into the same array with a second "insert position" pointer, swapping as I go so no value gets lost. One pass, O(n) time, O(1) space.',
      rubric: ['Follows the script template end-to-end', 'States the swap-based two-pointer insight and final complexity'],
    },
  },
  code: {
    signature: 'export function moveZeroes(nums: number[]): number[] {\n  // mutate nums in place, then return it\n}\n',
    harness: 'plain',
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], label: 'example' },
      { args: [[0]], expected: [0], label: 'single zero' },
      { args: [[1, 2, 3]], expected: [1, 2, 3], label: 'no zeros' },
      { args: [[0, 0, 1]], expected: [1, 0, 0], label: 'leading zeros', hidden: true },
      { args: [[1, 0, 0]], expected: [1, 0, 0], label: 'already partitioned', hidden: true },
      { args: [[0, 0, 0]], expected: [0, 0, 0], label: 'all zeros', hidden: true },
    ],
    referenceSolution:
      'export function moveZeroes(nums: number[]): number[] {\n  let insertPos = 0\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      const tmp = nums[insertPos]\n      nums[insertPos] = nums[i]\n      nums[i] = tmp\n      insertPos++\n    }\n  }\n  return nums\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
