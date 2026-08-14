import type { Problem } from '../../types'

export const singleNumber: Problem = {
  id: 'single-number',
  leetcodeId: 136,
  title: 'Single Number',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'bit-manipulation',
  authored: true,
  statement:
    'Every element of `nums` appears exactly twice except one, which appears once. Find it in **O(n) time and O(1) extra space**.',
  examples: [
    { input: 'nums = [2,2,1]', output: '1' },
    { input: 'nums = [4,1,2,1,2]', output: '4' },
    { input: 'nums = [1]', output: '1' },
  ],
  constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'every element appears twice except one'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array where exactly one value is unpaired. Output: that value. The pairing guarantee is total — no "maybe two singles" cases.',
      rubric: ['Pairing guarantee registered as absolute', 'Single value output'],
      teachingNote:
        'The demanded O(1) space *with* the exact-pairs guarantee is the entire fingerprint of this problem. Constraints + guarantees together choose the tool before you think about code.',
    },
    whatToFind: {
      modelAnswer: 'Existence/identification of the one element violating the pairing — but really: a whole-array aggregate that pairs cancel out of.',
      rubric: ['Identification framing', 'Seeks a pair-cancelling aggregate'],
      teachingNote:
        'The reframe from "search for the odd one" to "compute an aggregate where pairs vanish" is the whole leap. Sums almost work (sum − 2·sum(distinct) needs a set); XOR does it natively.',
    },
    constraintsHint: {
      modelAnswer:
        'O(n) time is easy (hash map) — O(1) *space* is the sting: no map, no sort (O(n log n) or mutation). Something must accumulate through a single register.',
      rubric: ['Space constraint kills the map', 'Single-register accumulation deduced'],
      teachingNote:
        'Walk the elimination chain out loud: map → banned by space; sort → banned by time/mutation; so the answer is an arithmetic/bitwise fold. Interviewers love hearing the elimination, not just the trick.',
    },
    bruteForce: {
      modelAnswer: 'Count occurrences in a hash map, return the key with count 1: O(n) time, O(n) space — correct, but violates the space contract.',
      rubric: ['Freq-map baseline', 'Space violation named'],
      teachingNote:
        'Always give the hash-map answer first even when you know the trick — it proves the trick is an *optimization*, not a lucky memory. Ten seconds, then improve it.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The map stores every pair only to watch them cancel at the end. XOR cancels them *in flight*: a ^ a = 0, a ^ 0 = a, and XOR is commutative — so folding the whole array leaves exactly the unpaired value, no memory at all. Pattern: Bit Manipulation (XOR).',
      rubric: ['Waste: storing pairs that annihilate anyway', 'The three XOR identities invoked'],
      acceptedPatterns: ['bit-manipulation'],
      teachingNote:
        'Say the algebra: self-inverse (a^a=0), identity (a^0=a), commutativity (order irrelevant). Those three lines *are* the proof, and reciting them cleanly is the senior version of this answer.',
    },
    algorithm: {
      modelAnswer: 'acc = 0; for each x: acc ^= x; return acc. One pass, one register. Time O(n), space O(1).',
      rubric: ['Single fold stated', 'States O(n)/O(1)'],
      teachingNote:
        'Three lines of code, so the interview is 90% explanation. Spend your time on the why; the code should take ten seconds.',
    },
    interviewScript: {
      modelAnswer:
        'The hash-map count is O(n) time but O(n) space, and the problem demands constant space. Since every pair must cancel, I want an aggregate with self-cancellation — XOR: a^a = 0, a^0 = a, order irrelevant, so XORing everything leaves precisely the single number. One pass, one register. Time O(n), space O(1).',
      rubric: ['Template followed with the identities as justification', 'Complexity stated'],
      teachingNote:
        'This script is worth memorizing verbatim — it\'s short, complete, and the XOR-cancellation cadence transfers to Missing Number and its whole family.',
    },
  },
  incrementalBuild: [
    {
      label: '1. The three identities that make XOR the tool',
      code: '// a ^ a = 0        (self-inverse: pairs annihilate)\n// a ^ 0 = a        (identity: the survivor passes through)\n// a ^ b = b ^ a    (commutative: order never matters)',
    },
    {
      label: '2. Fold the whole array through one register',
      code: 'let acc = 0\nfor (const x of nums) acc ^= x\n// every paired value cancels in flight — no storage needed',
    },
    {
      label: '3. What remains is the unpaired value',
      code: 'return acc   // O(n) time, O(1) space — the space contract is met',
    },
  ],
  code: {
    signature: 'export function singleNumber(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 2, 1]], expected: 1, label: 'example' },
      { args: [[4, 1, 2, 1, 2]], expected: 4, label: 'example 2' },
      { args: [[1]], expected: 1, label: 'single element' },
      { args: [[-3, 7, -3]], expected: 7, label: 'negatives', hidden: true },
      { args: [[0, 5, 0]], expected: 5, label: 'zeros pair up', hidden: true },
      { args: [[30000, -30000, 30000]], expected: -30000, label: 'boundary values', hidden: true },
    ],
    referenceSolution:
      'export function singleNumber(nums: number[]): number {\n  let acc = 0\n  for (const x of nums) acc ^= x\n  return acc\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
