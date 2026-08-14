import type { Problem } from '../../types'

export const validPalindrome: Problem = {
  id: 'valid-palindrome',
  leetcodeId: 125,
  title: 'Valid Palindrome',
  difficulty: 'easy',
  mode: 'guided',
  topicId: 'two-pointers',
  authored: true,
  statement:
    'Given a string `s`, return `true` if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, else `false`.',
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Cleaned: "amanaplanacanalpanama"' },
    { input: 's = "race a car"', output: 'false', explanation: 'Cleaned: "raceacar" is not a palindrome' },
    { input: 's = " "', output: 'true', explanation: 'Cleaned to empty string — vacuously a palindrome' },
  ],
  constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: a raw string with arbitrary punctuation/case/spacing. Output: a boolean — is the alphanumeric, lowercased core a palindrome. Cleaning is part of the contract, not optional preprocessing I can skip.',
      rubric: ['Notes cleaning (case-fold + strip non-alphanumeric) is part of the spec', 'Output is a boolean palindrome check'],
      teachingNote: 'Restate the cleaning rule precisely — "alphanumeric only, case-insensitive" — before touching pointers. Skipping this is where candidates silently mishandle punctuation.',
    },
    whatToFind: {
      modelAnswer: 'A symmetric-comparison check on the filtered character sequence: does it read the same forwards and backwards.',
      rubric: ['Names it as a symmetry/mirror check on the filtered sequence', 'Notes checking front vs back positions suffices'],
      teachingNote: '"Reads the same forwards and backwards" is literally two pointers converging from both ends — the reduction states the algorithm.',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 2×10^5 — needs linear time, so building a fully cleaned copy string plus reversing it (O(n) space) works, but converging two pointers over the original string does it in O(1) extra space, which is strictly better with no downside.',
      rubric: ['Notes n rules out anything super-linear', 'Prefers O(1) space two-pointer over building a cleaned copy'],
      teachingNote: 'There\'s no constraint forcing O(1) space here — but naming the space-optimal option and choosing it anyway shows judgment beyond "whatever passes."',
    },
    bruteForce: {
      modelAnswer:
        'Build a cleaned string (filter alphanumeric, lowercase), then compare it to its own reverse (`cleaned === cleaned.split("").reverse().join("")`). O(n) time, O(n) space for the copy and its reverse.',
      rubric: ['Filter-then-reverse-and-compare approach', 'States O(n) time, O(n) space'],
      teachingNote: 'This "brute force" is already linear time — the only waste to find is in space, which is a fine, common shape for easy problems.',
    },
    wasteAndPattern: {
      modelAnswer:
        'Building a full cleaned copy and a full reversed copy is unnecessary — a palindrome check only ever compares mirrored positions, so two pointers can walk inward from both ends of the original string, skipping non-alphanumeric characters in place, comparing lowercase chars directly. Pattern: Two Pointers (converge-and-compare) — no copy needed.',
      rubric: ['Waste: materializing cleaned + reversed copies', 'Two pointers converging from both ends replaces the copy'],
      acceptedPatterns: ['two-pointers'],
      teachingNote: 'Any "compare front half to back half" or "is X the same forwards/backwards" problem is a converge-from-both-ends two-pointer candidate — flag that shape on sight.',
    },
    algorithm: {
      modelAnswer:
        'left = 0, right = s.length − 1. While left < right: advance left while s[left] isn\'t alphanumeric; retreat right while s[right] isn\'t alphanumeric; if left >= right stop; compare s[left].toLowerCase() to s[right].toLowerCase(), return false on mismatch; else left++, right--. Return true if the loop finishes. Time O(n), space O(1).',
      rubric: ['Inner skip-loops for non-alphanumeric chars on both sides', 'Case-insensitive comparison', 'Early false on mismatch, loop-completion means true'],
      teachingNote: 'The two inner while-loops (skip junk from the left, skip junk from right) are the part people fumble — walk through them explicitly rather than hand-waving "skip bad chars".',
    },
    interviewScript: {
      modelAnswer:
        'The problem is really "is the cleaned string a palindrome", which is a symmetry check. Brute force builds a cleaned copy and its reverse and compares — O(n) time but O(n) space. I can avoid the copy entirely: converge two pointers from both ends of the original string, skipping non-alphanumeric characters as I go and comparing lowercased characters, failing fast on any mismatch. O(n) time, O(1) space.',
      rubric: ['Template followed: reduction, brute force, waste, pattern', 'States final complexity'],
      teachingNote: 'Emphasize "no copy needed" explicitly in the script — it\'s the one-line insight that separates the O(n) space and O(1) space solutions.',
    },
  },
  incrementalBuild: [
    {
      label: '1. Two pointers at both ends',
      code: 'let left = 0\nlet right = s.length - 1\nconst isAlnum = (c: string) => /[a-z0-9]/i.test(c)',
    },
    {
      label: '2. Skip non-alphanumeric characters from each side',
      code: 'while (left < right) {\n  while (left < right && !isAlnum(s[left])) left++\n  while (left < right && !isAlnum(s[right])) right--',
    },
    {
      label: '3. Compare case-insensitively, fail fast on mismatch',
      code: '  if (s[left].toLowerCase() !== s[right].toLowerCase()) return false\n  left++\n  right--\n}',
    },
    {
      label: '4. Loop finished without a mismatch — it\'s a palindrome',
      code: 'return true',
    },
  ],
  code: {
    signature: 'export function isPalindrome(s: string): boolean {\n\n}\n',
    harness: 'plain',
    tests: [
      { args: ['A man, a plan, a canal: Panama'], expected: true, label: 'example palindrome with punctuation' },
      { args: ['race a car'], expected: false, label: 'example non-palindrome' },
      { args: [' '], expected: true, label: 'cleans to empty string' },
      { args: ['0P'], expected: false, label: 'alphanumeric mismatch', hidden: true },
      { args: ['.,'], expected: true, label: 'only punctuation cleans to empty', hidden: true },
      { args: ['Was it a car or a cat I saw?'], expected: true, label: 'long mixed-case palindrome sentence', hidden: true },
    ],
    referenceSolution:
      'export function isPalindrome(s: string): boolean {\n  let left = 0\n  let right = s.length - 1\n  const isAlnum = (c: string) => /[a-z0-9]/i.test(c)\n  while (left < right) {\n    while (left < right && !isAlnum(s[left])) left++\n    while (left < right && !isAlnum(s[right])) right--\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false\n    left++\n    right--\n  }\n  return true\n}\n',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
}
