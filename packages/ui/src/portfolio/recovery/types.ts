import type { PortfolioProfile, PortfolioType } from "@shared/config";

export type SetupStep = "template" | "details" | "review" | "done";
export type RecoveryValue = {
  profession?: PortfolioType;
  profile: PortfolioProfile;
  username: string;
  isPublic: boolean;
  tab: string;
  step: SetupStep;
};
export type RecoveryRecord = { version: 1; revision: number; at: number; value: RecoveryValue };
export type RecoveryOptions = {
  storageKey: string;
  revision: number;
  value: RecoveryValue;
  dirty: boolean;
  onRestore: (value: RecoveryValue) => void;
};
export type RecoveryStatus = "checking" | "idle" | "pending" | "saving" | "saved" | "failed";

export type RecoveryController = {
  stop: () => void;
  status: RecoveryStatus;
  candidate: RecoveryRecord | null;
  stale: boolean;
  discard: () => void;
  saved: (revision: number) => void;
  conflict: () => void;
  retry: () => void;
  restore: () => void;
};
export type DraftRecoveryProps = { recovery: RecoveryController; disabled?: boolean };
