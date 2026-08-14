// Regenerate a topic's index.ts: import authored problem files that exist,
// emit stubs for the rest, preserving catalog order.
// Usage: node scripts/gen-topic-index.mjs <topic-id> [<topic-id>…] | --all
import { catalog } from './catalog.mjs'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase())

const topicIds = process.argv.includes('--all') ? Object.keys(catalog) : process.argv.slice(2)

for (const topicId of topicIds) {
  const rows = catalog[topicId]
  if (!rows) {
    console.error('unknown topic', topicId)
    process.exit(1)
  }
  const dir = join(root, 'src/data/problems', topicId)
  const imports = []
  const entries = []
  for (const [slug, lc, title, diff, mode, patterns] of rows) {
    const file = join(dir, `${slug}.ts`)
    if (existsSync(file)) {
      const src = readFileSync(file, 'utf8')
      const m = src.match(/export const (\w+)/)
      if (!m) throw new Error(`No export const in ${file}`)
      imports.push(`import { ${m[1]} } from './${slug}'`)
      entries.push(`  ${m[1]},`)
    } else {
      entries.push(
        `  {\n    id: '${slug}',\n    leetcodeId: ${lc},\n    title: ${JSON.stringify(title)},\n    difficulty: '${diff}',\n    mode: '${mode}',\n    topicId: '${topicId}',\n    authored: false,\n    acceptedPatterns: ${JSON.stringify(patterns).replace(/"/g, "'")},\n  },`,
      )
    }
  }
  const src = `import type { AnyProblem } from '../../types'\n${imports.join('\n')}\n\nexport const ${camel(topicId)}Problems: AnyProblem[] = [\n${entries.join('\n')}\n]\n`
  writeFileSync(join(dir, 'index.ts'), src)
  console.log('regenerated', topicId)
}
