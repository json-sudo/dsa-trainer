import type { Problem } from '../../types'

export const reverseBits: Problem = {
  id: 'reverse-bits',
  leetcodeId: 190,
  title: 'Reverse Bits',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'bit-manipulation',
  authored: true,
  statement: 'Reverse the bits of a 32-bit unsigned integer `n` (bit 0 swaps with bit 31, bit 1 with bit 30, …) and return the resulting unsigned integer.',
  examples: [
    { input: 'n = 0b00000010100101000001111010011100', output: '964176192', explanation: 'Reversed: 0b00111001011110000010100101000000.' },
    { input: 'n = 4294967293 (all ones except bit 1)', output: '3221225471' },
  ],
  constraints: ['0 <= n < 2^32', 'treat n as unsigned'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: 32 bits to be treated as unsigned. Output: those bits mirrored, again unsigned. JS trap: bitwise ops yield *signed* 32-bit values — a final >>> 0 restores unsignedness.',
      rubric: ['Mirror semantics stated', 'JS signed-bitwise trap + >>> 0 fix'],
    },
    whatToFind: {
      modelAnswer: 'A pure rearrangement of the representation — position i moves to 31 − i. No arithmetic meaning survives; it\'s bit choreography.',
      rubric: ['Fixed-position permutation framing', 'Representation-level task'],
    },
    constraintsHint: {
      modelAnswer: 'Always exactly 32 bits — complexity is constant by definition; the assessment is entirely about clean shifting/masking (and knowing >>> vs >>).',
      rubric: ['Constant-work observation', 'Signed vs unsigned shift distinction'],
    },
    bruteForce: {
      modelAnswer: 'Convert to a binary string, pad to 32, reverse, parse back: works, but string machinery for a bit task signals discomfort with shifts.',
      rubric: ['String-reversal named', 'Why it is frowned upon'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Strings allocate and re-parse what two registers express directly: peel the low bit off n, push it onto the result from the right — 32 shift-and-or steps. Pattern: Bit Manipulation.',
      rubric: ['Waste: string allocation for register work', 'Peel-and-push loop described'],
      acceptedPatterns: ['bit-manipulation'],
    },
    algorithm: {
      modelAnswer:
        'result = 0; repeat 32×: result = (result << 1) | (n & 1); n >>>= 1. Return result >>> 0 (unsigned). Time O(32), space O(1).',
      rubric: ['Shift-in/shift-out loop', 'Final >>> 0 normalization', 'Unsigned right shift on n'],
    },
    interviewScript: {
      modelAnswer:
        'String reversal works but allocates and parses for what registers do natively. I\'ll run 32 iterations: shift the result left, or-in n\'s low bit, shift n right unsigned — a conveyor belt moving bits from one end to the other — normalizing with >>> 0 at the end since JavaScript bitwise results are signed. Constant time and space by construction.',
      rubric: ['Template followed with the conveyor description', 'JS unsigned normalization mentioned'],
    },
  },
  code: {
    signature: 'export function reverseBits(n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [43261596], expected: 964176192, label: 'example' },
      { args: [4294967293], expected: 3221225471, label: 'high bit patterns' },
      { args: [0], expected: 0, label: 'zero' },
      { args: [1], expected: 2147483648, label: 'low bit to top', hidden: true },
      { args: [4294967295], expected: 4294967295, label: 'all ones', hidden: true },
      { args: [2147483648], expected: 1, label: 'top bit to bottom', hidden: true },
    ],
    referenceSolution:
      'export function reverseBits(n: number): number {\n  let result = 0\n  for (let i = 0; i < 32; i++) {\n    result = (result << 1) | (n & 1)\n    n = n >>> 1\n  }\n  return result >>> 0\n}\n',
    complexity: { time: 'O(32)', space: 'O(1)' },
  },
}
