import { describe, expect, it } from "vitest";
import {
  careerViews, careerReferences, sources, normalizeProfile,
  getNextStep, getSummary, softwareDetail,
} from "./ladder";

describe("career views", () => {
  it("provides three distinct views with levels and valid sources on every axis", () => {
    expect(careerViews.map((view) => view.id)).toEqual([
      "general", "software-engineer", "engineering-manager",
    ]);
    const sourceIds = new Set(sources.map((source) => source.id));
    for (const view of careerViews) {
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
    expect(careerViews[0].axes.map((axis) => axis.label)).not.toEqual(careerViews[1].axes.map((axis) => axis.label));
    expect(careerViews[2].axes.map((axis) => axis.label)).toEqual(["Results", "People", "Vision and Strategy"]);
  });

  it("normalizes saved levels against the selected view", () => {
    const software = careerViews[1];
    expect(normalizeProfile(software, { execution: 99, leadership: -4, unknown: 3 })).toEqual({
      ...software.defaultProfile,
      execution: 6,
      leadership: 1,
    });
    expect(normalizeProfile(careerViews[2], null)).toEqual(careerViews[2].defaultProfile);
  });

  it("uses view-specific next levels and summaries", () => {
    for (const view of careerViews) {
      const axis = view.axes[0];
      expect(getNextStep(view, axis, 1)?.summary).toBe(axis.levels[1].summary);
      expect(getNextStep(view, axis, view.levels.length)).toBeNull();
      const summary = getSummary(view, view.defaultProfile);
      expect(summary.highest.length).toBeGreaterThan(0);
      expect(summary.focus.length).toBeGreaterThan(0);
    }
  });

  it("includes the supplied career development links for every table", () => {
    expect(careerReferences.map((reference) => reference.href)).toEqual([
      "https://se-radio.net/2022/06/episode-515-swizec-teller-on-becoming-a-senior-engineer/",
      "https://newsletter.pragmaticengineer.com/p/what-is-a-principal-engineer-at-amazon",
    ]);
  });

  it("embeds the cleaned draft ladder by capability with Mid Level as the third column", () => {
    const software = careerViews[1];
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
});
