import type { Problem } from '../../types'

export const validParentheses: Problem = {
  id: 'valid-parentheses',
  leetcodeId: 20,
  title: 'Valid Parentheses',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'stack',
  authored: true,
  statement:
    'Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[`, `]`, determine if the input is valid: every opening bracket is closed by the same type of bracket, and brackets close in the correct order.',
  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "()[]{}"', output: 'true' },
    { input: 's = "(]"', output: 'false' },
  ],
  constraints: ['1 <= s.length <= 10^4', "s consists only of the characters '()[]{}'"],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a string of bracket characters only. Output: a boolean — is nesting well-formed (every open has a matching close of the same kind, closes happen in reverse-open order).',
      rubric: ['States both conditions: matching type AND correct nesting order', 'Notes the alphabet is fixed to three bracket kinds'],
      teachingNote: 'Two separate conditions hide in "valid": right bracket type, and right order. Naming both up front prevents a solution that only checks counts.',
    },
    whatToFind: {
      modelAnswer: 'Whether the most recently opened, still-unclosed bracket always matches the next closing bracket encountered — i.e., last-opened-first-closed.',
      rubric: ['Identifies last-opened-first-closed (LIFO) structure', 'Frames validity as a per-close match check'],
      teachingNote: '"Last opened, first closed" is the definition of a stack — say this phrase and the data structure names itself.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 1e4 — trivial for any linear approach. The real constraint is structural: only 3 bracket types, closed characters must exactly reverse-match opens, which is naturally a single linear pass with O(n) auxiliary space in the worst case (all opens).',
      rubric: ['Notes n is small — no performance pressure', 'Notes worst case all-opens needs O(n) space'],
      teachingNote: 'When n doesn\'t force anything, say so explicitly rather than skipping the step — it shows the constraint-reading habit, not just constraint-driven results.',
    },
    bruteForce: {
      modelAnswer:
        'Repeatedly scan the string for adjacent matching pairs like "()", "[]", "{}" and remove them, until no more removals are possible or the string is empty (valid) or stuck (invalid). Each pass is O(n), and up to n/2 passes may be needed: O(n²) time.',
      rubric: ['Repeated-removal-of-adjacent-pairs approach', 'States O(n²)'],
      teachingNote: 'This brute force is a nice concrete "simulation without memory" baseline — it does the right thing but re-scans from scratch every removal.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Repeated full re-scans are wasted because the only thing that can ever match the *next* closing bracket is the *most recently* opened one — a stack remembers exactly that without re-scanning anything. Push opens; on a close, pop and check it matches; one linear pass. Pattern: Stack for nested/matching structure.',
      rubric: ['Waste: re-scanning the whole string on every removal', 'Stack replaces re-scanning by remembering only the relevant open'],
      acceptedPatterns: ['stack'],
      teachingNote: 'Any "matching/nesting/most-recent-unclosed" language ("balanced", "nested", "matching pairs") is the strongest stack tell in the whole pattern catalog.',
    },
    algorithm: {
      modelAnswer:
        'Map each closing bracket to its opening counterpart. Walk the string; on an opening bracket push it; on a closing bracket, if the stack is empty or its top doesn\'t match the expected opener, return false — else pop. After the walk, valid iff the stack is empty (no unclosed opens remain). Time O(n), space O(n).',
      rubric: ['Push on open, pop-and-compare on close', 'Empty-stack-on-close is a failure case', 'Final emptiness check for leftover opens'],
      teachingNote: 'Two failure modes people forget: closing with an empty stack, and leftover opens at the end. Both must be checked explicitly.',
    },
    interviewScript: {
      modelAnswer:
        'Validity needs both matching type and correct order, which is a last-opened-first-closed relationship — that\'s exactly a stack. Brute force repeatedly removes adjacent matching pairs by rescanning, O(n²); instead I push each open bracket and, on each close, pop and check it matches — failing on mismatch or an empty stack — and require the stack empty at the end. O(n) time, O(n) space.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'Classic "canonical stack problem" — good one to have completely fluent since interviewers use it to gauge baseline stack fluency fast.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Map closers to their opener, and a stack',
      code: 'const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" }\nconst stack: string[] = []',
    },
    {
      label: '2. Push opens, pop-and-check on closes',
      code: 'for (const ch of s) {\n  if (ch === "(" || ch === "[" || ch === "{") {\n    stack.push(ch)\n  } else {\n    if (stack.pop() !== pairs[ch]) return false   // mismatch or empty stack (pop returns undefined)\n  }\n}',
    },
    {
      label: '3. Valid only if every open got closed',
      code: 'return stack.length === 0',
    },
  ],
  code: {
    signature: 'export function isValid(s: string): boolean {\n\n}\n',
    harness: 'plain',
    tests: [
      { args: ['()'], expected: true, label: 'simple pair' },
      { args: ['()[]{}'], expected: true, label: 'multiple pair types in sequence' },
      { args: ['(]'], expected: false, label: 'mismatched types' },
      { args: ['(['], expected: false, label: 'unclosed opens', hidden: true },
      { args: [')('], expected: false, label: 'close before any open', hidden: true },
      { args: ['{[()]}'], expected: true, label: 'nested brackets', hidden: true },
    ],
    referenceSolution:
      'export function isValid(s: string): boolean {\n  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" }\n  const stack: string[] = []\n  for (const ch of s) {\n    if (ch === "(" || ch === "[" || ch === "{") {\n      stack.push(ch)\n    } else {\n      if (stack.pop() !== pairs[ch]) return false\n    }\n  }\n  return stack.length === 0\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
