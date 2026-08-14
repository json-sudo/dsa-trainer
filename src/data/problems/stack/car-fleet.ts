import type { Problem } from '../../types'

export const carFleet: Problem = {
  id: 'car-fleet',
  leetcodeId: 853,
  title: 'Car Fleet',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'stack',
  authored: true,
  statement:
    '`n` cars are heading to the same destination `target` (a mile-marker) on a single-lane road. Car `i` starts at `position[i]` and drives at constant `speed[i]`, and cars cannot pass each other — a faster car that catches up to a slower one must slow down and travel at the slower car\'s pace, forming a "car fleet" that arrives together. Given `target`, `position`, and `speed`, return the number of car fleets that arrive at the destination.',
  examples: [
    {
      input: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]',
      output: '3',
      explanation: 'Cars at 10 and 8 merge; car at 0 travels alone; cars at 5 and 3 merge.',
    },
    { input: 'target = 10, position = [3], speed = [3]', output: '1' },
  ],
  constraints: ['1 <= n <= 10^5', '0 < target <= 10^6', '0 <= position[i] < target', 'all positions are unique', '0 < speed[i] <= 10^6'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a target distance and per-car position/speed arrays (all positions distinct, all less than target). Output: the count of fleets that arrive at target. Cars can never pass, only merge and slow down.',
      rubric: ['Notes cars cannot pass — merging only, never overtaking', 'Output is a fleet count, not positions or times'],
    },
    whatToFind: {
      modelAnswer:
        'For each car, whether it catches up to the car ahead of it before reaching target. If it would arrive at target sooner than the car ahead, it\'s blocked and merges into that car\'s fleet instead; otherwise it\'s a new fleet leader.',
      rubric: ['Frames it as "does this car catch the one ahead before target"', 'Recognizes merging depends only on time-to-target comparisons'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ pushes toward O(n log n): sorting by position is affordable, but simulating position over time (checking collisions minute-by-minute) is not. Since only order-of-arrival-time matters, a sort + single pass is the budget.',
      rubric: ['Derives O(n log n) as the budget from n ≤ 10⁵', 'Rules out step-by-step time simulation'],
    },
    bruteForce: {
      modelAnswer:
        'Simulate position over time in small steps, checking whether any car has caught up to the car ahead of it, merging speeds when it does. Extremely wasteful and imprecise — O(n · steps) and depends on step size for correctness.',
      rubric: ['Names the time-step simulation approach', 'Identifies it as slow and/or numerically unreliable'],
    },
    wasteAndPattern: {
      modelAnswer:
        'Simulating time steps recomputes positions I don\'t need — all I actually need is each car\'s time to reach target (distance/speed) and whether that time is masked by a slower car ahead. Sort cars by position descending (closest to target first) and sweep with a stack of "fleet arrival times": if the current car\'s time ≤ the time on top of the stack, it\'s absorbed into that fleet; otherwise it becomes a new leader. Pattern: Monotonic Stack + Sort Sweep.',
      rubric: ['Names the waste: simulating positions instead of comparing arrival times directly', 'Describes sort-by-position-descending plus a stack of leader arrival times'],
      acceptedPatterns: ['monotonic-stack', 'sort-sweep'],
    },
    algorithm: {
      modelAnswer:
        'Pair each car with time = (target - position) / speed. Sort pairs by position descending. Maintain a stack of times. For each car in that order: if the stack is non-empty and the car\'s time ≤ stack top, it merges (do nothing — it will catch up to and join that fleet, never passing it); otherwise push its time (it leads a new fleet, since it arrives at or after the car ahead but travels slower or arrives later, never overtaking). Answer = stack size. Time O(n log n) for the sort, space O(n).',
      rubric: ['Computes per-car time-to-target correctly', 'Sorts by position descending and processes with a stack keyed on time', 'States O(n log n)/O(n) and explains stack-size = fleet count'],
    },
    interviewScript: {
      modelAnswer:
        'Simulating positions over time steps is imprecise and slow. What actually determines merging is each car\'s time-to-target, compared to the car immediately ahead of it — since cars never pass, a car only ever merges with the fleet directly in front. So I sort by position descending and sweep with a stack of fleet arrival times: a car with time ≤ the top merges, otherwise it starts a new fleet. The stack size at the end is the fleet count. Time O(n log n), space O(n).',
      rubric: ['Follows the script template end-to-end', 'States the sort-then-stack-of-times approach and final complexity'],
    },
  },
  code: {
    signature:
      'export function carFleet(target: number, position: number[], speed: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3, label: 'example' },
      { args: [10, [3], [3]], expected: 1, label: 'single car' },
      { args: [100, [0, 2, 4], [4, 2, 1]], expected: 1, label: 'all merge into one fleet' },
      { args: [10, [0, 4, 2], [2, 1, 3]], expected: 1, label: 'catching up chain', hidden: true },
      { args: [20, [0, 1, 2, 3, 4], [1, 2, 3, 4, 5]], expected: 5, label: 'all separate fleets', hidden: true },
      { args: [6, [3, 1], [3, 2]], expected: 2, label: 'no catch up, arrive apart', hidden: true },
    ],
    referenceSolution:
      'export function carFleet(target: number, position: number[], speed: number[]): number {\n  const cars = position.map((p, i) => ({ pos: p, time: (target - p) / speed[i] }))\n  cars.sort((a, b) => b.pos - a.pos)\n  const stack: number[] = []\n  for (const car of cars) {\n    if (stack.length === 0 || car.time > stack[stack.length - 1]) {\n      stack.push(car.time)\n    }\n  }\n  return stack.length\n}\n',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
}
