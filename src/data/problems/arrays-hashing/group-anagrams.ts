import type { Problem } from '../../types'

export const groupAnagrams: Problem = {
  id: 'group-anagrams',
  leetcodeId: 49,
  title: 'Group Anagrams',
  difficulty: 'medium',
  mode: 'guided',
  topicId: 'arrays-hashing',
  authored: true,
  statement:
    'You are given an array of strings `strs`. Group the strings that are anagrams of each other (same letters, possibly rearranged) and return the groups as an array of arrays. Groups and strings within a group may be in any order.',
  examples: [
    {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      explanation: '"eat", "tea", "ate" all use the letters {a,e,t}.',
    },
    { input: 'strs = [""]', output: '[[""]]' },
    { input: 'strs = ["a"]', output: '[["a"]]' },
  ],
  constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
  steps: {
    inputsOutputs: {
      modelAnswer:
        'Input: an array of lowercase strings, up to 10⁴ of them, each up to 100 chars. Output: an array of arrays of strings — every input string appears in exactly one group. Order is free, so no sorting requirement on the output.',
      rubric: [
        'Names the input shape (array of strings) and size bounds',
        'Names the output shape (array of groups, each a string array)',
        'Notes that output order is unconstrained',
      ],
      teachingNote:
        'Always open by restating the I/O out loud. Here the key observation at the I/O stage is that the output is a *partition* — every string lands in exactly one group. That word "group" is your first hint toward a map keyed by something.',
    },
    whatToFind: {
      modelAnswer:
        'A grouping task: partition the strings into equivalence classes where "is an anagram of" is the equivalence relation. Not a count, not an existence check — the deliverable is the groups themselves.',
      rubric: ['Identifies this as a grouping/partition task', 'Names the equivalence relation (same multiset of letters)'],
      teachingNote:
        'From the fixed menu — existence / count / group / shortest / max-min / rearrange / construct — this is *group*. Naming the category out loud tells the interviewer you have a taxonomy, and "group by X" almost always means "hash map keyed by X".',
    },
    constraintsHint: {
      modelAnswer:
        'n up to 10⁴ strings of length up to 100. n² pair comparisons would be 10⁸ string comparisons, each up to 100 chars — too slow. Budget: roughly O(total characters), i.e. touch each string a constant number of times. Lowercase-only means a 26-slot count array is available as a key.',
      rubric: [
        'Multiplies the bounds to reject the pairwise approach',
        'States the budget (≈ linear in total input size)',
        'Notices "lowercase English letters" enables a 26-count signature',
      ],
      teachingNote:
        'The constraint line "lowercase English letters" is never decoration — it whispers "26 buckets". Train yourself to read every constraint as a hint: bounds give the budget, alphabet restrictions give the key space.',
    },
    bruteForce: {
      modelAnswer:
        'For each string, compare it against every existing group representative by sorting both and checking equality — O(n² · k log k) with k the string length. Correct but quadratic in n.',
      rubric: [
        'Describes a pairwise comparison scheme',
        'States its time complexity (≈ O(n² · k log k))',
        'States space complexity',
      ],
      teachingNote:
        'Say the brute force in one breath: enumeration + check + complexity. Here it is "compare every string with every group". The waste is obvious once said aloud — you re-answer "which group?" from scratch for every string.',
    },
    wasteAndPattern: {
      modelAnswer:
        'The brute force wastes work by re-deriving each string\'s identity on every comparison. An anagram class has a canonical signature — the sorted string or a 26-letter count — so compute it once per string and bucket by it. Pattern: Freq Map (or Hash Map keyed by the signature).',
      rubric: [
        'Names the waste: identity recomputed per comparison instead of once per string',
        'Proposes a canonical key (sorted string or letter counts)',
      ],
      acceptedPatterns: ['freq-map', 'hash-map'],
      teachingNote:
        'The waste names the pattern: "I keep recomputing a group identity" → compute a canonical key once and use a hash map. Whenever grouping is the task, ask "what is the canonical form of a group member?"',
    },
    algorithm: {
      modelAnswer:
        'Create a map from signature → list of strings. For each string, build its signature — 26 letter counts joined with a separator (O(k), avoids sorting) — and append the string to that bucket. Return the map\'s values. Time O(total chars), space O(total chars).',
      rubric: [
        'Keys a map by a canonical signature and appends into buckets',
        'Signature choice stated (counts vs sorted) with its cost',
        'States target complexity',
      ],
      teachingNote:
        'Note the separator when joining counts — "1,11" vs "11,1" must not collide. Small detail, but interviewers notice you handling key-encoding collisions unprompted.',
    },
    interviewScript: {
      modelAnswer:
        'Brute force would be comparing every string against every group by sorting both — that\'s quadratic in the number of strings, too slow for 10⁴. This looks like a hashing/grouping problem because anagrams share a canonical form. I\'ll bucket each string by its 26-letter count signature in one pass. Time O(total characters), space O(total characters).',
      rubric: [
        'Follows the template: brute force → why slow → pattern + why → plan → complexity',
        'Mentions the canonical-signature insight explicitly',
      ],
      teachingNote:
        'This is the sentence you say before touching the keyboard. Rehearse the template until it is reflex: "Brute force would be ___. That\'s slow because ___. This looks like ___ because ___. I\'ll use ___. Time ___, space ___."',
    },
  },
  incrementalBuild: [
    {
      label: '1. Buckets keyed by a canonical signature',
      code: 'const buckets = new Map<string, string[]>()\n// one bucket per anagram class; the key IS the class',
    },
    {
      label: '2. Build each string’s 26-count signature (O(k), no sort)',
      code: "const counts = new Array(26).fill(0)\nfor (const ch of s) counts[ch.charCodeAt(0) - 97]++\nconst key = counts.join(',')   // separator prevents '1,11' vs '11,1' collisions",
    },
    {
      label: '3. Append into the bucket (create on first sight)',
      code: 'const bucket = buckets.get(key)\nif (bucket) bucket.push(s)\nelse buckets.set(key, [s])',
    },
    {
      label: '4. The groups are exactly the bucket values',
      code: 'return [...buckets.values()]   // any order is accepted',
    },
  ],
  code: {
    signature:
      'export function groupAnagrams(strs: string[]): string[][] {\n  // your code here\n}\n',
    harness: 'plain',
    orderInsensitive: true,
    tests: [
      {
        args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
        label: 'example',
      },
      { args: [['']], expected: [['']], label: 'single empty string' },
      { args: [['a']], expected: [['a']], label: 'single char' },
      { args: [['ab', 'ba', 'ab']], expected: [['ab', 'ba', 'ab']], label: 'duplicates in one group', hidden: true },
      {
        args: [['abc', 'def', 'ghi']],
        expected: [['abc'], ['def'], ['ghi']],
        label: 'no anagrams at all',
        hidden: true,
      },
      {
        args: [['aab', 'aba', 'baa', 'abb']],
        expected: [['aab', 'aba', 'baa'], ['abb']],
        label: 'near-identical counts',
        hidden: true,
      },
    ],
    referenceSolution:
      "export function groupAnagrams(strs: string[]): string[][] {\n  const buckets = new Map<string, string[]>()\n  for (const s of strs) {\n    const counts = new Array(26).fill(0)\n    for (const ch of s) counts[ch.charCodeAt(0) - 97]++\n    const key = counts.join(',')\n    const bucket = buckets.get(key)\n    if (bucket) bucket.push(s)\n    else buckets.set(key, [s])\n  }\n  return [...buckets.values()]\n}\n",
    complexity: { time: 'O(total characters)', space: 'O(total characters)' },
  },
}
