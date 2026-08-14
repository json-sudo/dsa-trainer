import type { Problem } from '../../types'

export const plusOne: Problem = {
  id: 'plus-one',
  leetcodeId: 66,
  title: 'Plus One',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'Given a large integer represented as an array of digits (most significant digit first, no leading zeros unless the number itself is 0), increment the integer by one and return the resulting array of digits.',
  examples: [
    { input: 'digits = [1,2,3]', output: '[1,2,4]' },
    { input: 'digits = [4,3,2,1]', output: '[4,3,2,2]' },
    { input: 'digits = [9,9]', output: '[1,0,0]', explanation: 'Carrying all the way through grows the digit count.' },
  ],
  constraints: ['1 <= digits.length <= 100', '0 <= digits[i] <= 9', 'no leading zeros except the single digit 0'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: digits of a non-negative integer, most-significant first. Output: the digits of that integer plus one — length can grow by exactly one digit if carrying propagates all the way to the front (e.g. 99 → 100).',
      rubric: ['Notes MSB-first ordering', 'Flags that the output can be one digit longer than the input'],
    },
    whatToFind: {
      modelAnswer: 'Standard elementary-school addition of 1, applied digit-by-digit from the least significant end, with carry propagation.',
      rubric: ['Frames it as digit-wise addition with carry, from the last digit', 'Notes the carry can ripple leftward through multiple digits'],
    },
    constraintsHint: {
      modelAnswer:
        'Up to 100 digits: this is far too large to convert to a native number (precision loss well before 100 digits), so the arithmetic must stay digit-array-based throughout. Size otherwise permits a trivial O(n) pass.',
      rubric: ['Rules out converting to a native number due to precision', 'Notes O(n) digit-array arithmetic is the target'],
    },
    bruteForce: {
      modelAnswer: 'Convert the digit array to a BigInt (or number), add 1, convert back to a digit array. Works correctly with BigInt, but re-implements what a direct carry walk does more simply, and a plain `number` conversion silently loses precision past ~15-16 digits.',
      rubric: ['Names the convert-add-convert-back approach', 'Flags the native-number precision risk (or the BigInt workaround)'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Converting to and from a big-integer type does unnecessary work (and risks precision) for what is just "add 1 and propagate a carry" — something a single right-to-left pass handles directly on the array itself. Pattern: One-Pass (carry propagation).',
      rubric: ['Names the waste: full numeric conversion for a simple carry operation', 'Proposes a direct right-to-left carry pass on the array'],
      acceptedPatterns: ['math', 'one-pass'],
    },
    algorithm: {
      modelAnswer:
        'Walk i from the last index to 0: if digits[i] < 9, increment it and return immediately (no further carry). Otherwise set digits[i] = 0 and continue left (the carry). If the loop finishes without an early return, every digit was 9 and all became 0 — prepend a leading 1. Time O(n), space O(n) only in the all-nines case (new array), O(1) otherwise.',
      rubric: ['Early return the moment a digit < 9 absorbs the carry', 'Sets carried digits to 0 while continuing left', 'Handles the all-nines overflow by prepending 1'],
    },
    interviewScript: {
      modelAnswer:
        'This is elementary addition of 1 to the number represented by the digit array. Converting to BigInt and back would work but does more than necessary (and a plain number risks losing precision past ~15 digits at n=100). I\'ll walk from the last digit: increment and stop the moment a digit is below 9; a 9 becomes 0 and the carry continues left. If every digit was 9, I prepend a leading 1. Time O(n), space O(1) except in the rare all-nines case.',
      rubric: ['Follows the script template end-to-end', 'States the carry-walk insight and final complexity'],
    },
  },
  code: {
    signature: 'export function plusOne(digits: number[]): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 2, 3]], expected: [1, 2, 4], label: 'example: no carry' },
      { args: [[4, 3, 2, 1]], expected: [4, 3, 2, 2], label: 'example: last digit increments' },
      { args: [[9, 9]], expected: [1, 0, 0], label: 'example: full overflow grows length' },
      { args: [[0]], expected: [1], label: 'single zero digit', hidden: true },
      { args: [[1, 9, 9]], expected: [2, 0, 0], label: 'partial carry propagation', hidden: true },
      { args: [[9]], expected: [1, 0], label: 'single nine overflows', hidden: true },
    ],
    referenceSolution:
      'export function plusOne(digits: number[]): number[] {\n  for (let i = digits.length - 1; i >= 0; i--) {\n    if (digits[i] < 9) {\n      digits[i]++\n      return digits\n    }\n    digits[i] = 0\n  }\n  return [1, ...digits]\n}\n',
    complexity: { time: 'O(n)', space: 'O(1) amortized, O(n) worst case' },
  },
}
