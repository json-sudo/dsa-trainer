import type { Problem } from '../../types'

export const numberOf1Bits: Problem = {
  id: 'number-of-1-bits',
  leetcodeId: 191,
  title: 'Number of 1 Bits',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'bit-manipulation',
  authored: true,
  statement: 'Given a non-negative integer `n` (fits in 32 bits), return the number of `1` bits in its binary representation (its Hamming weight).',
  examples: [
    { input: 'n = 11 (1011)', output: '3' },
    { input: 'n = 128 (10000000)', output: '1' },
    { input: 'n = 2147483645', output: '30' },
  ],
  constraints: ['0 <= n <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer: 'Input: a 32-bit non-negative integer. Output: its set-bit count (0–31). Pure bit inspection, no array in sight.',
      rubric: ['32-bit framing', 'Count output range understood'],
    },
    whatToFind: {
      modelAnswer: 'Count positions where the binary expansion has a 1 — a count over the number\'s *representation*, not its value.',
      rubric: ['Representation-vs-value distinction', 'Counting category'],
    },
    constraintsHint: {
      modelAnswer:
        'At most 32 iterations whatever you do — the point is technique quality: per-bit checking is O(32); n & (n−1) is O(set bits), the idiom worth showing.',
      rubric: ['Notes complexity is bounded regardless', 'Names the clear-lowest-bit idiom as the target'],
    },
    bruteForce: {
      modelAnswer: 'Check all 32 positions: count += (n >>> i) & 1 for i in 0..31. O(32) — fine, inspects zero bits too.',
      rubric: ['Per-position mask loop with unsigned shift', 'Notes wasted work on zero bits'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Probing 0-bits answers questions nobody asked. n & (n−1) clears exactly the lowest set bit — decrementing borrows through the trailing zeros — so looping *only touches the ones*. Pattern: Bit Manipulation (Kernighan).',
      rubric: ['Waste: probing zero bits', 'Explains why n & (n−1) clears the lowest set bit'],
      acceptedPatterns: ['bit-manipulation'],
    },
    algorithm: {
      modelAnswer: 'count = 0; while n ≠ 0: n = n & (n − 1); count++. Return count. Iterations = number of set bits. Time O(set bits), space O(1). (Use >>> semantics / treat as unsigned.)',
      rubric: ['Kernighan loop stated', 'Iteration count = popcount claim', 'Unsigned-treatment note'],
    },
    interviewScript: {
      modelAnswer:
        'The straightforward loop masks all 32 positions — fine, but it probes zeros pointlessly. n & (n−1) clears exactly the lowest set bit (the decrement borrows through trailing zeros), so looping that until zero iterates once per 1-bit. Time O(set bits), space O(1) — and knowing this idiom pays off across the whole bit-trick family.',
      rubric: ['Template followed with the borrow explanation', 'Complexity in set-bit terms'],
    },
  },
  code: {
    signature: 'export function hammingWeight(n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [11], expected: 3, label: 'example' },
      { args: [128], expected: 1, label: 'single high bit' },
      { args: [0], expected: 0, label: 'zero' },
      { args: [2147483645], expected: 30, label: 'near-max value', hidden: true },
      { args: [1], expected: 1, label: 'one', hidden: true },
      { args: [2147483647], expected: 31, label: 'all 31 low bits set', hidden: true },
    ],
    referenceSolution:
      'export function hammingWeight(n: number): number {\n  let count = 0\n  while (n !== 0) {\n    n = n & (n - 1)\n    count++\n  }\n  return count\n}\n',
    complexity: { time: 'O(set bits)', space: 'O(1)' },
  },
}
