import type { Problem } from '../../types'

export const jumpGameII: Problem = {
  id: 'jump-game-ii',
  leetcodeId: 45,
  title: 'Jump Game II',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'greedy',
  authored: true,
  statement:
    'Given `nums` where `nums[i]` is the maximum jump length from index `i`, return the **minimum number of jumps** to reach the last index. Reaching it is guaranteed possible.',
  examples: [
    { input: 'nums = [2,3,1,1,4]', output: '2', explanation: '0→1→4.' },
    { input: 'nums = [2,3,0,1,4]', output: '2' },
  ],
  constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000', 'the last index is always reachable'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: jump-capacity array, success guaranteed. Output: the minimum jump *count*. Single-element input needs 0 jumps.',
      rubric: ['Count (not path) output', 'n = 1 → 0 jumps edge'],
    },
    whatToFind: {
      modelAnswer: 'Shortest path in jumps — i.e. BFS levels over indices, where "one more jump" expands a whole frontier window at once.',
      rubric: ['Min-steps = BFS-levels framing', 'Frontier-as-window observation'],
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴ rules out the O(n²) DP comfortably done at 10³ but wasteful here; the window structure gives O(n). Guaranteed reachability removes failure handling.',
      rubric: ['O(n) target', 'Reachability guarantee simplifies'],
    },
    bruteForce: {
      modelAnswer: 'DP: jumps[i] = 1 + min(jumps[j]) over all j that can reach i — O(n²) pairs; correct, standard, slow-ish.',
      rubric: ['Quadratic DP stated', 'O(n²) named'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The DP asks "who can reach i?" for every i separately, but indices reachable in exactly k jumps form one contiguous window — per level, only the window\'s furthest extension matters. Sweep with [curEnd, farthest]: when i hits curEnd, a jump is spent and the window advances. Pattern: Greedy (implicit BFS by windows).',
      rubric: ['Waste: per-index predecessor scans over a contiguous frontier', 'Window-advance rule stated'],
      acceptedPatterns: ['greedy'],
    },
    algorithm: {
      modelAnswer:
        'jumps = 0, curEnd = 0, farthest = 0. For i from 0 to n−2: farthest = max(farthest, i + nums[i]); if i === curEnd: jumps++, curEnd = farthest. Return jumps. Loop excludes the last index (no jump needed from it). Time O(n), space O(1).',
      rubric: ['Window variables and the boundary trigger', 'Loop bound n−2 justified', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'The quadratic DP asks, for every index, which earlier indices reach it — but "reachable in k jumps" is always one contiguous window, so that scan is redundant. I\'ll do BFS-by-windows greedily: track the current window\'s end and the farthest extension seen; crossing the end costs one jump and opens the next window. Time O(n), space O(1).',
      rubric: ['Template followed with windows-as-BFS-levels', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function jump(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: 2, label: 'example' },
      { args: [[2, 3, 0, 1, 4]], expected: 2, label: 'zeros inside' },
      { args: [[0]], expected: 0, label: 'single element' },
      { args: [[1, 2]], expected: 1, label: 'one hop', hidden: true },
      { args: [[1, 1, 1, 1]], expected: 3, label: 'forced single steps', hidden: true },
      { args: [[5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0]], expected: 3, label: 'long array', hidden: true },
    ],
    referenceSolution:
      'export function jump(nums: number[]): number {\n  let jumps = 0\n  let curEnd = 0\n  let farthest = 0\n  for (let i = 0; i < nums.length - 1; i++) {\n    farthest = Math.max(farthest, i + nums[i])\n    if (i === curEnd) {\n      jumps++\n      curEnd = farthest\n    }\n  }\n  return jumps\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
