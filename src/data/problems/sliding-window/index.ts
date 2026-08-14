import type { AnyProblem } from '../../types'
import { bestTimeToBuyAndSellStock } from './best-time-to-buy-and-sell-stock'
import { longestSubstringWithoutRepeatingCharacters } from './longest-substring-without-repeating-characters'
import { longestRepeatingCharacterReplacement } from './longest-repeating-character-replacement'
import { permutationInString } from './permutation-in-string'
import { minimumSizeSubarraySum } from './minimum-size-subarray-sum'

export const slidingWindowProblems: AnyProblem[] = [
  bestTimeToBuyAndSellStock,
  longestSubstringWithoutRepeatingCharacters,
  longestRepeatingCharacterReplacement,
  permutationInString,
  minimumSizeSubarraySum,
  {
    id: 'minimum-window-substring',
    leetcodeId: 76,
    title: "Minimum Window Substring",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'sliding-window',
    authored: false,
    acceptedPatterns: ['sliding-window'],
  },
  {
    id: 'sliding-window-maximum',
    leetcodeId: 239,
    title: "Sliding Window Maximum",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'sliding-window',
    authored: false,
    acceptedPatterns: ['monotonic-stack','sliding-window'],
  },
]
