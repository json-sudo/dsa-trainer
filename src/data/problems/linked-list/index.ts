import type { AnyProblem } from '../../types'
import { reverseLinkedList } from './reverse-linked-list'
import { linkedListCycle } from './linked-list-cycle'
import { mergeTwoSortedLists } from './merge-two-sorted-lists'
import { reorderList } from './reorder-list'
import { removeNthNodeFromEnd } from './remove-nth-node-from-end'
import { addTwoNumbers } from './add-two-numbers'
import { findTheDuplicateNumber } from './find-the-duplicate-number'

export const linkedListProblems: AnyProblem[] = [
  reverseLinkedList,
  linkedListCycle,
  mergeTwoSortedLists,
  reorderList,
  removeNthNodeFromEnd,
  addTwoNumbers,
  findTheDuplicateNumber,
]
