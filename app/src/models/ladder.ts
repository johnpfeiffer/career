import softwareData from "../data/ladder.json";
import generalData from "../data/general.json";
import managerData from "../data/engineering-manager.json";
import referencesData from "../data/references.json";
import softwareDetailData from "../data/software-detail.json";

export type ViewId = "general" | "software-engineer" | "engineering-manager";
export type Expectation = { label?: string; summary: string; sourceRefs: string[] };
export type Axis = {
  id: string;
  label: string;
  description: string;
  levels: Expectation[];
};
export type Profile = Record<string, number>;
export type CareerView = {
  id: ViewId;
  label: string;
  title: string;
  description: string;
  levels: { id: string; label: string; shortLabel: string }[];
  defaultProfile: Profile;
  axes: Axis[];
};
export type DetailRow = { label: string; levels: (string | null)[] };
export type DetailSection = { axisId: string; title: string; rows: DetailRow[]; notes: string[] };
export type SoftwareDetail = {
  levels: string[];
  guide: string[];
  patterns: { label: string; text: string }[];
  sections: DetailSection[];
  parkingLotIntro: string;
  parkingLot: { label: string; text: string }[];
};

const generalView: CareerView = { ...generalData, id: "general" };
const softwareView: CareerView = {
  ...softwareData,
  id: "software-engineer",
  label: "Software Engineer",
  title: "Software engineer career ladder",
  description: "Explore five engineering capabilities from Engineer I to Principal Engineer I.",
  defaultProfile: {
    execution: 4,
    "best-practices": 4,
    "customer-focus": 3,
    leadership: 3,
    "vision-strategy": 2,
  },
};
const managerView: CareerView = { ...managerData, id: "engineering-manager" };

export const careerViews: CareerView[] = [generalView, softwareView, managerView];
export const sources = softwareData.sources;
export const careerReferences = referencesData;
export const softwareDetail: SoftwareDetail = softwareDetailData;

export function getCareerView(id: ViewId): CareerView {
  return careerViews.find((view) => view.id === id) ?? generalView;
}

export function clampLevel(view: CareerView, value: number): number {
  return Math.min(view.levels.length, Math.max(1, Math.round(value)));
}

export function normalizeProfile(view: CareerView, value: unknown): Profile {
  const saved = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(view.axes.map((axis) => {
    const next = saved[axis.id];
    return [axis.id, typeof next === "number" && Number.isFinite(next)
      ? clampLevel(view, next)
      : view.defaultProfile[axis.id]];
  }));
}

export function getExpectation(view: CareerView, axis: Axis, level: number): Expectation {
  return axis.levels[clampLevel(view, level) - 1];
}

export function getLevelLabel(view: CareerView, axis: Axis, level: number): string {
  return getExpectation(view, axis, level).label ?? view.levels[clampLevel(view, level) - 1].label;
}

export function getNextStep(view: CareerView, axis: Axis, level: number): Expectation | null {
  const current = clampLevel(view, level);
  return current < view.levels.length ? axis.levels[current] : null;
}

export function getSummary(view: CareerView, profile: Profile) {
  const entries = view.axes.map((axis) => ({ axis, level: clampLevel(view, profile[axis.id]) }));
  const max = Math.max(...entries.map((entry) => entry.level));
  const min = Math.min(...entries.map((entry) => entry.level));
  return {
    highest: entries.filter((entry) => entry.level === max).map((entry) => entry.axis.label),
    focus: entries.filter((entry) => entry.level === min).map((entry) => entry.axis.label),
  };
}
