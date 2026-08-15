import type { AnyProblem } from '../../types'
import { bestTimeToBuyAndSellStock } from './best-time-to-buy-and-sell-stock'
import { longestSubstringWithoutRepeatingCharacters } from './longest-substring-without-repeating-characters'
import { longestRepeatingCharacterReplacement } from './longest-repeating-character-replacement'
import { permutationInString } from './permutation-in-string'
import { minimumSizeSubarraySum } from './minimum-size-subarray-sum'
import { minimumWindowSubstring } from './minimum-window-substring'
import { slidingWindowMaximum } from './sliding-window-maximum'

export const slidingWindowProblems: AnyProblem[] = [
  bestTimeToBuyAndSellStock,
  longestSubstringWithoutRepeatingCharacters,
  longestRepeatingCharacterReplacement,
  permutationInString,
  minimumSizeSubarraySum,
  minimumWindowSubstring,
  slidingWindowMaximum,
]
