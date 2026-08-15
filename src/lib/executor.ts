import { transform } from 'sucrase'
import equal from 'fast-deep-equal'
import { harnessSource } from './harness'
import { canonicalize } from './compare'
import type { HarnessKind, TestCase } from '../data/types'

export interface CaseResult {
  name: string
  status: 'pass' | 'fail' | 'timeout'
  expected?: string
  actual?: string
  consoleOutput?: string[]
  ms: number
}

export interface TestRunResult {
  runNumber: number
  cases: CaseResult[]
  durationMs: number
  passed: number
  total: number
  /** Set when the code failed to transpile — no cases were run. */
  error?: string
}

export const RUN_TIMEOUT_MS = 3000

/** Parse the entry function/class name out of a starter signature. */
export function entryName(signature: string): string {
  const m = signature.match(/(?:function|class)\s+([A-Za-z0-9_$]+)/)
  if (!m) throw new Error(`Cannot find entry name in signature: ${signature}`)
  return m[1]
}

export function stripTypes(code: string): string {
  // "imports" converts ESM to CJS so `export function` is legal in a classic worker.
  return transform(code, { transforms: ['typescript', 'imports'] }).code
}

/**
 * Build the self-contained worker script: harness + comparators + transpiled
 * user code + a loop that posts one message per test case.
 */
export function buildWorkerSource(opts: {
  userCode: string
  tests: TestCase[]
  entry: string
  harness: HarnessKind
  orderInsensitive?: boolean
}): string {
  const transpiled = stripTypes(opts.userCode)
  return `
'use strict';
${harnessSource()}
const __equal = ${equal.toString()};
const __canonical = ${canonicalize.toString()};
const canonicalize = __canonical;
const __tests = ${JSON.stringify(opts.tests)};
const __harness = ${JSON.stringify(opts.harness)};
const __orderInsensitive = ${JSON.stringify(opts.orderInsensitive ?? false)};
let __logs = [];
const console = {
  log: (...a) => __logs.push(a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ')),
  warn: (...a) => __logs.push(a.map(String).join(' ')),
  error: (...a) => __logs.push(a.map(String).join(' ')),
  info: (...a) => __logs.push(a.map(String).join(' ')),
};
const exports = {};
const module = { exports };
${transpiled}
const __entryFn =
  typeof ${opts.entry} !== 'undefined'
    ? ${opts.entry}
    : (module.exports && (module.exports.${opts.entry} || module.exports.default));
const __resolveArg = (v) => {
  if (v && typeof v === 'object' && '$list' in v) {
    return typeof v.$pos === 'number' ? buildCycle(v.$list, v.$pos) : buildList(v.$list);
  }
  if (v && typeof v === 'object' && '$tree' in v) return buildTree(v.$tree);
  return v;
};
const __resolveActual = (actual, expected) => {
  if (expected && typeof expected === 'object' && '$list' in expected) return listToArray(actual);
  if (expected && typeof expected === 'object' && '$tree' in expected) return treeToArray(actual);
  return actual;
};
const __resolveExpected = (expected) => {
  if (expected && typeof expected === 'object' && '$list' in expected) return expected.$list;
  if (expected && typeof expected === 'object' && '$tree' in expected) return expected.$tree;
  return expected;
};
const __show = (v) => (v === undefined ? 'undefined' : JSON.stringify(v));
for (let i = 0; i < __tests.length; i++) {
  const t = __tests[i];
  __logs = [];
  postMessage({ type: 'start', index: i });
  const t0 = Date.now();
  let status = 'fail';
  let actualShown = '';
  const expectedResolved = __resolveExpected(t.expected);
  try {
    const args = JSON.parse(JSON.stringify(t.args)).map(__resolveArg);
    let actual;
    if (__harness === 'class-design') {
      if (typeof __entryFn !== 'function') throw new Error('Class ${opts.entry} is not defined');
      const names = args[0];
      const argLists = args[1];
      const outputs = [];
      let inst = null;
      for (let j = 0; j < names.length; j++) {
        if (j === 0) {
          inst = new __entryFn(...argLists[0]);
          outputs.push(null);
        } else {
          const out = inst[names[j]](...argLists[j]);
          outputs.push(out === undefined ? null : out);
        }
      }
      actual = outputs;
    } else {
      if (typeof __entryFn !== 'function') throw new Error('Function ${opts.entry} is not defined');
      actual = __entryFn(...args);
    }
    actual = __resolveActual(actual, t.expected);
    const pass = __orderInsensitive
      ? __equal(__canonical(actual), __canonical(expectedResolved))
      : __equal(actual, expectedResolved);
    status = pass ? 'pass' : 'fail';
    actualShown = __show(actual);
  } catch (err) {
    status = 'fail';
    actualShown = String(err);
  }
  postMessage({
    type: 'case',
    index: i,
    status,
    expected: __show(expectedResolved),
    actual: actualShown,
    consoleOutput: __logs,
    ms: Date.now() - t0,
  });
}
postMessage({ type: 'done' });
`
}

/**
 * Run user code against a problem's test cases in a Blob-URL Web Worker with a
 * hard timeout. Resolves with per-case results; an infinite loop surfaces as a
 * timeout on the case that was running.
 */
export function runTests(opts: {
  userCode: string
  tests: TestCase[]
  signature: string
  harness: HarnessKind
  orderInsensitive?: boolean
  runNumber: number
  timeoutMs?: number
}): Promise<TestRunResult> {
  const started = Date.now()
  const total = opts.tests.length
  const finish = (cases: CaseResult[], error?: string): TestRunResult => ({
    runNumber: opts.runNumber,
    cases,
    durationMs: Date.now() - started,
    passed: cases.filter((c) => c.status === 'pass').length,
    total,
    error,
  })

  let source: string
  try {
    source = buildWorkerSource({
      userCode: opts.userCode,
      tests: opts.tests,
      entry: entryName(opts.signature),
      harness: opts.harness,
      orderInsensitive: opts.orderInsensitive,
    })
  } catch (err) {
    return Promise.resolve(finish([], String(err)))
  }

  return new Promise((resolve) => {
    const blob = new Blob([source], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    const cases: CaseResult[] = []
    let running = -1

    const caseName = (i: number) => opts.tests[i]?.label ?? `case ${i + 1}`

    const cleanup = () => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
    }

    const timer = setTimeout(() => {
      cleanup()
      if (running >= 0 && !cases.some((c) => c.name === caseName(running))) {
        cases.push({
          name: caseName(running),
          status: 'timeout',
          expected: undefined,
          actual: undefined,
          consoleOutput: [],
          ms: opts.timeoutMs ?? RUN_TIMEOUT_MS,
        })
      }
      resolve(finish(cases))
    }, opts.timeoutMs ?? RUN_TIMEOUT_MS)

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data
      if (msg.type === 'start') {
        running = msg.index
      } else if (msg.type === 'case') {
        cases.push({
          name: caseName(msg.index),
          status: msg.status,
          expected: msg.expected,
          actual: msg.actual,
          consoleOutput: msg.consoleOutput,
          ms: msg.ms,
        })
      } else if (msg.type === 'done') {
        cleanup()
        resolve(finish(cases))
      }
    }

    worker.onerror = (e) => {
      cleanup()
      resolve(finish(cases, e.message || 'Worker error'))
    }
  })
}
