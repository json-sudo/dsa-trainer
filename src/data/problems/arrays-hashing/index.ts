import type { AnyProblem } from '../../types'
import { containsDuplicate } from './contains-duplicate'
import { groupAnagrams } from './group-anagrams'
import { validAnagram } from './valid-anagram'
import { twoSum } from './two-sum'
import { topKFrequentElements } from './top-k-frequent-elements'
import { productOfArrayExceptSelf } from './product-of-array-except-self'
import { longestConsecutiveSequence } from './longest-consecutive-sequence'

export const arraysHashingProblems: AnyProblem[] = [
  containsDuplicate,
  groupAnagrams,
  validAnagram,
  twoSum,
  topKFrequentElements,
  productOfArrayExceptSelf,
  longestConsecutiveSequence,
]
