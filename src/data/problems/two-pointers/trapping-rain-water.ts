import type { Problem } from '../../types'

export const trappingRainWater: Problem = {
  id: 'trapping-rain-water',
  leetcodeId: 42,
  title: 'Trapping Rain Water',
  difficulty: 'hard',
  mode: 'practice',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given `n` non-negative integers `height` representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  examples: [
    { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'Water pools above the shorter bars between taller ones on each side.' },
    { input: 'height = [4,2,0,3,2,5]', output: '9' },
  ],
  constraints: ['1 <= height.length <= 2 * 10^4', '0 <= height[i] <= 10^5'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of non-negative bar heights (width 1 each), up to 2×10⁴ bars. Output: a single integer — total trapped water volume across the whole array, not per-bar.',
      rubric: ['Names the elevation-map shape and non-negative heights', 'Output is a total volume, a single number'],
    },
    whatToFind: {
      modelAnswer:
        'At each index, the water sitting above that bar is bounded by min(tallest bar to its left, tallest bar to its right) minus its own height — I need that per-index bound summed over the array.',
      rubric: ['States the per-index water = min(leftMax, rightMax) − height[i] formula', 'Frames it as a sum over all indices'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 2×10⁴ means O(n²) (4×10⁸ worst case) is too slow to be the target; O(n) time is expected. Heights up to 10⁵ fit safely in normal integers, no overflow concerns.',
      rubric: ['Derives an O(n) time budget from n ≤ 2×10⁴', 'Notes the value range is not itself a concern'],
    },
    bruteForce: {
      modelAnswer:
        'For each index i, scan left for the max and scan right for the max, then add max(0, min(leftMax, rightMax) − height[i]). O(n) work per index means O(n²) total, O(1) extra space.',
      rubric: ['Names the per-index left/right rescan', 'States O(n²) time'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The waste is rescanning the whole array on both sides for every single index when leftMax and rightMax only ever grow as you sweep — I can precompute them once, or better, track them on the fly with two pointers closing inward and only ever move the side whose max is smaller, since that side\'s water level is already fully determined. Pattern: Two Pointers (with a Prefix-max idea underneath).',
      rubric: ['Names the waste: repeated full-array rescans for a monotonically-updatable value', 'Proposes tracking running left/right maxima instead of rescanning'],
      acceptedPatterns: ['two-pointers', 'prefix'],
    },
    algorithm: {
      modelAnswer:
        'Two pointers l = 0, r = n − 1, with leftMax = 0, rightMax = 0, total = 0. While l < r: if height[l] < height[r], then leftMax\'s side is the binding constraint (rightMax is guaranteed ≥ height[l] since it comes from a taller-or-equal region), so update leftMax = max(leftMax, height[l]), add leftMax − height[l] to total, then l++. Otherwise mirror on the right: update rightMax = max(rightMax, height[r]), add rightMax − height[r], then r--. Return total. Time O(n), space O(1).',
      rubric: [
        'Two pointers close inward, moving the side with the smaller running max',
        'Correctly justifies why moving the smaller side is safe (other side\'s max is already ≥)',
        'States O(n) time, O(1) space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute force computes leftMax and rightMax by rescanning the whole array at every index — O(n²), and wasteful since those maxima only grow monotonically as you sweep. This is a two-pointers problem: I close in from both ends tracking a running leftMax and rightMax, and at each step I only advance the side with the smaller max, because that side\'s trapped-water level is already fully determined by its own max — the far side is guaranteed at least as tall. I add max − height[pointer] before advancing. Time O(n), space O(1).',
      rubric: ['Follows the script template end-to-end', 'States the which-side-to-move justification and final complexity'],
    },
  },
  code: {
    signature: 'export function trap(height: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, label: 'example' },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9, label: 'example 2' },
      { args: [[1, 1, 1, 1]], expected: 0, label: 'flat, no trapping' },
      { args: [[5, 4, 3, 2, 1]], expected: 0, label: 'strictly decreasing', hidden: true },
      { args: [[1, 2, 3, 4, 5]], expected: 0, label: 'strictly increasing', hidden: true },
      { args: [[0]], expected: 0, label: 'single bar', hidden: true },
      { args: [[3, 0, 0, 0, 3]], expected: 9, label: 'deep single basin', hidden: true },
    ],
    referenceSolution:
      'export function trap(height: number[]): number {\n  let l = 0\n  let r = height.length - 1\n  let leftMax = 0\n  let rightMax = 0\n  let total = 0\n  while (l < r) {\n    if (height[l] < height[r]) {\n      leftMax = Math.max(leftMax, height[l])\n      total += leftMax - height[l]\n      l++\n    } else {\n      rightMax = Math.max(rightMax, height[r])\n      total += rightMax - height[r]\n      r--\n    }\n  }\n  return total\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
