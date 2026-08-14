import type { AnyProblem } from '../../types'
import { binarySearch } from './binary-search'
import { kokoEatingBananas } from './koko-eating-bananas'
import { searchInsertPosition } from './search-insert-position'
import { searchA2dMatrix } from './search-a-2d-matrix'
import { findMinimumInRotatedSortedArray } from './find-minimum-in-rotated-sorted-array'
import { searchInRotatedSortedArray } from './search-in-rotated-sorted-array'
import { timeBasedKeyValueStore } from './time-based-key-value-store'

export const binarySearchProblems: AnyProblem[] = [
  binarySearch,
  kokoEatingBananas,
  searchInsertPosition,
  searchA2dMatrix,
  findMinimumInRotatedSortedArray,
  searchInRotatedSortedArray,
  timeBasedKeyValueStore,
]
