import type { PortfolioProfile } from "@shared/config";

export type PublicationStatus = {
  currentRevision: number;
  publishedCv?: PortfolioProfile | null;
  published: {
    revision: number;
    username: string;
    updated_at: string;
    profile?: PortfolioProfile;
  } | null;
};
export type PublicationProps = {
  profile: PortfolioProfile;
  revision: number;
  dirty: boolean;
  disabled: boolean;
  load: () => Promise<PublicationStatus>;
  change: (publish: boolean, revision: number) => Promise<void>;
  scheduling?: PublicationScheduling;
  onChanged: (published: boolean) => void;
};

export type PublicationScheduleRecord = {
  id: string;
  revision: number;
  username: string;
  run_at: string;
  timezone: string;
  state: "pending" | "completed" | "cancelled" | "failed";
  error: string | null;
};
export type PublicationScheduling = {
  load: () => Promise<PublicationScheduleRecord[]>;
  create: (runAt: string, timezone: string, revision: number) => Promise<void>;
  cancel: (id: string) => Promise<void>;
};
export type PublicationScheduleProps = {
  revision: number;
  reviewing: boolean;
  blocked: boolean;
  scheduling: PublicationScheduling;
  onScheduled: () => void;
};
