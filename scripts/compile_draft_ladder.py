"""Compile the cleaned, human-reviewable draft ladder into app JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "SPEC/draft-engineer-ladder-clean.md"
OUTPUT = ROOT / "app/src/data/software-detail.json"

LEVELS = ["Engineer I", "Engineer II", "Mid Level", "Senior Engineer I"]
AXES = {
    "Execution": "execution",
    "Engineering Best Practices": "best-practices",
    "Customer Focus": "customer-focus",
    "Leadership": "leadership",
    "Vision and Strategy": "vision-strategy",
}


def parse() -> dict:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    result: dict = {"levels": LEVELS, "guide": [], "patterns": [], "sections": [], "parkingLot": []}
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


if __name__ == "__main__":
    OUTPUT.write_text(json.dumps(parse(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}")
