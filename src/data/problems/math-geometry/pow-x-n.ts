import type { Problem } from '../../types'

export const powXN: Problem = {
  id: 'pow-x-n',
  leetcodeId: 50,
  title: 'Pow(x, n)',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'math-geometry',
  authored: true,
  statement: 'Implement `pow(x, n)` computing `x` raised to the integer power `n` (n may be negative or zero). Do not use the built-in exponent operator.',
  examples: [
    { input: 'x = 2.0, n = 10', output: '1024.0' },
    { input: 'x = 2.1, n = 3', output: '9.261' },
    { input: 'x = 2.0, n = -2', output: '0.25' },
  ],
  constraints: ['-100 < x < 100', '-2^31 <= n <= 2^31 - 1', 'result fits in a double'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a real base and an integer exponent that can be negative, zero, or −2³¹ (whose negation overflows 32-bit — worth a note, harmless in JS doubles). Output: one float.',
      rubric: ['Negative/zero exponent cases', 'The −2³¹ negation footnote'],
    },
    whatToFind: {
      modelAnswer: 'Compute a power efficiently — a pure computation task where the exponent\'s *binary structure* is the exploitable input.',
      rubric: ['Computation (not search) framing', 'Binary-structure-of-n hint'],
    },
    constraintsHint: {
      modelAnswer: 'n up to 2³¹: 2×10⁹ multiplications is far too slow — the budget is O(log n), which square-and-multiply delivers (≤ 31 squarings).',
      rubric: ['Linear multiplication rejected numerically', 'log-n budget from halving'],
    },
    bruteForce: {
      modelAnswer: 'Multiply x into an accumulator |n| times: O(n) — 2×10⁹ steps at the bound, plus reciprocal handling for negatives.',
      rubric: ['Linear loop stated', 'O(n) with the bound named'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The linear loop recomputes overlapping products: x⁸ is (x⁴)² but the loop rebuilds it from scratch, one x at a time. Halve the exponent: x²ᵏ = (xᵏ)², odd exponents peel one factor. Each halving step is one squaring — 31 steps, not 2 billion. Pattern: Math (fast power / divide & conquer).',
      rubric: ['Waste: rebuilding powers that squaring composes', 'Even/odd halving recurrence stated'],
      acceptedPatterns: ['math'],
    },
    algorithm: {
      modelAnswer:
        'Handle n < 0: x = 1/x, n = −n. Iterative binary exponentiation: result = 1; while n > 0: if n odd → result *= x; x *= x; n = ⌊n/2⌋. Time O(log n), space O(1).',
      rubric: ['Negative-exponent inversion first', 'Correct odd-bit multiply + square loop', 'States O(log n)/O(1)'],
    },
    interviewScript: {
      modelAnswer:
        'Multiplying x in a loop is O(n) — 2 billion steps at the bound. Exponents compose by squaring: x²ᵏ is (xᵏ)², so processing n\'s bits gives O(log n) — 31 squarings, multiplying into the result on odd bits, with negative n handled by inverting the base upfront. Time O(log n), space O(1).',
      rubric: ['Template followed with the squaring-composition insight', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function myPow(x: number, n: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [2.0, 10], expected: 1024, label: 'example' },
      { args: [2.0, -2], expected: 0.25, label: 'negative exponent' },
      { args: [7.5, 0], expected: 1, label: 'zero exponent' },
      { args: [1.0, 2147483647], expected: 1, label: 'max exponent base one', hidden: true },
      { args: [-2.0, 3], expected: -8, label: 'negative base odd power', hidden: true },
      { args: [2.0, 31], expected: 2147483648, label: 'large power of two', hidden: true },
    ],
    referenceSolution:
      'export function myPow(x: number, n: number): number {\n  let base = x\n  let exp = n\n  if (exp < 0) {\n    base = 1 / base\n    exp = -exp\n  }\n  let result = 1\n  while (exp > 0) {\n    if (exp % 2 === 1) result *= base\n    base *= base\n    exp = Math.floor(exp / 2)\n  }\n  return result\n}\n',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
}
