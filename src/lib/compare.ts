import equal from 'fast-deep-equal'

export function isListMarker(v: unknown): v is { $list: number[] } {
  return typeof v === 'object' && v !== null && '$list' in v
}

export function isTreeMarker(v: unknown): v is { $tree: (number | null)[] } {
  return typeof v === 'object' && v !== null && '$tree' in v
}

export function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(canonicalize)
    return items
      .map((item) => [JSON.stringify(item), item] as const)
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .map(([, item]) => item)
  }
  return value
}

export function resultsEqual(actual: unknown, expected: unknown, orderInsensitive?: boolean): boolean {
  if (orderInsensitive) return equal(canonicalize(actual), canonicalize(expected))
  return equal(actual, expected)
}

export { equal as deepEqual }
