import type { Problem } from '../../types'

export const productOfArrayExceptSelf: Problem = {
  id: 'product-of-array-except-self',
  leetcodeId: 238,
  title: 'Product of Array Except Self',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element of `nums` except `nums[i]`. You must run in O(n) time **without using division**. Products fit in a 32-bit integer.',
  examples: [
    { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
    { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
  ],
  constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'division is not allowed'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an integer array (length up to 10⁵, values small, zeros possible). Output: a same-length array where each slot is the product of all *other* elements. The division ban is part of the contract.',
      rubric: ['Same-length output array of products', 'Notes zeros are possible and division is banned'],
    },
    whatToFind: {
      modelAnswer:
        'A construct task: build a whole new array where every position aggregates the rest of the input. Per-position "everything except me" is the defining shape.',
      rubric: ['Identifies construct/transform (not search or count)', 'Names the "all except self" aggregation'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁵ with an explicit O(n) requirement — the naive per-position rescan at O(n²) is out. "No division" kills the total-product ÷ nums[i] shortcut, which also breaks on zeros anyway.',
      rubric: ['States O(n) explicitly required', 'Explains why the division shortcut is unavailable/fragile'],
    },
    bruteForce: {
      modelAnswer: 'For each index, loop over the whole array multiplying everything except that index. O(n²) time, O(1) extra space.',
      rubric: ['Nested-loop per-position product', 'States O(n²) time', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Adjacent positions share almost their entire product — the rescan recomputes the same left-side and right-side products over and over. Precompute running products from each direction: answer[i] = (product of everything left of i) × (product of everything right of i). Pattern: Prefix.',
      rubric: ['Names the waste: overlapping products recomputed', 'Proposes prefix/suffix running products'],
      acceptedPatterns: ['prefix'],
    },
    algorithm: {
      modelAnswer:
        'Pass 1 left→right: answer[i] = product of nums[0..i−1] (running prefix, starting at 1). Pass 2 right→left with a running suffix: multiply answer[i] by the product of nums[i+1..]. Two passes, output array reused as storage. Time O(n), space O(1) beyond the output.',
      rubric: ['Two directional passes with running products', 'Reuses the output array (O(1) extra)', 'States complexity'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be rescanning the array for every position — O(n²), too slow for 10⁵ and the problem demands O(n). Division on the total product is banned and breaks on zeros. This looks like a prefix problem because each answer splits into a left product and a right product. I\'ll do two running-product passes into the output array. Time O(n), space O(1) extra.',
      rubric: ['Template followed; division pitfall mentioned', 'Prefix/suffix split named with complexity'],
    },
  },
  code: {
    signature: 'export function productExceptSelf(nums: number[]): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], label: 'example' },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], label: 'one zero' },
      { args: [[2, 3]], expected: [3, 2], label: 'minimum length' },
      { args: [[0, 0, 2]], expected: [0, 0, 0], label: 'two zeros', hidden: true },
      { args: [[-2, -3, 4]], expected: [-12, -8, 6], label: 'negatives', hidden: true },
      { args: [[1, 1, 1, 1]], expected: [1, 1, 1, 1], label: 'all ones', hidden: true },
    ],
    referenceSolution:
      'export function productExceptSelf(nums: number[]): number[] {\n  const n = nums.length\n  const answer = new Array(n).fill(1)\n  let prefix = 1\n  for (let i = 0; i < n; i++) {\n    answer[i] = prefix\n    prefix *= nums[i]\n  }\n  let suffix = 1\n  for (let i = n - 1; i >= 0; i--) {\n    answer[i] *= suffix\n    suffix *= nums[i]\n  }\n  return answer\n}\n',
    complexity: { time: 'O(n)', space: 'O(1) extra (output excluded)' },
  },
}
