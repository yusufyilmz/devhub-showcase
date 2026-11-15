import { storage } from "@shared/config/storage";

import { accountPreferenceSession } from "./accountPreferenceSession";
import { localStorageBase } from "./browserStorage";

type Side = "left" | "right";
export type TipSettings = { enabled: boolean; seen: string[]; last: number; day?: string };

const agentKey = (agent: string, setting: string) =>
  `${storage.agentCompanion}:${encodeURIComponent(agent)}:${setting}`;

type Layout = { x: number; y: number; size?: number };
const tipPreference = (key: string) => {
  const guide = key.slice(storage.agentCompanion.length + 1, -":feature-tips".length);
  return `tips:${decodeURIComponent(guide).split(":")[0]}`;
};
const isFraction = (value: unknown): value is number =>
  typeof value === "number" && value >= 0 && value <= 1;

export const companionStorage = {
  readLayout(agent: string): Layout | undefined {
    const value = accountPreferenceSession.active()
      ? accountPreferenceSession.get(`layout:${agent}`)
      : localStorageBase.readJSON(agentKey(agent, "layout"));
    if (!value || typeof value !== "object") return undefined;
    const { x, y, size } = value as Partial<Layout>;
    if (!isFraction(x) || !isFraction(y)) return undefined;
    return { size: typeof size === "number" && Number.isFinite(size) ? size : undefined, x, y };
  },
  readSide: (agent: string): Side =>
    !accountPreferenceSession.active() &&
    localStorageBase.getItem(agentKey(agent, "side")) === "right"
      ? "right"
      : "left",
  readTips(key: string): TipSettings | null {
    const value = localStorageBase.readJSON(key);
    const accountEnabled = accountPreferenceSession.active()
      ? accountPreferenceSession.get(tipPreference(key)) !== false
      : undefined;
    if (!value || typeof value !== "object")
      return accountEnabled === undefined ? null : { enabled: accountEnabled, last: 0, seen: [] };
    const { day, enabled, last, seen } = value as Partial<TipSettings>;
    return {
      day: typeof day === "string" ? day : undefined,
      enabled: accountEnabled ?? enabled !== false,
      last: typeof last === "number" && Number.isFinite(last) ? last : 0,
      seen:
        day === new Date().toDateString() && Array.isArray(seen)
          ? seen.filter((id) => typeof id === "string")
          : [],
    };
  },
  setTipsEnabled(key: string, enabled: boolean) {
    accountPreferenceSession.update(tipPreference(key), enabled);
  },
  tipsKey: (guide: string) => `${storage.agentCompanion}:${encodeURIComponent(guide)}:feature-tips`,
  writeLayout(agent: string, layout: Layout) {
    if (!accountPreferenceSession.update(`layout:${agent}`, layout))
      localStorageBase.writeJSON(agentKey(agent, "layout"), layout);
  },
  writeSide: (agent: string, side: Side) => localStorageBase.setItem(agentKey(agent, "side"), side),
  writeTips: (key: string, value: TipSettings) => localStorageBase.writeJSON(key, value),
};
