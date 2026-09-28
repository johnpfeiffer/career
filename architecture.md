# Architecture

## System design

The immutable KERNEL defines the app's scope and supplies the draft engineering ladder. A cleaned Markdown working copy repairs extraction errors; a compiler turns its tables into JSON. The app reads static JSON for each view, so it needs no backend or network request after loading.

```mermaid
flowchart LR
    K["KERNEL: requirements and draft engineering ladder"] --> M["SPEC: cleaned draft ladder"]
    M --> C["scripts/compile_draft_ladder.py"]
    C --> D["software-detail.json: four-level competency matrix"]
    K --> J["app/src/data: view-level JSON"]
    D --> L["models/ladder.ts: view, profile, and detail data"]
    J --> L
    R["references.json: career links"] --> L
    L --> V["React: view menu, graph, summary, inline ladder accordions, references"]
    V <--> S["Browser localStorage: selected view and per-view profiles"]
```

The graph and summary use the same model functions. Every axis has an expectation at every level, satisfying `INV-001`: General has six axes and five levels, Software Engineer has five axes and six levels, and Engineering Manager has three axes and five levels. The Software Engineer capability area embeds four-level competency tables from the cleaned draft, grouped into collapsed accordions. It shows the selected profile's summary even for Staff and Principal, which lie beyond that draft matrix. `App.tsx` owns routing, the view menu, and the default MUI light theme; views stay in `components/`. The former `/references` route redirects to the landing page.

## User journey

```mermaid
flowchart TD
    A["Open landing page"] --> B["Choose General, Software Engineer, or Engineering Manager"]
    B --> C["See that view's example spider graph"]
    C --> D["Select capability and read current and next levels"]
    D --> E["Change example level"]
    E --> F["Graph, summary, and table update together"]
    F --> G["Expand an inline capability matrix"]
    G --> I["Read career links below the table"]
    F --> H["Reset this view's example"]
    F --> B
```

The selected view and each view's profile are local to the browser. Switching views restores that view's last example. The graph is a reference for development conversations; its levels are not a promotion checklist.
