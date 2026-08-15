export function resolveArg(
  v: unknown,
  buildList: (values: number[]) => unknown,
  buildCycle: (values: number[], pos: number) => unknown,
  buildTree: (values: (number | null)[]) => unknown,
): unknown {
  if (v && typeof v === 'object' && '$list' in v) {
    const m = v as { $list: number[]; $pos?: number }
    return typeof m.$pos === 'number' ? buildCycle(m.$list, m.$pos) : buildList(m.$list)
  }
  if (v && typeof v === 'object' && '$tree' in v) {
    return buildTree((v as { $tree: (number | null)[] }).$tree)
  }
  return v
}

export function resolveActual(
  actual: unknown,
  expected: unknown,
  listToArray: (head: unknown) => unknown,
  treeToArray: (root: unknown) => unknown,
): unknown {
  if (expected && typeof expected === 'object' && '$list' in expected) return listToArray(actual)
  if (expected && typeof expected === 'object' && '$tree' in expected) return treeToArray(actual)
  return actual
}

export function resolveExpected(expected: unknown): unknown {
  if (expected && typeof expected === 'object' && '$list' in expected)
    return (expected as { $list: unknown }).$list
  if (expected && typeof expected === 'object' && '$tree' in expected)
    return (expected as { $tree: unknown }).$tree
  return expected
}

export function invokeEntry(fn: unknown, args: unknown[], harness: string, entry: string): unknown {
  if (typeof fn !== 'function') {
    throw new Error(`${harness === 'class-design' ? 'Class' : 'Function'} ${entry} is not defined`)
  }
  if (harness === 'class-design') {
    const names = args[0] as string[]
    const argLists = (args[1] as unknown[][]) ?? []
    const outputs: unknown[] = []
    let inst: Record<string, (...a: unknown[]) => unknown> | null = null
    for (let i = 0; i < names.length; i++) {
      if (i === 0) {
        inst = new (fn as unknown as new (...a: unknown[]) => Record<string, (...a: unknown[]) => unknown>)(
          ...((argLists[0] ?? []) as unknown[]),
        )
        outputs.push(null)
      } else {
        const out = inst![names[i]](...((argLists[i] ?? []) as unknown[]))
        outputs.push(out === undefined ? null : out)
      }
    }
    return outputs
  }
  return (fn as (...a: unknown[]) => unknown)(...args)
}

export function lockdownWorkerGlobals(): void {
  const g = globalThis as unknown as Record<string, unknown>
  const keys = [
    'fetch',
    'indexedDB',
    'webkitIndexedDB',
    'XMLHttpRequest',
    'WebSocket',
    'EventSource',
    'caches',
    'importScripts',
  ]
  for (let i = 0; i < keys.length; i++) {
    try {
      g[keys[i]] = undefined
    } catch {
      
    }
  }
}
