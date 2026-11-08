import { portfolioTypes } from "@shared/config";

import { isDraftStructure } from "./structure";
import type { RecoveryRecord } from "./types";

export const recoveryRetention = 24 * 60 * 60 * 1000;

export function readRecovery(raw: string | null, now = Date.now()): RecoveryRecord | null {
  if (!raw || raw.length > 250000) return null;
  try {
    const item = JSON.parse(raw) as RecoveryRecord;
    if (
      item.version !== 1 ||
      !Number.isInteger(item.revision) ||
      item.revision < 0 ||
      !Number.isFinite(item.at) ||
      item.at > now ||
      now - item.at > recoveryRetention
    )
      return null;
    const value = item.value;
    if (
      !value ||
      typeof value.username !== "string" ||
      typeof value.isPublic !== "boolean" ||
      typeof value.tab !== "string" ||
      !["template", "details", "review", "done"].includes(value.step)
    )
      return null;
    if (value.profession && !portfolioTypes.some((type) => type.id === value.profession))
      return null;
    if (!isDraftStructure(value.profile)) return null;
    return item;
  } catch {
    return null;
  }
}
