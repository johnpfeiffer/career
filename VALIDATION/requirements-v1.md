# Requirements v1 validation

| Source requirement | Implementation | Check |
| --- | --- | --- |
| `INV-001`: every graph axis has levels | General has 6 × 5, Software Engineer 5 × 6, and Engineering Manager 5 × 6 expectations in `app/src/data/` | `npm test` verifies lengths and nonempty expectations across all views |
| Earlier PDF conversion request | Historical sources/conversions are retained in `KERNEL/RAW/`; current drafts supply engineering/manager content | Engineering uses a cleaned derived copy; completed manager Markdown is compiled directly; no KERNEL file edited |
| Landing page title, direct click/drag graph adjustment, bold underlined selection | `HomePage.tsx`, `RadarChart.tsx`, level projection in `models/ladder.ts` | Chromium UAT: selection without edits, click/drag, rounding, bounds, rapid changes, interrupted drag |
| Simplified wording and Reset to Default | `HomePage.tsx`, `RadarChart.tsx` | Chromium UAT: exact required introduction, italic instruction, removed extraneous labels, reset title |
| Strengths/Lowest below graph, followed by two-part capability table | `HomePage.tsx`, `LadderTable.tsx`, `getCapabilityRows` | Chromium UAT: mixed/tied summaries, selected values, collapsed sections, all levels in all views, consistent explanations, placeholders |
| Three views selected from the top right | `App.tsx`, three JSON datasets, `models/ladder.ts` | Browser check: menu switches graph axes, level scale, detail, and table; selection and profiles persist locally |
| References area beneath each table, distinct by view | Each ladder's JSON, `HomePage.tsx` | Chromium UAT: exact URLs and intercepted navigation for all 13 references; model test checks counts and software URLs. Milestone 2 supersedes the previous shared two-link assertion. |
| Creator footer beneath separator | `Footer.tsx` | Chromium UAT: attribution, accessible LinkedIn/GitHub links, exact destinations and intercepted navigation |
| Clean and embed draft engineering ladder | `SPEC/draft-engineer-ladder-clean.md`, compiler, `software-detail.json` | Test verifies five capability sections, four columns per row, and repaired split words; browser check verifies inline rendering |
| Completed manager draft | Compiler generates full `engineering-manager.json` directly from `KERNEL/draft-manager-ladder.md` | Three compiler tests verify generated fidelity, 34 × 6 detailed cells, preserved supporting sections, and rejection of incomplete/misaligned tables; model test checks M3–M8, five capabilities, and source qualifications |
| Manager context and embedded references | Generic `LadderDetails`, `LadderContent.tsx`, shared table renderer | Chromium UAT opens all supporting sections, checks complete Technology cells, follows a GitLab embedded link, and verifies timestamped source links and synthesis notes |
| Changed manager title sequence | Content-supplied profile version uses a fresh v3 manager entry | Chromium UAT seeds an old v2 manager profile, verifies fresh defaults, retains General values, and checks new manager edits across reload |
| Mid Level label and bold headers | `ladder.json`, table components | Test checks third software level; browser check confirms desktop table header font weight 700 |
| No Sources page or downloadable Markdown links | `App.tsx`, `HomePage.tsx` | Browser check: no Sources control or Markdown links; old `/references` route redirects home |
| JSON data and Ladder domain model | Three ladder datasets with source IDs, defaults, and references; `models/ladder.ts` registry | Model tests verify level expectations and source IDs; Chromium UAT exercises every capability/level |
| React, TypeScript, MUI defaults, router pattern | Vite app, MUI theme, `createBrowserRouter` in `App.tsx` | `npm run build` type checks and bundles the app |
| README and architecture documentation | Root `README.md` and `architecture.md` | Reviewed after implementation |

The cleaned engineering copy repairs clear word breaks and table splits. Missing Customer Focus cells remain blank, and unclear Leadership and parking-lot fragments are kept as notes. General explanations interpret the six progressions in `KERNEL/requirements-v1.md`. The completed manager dataset includes Technology and Collaboration and all M3–M8 competency cells. Graph summaries use the source's first scope row. Synthesis qualifications, evidence, and supporting sources remain visible. Generated files are checked for drift before model tests.

The derived root `TEST-PLAN.md` expands the human-authored kernel test plan with manager integration and profile compatibility cases. Nine browser workflows cover active cases without snapshots. Narrow screens/touch, unavailable browser storage, and zoom remain explicitly deferred by the user; they are not represented as passing. Browser tests verify application behavior and link destinations, not third-party service availability. Final execution results are recorded in `TEST-PLAN.md`.
