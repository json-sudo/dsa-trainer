# DSA Trainer

A local-only practice site for interview-style DSA problem solving: the NeetCode
roadmap (18 topics as a prerequisite DAG) where every problem runs as a fixed
10-step wizard — read → I/O → goal → constraints budget → brute force → waste →
pattern → algorithm → interview script → code → grade. Guided walkthroughs show
model answers and teaching notes; practice problems hide them until you commit
an answer and self-score 0/1/2 against a rubric. Code runs in-browser (Monaco +
Sucrase + Web Worker with a 3s kill) against hardcoded test cases.

Built from the specs in the project vault:
`specs/dsa-interview-trainer.md` and `specs/dsa-interview-trainer-catalog.md`.

## Commands

```sh
npm run dev            # start the app (Vite)
npm run build          # typecheck + production build
npm test               # all Vitest suites (units, RTL, validate-data)
npm run validate-data  # schema + reference-solution checks only
npm run test:e2e       # Playwright journeys (builds dist first: npm run build)
npm run lint           # oxlint
```

## Layout

- `src/data/` — all content: roadmap DAG, 21 pattern primers + code templates,
  126 problems (116 fully authored, 10 stubs) under `problems/<topic>/`.
- `src/lib/` — engine: list/tree harness, worker executor, grading weights,
  localStorage persistence, topic locking.
- `src/wizard/` — the 10-step wizard (step rail, step body, Monaco code step,
  grade screen).
- `src/pages/` — roadmap, topic, patterns reference, progress, wizard shell.
- `scripts/catalog.mjs` — the authoritative catalog table; validate-data
  cross-checks every problem file against it.

Progress lives in `localStorage` under `dsa-trainer/v1` (export/import JSON on
the Progress page). To author one of the 10 remaining stubs, add a problem file
under its topic directory and run `node scripts/gen-topic-index.mjs <topic>` —
`npm run validate-data` picks it up automatically.
