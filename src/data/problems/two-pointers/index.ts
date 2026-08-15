import type { AnyProblem } from '../../types'
import { validPalindrome } from './valid-palindrome'
import { threeSum } from './three-sum'
import { twoSumII } from './two-sum-ii'
import { removeDuplicatesFromSortedArray } from './remove-duplicates-from-sorted-array'
import { containerWithMostWater } from './container-with-most-water'
import { moveZeroes } from './move-zeroes'
import { trappingRainWater } from './trapping-rain-water'

export const twoPointersProblems: AnyProblem[] = [
  validPalindrome,
  threeSum,
  twoSumII,
  removeDuplicatesFromSortedArray,
  containerWithMostWater,
  moveZeroes,
  trappingRainWater,
]
