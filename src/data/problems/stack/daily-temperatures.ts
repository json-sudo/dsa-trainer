import type { Problem } from '../../types'

export const dailyTemperatures: Problem = {
  id: 'daily-temperatures',
  leetcodeId: 739,
  title: 'Daily Temperatures',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'stack',
  authored: true,
  statement:
    'Given an array `temperatures` of daily temperatures, return an array `answer` where `answer[i]` is the number of days you must wait after day i for a **warmer** temperature. If no warmer day comes, `answer[i] = 0`.',
  examples: [
    { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
    { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
    { input: 'temperatures = [60,50,40,30]', output: '[0,0,0,0]' },
  ],
  constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an integer array up to 10⁵ (small value range 30–100). Output: a same-length array of *distances* to the next strictly greater value, 0 when none exists.',
      rubric: ['Output is per-index distance, not the value', 'Zero sentinel for "never" noted'],
      teachingNote:
        'This is the canonical "next greater element" shape wearing a costume. Learn to see through the story: per-index, "when does something bigger appear to my right?"',
    },
    whatToFind: {
      modelAnswer:
        'For every index, the nearest strictly-greater element to the right — a per-position search, output constructed for all positions at once.',
      rubric: ['Names next-greater-to-the-right per index', 'Recognizes construct-for-every-index'],
      teachingNote:
        'The step-3 category here is *construct*: every position needs an answer. Per-position "nearest X to the right/left" questions are the monotonic-stack family — file the tell.',
    },
    constraintsHint: {
      modelAnswer:
        'n ≤ 10⁵: the O(n²) rightward scan (~10¹⁰ worst case on decreasing input) is out; budget O(n). The tiny value range (30–100) even permits a value-bucket trick, but a linear stack pass is the intended shape.',
      rubric: ['Rejects O(n²) with the decreasing worst case', 'States O(n) budget'],
      teachingNote:
        'Worst-case thinking matters: on a strictly decreasing array the naive scan degenerates fully. Always name the adversarial input when you reject a brute force — it shows you know *why* it fails.',
    },
    bruteForce: {
      modelAnswer: 'For each i, scan right until a warmer day: O(n²) time worst case, O(1) extra space.',
      rubric: ['Rightward scan per index', 'States O(n²) worst case', 'States space'],
      teachingNote:
        'One-sentence brute forces are fine. Spend your breath on the waste instead — that\'s where the pattern hides.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The rescans re-walk runs of colder days that have already been proven cold: once day j is answered, any earlier colder day scanning past j repeats that walk. Instead, keep the *unanswered* days on a stack — they are always a decreasing run. Each new temperature pops (answers) every colder day on top, once, forever. Pattern: Monotonic Stack. (Not BFS — "next greater" has no graph.)',
      rubric: [
        'Names the waste: re-walking proven-colder runs',
        'Proposes the stack of unresolved indices, popped on defeat',
      ],
      acceptedPatterns: ['monotonic-stack'],
      teachingNote:
        'Your known confusion: "next greater" is a stack tell, not BFS — there are no neighbors or levels here, just resolution order. The stack holds *questions* (indices waiting for an answer); a new element answers whichever questions it can.',
    },
    algorithm: {
      modelAnswer:
        'answer filled with 0. Stack of indices with decreasing temperatures. For each i: while stack non-empty and temperatures[i] > temperatures[top], pop j and set answer[j] = i − j; push i. Each index is pushed and popped at most once → O(n) time, O(n) space.',
      rubric: [
        'Index stack, pop-while-warmer, distance written on pop',
        'Amortized O(n) argument (one push + one pop per index)',
        'Zero default for never-answered days',
      ],
      teachingNote:
        'State the invariant aloud: "the stack always holds a strictly decreasing run of unanswered days". Invariants are the difference between reciting a trick and owning it.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be scanning right from every day — O(n²) on a decreasing sequence, too slow at 10⁵. This looks like a monotonic stack because I need each day\'s nearest warmer successor, and unanswered days form a decreasing run that a new warm day resolves in one sweep. I\'ll push indices and pop everything colder than the current day. Time O(n), space O(n).',
      rubric: ['Template followed with the decreasing-run insight', 'Complexity stated'],
      teachingNote:
        'Rehearse the phrase "each element is pushed and popped at most once" — it is the standard amortized argument for every monotonic-stack problem and interviewers listen for it.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Answers default to 0; the stack holds unanswered days (indices)',
      code: 'const answer = new Array(temperatures.length).fill(0)\nconst stack: number[] = []\n// invariant: temperatures at stacked indices are strictly decreasing',
    },
    {
      label: '2. A warm day answers every colder day on top of the stack',
      code: 'while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n  const j = stack.pop()!\n  answer[j] = i - j        // distance, not the temperature\n}',
    },
    {
      label: '3. Today then waits for ITS answer',
      code: 'stack.push(i)\n// each index is pushed once and popped at most once -> O(n) amortized',
    },
  ],
  code: {
    signature: 'export function dailyTemperatures(temperatures: number[]): number[] {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], label: 'example' },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], label: 'increasing' },
      { args: [[60, 50, 40, 30]], expected: [0, 0, 0, 0], label: 'decreasing (worst case)' },
      { args: [[50]], expected: [0], label: 'single day', hidden: true },
      { args: [[70, 70, 70, 71]], expected: [3, 2, 1, 0], label: 'equal runs (strictly greater)', hidden: true },
      { args: [[55, 60, 55, 60]], expected: [1, 0, 1, 0], label: 'alternating', hidden: true },
    ],
    referenceSolution:
      'export function dailyTemperatures(temperatures: number[]): number[] {\n  const answer = new Array(temperatures.length).fill(0)\n  const stack: number[] = []\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const j = stack.pop()!\n      answer[j] = i - j\n    }\n    stack.push(i)\n  }\n  return answer\n}\n',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
}
