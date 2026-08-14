import type { AnyProblem } from '../../types'
import { kthLargestElementInAnArray } from './kth-largest-element-in-an-array'
import { findMedianFromDataStream } from './find-median-from-data-stream'
import { kthLargestElementInAStream } from './kth-largest-element-in-a-stream'
import { lastStoneWeight } from './last-stone-weight'
import { kClosestPointsToOrigin } from './k-closest-points-to-origin'
import { taskScheduler } from './task-scheduler'

export const heapProblems: AnyProblem[] = [
  kthLargestElementInAnArray,
  findMedianFromDataStream,
  kthLargestElementInAStream,
  lastStoneWeight,
  kClosestPointsToOrigin,
  taskScheduler,
  {
    id: 'merge-k-sorted-lists',
    leetcodeId: 23,
    title: "Merge k Sorted Lists",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'heap',
    authored: false,
    acceptedPatterns: ['heap'],
  },
]
