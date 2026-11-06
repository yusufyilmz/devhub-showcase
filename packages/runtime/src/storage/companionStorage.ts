import { storage } from "@shared/config/storage";

import { localStorageBase } from "./browserStorage";

type Side = "left" | "right";
export type TipSettings = { enabled: boolean; seen: string[]; last: number; day?: string };

const sideKey = (agent: string) =>
  `${storage.agentCompanion}:${encodeURIComponent(agent)}:side`;

export const companionStorage = {
  readSide: (agent: string): Side =>
    localStorageBase.getItem(sideKey(agent)) === "right" ? "right" : "left",
  readTips(key: string): TipSettings | null {
    const value = localStorageBase.readJSON(key);
    if (!value || typeof value !== "object") return null;
    const { day, enabled, last, seen } = value as Partial<TipSettings>;
    return {
      day: typeof day === "string" ? day : undefined,
      enabled: enabled !== false,
      last: typeof last === "number" && Number.isFinite(last) ? last : 0,
      seen:
        day === new Date().toDateString() && Array.isArray(seen)
          ? seen.filter((id) => typeof id === "string")
          : [],
    };
  },
  tipsKey: (guide: string) =>
    `${storage.agentCompanion}:${encodeURIComponent(guide)}:feature-tips`,
  writeSide: (agent: string, side: Side) => localStorageBase.setItem(sideKey(agent), side),
  writeTips: (key: string, value: TipSettings) => localStorageBase.writeJSON(key, value),
};
