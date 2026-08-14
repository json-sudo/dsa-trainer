import type { Problem } from '../../types'

export const removeDuplicatesFromSortedArray: Problem = {
  id: 'remove-duplicates-from-sorted-array',
  leetcodeId: 26,
  title: 'Remove Duplicates from Sorted Array',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in place** so each unique value appears once, keeping relative order. Return the deduplicated prefix (i.e. `nums.slice(0, k)` after compacting the first `k` slots in place). Use O(1) extra space.',
  examples: [
    { input: 'nums = [1,1,2]', output: '[1,2]' },
    { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '[0,1,2,3,4]' },
  ],
  constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'sorted non-decreasing · O(1) extra space'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a sorted integer array, duplicates allowed. Output: the compacted unique prefix, order preserved, produced by in-place writes — no second array allowed.',
      rubric: ['Sorted input, in-place constraint named', 'Output is the unique prefix in original order'],
    },
    whatToFind: {
      modelAnswer: 'A rearrange/compact task: shift each first-occurrence left so uniques occupy a prefix. Nothing is searched or counted beyond that.',
      rubric: ['Identifies in-place compaction (rearrange)', 'Notes stability (relative order kept)'],
    },
    constraintsHint: {
      modelAnswer:
        'Sorted input means duplicates are adjacent — detecting a new value is a single comparison with the previous unique. O(1) extra space forbids a set; the sort *is* the set.',
      rubric: ['Uses sortedness: duplicates are adjacent', 'O(1) space rules out an auxiliary set'],
    },
    bruteForce: {
      modelAnswer:
        'Copy into a new array (or set), skipping values already present, then write back — O(n) time but O(n) extra space, which the problem forbids.',
      rubric: ['Names the extra-array approach', 'Notes it violates the space constraint', 'States O(n)/O(n)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The auxiliary structure wastes space remembering *all* seen values when sortedness means only the *last written* value matters. Fast/slow pointers: fast scans, slow marks the write position for the next unique. Pattern: Two Pointers (fast/slow).',
      rubric: ['Names the waste: remembering everything vs. just the last unique', 'Proposes writer/scanner pointers'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'slow = 1 (first element is always kept). For fast from 1 to n−1: if nums[fast] !== nums[slow−1], write nums[slow] = nums[fast] and slow++. Return the first slow elements. Time O(n), space O(1).',
      rubric: ['Writer starts at 1; scanner compares against last written', 'Single pass, in-place writes', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be building a new array of first occurrences — linear time but linear space, and the problem requires in-place O(1). This looks like fast/slow two pointers because sorted duplicates are adjacent: one pointer scans, the other marks where the next unique lands. I\'ll do a single pass with a write index. Time O(n), space O(1).',
      rubric: ['Template followed with the adjacency insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function removeDuplicates(nums: number[]): number[] {\n  // compact in place, then return nums.slice(0, k)\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 1, 2]], expected: [1, 2], label: 'example' },
      { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4], label: 'long example' },
      { args: [[7]], expected: [7], label: 'single element' },
      { args: [[2, 2, 2, 2]], expected: [2], label: 'all duplicates', hidden: true },
      { args: [[1, 2, 3]], expected: [1, 2, 3], label: 'already unique', hidden: true },
      { args: [[-3, -3, -1, 0, 0]], expected: [-3, -1, 0], label: 'negatives and zero', hidden: true },
    ],
    referenceSolution:
      'export function removeDuplicates(nums: number[]): number[] {\n  let slow = 1\n  for (let fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] !== nums[slow - 1]) {\n      nums[slow] = nums[fast]\n      slow++\n    }\n  }\n  return nums.slice(0, slow)\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
