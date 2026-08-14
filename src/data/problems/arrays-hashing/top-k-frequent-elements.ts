import type { Problem } from '../../types'

export const topKFrequentElements: Problem = {
  id: 'top-k-frequent-elements',
  leetcodeId: 347,
  title: 'Top K Frequent Elements',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'Given an integer array `nums` and an integer `k`, return the `k` values that occur most frequently. The answer is guaranteed to be unique, and you may return it in any order.',
  examples: [
    { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
    { input: 'nums = [1], k = 1', output: '[1]' },
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '-10^4 <= nums[i] <= 10^4',
    'k is between 1 and the number of distinct elements',
    'the answer is unique',
  ],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an integer array up to 10⁵ long and an integer k. Output: an array of k values (not counts, not indices), any order — order-free output means no full sort is required of me.',
      rubric: ['Names input shapes and bounds', 'Output is k values in any order'],
    },
    whatToFind: {
      modelAnswer:
        'A max-k selection over frequencies: first count occurrences, then select the k largest by count. Two sub-questions — counting (group) and selection (max-min).',
      rubric: ['Splits the task into count + select-top-k', 'Recognizes selection, not full ranking'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁵ → O(n log n) is fine, O(n) is achievable. "Any order" plus "answer unique" hints I never need a total sort — bucket-by-count gives O(n), a heap gives O(n log k).',
      rubric: ['States the budget from n ≤ 10⁵', 'Notes "any order" removes the need for full sorting'],
    },
    bruteForce: {
      modelAnswer:
        'Count with a map, then sort all distinct values by count descending and take the first k. O(n log n) time, O(n) space — actually acceptable here, but sorting everything to keep only k is the visible waste.',
      rubric: ['Count map + full sort described', 'States O(n log n)/O(n)', 'Notes it is within budget but wasteful'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Sorting ranks every distinct value when only the top k matter — the rest of the order is thrown away. Keep counts in a Freq Map, then select with a bucket array indexed by count (counts are bounded by n) or a size-k heap. Pattern: Freq Map (Heap accepted for the selection half).',
      rubric: ['Names the waste: full ordering computed, only top-k needed', 'Proposes bucket-by-count or size-k heap'],
      acceptedPatterns: ['freq-map', 'heap'],
    },
    algorithm: {
      modelAnswer:
        'Pass 1: map value → count. Pass 2: buckets[count] = list of values (count ≤ n, so an array of length n+1 works). Pass 3: walk buckets from n down, collecting values until k are taken. Time O(n), space O(n).',
      rubric: ['Bucket-by-count (or heap) selection described concretely', 'Walks from highest count until k collected', 'States O(n)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be counting then sorting all distinct values by frequency — O(n log n), which works but ranks everything when I only need the top k. This looks like a frequency-map problem with a selection step; since counts are bounded by n I can bucket values by count and read the buckets from the top. Time O(n), space O(n).',
      rubric: ['Template followed with the bucket insight', 'Complexity stated for both phases'],
    },
  },
  code: {
    signature: 'export function topKFrequent(nums: number[], k: number): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], label: 'example' },
      { args: [[1], 1], expected: [1], label: 'single element' },
      { args: [[4, 4, 4, 4], 1], expected: [4], label: 'one distinct value', hidden: true },
      { args: [[-1, -1, 2, 3, 3, 3], 2], expected: [3, -1], label: 'negative values', hidden: true },
      { args: [[5, 6, 7], 3], expected: [5, 6, 7], label: 'k equals distinct count', hidden: true },
      { args: [[2, 2, 3, 3, 1], 2], expected: [2, 3], label: 'tie among winners', hidden: true },
    ],
    referenceSolution:
      'export function topKFrequent(nums: number[], k: number): number[] {\n  const counts = new Map<number, number>()\n  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1)\n  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => [])\n  for (const [value, count] of counts) buckets[count].push(value)\n  const out: number[] = []\n  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {\n    for (const value of buckets[c]) {\n      out.push(value)\n      if (out.length === k) break\n    }\n  }\n  return out\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
