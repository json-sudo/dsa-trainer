import type { Problem } from '../../types'

export const missingNumber: Problem = {
  id: 'missing-number',
  leetcodeId: 268,
  title: 'Missing Number',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'bit-manipulation',
  authored: true,
  statement: 'Given `nums` containing `n` **distinct** numbers from the range `[0, n]`, return the one number in the range missing from the array. Aim for O(n) time, O(1) space.',
  examples: [
    { input: 'nums = [3,0,1]', output: '2' },
    { input: 'nums = [0,1]', output: '2', explanation: 'n = 2; the range is [0,2].' },
    { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' },
  ],
  constraints: ['1 <= n <= 10^4', '0 <= nums[i] <= n', 'all distinct'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: n distinct values covering [0, n] minus one. Output: the absent value — possibly 0 or n itself (the endpoints are the classic missed cases).',
      rubric: ['Range endpoints can be the answer', 'Distinctness guarantee'],
    },
    whatToFind: {
      modelAnswer: 'Identify the single gap between an ideal multiset ([0..n]) and the actual one — a difference-of-aggregates question.',
      rubric: ['Ideal-vs-actual differencing framing', 'Single-gap guarantee'],
    },
    constraintsHint: {
      modelAnswer:
        'O(n)/O(1) demanded: no sort, no set. Two candidate aggregates: the sum formula n(n+1)/2 (fine here; overflow-prone in fixed-width languages) and XOR (immune by construction).',
      rubric: ['Sort/set eliminated by the contract', 'Sum-vs-XOR tradeoff named'],
    },
    bruteForce: {
      modelAnswer: 'Build a seen-set, scan 0..n for the absentee: O(n) time but O(n) space; sorting instead is O(n log n) — both break the stated goal.',
      rubric: ['Set or sort baseline', 'Contract violations identified'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The set stores n values to detect one absence that an aggregate exposes for free: XOR of all indices 0..n and all values leaves every present number self-cancelled — only the missing one survives. Pattern: Bit Manipulation (XOR) — the sum formula is the accepted Math twin.',
      rubric: ['Waste: full storage for one difference', 'Index-XOR-value cancellation'],
      acceptedPatterns: ['bit-manipulation', 'math'],
    },
    algorithm: {
      modelAnswer: 'acc = n; for i in 0..n−1: acc ^= i ^ nums[i]. Return acc. Every present value pairs with its equal index somewhere; the missing one\'s index partner survives. Time O(n), space O(1).',
      rubric: ['Single-loop fold seeding with n', 'Pairing argument for correctness', 'States O(n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'A seen-set is O(n) space and sorting is O(n log n) — the contract wants better. XOR-ing every index 0..n against every value cancels each present number against its equal index, leaving exactly the missing number; unlike the n(n+1)/2 sum trick, XOR can\'t overflow in fixed-width languages. One pass, one register: O(n) time, O(1) space.',
      rubric: ['Template followed with cancellation + overflow comparison', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function missingNumber(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[3, 0, 1]], expected: 2, label: 'example' },
      { args: [[0, 1]], expected: 2, label: 'missing is n' },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8, label: 'long example' },
      { args: [[1]], expected: 0, label: 'missing is zero', hidden: true },
      { args: [[0]], expected: 1, label: 'single element', hidden: true },
      { args: [[1, 2]], expected: 0, label: 'zero absent from longer array', hidden: true },
    ],
    referenceSolution:
      'export function missingNumber(nums: number[]): number {\n  let acc = nums.length\n  for (let i = 0; i < nums.length; i++) {\n    acc ^= i ^ nums[i]\n  }\n  return acc\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
