"""Validate source-to-JSON fidelity and reject ambiguous manager matrices."""

import json
from pathlib import Path
import tempfile
import unittest

from compile_draft_ladder import MANAGER_OUTPUT, MANAGER_SOURCE, OUTPUT, parse, parse_manager


class LadderCompilerTests(unittest.TestCase):
    def test_committed_outputs_match_their_sources(self):
        for output, compile_data in [(OUTPUT, parse), (MANAGER_OUTPUT, parse_manager)]:
            with self.subTest(output=output.name):
                self.assertEqual(json.loads(output.read_text(encoding="utf-8")), compile_data())
        engineering = parse()
        practices = next(section for section in engineering["sections"] if section["axisId"] == "best-practices")
        ai = next(row for row in practices["rows"] if row["label"] == "AI / LLM")
        self.assertEqual(ai["levels"], [
            "Learn the organization's tools and foundational concepts such as prompting and hallucination.",
            "Use the defaults of AI and LLM tools, including code autocomplete, code analysis and explanation, and chat for prompting practice.",
            "Integrate LLMs into your workflow beyond code; use them to understand requirements, engineering, product and privacy practices, and domain concepts; recognize and mitigate shortcomings.",
            "Use LLMs for pair programming, code review, refactoring, architecture documentation, and training less experienced team members.",
        ])

    def test_manager_preserves_all_six_columns_and_supporting_content(self):
        data = parse_manager()
        self.assertEqual([len(section["rows"]) for section in data["details"]["sections"]], [6, 8, 6, 7, 7])
        for axis, section in zip(data["axes"], data["details"]["sections"]):
            self.assertEqual([level["summary"] for level in axis["levels"]], section["rows"][0]["levels"])
        self.assertEqual([article["title"] for article in data["details"]["articles"]], [
            "Levels", "Role essentials", "Distinguishing adjacent roles", "Backlog and parking lot", "Sources and contribution notes",
        ])
        source_table = data["details"]["articles"][-1]["blocks"][1]
        self.assertEqual(len(source_table["rows"]), 15)
        self.assertIn("M7–M8 detail is proposed synthesis", json.dumps(data, ensure_ascii=False))

    def test_incomplete_or_misaligned_tables_are_rejected(self):
        source = MANAGER_SOURCE.read_text(encoding="utf-8")
        variants = {
            "missing executive cell": source.replace("| Delivery | Ensure Directors can run operations; manage material gaps while protecting time for strategy. | Ensure major technology commitments are feasible and supported; establish accountability with the VP and technical leaders. |", "| Delivery | Ensure Directors can run operations; manage material gaps while protecting time for strategy. |"),
            "wrong level order": source.replace("M7 Vice President of Engineering — synthesis | M8 CTO — synthesis", "M8 CTO — synthesis | M7 Vice President of Engineering — synthesis", 1),
            "unmatched executive row": source.replace("| Delivery | Ensure Directors", "| Unexpected competency | Ensure Directors", 1),
            "empty expectation": source.replace("Engineering-wide business contribution; take executive responsibility for delivery capability and the operating organization.", "", 1),
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "manager.md"
            for name, text in variants.items():
                with self.subTest(name=name):
                    path.write_text(text, encoding="utf-8")
                    with self.assertRaises(ValueError):
                        parse_manager(path)


if __name__ == "__main__":
    unittest.main()
