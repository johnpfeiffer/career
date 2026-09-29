# Milestone 2 black-box UAT

Derived from immutable `KERNEL/requirements-v1.md`, `KERNEL/TEST-PLAN.md`, and `KERNEL/INVARIANTS.md`. The kernel wins if this file differs. Test through rendered UI and browser controls; use fresh browser sessions and record each view's defaults before editing. Content is checked against the kernel and applicable source data. No kernel files are edited.

Keep automation small: seven browser workflows cover multiple cases, alongside the existing model tests. Avoid DOM snapshots and styling checks except the explicitly required selection and italic instruction. Browser tests do not import implementation models. Run shared behavior in all three views where indicated.

## Happy paths

| ID | Case and actions | Expected result | Status |
| --- | --- | --- | --- |
| HP-01 | First visit; read General from top to bottom. | Title and graph precede Summary and Capability table. Introduction is “Interactively explore your progression and growth.” Graph instruction is “Click to adjust a point along any axis” in italics. Extraneous labels are absent; reset reads “Reset to Default.” | Pass |
| HP-02 | Select two capabilities using their labels or existing dots. | Selection alone preserves values; selected label is bold and underlined, and details identify that capability. | Pass |
| HP-03 | Click Execution at levels 4 and 2 while another capability is selected. | Execution is automatically selected; dot, explanation, summary, and selected-value table reflect the clicked level. Other values stay unchanged. | Pass |
| HP-04 | Drag an unselected dot outward and inward. | Capability is automatically selected; dot remains on its axis and settles at a whole valid level. All displayed values agree. | Pass |
| HP-05 | Set General to all 3; Autonomy and Execution to 5; Scope of Influence to 1. | “Strengths: Autonomy, Execution” and “Lowest: Scope of Influence”; names are comma-separated, unique, and ordered consistently. | Pass |
| HP-06 | Read selected-value table; expand a capability; adjust its level; collapse/reopen. | Every capability's selected level and explanation are visible. Full ladder starts collapsed, shows all levels, identifies current level, updates immediately, and preserves edits through expansion. | Pass |
| HP-07 | In each view, visit every capability and every offered level. | Every axis has levels (INV-001); titles, scale, labels, explanations, and tables belong to the correct view. General's 30 labels match the kernel. Increasing levels move outward. | Pass |
| HP-08 | Switch views and follow references and footer links. | Exact per-view URLs match the kernel (4 General, 4 Software Engineer, 5 Engineering Manager). Footer reads “Built by John Pfeiffer,” links to the copied component's LinkedIn profile and this repository on GitHub, with accessible icon names. | Pass |
| HP-09 | Edit all three views; switch back; reload Software Engineer; reset; revisit other views and reload. | Active view and separate profiles persist. Reset restores all active-view defaults, persists after reload, and leaves other views' edits intact. | Pass |

## Edge cases

| ID | Case and actions | Expected result | Status |
| --- | --- | --- | --- |
| EC-01 | Click between levels nearer one position; click empty space away from axes; click a label. | Axis click snaps to nearest valid level; empty space preserves values; label selects without editing. | Pass |
| EC-02 | Set Software Engineer Execution to 6; switch to five-level views and back. | Correct scales and independent saved values; no capability names or expectations leak between views. | Pass |
| EC-03 | Move every General capability to minimum/maximum and drag beyond both limits; inspect next-level text. | Dot stays on its axis within valid range; correct endpoint explanation; maximum clearly has no next level. | Pass |
| EC-04 | Rapidly alternate Autonomy/Execution; finish at 2/5 with all others at 3. | Correct final values, selection, summary, and table; no delayed write to a different axis. | Pass |
| EC-05 | Drag outside graph, release, return, then adjust another capability. | First drag settles at a valid value and stops; later pointer movement does not resume it; next adjustment works. | Pass |
| EC-06 | Set all capabilities to the same level. | Both summary lists contain every capability exactly once in stable order, since all are tied. | Pass |
| EC-07 | Select Software Engineer Staff/Principal; inspect all expanded levels and missing detailed cells. | Correct selected title and available summary; absent detailed content uses “—”, without substituting another level or removing graph levels. | Pass |

## Deferred Weird Cases

Explicitly deferred by the user: narrow screens/touch, unavailable browser storage, and long text/browser zoom. These are not counted as passing active cases. Existing responsive presentation is retained; no additional resilience features or test matrix is required for this milestone.

## Validation commands and results

From `app/`: `npm test`, `npm run test:uat`, and `npm run build`. Install browser once using `npx playwright install chromium` after `npm ci`.

The browser suite verifies external link destinations using intercepted navigation, so third-party uptime, subscriptions, and content are outside the pass criterion. Chromium desktop is the acceptance browser for this scoped run.

Validated on 2026-09-29 in Chromium desktop: all 16 active UAT cases pass through the seven workflows below. The three Weird Cases remain deferred.

| Browser workflow | Cases covered | Result |
| --- | --- | --- |
| Presentation, selection, direct adjustment, synchronized summary | HP-01–05, EC-06 | Pass |
| Pointer boundaries, rounding, rapid changes, interrupted drag | EC-01, EC-03–05 | Pass |
| General: every capability and level, selected values, expanded content | HP-06–07 | Pass |
| Software Engineer: every capability and level, selected values, expanded content | HP-06–07, EC-07 | Pass |
| Engineering Manager: every capability and level, selected values, expanded content | HP-06–07 | Pass |
| View-specific references and footer destinations | HP-08 | Pass |
| Independent profiles, reload, different scales, active-view reset | HP-09, EC-02 | Pass |

Red/green evidence: the baseline five model tests passed; the revised reference requirement failed before implementation. All seven browser workflows then failed against the old application on missing milestone behavior, after installing the browser. Final results: `npm test` — 5 passed; `npm run test:uat` — 7 passed in 32.2 seconds; `npm run build` — passed; `git diff --check` — passed. The existing two-link reference criterion was replaced because the new kernel explicitly requires three distinct reference lists. No other model criteria were removed.

All six kernel file hashes match their values recorded before implementation. The required README and system/user-journey architecture diagrams are updated. The production build emits Vite's bundle-size advisory; compilation and bundling succeed.

Follow-up: removed the browser's rectangular SVG focus outline on dot clicks. A focused browser check reproduced the unwanted outline before the fix, then passed after the fix and confirmed keyboard focus still uses the dot stroke. The five model tests, production build, and diff whitespace check also pass. No additional permanent tests were added for this small style correction.
