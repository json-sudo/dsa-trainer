import type { Problem } from '../../types'

export const validParenthesisString: Problem = {
  id: 'valid-parenthesis-string',
  leetcodeId: 678,
  title: 'Valid Parenthesis String',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'greedy',
  authored: true,
  statement:
    'Given a string `s` containing only `(`, `)`, and `*`, determine if `s` is valid. `(` and `)` must match normally; `*` may be treated as `(`, as `)`, or as an empty string. Return true if some interpretation of every `*` makes `s` a valid parenthesization.',
  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "(*)"', output: 'true', explanation: '* is treated as empty.' },
    { input: 's = "(*))"', output: 'true', explanation: '* is treated as "(", giving "(())".' },
  ],
  constraints: ['1 <= s.length <= 100', 's[i] is (, ), or *'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a string up to length 100 of three characters, where `*` is a wildcard with three possible interpretations. Output: a boolean — does SOME assignment of every wildcard yield a valid parenthesization.',
      rubric: ['Names the three-way ambiguity of `*`', 'Output is existence over all wildcard assignments, not one fixed string'],
    },
    whatToFind: {
      modelAnswer:
        'A feasibility question under uncertainty: rather than trying every combination of wildcard choices, track the *range* of open-paren counts that remain possible at each position and see if zero is reachable at the end.',
      rubric: ['Frames it as tracking a range of possibilities rather than enumerating choices', 'Notes the goal is "some assignment works", not counting assignments'],
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 100 with 3 choices per `*` means brute-force enumeration is up to 3^100 — hopeless. Even a naive DP over (position, open-count) is only O(n²) and would pass, but the structure supports an O(n) single-pass greedy using a bounded range of open counts.',
      rubric: ['Rules out exponential enumeration of wildcard assignments', 'Identifies that a single O(n) pass suffices'],
    },
    bruteForce: {
      modelAnswer:
        'Recursively branch on each `*` into three cases (treat as `(`, `)`, or skip) and check validity of the resulting string, or equivalently a DP over dp[i][open] = reachable. The pure branching approach is O(3^n) time; even the DP is O(n²) time, O(n) space.',
      rubric: ['Describes the three-way branch per wildcard', 'States the exponential (or O(n²) DP) cost'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Tracking every individual reachable open-count is overkill — at each step the set of reachable open counts is always a contiguous range, so I only need its low and high bounds, not every value in between. Maintain [loMin, hiMax] and update it per character. Pattern: Greedy (range tracking), closely related to the Stack-based direct-matching intuition.',
      rubric: ['Names the waste: tracking a whole set/DP row when only the range endpoints matter', 'States that reachable open-counts form a contiguous range'],
      acceptedPatterns: ['greedy', 'stack'],
    },
    algorithm: {
      modelAnswer:
        'Scan left to right maintaining loMin (fewest opens possible so far) and hiMax (most opens possible so far), both starting at 0. On `(`: loMin++, hiMax++. On `)`: loMin--, hiMax--. On `*`: loMin-- (treat as `)`), hiMax++ (treat as `(`). Whenever loMin < 0, clamp it to 0 (excess `)` interpretations are simply discarded, not carried as an error — some other wildcard choice avoids them). If hiMax < 0 at any point, return false immediately — even the most generous interpretation has too many `)`. At the end, return loMin === 0. Time O(n), space O(1).',
      rubric: [
        'States the update rules for (, ), and * on both loMin and hiMax',
        'Clamps loMin to 0 rather than treating negative as failure',
        'Early-exits when hiMax < 0, and finishes with loMin === 0'
      ],
    },
    interviewScript: {
      modelAnswer:
        'Brute-forcing every wildcard assignment is 3^n — way too slow. This is a greedy range-tracking problem: since the set of open-paren counts reachable at any prefix is always contiguous, I track just its bounds, loMin and hiMax, instead of every individual count. `(` raises both bounds, `)` lowers both, `*` lowers the low bound and raises the high bound to cover all three interpretations at once. I clamp loMin to 0 when it dips negative — that means some interpretation dropped an over-eager `)` — and bail out early if hiMax goes negative, since no interpretation can recover from too many `)` even at their most generous. At the end it\'s valid iff loMin can be exactly 0. One pass, O(n) time, O(1) space.',
      rubric: ['Follows the script template end-to-end', 'States the loMin/hiMax mechanics and final complexity'],
    },
  },
  code: {
    signature: 'export function checkValidString(s: string): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: ['()'], expected: true, label: 'simple valid' },
      { args: ['(*)'], expected: true, label: 'star as empty' },
      { args: ['(*))'], expected: true, label: 'star as open' },
      { args: [')('], expected: false, label: 'reversed pair', hidden: true },
      { args: ['(((*'], expected: false, label: 'too many opens, star cannot save it', hidden: true },
      { args: ['***'], expected: true, label: 'all wildcards can be empty', hidden: true },
    ],
    referenceSolution:
      'export function checkValidString(s: string): boolean {\n  let loMin = 0\n  let hiMax = 0\n  for (const ch of s) {\n    if (ch === \'(\') {\n      loMin++\n      hiMax++\n    } else if (ch === \')\') {\n      loMin--\n      hiMax--\n    } else {\n      loMin--\n      hiMax++\n    }\n    if (hiMax < 0) return false\n    if (loMin < 0) loMin = 0\n  }\n  return loMin === 0\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
