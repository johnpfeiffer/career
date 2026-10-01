# Manager ladder integration

Derived from immutable `KERNEL/draft-manager-ladder.md`, `KERNEL/requirements-v1.md`, and `KERNEL/INVARIANTS.md`. The completed manager Markdown is already structured, so it is compiled directly rather than maintained as a second cleaned copy. No kernel file is changed.

`scripts/compile_draft_ladder.py` previously compiled only the cleaned engineering competency matrix. It now generates both `software-detail.json` and the complete `engineering-manager.json`. `--ladder software` or `--ladder manager` restricts generation; `--check` verifies committed outputs without writing. Parsing finishes before either output is written.

## Content mapping

| Source | App data and behavior |
| --- | --- |
| Levels table | Six ordered levels, M3 Engineering Manager through M8 CTO. Labels include local codes; slider marks use M3–M8. Accountability, scope, authority, transition note, and ship analogy remain in the expandable Levels article. |
| Results, Technology, Collaboration, People, Vision and Strategy | Five graph axes and corresponding detailed tables. Existing Results, People, and Strategy axis IDs are retained. |
| First scope row of each competency table | Exact source wording supplies graph and selected-table expectations. There is no separately maintained graph paraphrase. |
| M3–M6 and M7–M8 competency tables | Match row names and concatenate into six columns. Reject missing cells, mismatched/duplicate rows, or incorrect level order rather than shift content silently. All 34 rows have six populated cells, satisfying INV-001. |
| M7–M8 synthesis qualifiers | Display a note in selected capability details, the expanded selected-level panel, and full-table headers. Preserve source explanations and qualifications below the matrix. |
| Overview and carry-forward statement | Expandable introduction, with paragraphs, lists, emphasis, and clickable embedded references. |
| Role essentials, adjacent roles, backlog, sources | Separate collapsed articles retain headings, lists, prose, and supporting tables. These remain distinct from competency expectations. |
| Evidence and source-addition notes | Retain below their capability table, including timestamped links and applicability qualifications. |
| Five EM references in requirements-v1 | Preserve the required footer reference list; additional draft references remain embedded in context and competency notes. |

The shared `LadderDetails` model supports optional introduction/articles as well as the existing engineering guide, patterns, and parking lot. Article blocks describe paragraphs, headings, lists, and tables. The view renders these blocks and limited inline Markdown as React text/elements; it does not evaluate HTML. The shared graph, routing, and view menu already handle different axis and level counts.

## Saved profiles

The old five manager titles do not map consistently to the new M3–M8 sequence. Reusing their numeric values would assign different roles without a reliable mapping. The manager dataset therefore sets `profileVersion: 3` and starts from its example defaults, preserving the old v2 manager entry in localStorage. General and Software Engineer continue using their existing v2 keys and values. New manager edits persist and reset independently.

## Validation

`npm test` in `app/` runs three compiler tests, verifies generated-file freshness, and runs six model tests. Compiler checks cover source fidelity, complete supporting content, and malformed/misaligned matrices. Browser UAT visits every capability and level across all views, checks embedded source navigation, and verifies that old manager values are not reinterpreted while other saved views survive. `npm run build` checks TypeScript and creates the production bundle. Results are recorded in root `TEST-PLAN.md`.
