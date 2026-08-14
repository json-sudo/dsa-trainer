import type { Problem } from '../../types'

export const multiplyStrings: Problem = {
  id: 'multiply-strings',
  leetcodeId: 43,
  title: 'Multiply Strings',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also as a string. You may not convert the inputs directly to a native integer or BigInt — the numbers can be arbitrarily long.',
  examples: [
    { input: 'num1 = "2", num2 = "3"', output: '"6"' },
    { input: 'num1 = "123", num2 = "456"', output: '"56088"' },
    { input: 'num1 = "0", num2 = "52"', output: '"0"' },
  ],
  constraints: ['1 <= num1.length, num2.length <= 200', 'num1 and num2 consist only of digits', 'neither has a leading zero unless it is exactly "0"'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: two digit-strings, each up to 200 characters (far beyond native integer or even safe-double precision). Output: the product as a string — I have to do the arithmetic digit-by-digit, no shortcut through Number or BigInt is intended.',
      rubric: ['Notes the string lengths make native-number conversion unsafe/disallowed', 'Output must be built as a string via manual digit arithmetic'],
    },
    whatToFind: {
      modelAnswer:
        'Simulate elementary-school long multiplication: multiply every digit of num1 by every digit of num2, and correctly accumulate each partial product into the right decimal place of the result.',
      rubric: ['Frames it as simulating manual long multiplication', 'Notes results must accumulate correctly across overlapping decimal positions'],
    },
    constraintsHint: {
      modelAnswer:
        'Lengths up to 200 mean the product has at most 400 digits — too large for a double to represent exactly, and BigInt is disallowed by the problem\'s intent. The digit-by-digit approach is O(n·m) digit multiplications (≤ 4×10⁴), comfortably fast, and naturally exact.',
      rubric: ['Notes 400-digit products exceed safe double precision', 'Derives an O(n·m) budget for the digit-pair approach'],
    },
    bruteForce: {
      modelAnswer:
        '"Convert both to Number, multiply, convert back to string" — fails immediately for inputs beyond ~15-16 significant digits due to floating-point precision loss, and the problem explicitly disallows it. Not a viable baseline; the real starting point is the digit-pair simulation itself.',
      rubric: ['Explains why naive Number conversion is unsound (precision loss), not just "disallowed"', 'Identifies digit-by-digit simulation as the necessary approach even as a baseline'],
    },
    wasteAndPattern: {
      modelAnswer:
        'There\'s no "wasteful" version to optimize away here — the insight is structural: multiplying digit i of num1 (from the right, 0-indexed) by digit j of num2 always contributes to result positions i+j (carry) and i+j+1 (digit), regardless of the other digits. Pre-size a result array of length n+m and accumulate every digit-pair product into its fixed position, then resolve carries. Pattern: Math (positional-value simulation).',
      rubric: ['States the key placement fact: digit i × digit j lands at positions i+j and i+j+1', 'Notes a result array of length n+m is exactly enough (no overflow beyond that)'],
      acceptedPatterns: ['math'],
    },
    algorithm: {
      modelAnswer:
        'Let n = num1.length, m = num2.length. Allocate result = new Array(n+m).fill(0). For i from n-1 down to 0, for j from m-1 down to 0: d1 = digit at num1[i], d2 = digit at num2[j]; product = d1*d2 + result[i+j+1] (fold in whatever is already sitting there); result[i+j+1] = product % 10; result[i+j] += Math.floor(product / 10) (carry into the next-higher place). After both loops, join the digit array into a string and strip leading zeros, keeping a single "0" if everything strips away. Time O(n·m), space O(n+m).',
      rubric: [
        'States the double loop over digit pairs from the least-significant end',
        'States the correct carry accumulation into result[i+j] and result[i+j+1]',
        'Mentions stripping leading zeros (but preserving a lone "0")',
      ],
    },
    interviewScript: {
      modelAnswer:
        'Converting to native numbers loses precision past ~15-16 digits and the problem forbids it outright — with inputs up to 200 digits, the product can be 400 digits long, so I need exact digit-by-digit arithmetic. This is the classic long-multiplication simulation: multiplying digit i of num1 by digit j of num2 (both counted from the right) always lands at result positions i+j and i+j+1, so I can preallocate a result array of size n+m and accumulate every partial product plus carries in place. After the double loop I resolve remaining carries, join to a string, and strip leading zeros. O(n·m) time, O(n+m) space.',
      rubric: ['Follows the script template end-to-end', 'States the position formula and complexity'],
    },
  },
  code: {
    signature: 'export function multiply(num1: string, num2: string): string {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['2', '3'], expected: '6', label: 'single digits' },
      { args: ['123', '456'], expected: '56088', label: 'multi-digit example' },
      { args: ['0', '52'], expected: '0', label: 'zero operand' },
      { args: ['999', '999'], expected: '998001', label: 'carries across every position', hidden: true },
      { args: ['123456789', '987654321'], expected: '121932631112635269', label: 'large numbers, no BigInt allowed', hidden: true },
      { args: ['0', '0'], expected: '0', label: 'both zero', hidden: true },
    ],
    referenceSolution:
      'export function multiply(num1: string, num2: string): string {\n  if (num1 === \'0\' || num2 === \'0\') return \'0\'\n  const n = num1.length\n  const m = num2.length\n  const result = new Array(n + m).fill(0)\n  for (let i = n - 1; i >= 0; i--) {\n    const d1 = num1.charCodeAt(i) - 48\n    for (let j = m - 1; j >= 0; j--) {\n      const d2 = num2.charCodeAt(j) - 48\n      const product = d1 * d2 + result[i + j + 1]\n      result[i + j + 1] = product % 10\n      result[i + j] += Math.floor(product / 10)\n    }\n  }\n  let out = result.join(\'\')\n  out = out.replace(/^0+/, \'\')\n  return out === \'\' ? \'0\' : out\n}\n',
    complexity: { time: 'O(n·m)', space: 'O(n + m)' },
  },
}
