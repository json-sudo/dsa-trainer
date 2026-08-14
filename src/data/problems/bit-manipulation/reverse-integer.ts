import type { Problem } from '../../types'

export const reverseInteger: Problem = {
  id: 'reverse-integer',
  leetcodeId: 7,
  title: 'Reverse Integer',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'bit-manipulation',
  authored: true,
  statement:
    'Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing causes the value to overflow the signed 32-bit range `[-2^31, 2^31 - 1]`, return 0.',
  examples: [
    { input: 'x = 123', output: '321' },
    { input: 'x = -123', output: '-321' },
    { input: 'x = 1534236469', output: '0', explanation: 'Reversed is 9646324351, which overflows 32-bit signed range.' },
  ],
  constraints: ['-2^31 <= x <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: one signed 32-bit integer, positive or negative. Output: its digits reversed as a signed integer, or 0 specifically if the reversal overflows the 32-bit signed range.',
      rubric: ['Notes x can be negative, and the sign must be preserved on the reversed result', 'Notes the overflow-to-0 special case explicitly'],
    },
    whatToFind: {
      modelAnswer:
        'Digit-by-digit reconstruction with a built-in bounds check: peel off digits from one end, rebuild the number in reverse order, and simultaneously verify at each step whether the fixed-width 32-bit contract has been violated.',
      rubric: ['Frames it as digit extraction + rebuild', 'Recognizes overflow detection must happen as part of the same process, not as an afterthought'],
    },
    constraintsHint: {
      modelAnswer:
        'The 32-bit bound is the crux of the problem, not an incidental detail: JavaScript numbers don\'t overflow the way a native 32-bit integer would — they just keep full precision well past 2^31. So "let it overflow and check at the end" silently produces the mathematically correct big number instead of the wraparound/garbage a real 32-bit system would produce, and the problem wants us to *simulate* that constraint by explicitly checking after each digit rather than relying on the language to enforce it.',
      rubric: ['Names the 32-bit signed range as the core constraint to enforce', 'Explicitly states that JS numbers do not naturally overflow, so the check must be done manually mid-computation'],
    },
    bruteForce: {
      modelAnswer:
        'Convert to a string, reverse it, reapply the sign, parse back to a number, then compare against 2^31 - 1 / -2^31 at the end. Works correctness-wise in JS because of unbounded-precision doubles, but it "cheats" the spirit of the 32-bit simulation and is the version to explicitly upgrade away from — checking only at the end rather than as digits accumulate.',
      rubric: ['Describes the string-reverse-and-parse approach', 'Notes it only works because JS numbers don\'t truly overflow, and that checking only at the end differs from the intended digit-by-digit simulation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The string round-trip does unnecessary work (string conversion, reversal, re-parsing) for something that\'s naturally a numeric peel-and-build loop; more importantly, checking overflow only at the very end doesn\'t faithfully simulate a real 32-bit integer, which would have already wrapped incorrectly mid-computation. Peel digits with %10 and integer division by 10, build the result one digit at a time, and check the 32-bit bound after every digit is added. Pattern: Math (digit manipulation with an explicit bound check), closely tied to bit-manipulation-style fixed-width reasoning.',
      rubric: ['Names the waste: string round-trip vs. direct numeric digit extraction', 'States that the bound must be checked per-digit, not just at the end'],
      acceptedPatterns: ['math'],
    },
    algorithm: {
      modelAnswer:
        'Work with sign = Math.sign(x) and n = Math.abs(x) to sidestep JS\'s quirky `%` behavior on negatives. Initialize result = 0. While n !== 0: digit = n % 10; n = Math.floor(n / 10); result = result * 10 + digit; after each update, check if result > 2^31 - 1 (since the final signed value could hit -2^31 exactly when sign is negative, compare the unsigned magnitude against 2^31 for the negative case, or equivalently check result*sign against the bounds) — if it has overflowed, return 0 immediately. At the end, return result * sign. Time O(log₁₀ x) — proportional to the digit count — space O(1).',
      rubric: [
        'States digit extraction via %10 and integer division by 10, working off Math.abs(x) with the sign reapplied at the end',
        'States the overflow check happens after each digit is folded in, not only at the end',
        'States O(log x) time, O(1) space',
      ],
    },
    interviewScript: {
      modelAnswer:
        'A string-reverse-and-parse works in JavaScript only because JS numbers don\'t actually overflow like a real 32-bit integer would — they keep full precision — so checking bounds only at the end doesn\'t faithfully simulate the original constraint. Instead I peel digits off Math.abs(x) with %10 and integer division by 10, rebuild the reversed value one digit at a time, and after folding in each digit I check whether the running result has already exceeded the signed 32-bit range; if so I return 0 immediately rather than letting JS\'s unbounded precision carry it further. At the end I reapply the original sign. This runs in time proportional to the digit count, O(log x), O(1) space.',
      rubric: ['Follows the script template end-to-end', 'Explicitly calls out the JS-numbers-don\'t-overflow issue and the mid-computation check it necessitates'],
    },
  },
  code: {
    signature: 'export function reverseInteger(x: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [123], expected: 321, label: 'simple positive' },
      { args: [-123], expected: -321, label: 'negative' },
      { args: [1534236469], expected: 0, label: 'overflow returns 0' },
      { args: [120], expected: 21, label: 'trailing zero dropped', hidden: true },
      { args: [0], expected: 0, label: 'zero' },
      { args: [-2147483648], expected: 0, label: 'min int32 reversal overflows', hidden: true },
      { args: [1563847412], expected: 0, label: 'another overflow case', hidden: true },
    ],
    referenceSolution:
      'export function reverseInteger(x: number): number {\n  const INT_MAX = 2147483647\n  const INT_MIN = -2147483648\n  const sign = x < 0 ? -1 : 1\n  let n = Math.abs(x)\n  let result = 0\n  while (n !== 0) {\n    const digit = n % 10\n    n = Math.floor(n / 10)\n    result = result * 10 + digit\n    if (sign * result > INT_MAX || sign * result < INT_MIN) return 0\n  }\n  return sign * result\n}\n',
    complexity: { time: 'O(log x) (proportional to digit count)', space: 'O(1)' },
  },
}
