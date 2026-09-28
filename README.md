# Career Coach

A React and TypeScript career development app built from the immutable materials in `KERNEL/`. The landing page leads with an interactive spider graph, followed by a summary and capability table. Use the top-right View menu to switch between General, Software Engineer, and Engineering Manager. Each view has its own graph, levels, table, and locally saved example profile. The profile is an editable example, not an assessment or promotion decision. The Software Engineer page embeds the detailed draft ladder in capability accordions that start collapsed.

## Run locally

Requires Node.js 20.19+ (or 22.12+) and npm.

```bash
cd app
npm ci
npm run dev
```

Open the local URL printed by Vite. The app has no server or account setup.

## Test and build

```bash
cd app
npm test
npm run build
```

The tests check the three views, required axis levels, source references, the cleaned draft matrix, saved profile normalization, next-level behavior, and career-development links. `npm run build` performs TypeScript checking and a production Vite build.

## Draft ladder and data

`KERNEL/draft-engineer-ladder.md` is the human-authored source and is immutable for agents. Its extraction contains split words and broken table boundaries. [`SPEC/draft-engineer-ladder-clean.md`](SPEC/draft-engineer-ladder-clean.md) is a corrected working copy. Clear four-level expectations are arranged by competency; missing or ambiguous assignments are explicitly marked. The source's fragmented parking lot remains separate from the active matrix. To regenerate the app data after changing the cleaned copy:

```bash
python3 scripts/compile_draft_ladder.py
```

The script writes [`app/src/data/software-detail.json`](app/src/data/software-detail.json), which the Software Engineer page renders inline. The third level is **Mid Level**. The graph also includes Staff Engineer and Principal Engineer I summaries; the detailed draft matrix currently reaches Senior Engineer I. Other view datasets live in [`app/src/data`](app/src/data). The current KERNEL checkout does not contain the older manager and senior source PDFs used for those previously derived summaries, so their wording cannot be revalidated against those originals here.

Add or change links in the References section beneath each table by editing [`app/src/data/references.json`](app/src/data/references.json). The two supplied career-development links appear in all three views. There is no Sources page or downloadable Markdown link in the app. See [`architecture.md`](architecture.md) for the design and [`VALIDATION/requirements-v1.md`](VALIDATION/requirements-v1.md) for checks.
