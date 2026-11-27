import { useEffect, useRef, useState } from "react";
import { matchesProfileKey, readProfile, saveProfile } from "../models/careerStorage";
import { ladders, type Ladder, type Profile, type ViewId } from "../models/ladder";

type ProfileState = { value: Profile; available: boolean };

export function useProfiles(view: Ladder) {
  const [profiles, setProfiles] = useState(() => Object.fromEntries(ladders.map((ladder) => {
    const value = readProfile(ladder);
    return [ladder.id, { value: value ?? ladder.defaultProfile, available: value !== undefined }];
  })) as Record<ViewId, ProfileState>);
  const pendingChanges = useRef<Partial<Record<ViewId, Profile>>>({});
  const profile = profiles[view.id].value;

  useEffect(() => {
    function refreshProfiles(event: StorageEvent) {
      const updates: Partial<Record<ViewId, ProfileState>> = {};
      for (const ladder of ladders) {
        if (!matchesProfileKey(ladder, event.key)) continue;
        const saved = readProfile(ladder);
        if (saved === undefined) continue;
        const pending = pendingChanges.current[ladder.id];
        updates[ladder.id] = { value: { ...saved, ...pending }, available: pending === undefined };
      }
      if (Object.keys(updates).length > 0) {
        setProfiles((current) => ({ ...current, ...updates }));
      }
    }

    window.addEventListener("storage", refreshProfiles);
    return () => window.removeEventListener("storage", refreshProfiles);
  }, []);

  function updateProfile(changes: Profile) {
    // Read the latest saved axes even if a storage event from another tab is still queued.
    const saved = readProfile(view);
    const pending = { ...pendingChanges.current[view.id], ...changes };
    const value = { ...(saved ?? profile), ...pending };
    const available = saved !== undefined && saveProfile(view, value);
    pendingChanges.current[view.id] = available ? undefined : pending;
    setProfiles((current) => ({ ...current, [view.id]: { value, available } }));
  }

  return {
    profile,
    updateProfile,
    profilesAvailable: Object.values(profiles).every((entry) => entry.available),
  };
}
