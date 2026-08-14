// One-time generator: writes a stub-only index.ts for every topic that doesn't
// have one yet. Authoring replaces stub entries with imports of full problem files.
import { catalog } from './catalog.mjs'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase())

for (const [topicId, rows] of Object.entries(catalog)) {
  const dir = join(root, 'src/data/problems', topicId)
  const file = join(dir, 'index.ts')
  if (existsSync(file)) continue
  mkdirSync(dir, { recursive: true })
  const stubs = rows
    .map(
      ([slug, lc, title, diff, mode, patterns]) =>
        `  {\n    id: '${slug}',\n    leetcodeId: ${lc},\n    title: ${JSON.stringify(title)},\n    difficulty: '${diff}',\n    mode: '${mode}',\n    topicId: '${topicId}',\n    authored: false,\n    acceptedPatterns: ${JSON.stringify(patterns).replace(/"/g, "'")},\n  },`,
    )
    .join('\n')
  const src = `import type { AnyProblem } from '../../types'\n\nexport const ${camel(topicId)}Problems: AnyProblem[] = [\n${stubs}\n]\n`
  writeFileSync(file, src)
  console.log('wrote', file)
}
