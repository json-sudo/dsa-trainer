import type { Problem } from '../../types'

export const countingBits: Problem = {
  id: 'counting-bits',
  leetcodeId: 338,
  title: 'Counting Bits',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'bit-manipulation',
  authored: true,
  statement:
    'Given an integer `n`, return an array `ans` of length `n+1` where `ans[i]` is the number of `1` bits in the binary representation of `i`, for every `i` from `0` to `n`.',
  examples: [
    { input: 'n = 2', output: '[0,1,1]', explanation: '0=0b0, 1=0b1, 2=0b10.' },
    { input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: '0=0b0, 1=0b1, 2=0b10, 3=0b11, 4=0b100, 5=0b101.' },
  ],
  constraints: ['0 <= n <= 10^5'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a single integer n. Output: an array of length n+1, ans[i] = popcount(i) for each i in [0, n]. This is a batch computation over a range, not a single popcount call.',
      rubric: ['Output length is n+1, not n', 'Recognizes it as a range of popcounts, not one'],
      teachingNote:
        'The "batch over a range" framing is the whole point — if the candidate treats this as "call popcount n+1 times", they\'ll miss the DP relation the problem is actually testing.',
    },
    whatToFind: {
      modelAnswer:
        'A relationship between popcount(i) and popcount of some smaller, already-computed value — so each answer can be derived in O(1) from prior answers instead of counted from scratch.',
      rubric: ['Frames the goal as reusing previously computed popcounts', 'Anticipates an O(1)-per-element recurrence'],
      teachingNote:
        'Nudge toward binary structure: i and i>>1 (i with the last bit dropped) are closely related — what\'s the exact relationship between their bit counts?',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10^5 means the output itself has up to 100,001 entries — computing each independently even at O(log i) per popcount is only ~1.7M bit-ops, which passes, but an O(1)-per-element DP is strictly better and just as easy to write.',
      rubric: ['Notes independent per-element popcount already passes at this n', 'Still motivates DP as the cleaner O(1)-per-element approach'],
      teachingNote:
        'This is a case where brute force *technically* passes at the given n — worth being upfront about that, then pivoting because the DP relation is asked for explicitly and is no harder to implement.',
    },
    bruteForce: {
      modelAnswer:
        'For each i from 0 to n, count its bits directly: peel bits with i & 1 then i >>= 1 in a loop (or use Brian Kernighan\'s i &= i-1 trick), accumulating a count. O(log i) per number → O(n log n) total.',
      rubric: ['Independent per-number bit-counting loop described', 'States O(n log n) total'],
      teachingNote:
        'Brian Kernighan\'s trick (i &= i-1 clears the lowest set bit, so the loop runs popcount(i) times rather than log(i) times) is worth knowing as a fact, but it doesn\'t change the asymptotic story here relative to DP.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Counting each i\'s bits from scratch ignores that i and i>>1 differ by exactly the bit that got shifted off: popcount(i) = popcount(i >> 1) + (i\'s last bit). i>>1 is a smaller number whose popcount was already computed earlier in the same pass. Build the array left to right, deriving each entry in O(1) from an already-known earlier entry. Pattern: bit manipulation + 1D DP.',
      rubric: [
        'States the recurrence bits[i] = bits[i>>1] + (i & 1)',
        'Notes i>>1 < i so it is already computed',
        'Explains i and i>>1 differ by exactly the last bit',
      ],
      acceptedPatterns: ['bit-manipulation', 'dp'],
      teachingNote:
        'This is a clean example of DP where the "subproblem" isn\'t explicitly recursive-looking — it\'s hidden inside a bit-shift relationship. Recognizing bit shifts as index reductions is the transferable skill.',
    },
    algorithm: {
      modelAnswer:
        'ans = new array of length n+1, ans[0] = 0. For i from 1 to n: ans[i] = ans[i >> 1] + (i & 1) — right-shift drops the last bit (a strictly smaller, already-filled index), and (i & 1) adds back 1 if that dropped bit was a 1. Return ans. O(n) time, O(n) space (output only, O(1) extra).',
      rubric: [
        'Correct base case ans[0] = 0',
        'Correct recurrence applied left to right',
        'States O(n) time, O(1) extra space',
      ],
      teachingNote:
        'Confirm i >> 1 is always strictly less than i for i ≥ 1 — that\'s what guarantees the left-to-right fill order is valid (never reads an index that hasn\'t been written yet).',
    },
    interviewScript: {
      modelAnswer:
        'Rather than counting each number\'s bits independently in O(log i), I use that i and i>>1 differ only by the bit shifted off: ans[i] = ans[i>>1] + (i & 1). Since i>>1 is always a smaller, already-computed index, one left-to-right pass fills the whole array. O(n) time, O(1) extra space beyond the output.',
      rubric: ['Template followed: recurrence stated with justification, single-pass fill', 'Complexity given'],
      teachingNote:
        'This problem rewards brevity — the whole solution is a one-line recurrence in a loop, so the interview value is entirely in explaining *why* the recurrence is correct, not in the code itself.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Allocate the answer array with the base case',
      code: 'const ans = new Array(n + 1).fill(0)   // ans[0] = 0 already',
    },
    {
      label: '2. Each i reuses the already-computed answer for i >> 1',
      code: 'for (let i = 1; i <= n; i++) {\n  const smaller = i >> 1        // drop the last bit — strictly smaller index',
    },
    {
      label: '3. Add back 1 if the dropped bit was set',
      code: '  ans[i] = ans[smaller] + (i & 1)\n}',
    },
    {
      label: '4. Return the filled array',
      code: 'return ans   // ans[i] built in O(1) from an earlier, smaller index',
    },
  ],
  code: {
    signature: 'export function countBits(n: number): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [2], expected: [0, 1, 1], label: 'example n=2' },
      { args: [5], expected: [0, 1, 1, 2, 1, 2], label: 'example n=5' },
      { args: [0], expected: [0], label: 'n=0 single entry' },
      { args: [1], expected: [0, 1], label: 'n=1', hidden: true },
      { args: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1], label: 'n=8 power of two resets popcount to 1', hidden: true },
      { args: [15], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4], label: 'n=15 all-ones boundary', hidden: true },
    ],
    referenceSolution:
      'export function countBits(n: number): number[] {\n  const ans = new Array(n + 1).fill(0)\n  for (let i = 1; i <= n; i++) {\n    const smaller = i >> 1\n    ans[i] = ans[smaller] + (i & 1)\n  }\n  return ans\n}\n',
    complexity: { time: 'O(n)', space: 'O(1) extra' },
  },
}
