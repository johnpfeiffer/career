import { describe, expect, it } from "vitest";
import {
  ladders, sources, normalizeProfile,
  getNextStep, getSummary, softwareDetail,
} from "./ladder";

describe("career views", () => {
  it("provides three distinct views with levels and valid sources on every axis", () => {
    expect(ladders.map((view) => view.id)).toEqual([
      "general", "software-engineer", "engineering-manager",
    ]);
    const sourceIds = new Set(sources.map((source) => source.id));
    for (const view of ladders) {
      expect(view.axes.length).toBeGreaterThanOrEqual(3);
      for (const axis of view.axes) {
        expect(axis.levels).toHaveLength(view.levels.length);
        for (const expectation of axis.levels) {
          expect(expectation.summary.length).toBeGreaterThan(10);
          expect(expectation.sourceRefs.length).toBeGreaterThan(0);
          expect(expectation.sourceRefs.every((id) => sourceIds.has(id))).toBe(true);
        }
      }
    }
    expect(ladders[0].axes.map((axis) => axis.label)).not.toEqual(ladders[1].axes.map((axis) => axis.label));
    expect(ladders[2].axes.map((axis) => axis.label)).toEqual(["Results", "Technology", "Collaboration", "People", "Vision and Strategy"]);
  });

  it("normalizes saved levels against the selected view", () => {
    const software = ladders[1];
    expect(normalizeProfile(software, { execution: 99, leadership: -4, unknown: 3 })).toEqual({
      ...software.defaultProfile,
      execution: 6,
      leadership: 1,
    });
    expect(normalizeProfile(ladders[2], null)).toEqual(ladders[2].defaultProfile);
  });

  it("uses view-specific next levels and summaries", () => {
    for (const view of ladders) {
      const axis = view.axes[0];
      expect(getNextStep(view, axis, 1)?.summary).toBe(axis.levels[1].summary);
      expect(getNextStep(view, axis, view.levels.length)).toBeNull();
      const summary = getSummary(view, view.defaultProfile);
      expect(summary.highest.length).toBeGreaterThan(0);
      expect(summary.focus.length).toBeGreaterThan(0);
    }
  });

  // The kernel now requires distinct reference lists, superseding the shared two-link list.
  it("provides the required references for each ladder", () => {
    expect(ladders.map((view) => view.references.length)).toEqual([4, 4, 5]);
    expect(ladders[1].references.map((reference) => reference.href)).toEqual([
      "https://www.levels.fyi/blog/what-are-career-levels-ladders.html",
      "https://se-radio.net/2022/06/episode-515-swizec-teller-on-becoming-a-senior-engineer/",
      "https://newsletter.pragmaticengineer.com/p/what-is-a-principal-engineer-at-amazon",
      "https://www.youtube.com/watch?v=bOG5GTM_yXs",
    ]);
  });

  it("embeds the cleaned draft ladder by capability with Mid Level as the third column", () => {
    const software = ladders[1];
    expect(software.levels[2].label).toBe("Mid Level");
    expect(softwareDetail.levels).toEqual(["Engineer I", "Engineer II", "Mid Level", "Senior Engineer I"]);
    expect(softwareDetail.sections.map((section) => section.axisId)).toEqual(software.axes.map((axis) => axis.id));
    expect(softwareDetail.sections.find((section) => section.axisId === "execution")?.rows.map((row) => row.label))
      .toContain("Collaboration");
    for (const section of softwareDetail.sections) {
      expect(section.rows.length).toBeGreaterThan(2);
      for (const row of section.rows) expect(row.levels).toHaveLength(4);
    }
    expect(softwareDetail.parkingLot.length).toBeGreaterThan(5);
    const text = JSON.stringify(softwareDetail);
    expect(text).not.toMatch(/Character istics|Collabora tion|Dependen cies|Communicatio n|progra m|torwards|autocomplet e/);
  });

  it("provides the completed manager matrix from M3 through M8 with source qualifications", () => {
    const manager = ladders[2];
    expect(manager.levels.map((level) => level.label)).toEqual([
      "M3 Engineering Manager", "M4 Senior Engineering Manager", "M5 Director of Engineering",
      "M6 Senior Director of Engineering", "M7 Vice President of Engineering", "M8 CTO",
    ]);
    expect(manager.details?.levels).toEqual(manager.levels.map((level) => level.label));
    expect(manager.details?.sections.map((section) => section.axisId)).toEqual(manager.axes.map((axis) => axis.id));
    const sections = manager.details?.sections ?? [];
    expect(sections.map((section) => section.rows.length)).toEqual([6, 8, 6, 7, 7]);
    for (const section of sections) {
      for (const row of section.rows) {
        expect(row.levels).toHaveLength(6);
        expect(row.levels.every((cell) => typeof cell === "string" && cell.length > 10)).toBe(true);
      }
    }
    expect(sections[1]?.rows.find((row) => row.label === "AI / LLM — kernel-derived")?.levels[5])
      .toBe("Decide where AI contributes to technology or product strategy; set evaluation principles and strategic guardrails with partners.");
    expect(sections[0]?.rows[0].levels[0]).toBe("Team; deliver defined projects toward quarterly goals with appropriate guidance.");
    expect(JSON.stringify(manager.details)).toContain("M7–M8 detail is proposed synthesis");
    expect(JSON.stringify(manager.details)).toContain("https://www.youtube.com/watch?v=TkA5A7BJF2k&t=1430s");
  });
});
