/**
 * Synchronous test-case runner used by validate-data (Node) and unit tests.
 * Mirrors the worker's semantics without the worker: harness markers,
 * class-design sequences, order-insensitive comparison.
 */
import { buildList, buildTree, listToArray, treeToArray, MinHeap } from './harness'
import { resultsEqual } from './compare'
import { entryName, stripTypes } from './executor'
import type { Problem, TestCase } from '../data/types'

function resolveArg(v: unknown): unknown {
  if (v && typeof v === 'object' && '$list' in (v as object)) return buildList((v as { $list: number[] }).$list)
  if (v && typeof v === 'object' && '$tree' in (v as object))
    return buildTree((v as { $tree: (number | null)[] }).$tree)
  return v
}

function resolveActual(actual: unknown, expected: unknown): unknown {
  if (expected && typeof expected === 'object' && '$list' in (expected as object)) return listToArray(actual as never)
  if (expected && typeof expected === 'object' && '$tree' in (expected as object)) return treeToArray(actual as never)
  return actual
}

function resolveExpected(expected: unknown): unknown {
  if (expected && typeof expected === 'object' && '$list' in (expected as object))
    return (expected as { $list: unknown }).$list
  if (expected && typeof expected === 'object' && '$tree' in (expected as object))
    return (expected as { $tree: unknown }).$tree
  return expected
}

export function compileEntry(code: string, signature: string): (...args: unknown[]) => unknown {
  const entry = entryName(signature)
  const transpiled = stripTypes(code)
  const factory = new Function(
    'buildList',
    'buildTree',
    'listToArray',
    'treeToArray',
    'MinHeap',
    `const exports = {}; const module = { exports };\n${transpiled}\nreturn typeof ${entry} !== 'undefined' ? ${entry} : (module.exports.${entry} || module.exports.default);`,
  )
  const fn = factory(buildList, buildTree, listToArray, treeToArray, MinHeap)
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
    const args = structuredClone(test.args).map(resolveArg)
    let actual: unknown
    if (problem.code.harness === 'class-design') {
      const [names, argLists] = args as [string[], unknown[][]]
      const outputs: unknown[] = []
      let inst: Record<string, (...a: unknown[]) => unknown> | null = null
      for (let i = 0; i < names.length; i++) {
        if (i === 0) {
          inst = new (fn as unknown as new (...a: unknown[]) => Record<string, (...a: unknown[]) => unknown>)(
            ...(argLists[0] ?? []),
          )
          outputs.push(null)
        } else {
          const out = inst![names[i]](...(argLists[i] ?? []))
          outputs.push(out === undefined ? null : out)
        }
      }
      actual = outputs
    } else {
      actual = fn(...args)
    }
    actual = resolveActual(actual, test.expected)
    return { label, pass: resultsEqual(actual, expected, problem.code.orderInsensitive), actual, expected }
  } catch (err) {
    return { label, pass: false, actual: undefined, expected, error: String(err) }
  }
}

export function runAllCases(problem: Problem, code: string): NodeCaseResult[] {
  return problem.code.tests.map((t) => runCase(problem, code, t))
}
