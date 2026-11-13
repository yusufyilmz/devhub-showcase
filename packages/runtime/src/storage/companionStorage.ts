import { storage } from "@shared/config/storage";

import { localStorageBase } from "./browserStorage";

type Side = "left" | "right";
export type TipSettings = { enabled: boolean; seen: string[]; last: number; day?: string };

const agentKey = (agent: string, setting: string) =>
  `${storage.agentCompanion}:${encodeURIComponent(agent)}:${setting}`;

type Layout = { x: number; y: number; size?: number };
const isFraction = (value: unknown): value is number =>
  typeof value === "number" && value >= 0 && value <= 1;

export const companionStorage = {
  readLayout(agent: string): Layout | undefined {
    const value = localStorageBase.readJSON(agentKey(agent, "layout"));
    if (!value || typeof value !== "object") return undefined;
    const { x, y, size } = value as Partial<Layout>;
    if (!isFraction(x) || !isFraction(y)) return undefined;
    return { size: typeof size === "number" && Number.isFinite(size) ? size : undefined, x, y };
  },
  readSide: (agent: string): Side =>
    localStorageBase.getItem(agentKey(agent, "side")) === "right" ? "right" : "left",
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
  tipsKey: (guide: string) => `${storage.agentCompanion}:${encodeURIComponent(guide)}:feature-tips`,
  writeLayout: (agent: string, layout: Layout) =>
    localStorageBase.writeJSON(agentKey(agent, "layout"), layout),
  writeSide: (agent: string, side: Side) => localStorageBase.setItem(agentKey(agent, "side"), side),
  writeTips: (key: string, value: TipSettings) => localStorageBase.writeJSON(key, value),
};
