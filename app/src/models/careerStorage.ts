import { getProfileStorageKey, ladders, normalizeProfile, type Ladder, type Profile, type ViewId } from "./ladder";

const viewKey = "career-coach-view-v1";
const legacySoftwareKey = "career-coach-profile-v1";

// null means the key is absent, while undefined means storage could not be read.
function read(key: string): string | null | undefined {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return undefined;
  }
}

function write(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readViewPreference(): { viewId: ViewId; available: boolean } {
  const saved = read(viewKey);
  return {
    viewId: ladders.find((view) => view.id === saved)?.id ?? "general",
    available: saved !== undefined,
  };
}

export function saveViewPreference(viewId: ViewId): boolean {
  return write(viewKey, viewId);
}

export function readProfile(view: Ladder): Profile | undefined {
  let saved = read(getProfileStorageKey(view));
  if (saved === null && view.id === "software-engineer") {
    saved = read(legacySoftwareKey);
  }
  if (saved === undefined) return undefined;
  try {
    return normalizeProfile(view, JSON.parse(saved ?? "null"));
  } catch {
    return { ...view.defaultProfile };
  }
}

export function saveProfile(view: Ladder, profile: Profile): boolean {
  return write(getProfileStorageKey(view), JSON.stringify(profile));
}

export function matchesProfileKey(view: Ladder, key: string | null): boolean {
  return key === null || key === getProfileStorageKey(view)
    || (view.id === "software-engineer" && key === legacySoftwareKey);
}
