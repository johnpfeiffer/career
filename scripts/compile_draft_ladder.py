"""Compile draft ladders into static app data without changing the kernel."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "SPEC/draft-engineer-ladder-clean.md"
OUTPUT = ROOT / "app/src/data/software-detail.json"
MANAGER_SOURCE = ROOT / "KERNEL/draft-manager-ladder.md"
MANAGER_OUTPUT = ROOT / "app/src/data/engineering-manager.json"

LEVELS = ["Engineer I", "Engineer II", "Mid Level", "Senior Engineer I"]
AXES = {
    "Execution": "execution",
    "Engineering Best Practices": "best-practices",
    "Customer Focus": "customer-focus",
    "Leadership": "leadership",
    "Vision and Strategy": "vision-strategy",
}


def parse(source: Path = SOURCE) -> dict:
    lines = source.read_text(encoding="utf-8").splitlines()
    result: dict = {"levels": LEVELS, "guide": [], "patternsTitle": "Advanced engineer patterns", "patterns": [], "sections": [], "parkingLot": []}
    area = ""
    section: dict | None = None

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            area = stripped[3:]
            section = None
            continue
        if area == "Core competencies" and stripped.startswith("### "):
            title = stripped[4:]
            if title not in AXES:
                raise ValueError(f"Unknown section: {title}")
            section = {"axisId": AXES[title], "title": title, "rows": [], "notes": []}
            result["sections"].append(section)
            continue
        if not stripped:
            continue
        if area == "Guide":
            result["guide"].append(stripped)
        elif area == "Advanced engineer patterns" and stripped.startswith("- **"):
            match = re.fullmatch(r"- \*\*(.+?):\*\* (.+)", stripped)
            if not match:
                raise ValueError(f"Malformed pattern: {stripped}")
            result["patterns"].append({"label": match[1], "text": match[2]})
        elif area == "Core competencies" and section is not None:
            if stripped.startswith("|"):
                cells = [cell.strip() for cell in stripped.strip("|").split("|")]
                if cells[0] == "Competency":
                    if cells[1:] != LEVELS:
                        raise ValueError(f"Level header differs from expected levels: {cells}")
                elif cells[0] != "---":
                    if len(cells) != 5:
                        raise ValueError(f"Expected 5 cells in {section['title']}: {cells}")
                    section["rows"].append({
                        "label": cells[0],
                        "levels": [None if value == "—" else value for value in cells[1:]],
                    })
            else:
                section["notes"].append(stripped)
        elif area == "Backlog and parking lot":
            if stripped.startswith("- **"):
                match = re.fullmatch(r"- \*\*(.+?):\*\* (.+)", stripped)
                if not match:
                    raise ValueError(f"Malformed parking-lot note: {stripped}")
                result["parkingLot"].append({"label": match[1], "text": match[2]})
            else:
                result["parkingLotIntro"] = stripped

    if [item["axisId"] for item in result["sections"]] != list(AXES.values()):
        raise ValueError("Expected one section for each software engineering capability")
    return result


def table_cells(line: str) -> list[str]:
    return [cell.strip().replace(r"\|", "|") for cell in re.split(r"(?<!\\)\|", line.strip().strip("|"))]


def parse_blocks(lines: list[str]) -> list[dict]:
    """Keep supporting prose, lists, headings, and tables as content data."""
    blocks: list[dict] = []
    index = 0
    list_pattern = r"^(?:- |\d+\. )(.+)"
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith("|"):
            table = []
            while index < len(lines) and lines[index].strip().startswith("|"):
                table.append(table_cells(lines[index]))
                index += 1
            if len(table) < 3 or not all(re.fullmatch(r":?-+:?", cell) for cell in table[1]):
                raise ValueError(f"Malformed table: {table}")
            if any(len(row) != len(table[0]) for row in table):
                raise ValueError(f"Inconsistent table width: {table[0]}")
            blocks.append({"kind": "table", "headers": table[0], "rows": table[2:]})
        elif line.startswith("### "):
            blocks.append({"kind": "heading", "text": line[4:]})
            index += 1
        elif re.match(list_pattern, line):
            ordered = not line.startswith("- ")
            items = []
            while index < len(lines):
                candidate = lines[index].strip()
                match = re.match(list_pattern, candidate)
                if not match or ordered == candidate.startswith("- "):
                    break
                items.append(match[1])
                index += 1
            blocks.append({"kind": "list", "ordered": ordered, "items": items})
        else:
            paragraphs = [line]
            index += 1
            while index < len(lines):
                candidate = lines[index].strip()
                if not candidate or candidate.startswith(("|", "### ")) or re.match(list_pattern, candidate):
                    break
                paragraphs.append(candidate)
                index += 1
            blocks.append({"kind": "paragraph", "text": " ".join(paragraphs)})
    return blocks


MANAGER_AXES = {
    "Results": ("results", "Deliver valuable outcomes and improve the operating system as scope grows."),
    "Technology": ("manager-technology", "Use technical judgment to guide quality, risk, and investment."),
    "Collaboration": ("manager-collaboration", "Align peers and partners around shared outcomes and clear decisions."),
    "People": ("manager-people", "Develop people, leaders, and a healthy organization."),
    "Vision and Strategy": ("manager-strategy", "Connect direction, planning, and investment to company goals."),
}


def parse_manager(source: Path = MANAGER_SOURCE) -> dict:
    areas: dict[str, list[str]] = {}
    area = ""
    for line in source.read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            area = line[3:].strip()
            if area in areas:
                raise ValueError(f"Duplicate document section: {area}")
            areas[area] = []
        elif area:
            areas[area].append(line)
    expected = ["Overview", "Levels", "Role essentials", "Core competencies", "Distinguishing adjacent roles", "Backlog and parking lot", "Sources and contribution notes"]
    if list(areas) != expected:
        raise ValueError(f"Expected manager document sections: {expected}; got {list(areas)}")

    level_table = next(block for block in parse_blocks(areas["Levels"]) if block["kind"] == "table")
    if level_table["headers"] != ["Local level", "Title", "Accountability", "Typical scope and authority"]:
        raise ValueError("Unexpected manager level table columns")
    if [row[0] for row in level_table["rows"]] != [f"M{n}" for n in range(3, 9)]:
        raise ValueError("Expected manager levels M3 through M8 in order")
    levels = [{"id": row[0].lower(), "label": f"{row[0]} {row[1]}", "shortLabel": row[0],
               **({"note": "Proposed synthesis; calibrate against the role's actual remit.", "noteLabel": "Proposed synthesis"} if row[0] in ("M7", "M8") else {})}
              for row in level_table["rows"]]

    sections = []
    axes = []
    core_lines: dict[str, list[str]] = {}
    heading = ""
    core_intro = []
    for line in areas["Core competencies"]:
        if line.startswith("### "):
            heading = line[4:].strip()
            if heading in core_lines:
                raise ValueError(f"Duplicate competency section: {heading}")
            core_lines[heading] = []
        elif heading:
            core_lines[heading].append(line)
        else:
            core_intro.append(line)
    if list(core_lines) != list(MANAGER_AXES):
        raise ValueError(f"Expected manager capabilities: {list(MANAGER_AXES)}")
    for title, lines in core_lines.items():
        blocks = parse_blocks(lines)
        tables = [block for block in blocks if block["kind"] == "table"]
        if len(tables) != 2:
            raise ValueError(f"Expected M3–M6 and M7–M8 tables in {title}")
        for table, numbers in zip(tables, (range(3, 7), range(7, 9))):
            codes = [re.match(r"M\d+\b", header) for header in table["headers"][1:]]
            if table["headers"][0] != "Competency" or [match[0] if match else None for match in codes] != [f"M{n}" for n in numbers]:
                raise ValueError(f"Unexpected level columns in {title}")
        first, executive = (table["rows"] for table in tables)
        if [row[0] for row in first] != [row[0] for row in executive] or len({row[0] for row in first}) != len(first):
            raise ValueError(f"Missing, duplicate, or mismatched competency rows in {title}")
        rows = [{"label": row[0], "levels": row[1:] + end[1:]} for row, end in zip(first, executive)]
        if not rows or any(not cell or cell == "—" for row in rows for cell in row["levels"]):
            raise ValueError(f"Every competency must have six populated levels in {title}")
        axis_id, description = MANAGER_AXES[title]
        # The source's first scope row is the graph summary; no separately maintained paraphrase.
        axes.append({"id": axis_id, "label": title, "description": description,
                     "levels": [{"summary": cell, "sourceRefs": ["manager"]} for cell in rows[0]["levels"]]})
        sections.append({"axisId": axis_id, "title": title, "rows": rows,
                         "notes": [block["text"] for block in blocks if block["kind"] == "paragraph"]})

    requirements = (ROOT / "KERNEL/requirements-v1.md").read_text(encoding="utf-8")
    reference_text = requirements.split("The EM View should have:", 1)[1].split("### Footer", 1)[0]
    urls = re.findall(r"^- (https://\S+)$", reference_text, re.MULTILINE)
    reference_labels = ["Sourcegraph leveling guide", "Frontline manager at Meta to senior",
                        "Building managers: leading from the back, leading from the front",
                        "Conscious career growth, part 2", "Software engineering leadership"]
    if len(urls) != len(reference_labels):
        raise ValueError("Expected the five manager references from KERNEL/requirements-v1.md")
    return {
        "id": "engineering-manager", "label": "Engineering Manager", "title": "Engineering management ladder",
        "description": "Explore five management capabilities from M3 Engineering Manager through M8 CTO.",
        "profileVersion": 3, "levels": levels,
        "defaultProfile": {axis["id"]: (1 if axis["id"] == "manager-strategy" else 2) for axis in axes},
        "sources": [{"id": "manager", "label": "Engineering Management Ladder",
                     "description": "KERNEL/draft-manager-ladder.md; M7–M8 competencies are explicitly labeled synthesis."}],
        "axes": axes,
        "references": [{"label": label, "href": href} for label, href in zip(reference_labels, urls)],
        "details": {
            "levels": [level["label"] for level in levels], "sections": sections,
            "introduction": {"title": "How to read this draft ladder", "blocks": parse_blocks(areas["Overview"]) + parse_blocks(core_intro)},
            "articles": [{"title": title, "blocks": parse_blocks(lines)} for title, lines in areas.items()
                         if title not in ("Overview", "Core competencies")],
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ladder", choices=("software", "manager", "all"), default="all")
    parser.add_argument("--check", action="store_true", help="Fail if committed JSON differs from generated data")
    args = parser.parse_args()
    outputs = []
    # Parse everything before writing so malformed input cannot leave partially updated data.
    if args.ladder in ("software", "all"):
        outputs.append((OUTPUT, parse()))
    if args.ladder in ("manager", "all"):
        outputs.append((MANAGER_OUTPUT, parse_manager()))
    stale = []
    for path, data in outputs:
        serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != serialized:
                stale.append(str(path.relative_to(ROOT)))
        else:
            path.write_text(serialized, encoding="utf-8")
            print(f"Wrote {path.relative_to(ROOT)}")
    if stale:
        print(f"Stale generated data: {', '.join(stale)}. Run python3 scripts/compile_draft_ladder.py")
        return 1
    if args.check:
        print("Generated ladder data is up to date")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
