import type { Problem } from '../../types'

export const letterCombinationsOfAPhoneNumber: Problem = {
  id: 'letter-combinations-of-a-phone-number',
  leetcodeId: 17,
  title: 'Letter Combinations of a Phone Number',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'backtracking',
  authored: true,
  statement:
    'Given a string `digits` of digits 2–9, return all letter strings the number could represent on a phone keypad (2=abc, 3=def, 4=ghi, 5=jkl, 6=mno, 7=pqrs, 8=tuv, 9=wxyz), in any order. Empty input → empty output.',
  examples: [
    { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
    { input: 'digits = ""', output: '[]' },
    { input: 'digits = "2"', output: '["a","b","c"]' },
  ],
  constraints: ['0 <= digits.length <= 4', 'digits[i] is in [2-9]'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: up to 4 digits, each mapping to 3–4 letters. Output: every combination — one letter per digit, order of digits fixed. Empty input yields [] (not [""]).',
      rubric: ['Fixed digit order, one letter each', 'Empty-input convention flagged'],
    },
    whatToFind: {
      modelAnswer: 'The cartesian product of the per-digit letter sets — pure generation, no constraint can ever fail.',
      rubric: ['Cartesian product framing', 'Notes there is nothing to prune'],
    },
    constraintsHint: {
      modelAnswer: 'At most 4⁴ = 256 outputs — the bound authorizes enumeration outright. Complexity is output-bound: O(4ⁿ·n).',
      rubric: ['Output-size bound computed', 'Enumeration license from tiny n'],
    },
    bruteForce: {
      modelAnswer:
        'Nested loops per digit — but the nesting depth depends on input length, so "brute force" literally requires either recursion or an iterative product build. The naive fixed-depth loop approach doesn\'t generalize.',
      rubric: ['Recognizes fixed loops can\'t express variable depth', 'Motivates recursion/iterative product'],
    },
    wasteAndPattern: {
      modelAnswer:
        'No pruning exists (every branch completes), so the pattern choice is structural: variable-depth choice sequences are exactly the backtracking skeleton — choose a letter for digit i, recurse to i+1, un-choose. Pattern: Backtracking.',
      rubric: ['Notes zero-prune generation', 'Skeleton as variable-depth nested loops'],
      acceptedPatterns: ['backtracking'],
    },
    algorithm: {
      modelAnswer:
        'Map digits → letters. dfs(i, path): if i = digits.length, record path.join(""); else for each letter of digits[i]: push, dfs(i+1), pop. Guard the empty input before starting. Time O(4ⁿ·n), space O(n).',
      rubric: ['Index-driven skeleton with keypad map', 'Empty-input guard', 'States O(4ⁿ·n)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'This is the cartesian product of each digit\'s letters — 4⁴ = 256 strings at most, so enumeration is the intent. Fixed nested loops can\'t express a depth that depends on input length, so I\'ll use the backtracking skeleton as variable-depth loops: pick a letter for the current digit, recurse, backtrack. No pruning exists because nothing can fail. Time O(4ⁿ·n), space O(n) beyond the output.',
      rubric: ['Template adapted: names why recursion (variable depth) rather than speed', 'Complexity stated'],
    },
  },
  code: {
    signature: 'export function letterCombinations(digits: string): string[] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      { args: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'], label: 'example' },
      { args: [''], expected: [], label: 'empty input' },
      { args: ['2'], expected: ['a', 'b', 'c'], label: 'single digit' },
      { args: ['7'], expected: ['p', 'q', 'r', 's'], label: 'four-letter digit', hidden: true },
      {
        args: ['79'],
        expected: [
          'pw', 'px', 'py', 'pz', 'qw', 'qx', 'qy', 'qz',
          'rw', 'rx', 'ry', 'rz', 'sw', 'sx', 'sy', 'sz',
        ],
        label: 'two four-letter digits',
        hidden: true,
      },
    ],
    referenceSolution:
      "export function letterCombinations(digits: string): string[] {\n  if (digits.length === 0) return []\n  const map: Record<string, string> = {\n    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',\n    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',\n  }\n  const out: string[] = []\n  const path: string[] = []\n  const dfs = (i: number) => {\n    if (i === digits.length) {\n      out.push(path.join(''))\n      return\n    }\n    for (const letter of map[digits[i]]) {\n      path.push(letter)\n      dfs(i + 1)\n      path.pop()\n    }\n  }\n  dfs(0)\n  return out\n}\n",
    complexity: { time: 'O(4ⁿ · n)', space: 'O(n) recursion (output excluded)' },
  },
}
