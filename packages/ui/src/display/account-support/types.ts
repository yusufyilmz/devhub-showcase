export type SupportReason = "customer_request" | "incident_response" | "configuration_review";
export type SupportAccount = { id: string; created_at: string; confirmed: boolean };
export type SupportSummary = SupportAccount & {
  profiles: { id: string; revision: number; websitePublished: boolean; cvPublished: boolean }[];
  billing: {
    plan: string;
    status: string;
    periodEnd?: string;
    active: boolean;
    chatLimit: number;
    editorLimit: number;
    chatUsed: number;
    editorUsed: number;
    chatEnabled: boolean;
  };
  audit: {
    request_id: string;
    actor_id: string;
    action: string;
    reason: string;
    before_enabled: boolean;
    after_enabled: boolean;
    created_at: string;
  }[];
};
export type SupportProps = {
  load: (after?: string) => Promise<{ accounts: SupportAccount[]; next?: string }>;
  inspect: (account: string) => Promise<SupportSummary>;
  disable: (account: string, reason: SupportReason, requestId: string) => Promise<void>;
};
