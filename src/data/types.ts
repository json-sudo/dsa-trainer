export type PatternId =
  | 'hash-set'
  | 'hash-map'
  | 'freq-map'
  | 'two-pointers'
  | 'sliding-window'
  | 'prefix'
  | 'stack'
  | 'monotonic-stack'
  | 'binary-search'
  | 'heap'
  | 'dfs'
  | 'bfs'
  | 'backtracking'
  | 'dp'
  | 'greedy'
  | 'sort-sweep'
  | 'one-pass'
  | 'trie'
  | 'union-find'
  | 'bit-manipulation'
  | 'math'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Mode = 'guided' | 'practice'

/** Topic-page primer — text only; code templates live on pattern entries. */
export interface PatternPrimer {
  when: string
  firstMove: string
  complexity: string
  tells: string
}

export interface PatternInfo {
  id: PatternId
  name: string
  when: string
  firstMove: string
  complexity: string
  tells: string[]
  /** Generic TypeScript skeleton with per-line comments — Patterns page only. */
  codeTemplate: string
}

export interface Topic {
  id: string
  name: string
  prerequisites: string[]
  /** Layout position on the roadmap canvas (node center x, top y). */
  x: number
  y: number
  primer: PatternPrimer
  primerTitle: string
  problemIds: string[]
}

export interface StepContent {
  modelAnswer: string
  rubric: string[]
  teachingNote?: string
}

export interface TestCase {
  args: unknown[]
  expected: unknown
  hidden?: boolean
  label?: string
}

export type HarnessKind = 'plain' | 'linked-list' | 'tree' | 'class-design'

export interface ProblemStub {
  id: string
  leetcodeId: number
  title: string
  difficulty: Difficulty
  mode: Mode
  topicId: string
  authored: false
  acceptedPatterns: PatternId[]
}

export interface Problem {
  id: string
  leetcodeId: number
  title: string
  difficulty: Difficulty
  mode: Mode
  topicId: string
  authored: true
  statement: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  steps: {
    inputsOutputs: StepContent
    whatToFind: StepContent
    constraintsHint: StepContent
    bruteForce: StepContent
    wasteAndPattern: StepContent & { acceptedPatterns: PatternId[] }
    algorithm: StepContent
    interviewScript: StepContent
  }
  /** Guided problems only — step 9 incremental build, 3–5 labeled chunks. */
  incrementalBuild?: { label: string; code: string }[]
  code: {
    signature: string
    harness: HarnessKind
    tests: TestCase[]
    orderInsensitive?: boolean
    referenceSolution: string
    complexity: { time: string; space: string }
  }
}

export type AnyProblem = Problem | ProblemStub

export function isAuthored(p: AnyProblem): p is Problem {
  return p.authored
}
