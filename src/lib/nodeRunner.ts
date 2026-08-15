import { buildCycle, buildList, buildTree, listToArray, treeToArray, MinHeap } from './harness'
import { resultsEqual } from './compare'
import { entryName, stripTypes } from './executor'
import { invokeEntry, resolveActual, resolveArg, resolveExpected } from './runHarness'
import type { Problem, TestCase } from '../data/types'

export function compileEntry(code: string, signature: string): (...args: unknown[]) => unknown {
  const entry = entryName(signature)
  const transpiled = stripTypes(code)
  const factory = new Function(
    'buildList',
    'buildCycle',
    'buildTree',
    'listToArray',
    'treeToArray',
    'MinHeap',
    `const exports = {}; const module = { exports };\n${transpiled}\nreturn typeof ${entry} !== 'undefined' ? ${entry} : (module.exports.${entry} || module.exports.default);`,
  )
  const fn = factory(buildList, buildCycle, buildTree, listToArray, treeToArray, MinHeap)
  if (typeof fn !== 'function') throw new Error(`Entry ${entry} not found in code`)
  return fn
}

export interface NodeCaseResult {
  label: string
  pass: boolean
  actual: unknown
  expected: unknown
  error?: string
}

export function runCase(problem: Problem, code: string, test: TestCase): NodeCaseResult {
  const label = test.label ?? 'case'
  const expected = resolveExpected(test.expected)
  try {
    const fn = compileEntry(code, problem.code.signature)
    const args = structuredClone(test.args).map((v) => resolveArg(v, buildList, buildCycle, buildTree))
    let actual: unknown = invokeEntry(fn, args, problem.code.harness, entryName(problem.code.signature))
    actual = resolveActual(actual, test.expected, listToArray as (h: unknown) => unknown, treeToArray as (r: unknown) => unknown)
    return { label, pass: resultsEqual(actual, expected, problem.code.orderInsensitive), actual, expected }
  } catch (err) {
    return { label, pass: false, actual: undefined, expected, error: String(err) }
  }
}

export function runAllCases(problem: Problem, code: string): NodeCaseResult[] {
  return problem.code.tests.map((t) => runCase(problem, code, t))
}
