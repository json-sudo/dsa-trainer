import type { AnyProblem } from '../../types'
import { mergeIntervals } from './merge-intervals'
import { meetingRoomsIi } from './meeting-rooms-ii'
import { meetingRooms } from './meeting-rooms'
import { insertInterval } from './insert-interval'
import { nonOverlappingIntervals } from './non-overlapping-intervals'
import { intervalListIntersections } from './interval-list-intersections'
import { minimumIntervalToIncludeEachQuery } from './minimum-interval-to-include-each-query'

export const intervalsProblems: AnyProblem[] = [
  mergeIntervals,
  meetingRoomsIi,
  meetingRooms,
  insertInterval,
  nonOverlappingIntervals,
  intervalListIntersections,
  minimumIntervalToIncludeEachQuery,
]
