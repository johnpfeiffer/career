import softwareData from "../data/ladder.json";
import generalData from "../data/general.json";
import managerData from "../data/engineering-manager.json";
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
export type Ladder = {
  id: ViewId;
  label: string;
  title: string;
  description: string;
  levels: { id: string; label: string; shortLabel: string }[];
  defaultProfile: Profile;
  axes: Axis[];
  references: { label: string; href: string }[];
  details?: SoftwareDetail;
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

const generalView: Ladder = { ...generalData, id: "general" };
const softwareView: Ladder = {
  ...softwareData,
  id: "software-engineer",
  details: softwareDetailData,
};
const managerView: Ladder = { ...managerData, id: "engineering-manager" };

export const ladders: Ladder[] = [generalView, softwareView, managerView];
export const sources = softwareData.sources;
export const softwareDetail: SoftwareDetail = softwareDetailData;

export function getLadder(id: ViewId): Ladder {
  return ladders.find((view) => view.id === id) ?? generalView;
}

export function clampLevel(view: Ladder, value: number): number {
  return Math.min(view.levels.length, Math.max(1, Math.round(value)));
}

export function normalizeProfile(view: Ladder, value: unknown): Profile {
  const saved = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(view.axes.map((axis) => {
    const next = saved[axis.id];
    return [axis.id, typeof next === "number" && Number.isFinite(next)
      ? clampLevel(view, next)
      : view.defaultProfile[axis.id]];
  }));
}

export function getExpectation(view: Ladder, axis: Axis, level: number): Expectation {
  return axis.levels[clampLevel(view, level) - 1];
}

export function getLevelLabel(view: Ladder, axis: Axis, level: number): string {
  return getExpectation(view, axis, level).label ?? view.levels[clampLevel(view, level) - 1].label;
}

export function getNextStep(view: Ladder, axis: Axis, level: number): Expectation | null {
  const current = clampLevel(view, level);
  return current < view.levels.length ? axis.levels[current] : null;
}

export function getSummary(view: Ladder, profile: Profile) {
  const entries = view.axes.map((axis) => ({ axis, level: clampLevel(view, profile[axis.id]) }));
  const max = Math.max(...entries.map((entry) => entry.level));
  const min = Math.min(...entries.map((entry) => entry.level));
  return {
    highest: entries.filter((entry) => entry.level === max).map((entry) => entry.axis.label),
    focus: entries.filter((entry) => entry.level === min).map((entry) => entry.axis.label),
  };
}

export function getCapabilityRows(ladder: Ladder, axis: Axis): DetailRow[] {
  const section = ladder.details?.sections.find((item) => item.axisId === axis.id);
  return [
    { label: "Level", levels: ladder.levels.map((_, index) => getLevelLabel(ladder, axis, index + 1)) },
    { label: "Expectation", levels: axis.levels.map((level) => level.summary) },
    ...(section?.rows.map((row) => ({
      ...row,
      levels: ladder.levels.map((_, index) => row.levels[index] ?? null),
    })) ?? []),
  ];
}

// Project a pointer onto one axis; movement sideways cannot change the chosen axis.
export function getLevelAtPoint(ladder: Ladder, axisIndex: number, point: { x: number; y: number }, center: { x: number; y: number }, radius: number): number {
  const angle = -Math.PI / 2 + axisIndex * Math.PI * 2 / ladder.axes.length;
  const distance = (point.x - center.x) * Math.cos(angle) + (point.y - center.y) * Math.sin(angle);
  return clampLevel(ladder, distance / radius * ladder.levels.length);
}
