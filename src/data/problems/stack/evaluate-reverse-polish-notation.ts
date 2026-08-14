import type { Problem } from '../../types'

export const evaluateReversePolishNotation: Problem = {
  id: 'evaluate-reverse-polish-notation',
  leetcodeId: 150,
  title: 'Evaluate Reverse Polish Notation',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'stack',
  authored: true,
  statement:
    'Evaluate an arithmetic expression given in Reverse Polish (postfix) notation as an array of `tokens`. Valid operators are `+`, `-`, `*`, `/`; every other token is an integer. Division **truncates toward zero**. The input is always a valid expression.',
  examples: [
    { input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '(2 + 1) × 3.' },
    { input: 'tokens = ["4","13","5","/","+"]', output: '6', explanation: '4 + (13 / 5) = 4 + 2.' },
  ],
  constraints: ['1 <= tokens.length <= 10^4', 'tokens are valid RPN', 'intermediate values fit in 32 bits'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of string tokens — numbers and four operators — forming valid postfix. Output: one integer. Two traps in the contract: negative number tokens, and division truncating toward zero (not flooring).',
      rubric: ['Token stream + single integer output', 'Flags truncate-toward-zero and negative tokens'],
    },
    whatToFind: {
      modelAnswer: 'Evaluate a postfix expression: each operator consumes the two most recent unconsumed operands. It is a construct/simulate task.',
      rubric: ['Names postfix evaluation semantics', 'Operator consumes the two most recent operands'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁴ — anything linear-ish passes; the constraint block is really about semantics (validity guaranteed → no error handling; 32-bit intermediates → plain numbers fine in JS).',
      rubric: ['Recognizes complexity is not the challenge here', 'Reads the semantic guarantees'],
    },
    bruteForce: {
      modelAnswer:
        'Repeatedly scan for the leftmost operator, evaluate it with the two numbers before it, and splice the result back: O(n²) from rescanning/splicing, O(n) space.',
      rubric: ['Scan-and-splice approach', 'States O(n²)', 'States space'],
    },
    wasteAndPattern: {
      modelAnswer:
        '"The two most recent unconsumed operands" is exactly a last-in-first-out access pattern — the rescan wastes time rediscovering what a stack top already knows. Push numbers; on an operator, pop two, apply, push the result. Pattern: Stack.',
      rubric: ['Waste: rescanning for what LIFO order gives free', 'Push-operands / pop-two-on-operator rule'],
      acceptedPatterns: ['stack'],
    },
    algorithm: {
      modelAnswer:
        'One pass over tokens. Number → push. Operator → pop b then a (order matters for − and /), compute a op b with Math.trunc for division, push. At the end the stack holds one value. Time O(n), space O(n).',
      rubric: ['Single pass with the pop-order (a op b) correctness', 'Math.trunc division noted', 'States O(n)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be repeatedly finding and splicing the next operator — quadratic and clumsy. Postfix is defined by "operator applies to the two most recent results", which is literally a stack discipline. I\'ll push numbers and fold on operators, minding operand order for subtraction and truncated division. Time O(n), space O(n).',
      rubric: ['Template followed with LIFO-by-definition insight', 'Order/truncation pitfalls mentioned'],
    },
  },
  code: {
    signature: 'export function evalRPN(tokens: string[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[['2', '1', '+', '3', '*']][0]], expected: 9, label: 'example' },
      { args: [[['4', '13', '5', '/', '+']][0]], expected: 6, label: 'truncating division' },
      { args: [[['42']][0]], expected: 42, label: 'single number' },
      {
        args: [[['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']][0]],
        expected: 22,
        label: 'long expression with negatives',
        hidden: true,
      },
      { args: [[['7', '-3', '/']][0]], expected: -2, label: 'negative division truncates toward zero', hidden: true },
      { args: [[['3', '4', '-']][0]], expected: -1, label: 'operand order for subtraction', hidden: true },
    ],
    referenceSolution:
      "export function evalRPN(tokens: string[]): number {\n  const stack: number[] = []\n  for (const token of tokens) {\n    if (token === '+' || token === '-' || token === '*' || token === '/') {\n      const b = stack.pop()!\n      const a = stack.pop()!\n      let result: number\n      if (token === '+') result = a + b\n      else if (token === '-') result = a - b\n      else if (token === '*') result = a * b\n      else result = Math.trunc(a / b)\n      stack.push(result)\n    } else {\n      stack.push(parseInt(token, 10))\n    }\n  }\n  return stack[0]\n}\n",
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
