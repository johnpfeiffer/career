# Career Coach

A React and TypeScript career development app built from the immutable materials in `KERNEL/`. Click a point along an axis or drag a dot to explore progression. The adjusted capability is automatically selected, bold, and underlined. The graph is followed by Strengths/Lowest summaries, a table of selected values, and collapsed full-ladder sections in all three views. Use the top-right View menu to switch between General, Software Engineer, and Engineering Manager. Each view has its own graph, levels, references, and locally saved profile. Reset to Default resets only the active view. The profile is an editable example for development conversations, not an assessment or promotion decision.

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
npx playwright install chromium
npm run test:uat
npm run build
```

The five model tests check ladder data, required axis levels, sources, saved profile normalization, next-level behavior, and the cleaned draft matrix. Seven Chromium browser workflows cover the scoped black-box cases in [`TEST-PLAN.md`](TEST-PLAN.md): graph adjustment, summaries, full tables, references, independent profiles, reload, and reset. The browser command starts its own local server, or reuses one on port 5173. External links use intercepted navigation so the suite does not depend on third-party uptime or subscriptions. Touch/narrow-screen, unavailable-storage, and zoom cases are explicitly deferred. `npm run build` performs TypeScript checking and a production Vite build.

## Draft ladder and data

`KERNEL/draft-engineer-ladder.md` is the human-authored source and is immutable for agents. Its extraction contains split words and broken table boundaries. [`SPEC/draft-engineer-ladder-clean.md`](SPEC/draft-engineer-ladder-clean.md) is a corrected working copy. Clear four-level expectations are arranged by competency; missing or ambiguous assignments are explicitly marked. The source's fragmented parking lot remains separate from the active matrix. To regenerate the app data after changing the cleaned copy:

```bash
python3 scripts/compile_draft_ladder.py
```

The script writes [`app/src/data/software-detail.json`](app/src/data/software-detail.json), which the Software Engineer page renders inline. The third level is **Mid Level**. The full table includes Staff Engineer and Principal Engineer I labels and summaries; detailed draft competency cells beyond Senior Engineer I display “—” because those source cells are absent. General and Engineering Manager display all their level labels and explanations in the same expandable presentation. The current KERNEL checkout does not contain the older manager and senior source PDFs used for those previously derived summaries, so their wording cannot be revalidated against those originals here.

Each ladder's JSON defines its titles, levels, axes, expectations, default profile, and references: [`general.json`](app/src/data/general.json), [`ladder.json`](app/src/data/ladder.json), and [`engineering-manager.json`](app/src/data/engineering-manager.json). The model registry attaches the software draft's additional competency details. Edit the applicable ladder JSON to change content; React components share the presentation. Reference lists contain the kernel's four General, four Software Engineer, and five Engineering Manager links. The former shared `references.json` and shared-two-link assertion were superseded by Milestone 2's per-view requirements. There is no Sources page or downloadable Markdown link in the app. See [`architecture.md`](architecture.md) and [`VALIDATION/requirements-v1.md`](VALIDATION/requirements-v1.md).
