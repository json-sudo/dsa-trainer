import type { Problem } from '../../types'

export const jumpGame: Problem = {
  id: 'jump-game',
  leetcodeId: 55,
  title: 'Jump Game',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'greedy',
  authored: true,
  statement:
    'Given `nums` where `nums[i]` is the maximum jump length from index `i`, starting at index 0, return `true` if you can reach the **last index**.',
  examples: [
    { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: '0→1→4.' },
    { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Index 3 is a wall.' },
  ],
  constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of max jump lengths (zeros are traps). Output: boolean reachability of the last index. Jumps are "up to" the value — any shorter hop is allowed.',
      rubric: ['"Up to" (not exactly) jump semantics', 'Reachability boolean'],
      teachingNote:
        '"At most k steps" vs "exactly k steps" changes everything — one makes reachable sets contiguous, the other doesn\'t. Verify quantifiers like this at the I/O step, out loud.',
    },
    whatToFind: {
      modelAnswer: 'Existence of any jump sequence to the end — reachability, and because hops are "up to", the reachable set is a contiguous prefix, summarized by one number: its furthest edge.',
      rubric: ['Reachability framing', 'Contiguity of the reachable set observed'],
      teachingNote:
        'The contiguity observation ("if I can reach i, I can reach everything before i") is the compression that turns a graph search into one integer. Hunt for such summaries before reaching for BFS.',
    },
    constraintsHint: {
      modelAnswer: 'n ≤ 10⁴: quadratic (~10⁸) is dicey, and the structure gives O(n) anyway. Zeros are the only obstacles worth thinking about.',
      rubric: ['O(n) target from structure', 'Zeros identified as the failure mode'],
      teachingNote:
        'Even when n² might squeak by, say what the structural observation buys you — choosing O(n) *because the structure permits it*, not because the bound forces it, reads as mastery.',
    },
    bruteForce: {
      modelAnswer:
        'DFS/BFS over indices: from i, try every hop 1..nums[i], with a visited set. O(n²) edges worst case (large jump values), ~10⁸ at the bound.',
      rubric: ['Graph-search formulation', 'O(n²) edge count stated'],
      teachingNote:
        'Framing the brute force as a graph search is correct and honorable — greedy problems are often graph problems with exploitable structure. The next step is spotting what makes the search redundant.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The search tracks *which* indices are reachable, but reachability here is a prefix — only its furthest edge matters. Sweep once maintaining maxReach = max(maxReach, i + nums[i]); if i ever exceeds maxReach, we\'re stuck. Pattern: Greedy (One Pass) — the local "extend the furthest edge" rule provably loses nothing.',
      rubric: ['Waste: tracking a set summarizable by one number', 'The maxReach invariant stated'],
      acceptedPatterns: ['greedy', 'one-pass'],
      teachingNote:
        'Greedy needs a *why*: here, keeping only the furthest reach is lossless because reachability is contiguous. One sentence of proof separates "I guessed greedy" from "greedy is correct".',
    },
    algorithm: {
      modelAnswer:
        'maxReach = 0. For i from 0: if i > maxReach → return false; maxReach = max(maxReach, i + nums[i]); early-return true when maxReach ≥ n−1. Time O(n), space O(1).',
      rubric: ['Stuck check before extending', 'Early exit at the goal', 'States O(n)/O(1)'],
      teachingNote:
        'Order matters in the loop: check "am I stuck?" *before* extending from i. Reversing those two lines is the classic off-by-one in this problem.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be a graph search over indices — up to n² edges since each index fans out by its jump value. But "up to k" jumps make the reachable set a contiguous prefix, fully described by its furthest edge, so I\'ll sweep once: extend maxReach at each index, fail if the index ever passes it. Greedy is lossless here precisely because of that contiguity. Time O(n), space O(1).',
      rubric: ['Template followed with the contiguity justification', 'Complexity stated'],
      teachingNote:
        'The script\'s core sentence is the *justification* ("contiguous, so one number suffices"). Lead greedy answers with the proof sketch, then the loop — never the reverse.',
    },
  },
  incrementalBuild: [
    {
      label: '1. One number summarizes everything: the furthest reachable index',
      code: 'let maxReach = 0\n// sound because reachability is CONTIGUOUS: reaching i implies reaching all j < i',
    },
    {
      label: '2. Check stuck BEFORE extending (order matters)',
      code: 'for (let i = 0; i < nums.length; i++) {\n  if (i > maxReach) return false          // nothing reaches this index\n  maxReach = Math.max(maxReach, i + nums[i])   // the greedy commit',
    },
    {
      label: '3. Early exit once the goal is covered',
      code: '  if (maxReach >= nums.length - 1) return true\n}\nreturn true   // loop finished -> every index (incl. the last) was reachable',
    },
  ],
  code: {
    signature: 'export function canJump(nums: number[]): boolean {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: true, label: 'example' },
      { args: [[3, 2, 1, 0, 4]], expected: false, label: 'zero wall' },
      { args: [[0]], expected: true, label: 'already at the end' },
      { args: [[0, 1]], expected: false, label: 'stuck at start', hidden: true },
      { args: [[1, 0, 0]], expected: false, label: 'short jump into trap', hidden: true },
      { args: [[5, 0, 0, 0, 0, 1]], expected: true, label: 'single big jump over zeros', hidden: true },
    ],
    referenceSolution:
      'export function canJump(nums: number[]): boolean {\n  let maxReach = 0\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false\n    maxReach = Math.max(maxReach, i + nums[i])\n    if (maxReach >= nums.length - 1) return true\n  }\n  return true\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
