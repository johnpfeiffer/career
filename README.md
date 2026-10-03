# Career Coach

A React and TypeScript career development app built from the immutable materials in `KERNEL/`. Click a point along an axis or drag a dot to explore progression. The adjusted capability is automatically selected, bold, and underlined. The graph is followed by Strengths/Lowest summaries, a table of selected values, and collapsed full-ladder sections in all three views. Use the top-right View menu to switch between General, Software Engineer, and Engineering Manager. Each view has its own graph, levels, references, and locally saved profile. Reset to Default resets only the active view. The profile is an editable example for development conversations, not an assessment or promotion decision.

## Run locally

Requires Node.js 20.19+ (or 22.12+) and npm. Data generation and `npm test` also require Python 3; the compiler uses only its standard library.

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

`npm test` runs three compiler tests, checks generated JSON freshness, and runs six model tests for levels, sources, profiles, next-level behavior, and both draft matrices. Nine Chromium browser workflows cover the scoped black-box cases in [`TEST-PLAN.md`](TEST-PLAN.md): graph adjustment, summaries, all capabilities and levels, full tables, references, independent profiles, reload, reset, manager context, and saved-profile compatibility. The browser command starts its own local server, or reuses one on port 5173. External links use intercepted navigation so the suite does not depend on third-party uptime or subscriptions. Touch/narrow-screen, unavailable-storage, and zoom cases remain explicitly deferred. `npm run build` performs TypeScript checking and a production Vite build.

## Draft ladder and data

The previous workflow used `scripts/compile_draft_ladder.py`, with a cleaned engineering Markdown copy as input; no skill is required. `KERNEL/draft-engineer-ladder.md` is immutable for agents and contains split words and broken table boundaries. [`SPEC/draft-engineer-ladder-clean.md`](SPEC/draft-engineer-ladder-clean.md) is the corrected working copy. Clear four-level expectations are arranged by competency; missing or ambiguous assignments are explicitly marked, and the fragmented parking lot remains separate.

The completed `KERNEL/draft-manager-ladder.md` is compiled directly into the complete manager dataset: six levels (M3–M8), five capabilities, and 34 detailed competency rows. Its overview, role essentials, adjacent-role discussion, backlog, and source contribution tables remain available in collapsed sections. Embedded references are clickable, and M7–M8 proposed synthesis is explicitly labeled. See [`SPEC/draft-manager-ladder-integration.md`](SPEC/draft-manager-ladder-integration.md).

To regenerate both derived datasets, or verify them without writing:

```bash
python3 scripts/compile_draft_ladder.py
python3 scripts/compile_draft_ladder.py --check
```

Use `--ladder software` or `--ladder manager` to regenerate only one. From `app/`, `npm run data:generate` regenerates both and `npm run test:data` runs compiler validation and freshness checks.

The software output is [`app/src/data/software-detail.json`](app/src/data/software-detail.json). Its third level is **Mid Level**. Staff Engineer and Principal Engineer I have labels and summaries, while absent detailed draft cells beyond Senior Engineer I display “—”. The manager output is [`app/src/data/engineering-manager.json`](app/src/data/engineering-manager.json); graph summaries use each capability's source scope row. Historical PDF conversions are retained in `KERNEL/RAW/`, while the completed manager draft supplies the current manager content.

Each ladder's JSON defines titles, levels, axes, expectations, default profile, and references: [`general.json`](app/src/data/general.json), [`ladder.json`](app/src/data/ladder.json), and the generated manager JSON. The registry attaches the software draft's separate details; manager details are included in its own JSON. Update source Markdown and regenerate generated files. General/software summaries remain maintained in their ladder JSON. Shared React components render optional content sections without manager-specific branches. Reference lists retain the kernel's four General, four Software Engineer, and five Engineering Manager links. There is no Sources page or downloadable Markdown link in the app.

Because the previous manager titles differ from M3–M8, the new manager dataset starts a fresh example profile under a new storage version. Its old saved entry is retained; General and Software Engineer profiles continue unchanged. See [`architecture.md`](architecture.md) and [`VALIDATION/requirements-v1.md`](VALIDATION/requirements-v1.md).
