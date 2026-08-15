import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { typescript } from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'typescript' || label === 'javascript') return new TsWorker()
    return new EditorWorker()
  },
}

loader.config({ monaco })
Object.assign(window, { monaco })

const HARNESS_DTS = `
interface ListNode {
  val: number
  next: ListNode | null
}
interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}
declare class MinHeap<T> {
  readonly size: number
  push(key: number, value: T): void
  peek(): T | undefined
  peekKey(): number | undefined
  pop(): T | undefined
}
`

typescript.typescriptDefaults.addExtraLib(HARNESS_DTS, 'ts:dsa-harness.d.ts')
typescript.javascriptDefaults.addExtraLib(HARNESS_DTS, 'ts:dsa-harness.d.ts')
