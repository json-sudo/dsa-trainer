import type { Problem } from '../../types'

export const findTheDuplicateNumber: Problem = {
  id: 'find-the-duplicate-number',
  leetcodeId: 287,
  title: 'Find the Duplicate Number',
  difficulty: 'medium',
  mode: 'practice',
  topicId: 'linked-list',
  authored: true,
  statement:
    'Given an array `nums` of `n + 1` integers, each in the range `[1, n]` inclusive, exactly one value is repeated (it may appear more than twice) — every other value appears exactly once. Return the repeated value **without modifying the array** and using only **O(1)** extra space.',
  examples: [
    { input: 'nums = [1,3,4,2,2]', output: '2' },
    { input: 'nums = [3,1,3,4,2]', output: '3' },
  ],
  constraints: ['1 <= n <= 10^5', 'nums.length == n + 1', '1 <= nums[i] <= n', 'exactly one value repeats (possibly more than twice)'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of n+1 integers, each value in [1, n], with exactly one value repeated. Output: the repeated value. Hard constraints: no mutating nums, and O(1) extra space — no sets, no counting array, no sort-in-place.',
      rubric: ['States the value range [1,n] with length n+1, guaranteeing a duplicate by pigeonhole', 'Names both hard constraints: no mutation, O(1) space'],
    },
    whatToFind: {
      modelAnswer:
        'The one value that appears more than once — but I can\'t use extra memory to track "seen" values and can\'t touch the array itself, so I need a way to detect repetition using only the values as pointers.',
      rubric: ['Frames it as finding a repeated value under strict no-extra-space, no-mutation limits', 'Signals that the values themselves must double as some kind of structure'],
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁵ is no complexity pressure by itself — the real constraint is O(1) space plus no mutation, which eliminates hash sets, frequency arrays, and in-place sorting/marking tricks. That combination is the signature of a "treat the array as a linked list" problem.',
      rubric: ['Explains O(1) space + no-mutation together rule out sets, counting arrays, and in-place marking', 'Recognizes this combination points at an implicit-structure trick'],
    },
    bruteForce: {
      modelAnswer:
        'Use a hash set: for each value, if already in the set, return it, else add it. O(n) time, but O(n) space — violates the O(1) space requirement. (Sorting a copy also works but still costs O(n) space or violates no-mutation if done in place.)',
      rubric: ['Names the hash-set (or sort) approach', 'States O(n) space and identifies it as the constraint violated'],
    },
    wasteAndPattern: {
      modelAnswer:
        'The hash set spends O(n) space just to remember what\'s been visited — but since every value is in [1,n] and the array has n+1 slots, I can treat nums[i] as a pointer to index nums[i], forming an implicit linked list. Because two different indices point to the same duplicate value, that list has a cycle, and finding a cycle needs no extra memory: Floyd\'s tortoise and hare. Pattern: Two Pointers (cycle detection).',
      rubric: ['Names the waste: extra memory to remember visited values', 'Reframes the array as an implicit linked list where a cycle = the duplicate, enabling Floyd\'s algorithm'],
      acceptedPatterns: ['two-pointers'],
    },
    algorithm: {
      modelAnswer:
        'Phase 1 (find intersection): slow = 0, fast = 0 (index 0 is the list\'s start node); loop slow = nums[slow], fast = nums[nums[fast]] until slow === fast — this is guaranteed since the duplicate value creates a cycle. Phase 2 (find entrance): reset one pointer to index 0, then advance both slow = nums[slow] and fast = nums[fast] one step at a time until they meet; that meeting point is the cycle entrance, which equals the duplicate value. Both phases must start from the same reference point (index 0) for the entrance-finding math to hold. Time O(n), space O(1).',
      rubric: ['Correctly implements phase 1: slow moves one step, fast moves two, meet inside the cycle', 'Correctly implements phase 2: reset one pointer to index 0, advance both by one step until they meet at the cycle entrance', 'States O(n)/O(1) and that no mutation occurred'],
    },
    interviewScript: {
      modelAnswer:
        'A hash set finds the duplicate in O(n) time but costs O(n) space, which the constraints forbid. The trick is that with values in [1,n] and n+1 slots, nums[i] can be read as "next index," turning the array into an implicit linked list — and since two indices lead into the same duplicate value, that list has a cycle. So I run Floyd\'s tortoise and hare to find where the cycle starts: first find any meeting point inside the cycle, then reset one pointer to the start and advance both one step at a time until they meet again — that\'s the duplicate. Time O(n), space O(1), and the array is never modified.',
      rubric: ['Follows the script template end-to-end', 'States the implicit-linked-list-cycle insight and final O(n)/O(1) complexity'],
    },
  },
  code: {
    signature: 'export function findDuplicate(nums: number[]): number {\n  // your code here\n}\n',
    harness: 'plain',
    tests: [
      { args: [[1, 3, 4, 2, 2]], expected: 2, label: 'example' },
      { args: [[3, 1, 3, 4, 2]], expected: 3, label: 'duplicate at start and middle' },
      { args: [[1, 1]], expected: 1, label: 'smallest case' },
      { args: [[2, 2, 2, 2, 2]], expected: 2, label: 'same value repeated many times', hidden: true },
      { args: [[1, 4, 4, 2, 4]], expected: 4, label: 'duplicate near the end', hidden: true },
      { args: [[6, 4, 2, 1, 3, 5, 6]], expected: 6, label: 'larger range', hidden: true },
    ],
    referenceSolution:
      'export function findDuplicate(nums: number[]): number {\n  let slow = 0\n  let fast = 0\n  do {\n    slow = nums[slow]\n    fast = nums[nums[fast]]\n  } while (slow !== fast)\n\n  slow = 0\n  while (slow !== fast) {\n    slow = nums[slow]\n    fast = nums[fast]\n  }\n  return slow\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
