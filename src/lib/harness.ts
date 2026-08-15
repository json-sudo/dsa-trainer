export interface ListNode {
  val: number
  next: ListNode | null
}

export interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

export function buildList(values: number[]): ListNode | null {
  let head: ListNode | null = null
  for (let i = values.length - 1; i >= 0; i--) {
    head = { val: values[i], next: head }
  }
  return head
}

export function buildCycle(values: number[], pos: number): ListNode | null {
  if (values.length === 0) return null
  const nodes: ListNode[] = []
  for (let i = 0; i < values.length; i++) {
    nodes.push({ val: values[i], next: null })
  }
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1]
  if (pos >= 0 && pos < nodes.length) nodes[nodes.length - 1].next = nodes[pos]
  return nodes[0]
}

export function listToArray(head: ListNode | null): number[] {
  const out: number[] = []
  let node = head
  let guard = 0
  while (node && guard++ < 100000) {
    out.push(node.val)
    node = node.next
  }
  return out
}

/** Build a binary tree from a LeetCode-style level-order array with nulls. */
export function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null
  const root: TreeNode = { val: values[0], left: null, right: null }
  const queue: TreeNode[] = [root]
  let i = 1
  while (i < values.length && queue.length > 0) {
    const node = queue.shift()!
    const l = values[i++]
    if (l !== null && l !== undefined) {
      node.left = { val: l, left: null, right: null }
      queue.push(node.left)
    }
    const r = values[i++]
    if (r !== null && r !== undefined) {
      node.right = { val: r, left: null, right: null }
      queue.push(node.right)
    }
  }
  return root
}

export function treeToArray(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = []
  const queue: (TreeNode | null)[] = [root]
  const seen = new WeakSet<object>()
  let guard = 0
  while (queue.length > 0 && guard++ < 100000) {
    const node = queue.shift()!
    if (node === null) {
      out.push(null)
    } else if (seen.has(node)) {
      out.push(null)
    } else {
      seen.add(node)
      out.push(node.val)
      queue.push(node.left, node.right)
    }
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop()
  return out
}

export class MinHeap<T> {
  private items: { key: number; value: T }[] = []

  get size(): number {
    return this.items.length
  }

  push(key: number, value: T): void {
    this.items.push({ key, value })
    let i = this.items.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.items[parent].key <= this.items[i].key) break
      ;[this.items[parent], this.items[i]] = [this.items[i], this.items[parent]]
      i = parent
    }
  }

  peek(): T | undefined {
    return this.items[0]?.value
  }

  peekKey(): number | undefined {
    return this.items[0]?.key
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined
    const top = this.items[0]
    const last = this.items.pop()!
    if (this.items.length > 0) {
      this.items[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = 2 * i + 2
        let smallest = i
        if (l < this.items.length && this.items[l].key < this.items[smallest].key) smallest = l
        if (r < this.items.length && this.items[r].key < this.items[smallest].key) smallest = r
        if (smallest === i) break
        ;[this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]]
        i = smallest
      }
    }
    return top.value
  }
}

export function harnessSource(): string {
  return [
    `const buildList = ${buildList.toString()};`,
    `const buildCycle = ${buildCycle.toString()};`,
    `const listToArray = ${listToArray.toString()};`,
    `const buildTree = ${buildTree.toString()};`,
    `const treeToArray = ${treeToArray.toString()};`,
    `const MinHeap = ${MinHeap.toString()};`,
  ].join('\n')
}
