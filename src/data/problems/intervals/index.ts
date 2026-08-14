import type { AnyProblem } from '../../types'
import { mergeIntervals } from './merge-intervals'
import { meetingRoomsIi } from './meeting-rooms-ii'
import { meetingRooms } from './meeting-rooms'
import { insertInterval } from './insert-interval'
import { nonOverlappingIntervals } from './non-overlapping-intervals'
import { intervalListIntersections } from './interval-list-intersections'

export const intervalsProblems: AnyProblem[] = [
  mergeIntervals,
  meetingRoomsIi,
  meetingRooms,
  insertInterval,
  nonOverlappingIntervals,
  intervalListIntersections,
  {
    id: 'minimum-interval-to-include-each-query',
    leetcodeId: 1851,
    title: "Minimum Interval to Include Each Query",
    difficulty: 'hard',
    mode: 'practice',
    topicId: 'intervals',
    authored: false,
    acceptedPatterns: ['heap','sort-sweep'],
  },
]
