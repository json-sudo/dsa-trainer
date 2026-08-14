import type { Problem } from '../../types'

export const happyNumber: Problem = {
  id: 'happy-number',
  leetcodeId: 202,
  title: 'Happy Number',
  difficulty: 'easy',
  mode: 'practice',
  topicId: 'math-geometry',
  authored: true,
  statement:
    'A number is **happy** if repeatedly replacing it by the sum of the squares of its digits eventually reaches `1`. Unhappy numbers loop forever. Return `true` if `n` is happy.',
  examples: [
    { input: 'n = 19', output: 'true', explanation: '19 → 82 → 68 → 100 → 1.' },
    { input: 'n = 2', output: 'false' },
  ],
  constraints: ['1 <= n <= 2^31 - 1'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: one positive integer up to 2³¹−1. Output: boolean. The process either hits 1 or cycles — the statement *tells* you non-termination shows up as a loop.',
      rubric: ['Reads the cycle guarantee out of the statement', 'Boolean output'],
    },
    whatToFind: {
      modelAnswer: 'Whether iterating a function from n reaches a fixed point (1) or enters a cycle — cycle detection on an implicit sequence.',
      rubric: ['Function-iteration framing', 'Reaches-1 vs enters-cycle dichotomy'],
    },
    constraintsHint: {
      modelAnswer:
        'Values shrink fast: any number below 10¹⁰ maps to at most 10·81 = 810, so the trajectory quickly lives in a tiny bounded set — cycles are guaranteed and short.',
      rubric: ['Bounds the trajectory (digit-square sums ≤ ~810)', 'Concludes cycles are inevitable/small'],
    },
    bruteForce: {
      modelAnswer: 'Iterate with a step cap ("if 1000 iterations pass, call it unhappy"): works by accident, but the cap is unjustified — a correctness smell, not an algorithm.',
      rubric: ['Names the arbitrary-cap hack', 'Identifies why it is unprincipled'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The honest mechanism is detecting a *revisit*: a seen-set answers exactly that in O(1) per step with O(k) memory. Floyd\'s slow/fast pointers do the same with O(1) memory — the cycle-detection idea from linked lists, transplanted to function iteration. Pattern: Hash Set (Two Pointers/Floyd accepted).',
      rubric: ['Revisit-detection framing', 'Both mechanisms (set, slow/fast) named'],
      acceptedPatterns: ['hash-set', 'two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'next(x) = sum of squared digits. Set version: while n ≠ 1: if n in seen → false; add, step. Floyd: slow = next(n), fast = next(next(n)); step until equal (unhappy) or fast hits 1 (happy). Time O(cycle length), space O(k) or O(1).',
      rubric: ['Correct next() digit loop', 'Either detection loop with right exits', 'Space contrast stated'],
    },
    interviewScript: {
      modelAnswer:
        'Capping iterations is a guess, not an algorithm. Digit-square sums collapse any number under ~810 immediately, so the trajectory is bounded and must either reach 1 or revisit a value — cycle detection. A seen-set answers revisits in O(k) space; Floyd\'s slow/fast pointers do it in O(1), same trick as linked-list cycles. I\'ll use the set for clarity, mentioning Floyd as the space upgrade.',
      rubric: ['Template followed with the boundedness argument', 'Both mechanisms compared'],
    },
  },
  code: {
    signature: 'export function isHappy(n: number): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [19], expected: true, label: 'example happy' },
      { args: [2], expected: false, label: 'example unhappy' },
      { args: [1], expected: true, label: 'already one' },
      { args: [7], expected: true, label: 'single digit happy', hidden: true },
      { args: [1111111], expected: true, label: 'seven ones', hidden: true },
      { args: [2147483647], expected: false, label: 'max int', hidden: true },
    ],
    referenceSolution:
      'export function isHappy(n: number): boolean {\n  const next = (x: number): number => {\n    let sum = 0\n    while (x > 0) {\n      const d = x % 10\n      sum += d * d\n      x = Math.floor(x / 10)\n    }\n    return sum\n  }\n  const seen = new Set<number>()\n  while (n !== 1) {\n    if (seen.has(n)) return false\n    seen.add(n)\n    n = next(n)\n  }\n  return true\n}\n',
    complexity: { time: 'O(cycle length)', space: 'O(k)' },
  },
}
