import type { Problem } from '../../types'

export const longestIncreasingSubsequence: Problem = {
  id: 'longest-increasing-subsequence',
  leetcodeId: 300,
  title: 'Longest Increasing Subsequence',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'dp-1d',
  authored: true,
  statement:
    'Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence — elements need not be contiguous, but their relative order must be preserved and each must be strictly greater than the previous.',
  examples: [
    { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'One LIS is [2,3,7,101] or [2,3,7,18].' },
    { input: 'nums = [0,1,0,3,2,3]', output: '4', explanation: '[0,1,2,3].' },
    { input: 'nums = [7,7,7,7]', output: '1', explanation: 'Strictly increasing — equal values cannot both be kept.' },
  ],
  constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an unsorted integer array up to 2500 elements. Output: a single integer, the length of the longest strictly-increasing subsequence — I need "length", not the actual subsequence, which opens the door to an approach that only tracks lengths, not full paths.',
      rubric: ['Notes only the length is required, not the subsequence itself', 'Notes "strictly increasing" (equal values don\'t extend the run)'],
    },
    whatToFind: {
      modelAnswer:
        'An optimization over subsequences (not contiguous subarrays): for every possible ending point, what\'s the best run I could have built ending there, and what\'s the max over all of them.',
      rubric: ['Distinguishes subsequence (order-preserving, skip allowed) from subarray (contiguous)', 'Frames it as best-ending-here optimized over all endpoints'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 2500 → n² = ~6×10⁶, comfortably fits an O(n²) DP. But it\'s a soft enough bound that if the interviewer pushes for better, O(n log n) is the known ceiling for this exact problem — worth naming both budgets.',
      rubric: ['Confirms O(n²) fits at n ≤ 2500', 'Anticipates the O(n log n) follow-up as the known better bound'],
    },
    bruteForce: {
      modelAnswer:
        'Try every subsequence (2ⁿ of them) and check which are strictly increasing, keeping the longest — hopeless at n=2500. The practical first-correct approach is dp[i] = length of the LIS ending exactly at index i: dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i] (or 1 if none). Answer is max(dp). O(n²) time, O(n) space.',
      rubric: ['Rejects the 2ⁿ subsequence enumeration as infeasible', 'States the O(n²) ending-at-i DP recurrence correctly'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The O(n²) DP rescans every earlier index j for each i just to find qualifying dp[j] values — but what actually matters for extending a future run is the *smallest possible tail value* achievable for each subsequence length, not which specific earlier index produced it. Track that directly: tails[k] = smallest tail value of any increasing subsequence of length k+1, kept sorted, and binary-search it for each new number. Pattern: DP → Binary Search (patience sorting).',
      rubric: ['Names the waste: full O(n) rescan of earlier indices per element in the O(n²) version', 'Proposes tracking smallest-tail-per-length and binary-searching it'],
      acceptedPatterns: ['dp', 'binary-search'],
    },
    algorithm: {
      modelAnswer:
        'Maintain tails: number[] = [], where tails[k] is the smallest tail achievable for an increasing subsequence of length k+1 (tails is always sorted). For each x in nums: binary-search tails for the first index whose value is >= x (lower bound); if found at index idx, replace tails[idx] = x (a smaller/equal tail for that length improves future extensions); if none found, append x (x extends the longest run found so far). The final answer is tails.length. Note tails itself is not necessarily a real subsequence of nums, only its length is meaningful. Time O(n log n), space O(n).',
      rubric: [
        'Correctly describes tails[k] as smallest tail for length k+1, kept sorted',
        'Binary search finds first element >= x, replacing it (or appending if none found)',
        'States answer = tails.length and O(n log n) time / O(n) space, notes tails is not a real subsequence',
      ],
    },
    interviewScript: {
      modelAnswer:
        'The O(n²) DP — dp[i] = 1 + max(dp[j]) for j<i with nums[j]<nums[i] — is correct and fits n≤2500, but it rescans all earlier indices per element. What actually matters for extending future runs isn\'t which index produced a given length, but the smallest tail value achievable at that length. So I\'ll maintain a sorted array tails where tails[k] is the smallest tail for length k+1: for each number, binary-search for the first tail >= it and overwrite that slot, or append if it\'s bigger than everything so far. The final tails.length is the answer. That\'s O(n log n) time, O(n) space — an improvement over the O(n²) DP given the interviewer\'s likely follow-up.',
      rubric: ['States the O(n²) DP baseline and its per-element rescan waste', 'Explains the tails/binary-search mechanism and gives O(n log n)/O(n)'],
    },
  },
  code: {
    signature: 'export function lengthOfLIS(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, label: 'example' },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4, label: 'example with repeats' },
      { args: [[7, 7, 7, 7]], expected: 1, label: 'all equal, strict increase required' },
      { args: [[1]], expected: 1, label: 'single element' },
      { args: [[1, 2, 3, 4, 5]], expected: 5, label: 'already fully increasing', hidden: true },
      { args: [[5, 4, 3, 2, 1]], expected: 1, label: 'strictly decreasing', hidden: true },
      { args: [[4, 10, 4, 3, 8, 9]], expected: 3, label: 'mixed with a dip', hidden: true },
    ],
    referenceSolution:
      'export function lengthOfLIS(nums: number[]): number {\n  const tails: number[] = []\n  for (const x of nums) {\n    let lo = 0\n    let hi = tails.length\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1\n      if (tails[mid] < x) lo = mid + 1\n      else hi = mid\n    }\n    if (lo === tails.length) tails.push(x)\n    else tails[lo] = x\n  }\n  return tails.length\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
