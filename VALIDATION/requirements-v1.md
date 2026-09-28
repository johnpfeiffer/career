# Requirements v1 validation

| Source requirement | Implementation | Check |
| --- | --- | --- |
| `INV-001`: every graph axis has levels | General has 6 × 5, Software Engineer 5 × 6, and Engineering Manager 3 × 5 expectations in `app/src/data/` | `npm test` verifies lengths and nonempty expectations across all views |
| Earlier PDF conversion request | The current KERNEL checkout now supplies `draft-engineer-ladder.md` and no PDFs; prior converted files are absent | Superseded for this checkout by the cleaned derived copy in `SPEC/`; no KERNEL file edited |
| Landing page title and interactive spider graph | `HomePage.tsx` and `RadarChart.tsx` | Browser check: selecting an axis and changing the slider updates detail and graph |
| Summary below graph, then table | `HomePage.tsx` and `SoftwareLadderTable.tsx` | Browser check: Software Engineer detail sections start collapsed and expand to show the matrix; other views retain their tables |
| Three views selected from the top right | `App.tsx`, three JSON datasets, `models/ladder.ts` | Browser check: menu switches graph axes, level scale, detail, and table; selection and profiles persist locally |
| References area beneath each table | `references.json`, `HomePage.tsx` | Browser check: both supplied links appear below every view's table; test checks URLs |
| Clean and embed draft engineering ladder | `SPEC/draft-engineer-ladder-clean.md`, compiler, `software-detail.json` | Test verifies five capability sections, four columns per row, and repaired split words; browser check verifies inline rendering |
| Mid Level label and bold headers | `ladder.json`, table components | Test checks third software level; browser check confirms desktop table header font weight 700 |
| No Sources page or downloadable Markdown links | `App.tsx`, `HomePage.tsx` | Browser check: no Sources control or Markdown links; old `/references` route redirects home |
| JSON data from source ladders and online references | Three view datasets with source IDs; career links in `references.json` | `npm test` verifies every expectation has a valid source ID |
| React, TypeScript, MUI defaults, router pattern | Vite app, MUI theme, `createBrowserRouter` in `App.tsx` | `npm run build` type checks and bundles the app |
| README and architecture documentation | Root `README.md` and `architecture.md` | Reviewed after implementation |

The cleaned draft copy repairs clear word breaks and table splits. The source's missing Customer Focus cells remain blank, and unclear Leadership and parking-lot fragments are kept as notes. The General view's explanatory sentences are interpretations of the six progressions in `KERNEL/requirements-v1.md`. The manager dataset remains derived from an earlier draft source that is absent from the current KERNEL checkout; Collaboration was unfinished and remains excluded.
