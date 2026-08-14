import type { AnyProblem } from '../../types'
import { numberOfIslands } from './number-of-islands'
import { courseSchedule } from './course-schedule'
import { cloneGraph } from './clone-graph'
import { maxAreaOfIsland } from './max-area-of-island'
import { rottingOranges } from './rotting-oranges'
import { surroundedRegions } from './surrounded-regions'
import { numberOfConnectedComponents } from './number-of-connected-components'

export const graphsProblems: AnyProblem[] = [
  numberOfIslands,
  courseSchedule,
  cloneGraph,
  maxAreaOfIsland,
  rottingOranges,
  surroundedRegions,
  numberOfConnectedComponents,
]
