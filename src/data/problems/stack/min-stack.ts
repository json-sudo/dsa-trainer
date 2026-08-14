import type { Problem } from '../../types'

export const minStack: Problem = {
  id: 'min-stack',
  leetcodeId: 155,
  title: 'Min Stack',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'stack',
  authored: true,
  statement:
    'Design a stack that supports `push(val)`, `pop()`, `top()`, and `getMin()` — retrieving the minimum element — **all in O(1) time**. Implement it as a class `MinStack`.',
  examples: [
    {
      input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
      output: '-3, then 0, then -2',
      explanation: 'getMin reflects the current stack contents at all times.',
    },
  ],
  constraints: ['-2^31 <= val <= 2^31 - 1', 'pop/top/getMin are only called on non-empty stacks', 'up to 3 * 10^4 operations'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a sequence of stack operations. Output: correct returns for top() and getMin() at every point in time. The contract is per-operation O(1) — this is an API-design task, not a single function.',
      rubric: ['Recognizes design-a-data-structure framing', 'Every operation O(1) is the contract'],
    },
    whatToFind: {
      modelAnswer:
        'Maintain an invariant under mutation: the current minimum must be recoverable instantly after any interleaving of pushes and pops.',
      rubric: ['Names the maintained-invariant framing', 'Notes pops are what make it non-trivial'],
    },
    constraintsHint: {
      modelAnswer:
        'Only 3×10⁴ operations, so even O(n) getMin would pass the volume — the O(1) requirement is a *design* constraint, not a throughput one. Values span full 32-bit range: no counting tricks; think structural.',
      rubric: ['Reads O(1) as the real requirement (not the op count)', 'Value range rules out bucket tricks'],
    },
    bruteForce: {
      modelAnswer: 'A plain array stack where getMin() scans all elements: push/pop/top O(1) but getMin O(n). Correct, violates the O(1) contract.',
      rubric: ['Scan-on-getMin baseline', 'Identifies which operation breaks the contract'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The scan wastes work recomputing a value that was already known when each element was pushed: the minimum *of the stack below any element* never changes while that element sits there. Record it at push time — a parallel stack of "min so far" that pushes and pops in lockstep. Pattern: Stack (auxiliary min stack).',
      rubric: ['Waste: recomputing a min that was known at push time', 'Proposes the paired min-stack snapshot'],
      acceptedPatterns: ['stack'],
    },
    algorithm: {
      modelAnswer:
        'Two arrays: values and mins. push(v): values.push(v); mins.push(min(v, mins.top ?? ∞)). pop(): pop both. top(): values.top. getMin(): mins.top. Every operation is an array push/pop/read → O(1) time, O(n) space.',
      rubric: ['Lockstep dual stacks described', 'Each API mapped to O(1) array ops', 'States O(1)/O(n)'],
    },
    interviewScript: {
      modelAnswer:
        'The naive design scans the stack on getMin — O(n) per call, and the problem demands O(1). The observation is that the minimum below a given element is frozen while that element is on the stack, so I can snapshot "min so far" alongside every value: a second stack pushed and popped in lockstep. All four operations become O(1), with O(n) extra space.',
      rubric: ['Template adapted to design problems (contract → invariant → structure)', 'Complexity per operation stated'],
    },
  },
  code: {
    signature:
      'export class MinStack {\n  push(val: number): void {\n    // your code here\n  }\n  pop(): void {}\n  top(): number {\n    return 0\n  }\n  getMin(): number {\n    return 0\n  }\n}\n',
    harness: 'class-design',
    tests: [
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
          [[], [-2], [0], [-3], [], [], [], []],
        ],
        expected: [null, null, null, null, -3, null, 0, -2],
        label: 'example sequence',
      },
      {
        args: [
          ['MinStack', 'push', 'getMin', 'top'],
          [[], [5], [], []],
        ],
        expected: [null, null, 5, 5],
        label: 'single element',
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin'],
          [[], [1], [1], [], [], []],
        ],
        expected: [null, null, null, 1, null, 1],
        label: 'duplicate minimums',
        hidden: true,
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'pop', 'pop', 'getMin'],
          [[], [3], [1], [2], [], [], []],
        ],
        expected: [null, null, null, null, null, null, 3],
        label: 'min removed by pops',
        hidden: true,
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'getMin', 'push', 'getMin', 'pop', 'getMin'],
          [[], [-1], [-2], [], [-3], [], [], []],
        ],
        expected: [null, null, null, -2, null, -3, null, -2],
        label: 'descending pushes',
        hidden: true,
      },
    ],
    referenceSolution:
      'export class MinStack {\n  private values: number[] = []\n  private mins: number[] = []\n\n  push(val: number): void {\n    this.values.push(val)\n    const currentMin = this.mins.length > 0 ? this.mins[this.mins.length - 1] : Infinity\n    this.mins.push(Math.min(val, currentMin))\n  }\n\n  pop(): void {\n    this.values.pop()\n    this.mins.pop()\n  }\n\n  top(): number {\n    return this.values[this.values.length - 1]\n  }\n\n  getMin(): number {\n    return this.mins[this.mins.length - 1]\n  }\n}\n',
    complexity: { time: 'O(1) per operation', space: 'O(n)' },
  },
}
