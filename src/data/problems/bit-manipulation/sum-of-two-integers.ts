import type { Problem } from '../../types'

export const sumOfTwoIntegers: Problem = {
  id: 'sum-of-two-integers',
  leetcodeId: 371,
  title: 'Sum of Two Integers',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'bit-manipulation',
  authored: true,
  statement:
    'Given two 32-bit signed integers `a` and `b`, return the sum `a + b` without using the `+` or `-` operators.',
  examples: [
    { input: 'a = 1, b = 2', output: '3' },
    { input: 'a = 2, b = 3', output: '5' },
    { input: 'a = -2, b = 3', output: '1' },
  ],
  constraints: ['-2^31 <= a, b <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two 32-bit signed integers, either sign. Output: their sum, but computed without the `+` or `-` operators — the arithmetic itself has to come from bitwise operations.',
      rubric: ['Notes both operands can be negative', 'Notes the constraint is on the operators used, not the values (forces a bitwise approach)'],
    },
    whatToFind: {
      modelAnswer:
        'Reproduce binary addition from first principles: at the bit level, addition is "XOR gives the sum bit ignoring carry, AND-then-shift gives the carry", repeated until no carry remains.',
      rubric: ['Identifies binary addition\'s two components: sum-without-carry and carry', 'Frames it as a repeated/iterative process, not a single formula'],
    },
    constraintsHint: {
      modelAnswer:
        'The 32-bit bound is what makes "no +/-" meaningful — it\'s a fixed-width addition, so overflow/wraparound must behave like real 32-bit arithmetic. In JavaScript, bitwise operators (`^`, `&`, `<<`) already coerce both operands to 32-bit signed integers and wrap accordingly, so this constraint is satisfied for free — no manual masking is needed the way it would be in a language without that built-in coercion.',
      rubric: ['Names the 32-bit signed bound as the reason overflow behavior matters', 'States the JS-specific fact that bitwise ops auto-coerce to 32-bit signed, avoiding manual masking'],
    },
    bruteForce: {
      modelAnswer:
        'There isn\'t really a slower "brute force" here — the only way to add without +/- is the bitwise carry simulation itself; the naive instinct (loop, incrementing one operand while decrementing the other by 1 each time) uses -- internally, which is disallowed, and would be O(|a|) time in any case rather than the fixed O(1)-ish bit-count loop.',
      rubric: ['Explains why a decrement-loop approach is disallowed and inefficient', 'Identifies bitwise carry simulation as the only real approach here'],
    },
    wasteAndPattern: {
      modelAnswer:
        'No structural waste to trim — the insight is direct: `a ^ b` computes each bit\'s sum ignoring carry-out, and `(a & b) << 1` computes exactly the carry bits shifted into their target position. Add those two together... except that reintroduces `+`. So instead, treat `(a ^ b)` as a new "a" and `(a & b) << 1` as a new "b", and repeat the same XOR/AND-shift step until the carry becomes 0. Pattern: Bit Manipulation.',
      rubric: ['States XOR = sum without carry, AND-then-shift = carry', 'States the fixed-point iteration: reassign a/b and repeat until carry is 0'],
      acceptedPatterns: ['bit-manipulation'],
    },
    algorithm: {
      modelAnswer:
        'While b !== 0: compute xorPart = a ^ b (sum ignoring carry) and carryPart = (a & b) << 1 (the carry, positioned one bit left); reassign a = xorPart, b = carryPart. When b reaches 0 there\'s no carry left to fold in, so a holds the final sum. Return a. JS\'s bitwise operators coerce to 32-bit signed integers automatically, so overflow wraps correctly without any extra masking. Time O(1) (bounded by 32 bit-widths), space O(1).',
      rubric: [
        'States the loop invariant: repeat XOR/AND-shift, reassigning a and b, until carry (b) is 0',
        'Returns a once the loop ends',
        'Notes the JS auto-coercion to 32-bit signed and states O(1)/O(1) (bounded by bit width)',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Without +/- the only path is simulating binary addition at the bit level: XOR gives the sum of each bit position ignoring any carry, and AND followed by a left shift gives exactly the carry bits, positioned where they need to be added in next. Since I can\'t use + to combine those two results, I instead treat them as a new (a, b) pair and repeat — XOR and carry-shift again — until the carry becomes zero, at which point the running XOR value is the final sum. In JavaScript this is especially clean because the bitwise operators already coerce operands to 32-bit signed integers and wrap on overflow automatically, so I don\'t need any manual masking that a language without that coercion would require. The loop runs at most 32 times, so O(1) time and space.',
      rubric: ['Follows the script template end-to-end', 'States the JS auto-coercion detail explicitly and the loop-until-no-carry mechanism'],
    },
  },
  code: {
    signature: 'export function getSum(a: number, b: number): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [1, 2], expected: 3, label: 'small positives' },
      { args: [2, 3], expected: 5, label: 'small positives 2' },
      { args: [-2, 3], expected: 1, label: 'mixed signs' },
      { args: [-5, -7], expected: -12, label: 'both negative', hidden: true },
      { args: [0, 0], expected: 0, label: 'both zero', hidden: true },
      { args: [2147483647, -1], expected: 2147483646, label: 'near int32 max boundary', hidden: true },
    ],
    referenceSolution:
      'export function getSum(a: number, b: number): number {\n  while (b !== 0) {\n    const xorPart = a ^ b\n    const carryPart = (a & b) << 1\n    a = xorPart\n    b = carryPart\n  }\n  return a\n}\n',
    complexity: { time: 'O(1) (bounded by 32 bit positions)', space: 'O(1)' },
  },
}
