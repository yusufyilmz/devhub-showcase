import type { PortfolioProfile } from "@shared/config";
export type HistoryEntry = { revision: number; created_at: string };
export type HistoryList = {
  currentRevision: number;
  revisions: HistoryEntry[];
  retention: { count: number; days: number };
};
export type HistoryRead = {
  currentRevision: number;
  revision: number;
  createdAt: string;
  profile: PortfolioProfile;
};
export type RevisionHistoryProps = {
  profile: PortfolioProfile;
  revision: number;
  load: () => Promise<HistoryList>;
  read: (revision: number) => Promise<HistoryRead>;
  onChange: (profile: PortfolioProfile) => void;
};
