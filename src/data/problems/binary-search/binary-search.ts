import type { Problem } from '../../types'

export const binarySearch: Problem = {
  id: 'binary-search',
  leetcodeId: 704,
  title: 'Binary Search',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'binary-search',
  authored: true,
  statement:
    'Given a sorted (ascending), zero-indexed array `nums` of distinct integers and an integer `target`, return the index of `target` if it exists in `nums`, or `-1` otherwise. Solve in `O(log n)` time.',
  examples: [
    { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-10^4 < nums[i], target < 10^4',
    'nums is sorted in strictly increasing order',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a sorted, distinct-valued array and a target value. Output: target\'s index, or -1 if absent.',
      rubric: ['States output is an index or -1', 'Notes distinctness of values means at most one valid index'],
      teachingNote: 'Trivial restate, but say "sorted and distinct" explicitly — those two properties are what license everything that follows.',
    },
    whatToFind: {
      modelAnswer: 'The position where target would sit in sorted order, verified to actually hold target — i.e., locate target by repeatedly halving the search space using the sort order.',
      rubric: ['Names the sortedness as what enables halving the search space', 'Frames each midpoint comparison as eliminating a half'],
      teachingNote: 'The reduction here basically is the algorithm name — "sorted array, find a value" should trigger binary search instantly, but still say why: comparison at the midpoint eliminates half the array.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 1e4 with an explicit O(log n) requirement in the prompt itself — that directly rules out any linear scan and names the target complexity class, which only binary search hits on a sorted array.',
      rubric: ['Notes the explicit O(log n) requirement rules out linear scan', 'Confirms n\'s scale is only relevant via that requirement, not on its own'],
      teachingNote: 'When a problem states its required complexity outright, that\'s the interviewer removing ambiguity — treat it as a hard constraint, not a hint.',
    },
    bruteForce: {
      modelAnswer: 'Linear scan: check nums[i] === target for each i left to right, return i on a hit, -1 if the loop finishes. O(n) time, O(1) space. Correct but ignores sortedness.',
      rubric: ['Linear scan approach', 'Notes it doesn\'t use sortedness', 'States O(n)'],
      teachingNote: 'The clean way to phrase this waste: "linear scan is correct for *any* array; sortedness is a superpower this solution doesn\'t use."',
    },
    wasteAndPattern: {
      modelAnswer:
        'A linear scan wastes the sorted order — checking one element at a time throws away the fact that comparing against the middle element tells you which entire half can be discarded. Repeatedly halve the search range using a low/high window and a mid comparison. Pattern: Binary Search.',
      rubric: ['Waste: not exploiting sortedness to eliminate half the array per comparison', 'Names binary search / halving pattern'],
      acceptedPatterns: ['binary-search'],
      teachingNote: 'The generalizable insight: any monotonic/sorted structure where a single comparison tells you "go left" or "go right" is a binary search candidate, even outside plain sorted arrays (e.g. answer-space binary search).',
    },
    algorithm: {
      modelAnswer:
        'low = 0, high = n - 1. While low <= high: mid = low + (high - low) >> 1 (avoids overflow); if nums[mid] === target return mid; if nums[mid] < target, low = mid + 1; else high = mid - 1. If the loop ends without returning, return -1. Time O(log n), space O(1).',
      rubric: ['Correct low <= high loop condition', 'Overflow-safe mid computation', 'Correct branch updates on both sides', 'Returns -1 on exhaustion'],
      teachingNote: 'low + (high - low) >> 1 vs (low + high) / 2 rarely matters in TS given number range, but stating the overflow-safe form signals language-agnostic rigor.',
    },
    interviewScript: {
      modelAnswer:
        'The array is sorted and distinct, and the problem explicitly demands O(log n), which rules out a linear scan. So I\'ll binary search: maintain a low/high window, compare target against the midpoint, and discard the half that can\'t contain it, repeating until found or the window is empty. O(log n) time, O(1) space.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'Foundational binary search fluency — this exact script structure (window + midpoint compare + discard half) transfers directly to every binary-search-on-answer variant later.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Search window bounds',
      code: 'let low = 0\nlet high = nums.length - 1',
    },
    {
      label: '2. Shrink the window by comparing the midpoint',
      code: 'while (low <= high) {\n  const mid = low + ((high - low) >> 1)   // overflow-safe midpoint\n  if (nums[mid] === target) return mid\n  if (nums[mid] < target) {\n    low = mid + 1        // target must be in the right half\n  } else {\n    high = mid - 1        // target must be in the left half\n  }\n}',
    },
    {
      label: '3. Window closed without a hit — target absent',
      code: 'return -1   // low > high: nothing left to check',
    },
  ],
  code: {
    signature: 'export function search(nums: number[], target: number): number {\n\n}\n',
    harness: 'plain',
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, label: 'target present mid-array' },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, label: 'target absent' },
      { args: [[5], 5], expected: 0, label: 'single element found' },
      { args: [[5], -5], expected: -1, label: 'single element not found', hidden: true },
      { args: [[-1, 0, 3, 5, 9, 12], -1], expected: 0, label: 'target at first index', hidden: true },
      { args: [[-1, 0, 3, 5, 9, 12], 12], expected: 5, label: 'target at last index', hidden: true },
    ],
    referenceSolution:
      'export function search(nums: number[], target: number): number {\n  let low = 0\n  let high = nums.length - 1\n  while (low <= high) {\n    const mid = low + ((high - low) >> 1)\n    if (nums[mid] === target) return mid\n    if (nums[mid] < target) {\n      low = mid + 1\n    } else {\n      high = mid - 1\n    }\n  }\n  return -1\n}\n',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
}
