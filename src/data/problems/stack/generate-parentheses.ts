import type { Problem } from '../../types'

export const generateParentheses: Problem = {
  id: 'generate-parentheses',
  leetcodeId: 22,
  title: 'Generate Parentheses',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'stack',
  authored: true,
  statement: 'Given `n` pairs of parentheses, return **all** strings of well-formed (balanced) parentheses using exactly `n` pairs, in any order.',
  examples: [
    { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    { input: 'n = 1', output: '["()"]' },
  ],
  constraints: ['1 <= n <= 8'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a single small integer n ≤ 8. Output: *every* valid string of n pairs — an enumeration whose size (Catalan number, 1430 at n=8) dominates the work.',
      rubric: ['Output is the full enumeration', 'Notes output size is exponential-ish (Catalan)'],
    },
    whatToFind: {
      modelAnswer: 'Enumerate all constructions satisfying the balance rule — a generation task, not a search or count.',
      rubric: ['Identifies exhaustive generation', 'Names the validity constraint'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 8 screams exponential-output enumeration is intended. The bound isn\'t a speed budget; it caps the output. When n is tiny, think backtracking/DFS over choices.',
      rubric: ['Reads a tiny bound as an enumeration hint', 'No linear-time expectation'],
    },
    bruteForce: {
      modelAnswer:
        'Generate all 2^(2n) strings of "(" and ")" and filter with a balance check: 65k strings at n=8, times O(n) validation — feasible but generates mostly garbage.',
      rubric: ['All 2^(2n) strings + filter', 'States O(2^(2n) · n)', 'Notes it is mostly wasted generation'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Almost every generated string is invalid from an early prefix — e.g. everything starting with ")" — yet the brute force finishes building them. Prune at choice time: only add "(" if any remain, only add ")" if it wouldn\'t exceed the "(" count. Pattern: Backtracking (the balance counter is the stack discipline).',
      rubric: ['Waste: completing strings doomed by their prefix', 'States the two pruning rules'],
      acceptedPatterns: ['backtracking', 'stack'],
    },
    algorithm: {
      modelAnswer:
        'DFS with (current, open, close): if length = 2n, record. Add "(" when open < n; add ")" when close < open. Every partial string is a valid prefix, so no dead branches at all. Time O(Catalan(n) · n), space O(n) recursion.',
      rubric: ['DFS with open/close counters and the two guards', 'Notes every branch survives (perfect pruning)', 'Complexity in output terms'],
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be generating all 2^(2n) bracket strings and filtering — mostly garbage since invalid prefixes are completed anyway. This looks like backtracking because validity is decidable per character: I can only open while opens remain, and only close while closes lag opens. I\'ll DFS with those two guards, so every path emitted is valid. Time proportional to the Catalan-sized output, space O(n).',
      rubric: ['Template followed with prefix-validity pruning', 'Output-sensitive complexity stated'],
    },
  },
  code: {
    signature: 'export function generateParenthesis(n: number): string[] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'], label: 'example' },
      { args: [1], expected: ['()'], label: 'single pair' },
      { args: [2], expected: ['(())', '()()'], label: 'two pairs' },
      {
        args: [4],
        expected: [
          '(((())))', '((()()))', '((())())', '((()))()', '(()(()))', '(()()())', '(()())()',
          '(())(())', '(())()()', '()((()))', '()(()())', '()(())()', '()()(())', '()()()()',
        ],
        label: 'n = 4 (14 strings)',
        hidden: true,
      },
      {
        args: [5],
        expected: [
          '((((()))))', '(((()())))', '(((())()))', '(((()))())', '(((())))()', '((()(())))',
          '((()()()))', '((()())())', '((()()))()', '((())(()))', '((())()())', '((())())()',
          '((()))(())', '((()))()()', '(()((())))', '(()(()()))', '(()(())())', '(()(()))()',
          '(()()(()))', '(()()()())', '(()()())()', '(()())(())', '(()())()()', '(())((()))',
          '(())(()())', '(())(())()', '(())()(())', '(())()()()', '()(((())))', '()((()()))',
          '()((())())', '()((()))()', '()(()(()))', '()(()()())', '()(()())()', '()(())(())',
          '()(())()()', '()()((()))', '()()(()())', '()()(())()', '()()()(())', '()()()()()',
        ],
        label: 'n = 5 (42 strings)',
        hidden: true,
      },
    ],
    referenceSolution:
      "export function generateParenthesis(n: number): string[] {\n  const out: string[] = []\n  const dfs = (current: string, open: number, close: number) => {\n    if (current.length === 2 * n) {\n      out.push(current)\n      return\n    }\n    if (open < n) dfs(current + '(', open + 1, close)\n    if (close < open) dfs(current + ')', open, close + 1)\n  }\n  dfs('', 0, 0)\n  return out\n}\n",
    complexity: { time: 'O(Catalan(n) · n)', space: 'O(n) recursion' },
  },
}
