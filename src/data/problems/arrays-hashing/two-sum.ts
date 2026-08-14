import type { Problem } from '../../types'

export const twoSum: Problem = {
  id: 'two-sum',
  leetcodeId: 1,
  title: 'Two Sum',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given an integer array `nums` and an integer `target`, return the indices of the two distinct elements that sum to `target`. Exactly one answer exists, and you may not use the same element twice. Return the indices in ascending order.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9.' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]' },
  ],
  constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'exactly one valid answer exists'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an unsorted integer array (up to 10⁴, values can be negative) and a target integer. Output: a pair of indices in ascending order — indices, not values, so I can\'t freely sort the array.',
      rubric: [
        'Names input shapes and that values may be negative',
        'Output is indices (ascending), which rules out naive sorting',
      ],
    },
    whatToFind: {
      modelAnswer:
        'An existence-with-location task: find the one pair whose sum is the target and report where it is. Not a count, not all pairs — exactly one answer is guaranteed.',
      rubric: ['Identifies "find the one pair" (existence + location)', 'Uses the uniqueness guarantee'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁴ means O(n²) (10⁸ pair checks) is borderline-too-slow and clearly wasteful; O(n) or O(n log n) is the budget. Values up to 10⁹ rule out counting arrays — a hash map is the lookup structure.',
      rubric: ['Derives the ~O(n) budget from n ≤ 10⁴', 'Notes the value range rules out a counting array'],
    },
    bruteForce: {
      modelAnswer: 'Check all pairs with two nested loops over i < j and test nums[i] + nums[j] === target. O(n²) time, O(1) space.',
      rubric: ['Names the enumeration (all pairs / nested loops)', 'States O(n²) time', 'States space complexity'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The inner loop wastes time re-scanning the whole array for a value I could look up in O(1): for a fixed nums[i], I already know I need target − nums[i]. Store seen values → index in a hash map and each lookup is constant. Pattern: Hash Map.',
      rubric: ['Names the waste: linear re-scan for a known complement', 'Proposes value→index map lookup'],
      acceptedPatterns: ['hash-map'],
    },
    algorithm: {
      modelAnswer:
        'One pass with a map from value → index. At each element, compute complement = target − nums[i]; if the map has it, return [map.get(complement), i]. Otherwise store nums[i] → i. Storing after checking handles the [3,3] duplicate case. Time O(n), space O(n).',
      rubric: [
        'Single pass, check complement before inserting current element',
        'Handles duplicate values correctly ([3,3])',
        'States O(n)/O(n)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be checking every pair with nested loops — that\'s O(n²), slow for 10⁴ elements and it wastes a full scan on each lookup. This looks like a hash-map problem because for each element I know exactly the complement I need. I\'ll do one pass storing value → index and checking each complement first. Time O(n), space O(n).',
      rubric: ['Follows the script template end-to-end', 'States the complement-lookup insight and final complexity'],
    },
  },
  code: {
    signature: 'export function twoSum(nums: number[], target: number): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], label: 'example' },
      { args: [[3, 2, 4], 6], expected: [1, 2], label: 'answer not at front' },
      { args: [[3, 3], 6], expected: [0, 1], label: 'duplicate values' },
      { args: [[-5, 12, 3, 5], 0], expected: [0, 3], label: 'negative numbers', hidden: true },
      { args: [[1, 2], 3], expected: [0, 1], label: 'minimum length', hidden: true },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3], label: 'zero target', hidden: true },
    ],
    referenceSolution:
      'export function twoSum(nums: number[], target: number): number[] {\n  const seen = new Map<number, number>()\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i]\n    const j = seen.get(complement)\n    if (j !== undefined) return [j, i]\n    seen.set(nums[i], i)\n  }\n  return []\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
