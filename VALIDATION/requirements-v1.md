# Requirements v1 validation

| Source requirement | Implementation | Check |
| --- | --- | --- |
| `INV-001`: every graph axis has levels | General has 6 × 5, Software Engineer 5 × 6, and Engineering Manager 3 × 5 expectations in `app/src/data/` | `npm test` verifies lengths and nonempty expectations across all views |
| Earlier PDF conversion request | The current KERNEL checkout now supplies `draft-engineer-ladder.md` and no PDFs; prior converted files are absent | Superseded for this checkout by the cleaned derived copy in `SPEC/`; no KERNEL file edited |
| Landing page title, direct click/drag graph adjustment, bold underlined selection | `HomePage.tsx`, `RadarChart.tsx`, level projection in `models/ladder.ts` | Chromium UAT: selection without edits, click/drag, rounding, bounds, rapid changes, interrupted drag |
| Simplified wording and Reset to Default | `HomePage.tsx`, `RadarChart.tsx` | Chromium UAT: exact required introduction, italic instruction, removed extraneous labels, reset title |
| Strengths/Lowest below graph, followed by two-part capability table | `HomePage.tsx`, `LadderTable.tsx`, `getCapabilityRows` | Chromium UAT: mixed/tied summaries, selected values, collapsed sections, all levels in all views, consistent explanations, placeholders |
| Three views selected from the top right | `App.tsx`, three JSON datasets, `models/ladder.ts` | Browser check: menu switches graph axes, level scale, detail, and table; selection and profiles persist locally |
| References area beneath each table, distinct by view | Each ladder's JSON, `HomePage.tsx` | Chromium UAT: exact URLs and intercepted navigation for all 13 references; model test checks counts and software URLs. Milestone 2 supersedes the previous shared two-link assertion. |
| Creator footer beneath separator | `Footer.tsx` | Chromium UAT: attribution, accessible LinkedIn/GitHub links, exact destinations and intercepted navigation |
| Clean and embed draft engineering ladder | `SPEC/draft-engineer-ladder-clean.md`, compiler, `software-detail.json` | Test verifies five capability sections, four columns per row, and repaired split words; browser check verifies inline rendering |
| Mid Level label and bold headers | `ladder.json`, table components | Test checks third software level; browser check confirms desktop table header font weight 700 |
| No Sources page or downloadable Markdown links | `App.tsx`, `HomePage.tsx` | Browser check: no Sources control or Markdown links; old `/references` route redirects home |
| JSON data and Ladder domain model | Three ladder datasets with source IDs, defaults, and references; `models/ladder.ts` registry | Model tests verify level expectations and source IDs; Chromium UAT exercises every capability/level |
| React, TypeScript, MUI defaults, router pattern | Vite app, MUI theme, `createBrowserRouter` in `App.tsx` | `npm run build` type checks and bundles the app |
| README and architecture documentation | Root `README.md` and `architecture.md` | Reviewed after implementation |

The cleaned draft copy repairs clear word breaks and table splits. The source's missing Customer Focus cells remain blank, and unclear Leadership and parking-lot fragments are kept as notes. The General view's explanatory sentences are interpretations of the six progressions in `KERNEL/requirements-v1.md`. The manager dataset remains derived from an earlier draft source that is absent from the current KERNEL checkout; Collaboration was unfinished and remains excluded.

The derived root `TEST-PLAN.md` expands the human-authored kernel test plan into nine happy paths and seven edge cases. Seven browser workflows cover those active cases without snapshots. Narrow screens/touch, unavailable browser storage, and zoom are explicitly deferred by the user; they are not represented as passing. Browser tests verify application behavior and link destinations, not third-party service availability. Final execution results are recorded in `TEST-PLAN.md`.
