"use client";
import { useState } from "react";

import { AccountOverview, type AccountStatus } from "@/features/billing/account-overview";
import { useAccountStatus } from "@/features/billing/use-account-status";

export function ChatSettings() {
  const { data, error, loading, refresh } = useAccountStatus();
  return (
    <section aria-labelledby="portfolio-ai-settings-title">
      <h2 id="portfolio-ai-settings-title">Portfolio AI features</h2>
      <p>
        Assign Pro to your portfolio to use the private editing assistant. Visitor chat is a
        separate opt-in and uses only published portfolio information.
      </p>
      <button className="studio-secondary" disabled={loading} onClick={refresh} type="button">
        Refresh status
      </button>
      {loading && <p role="status">Loading plan and usage…</p>}
      {!loading && data && (
        <>
          <AccountOverview {...data} />
          <AssignmentControls data={data} refresh={refresh} />
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
function AssignmentControls({ data, refresh }: { data: AccountStatus; refresh: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { billing, profile } = data;
  const assigned = billing.assignedProfileId === profile.id;
  const enabled = assigned && billing.chatEnabled;
  async function configure(profileId: string | null, chatEnabled: boolean) {
    setBusy(true);
    setError("");
    try {
      const result = await fetch("/api/admin/billing", {
        body: JSON.stringify({ chatEnabled, profileId }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      if (!result.ok) throw new Error("Unavailable");
      refresh();
    } catch {
      setError("Could not update AI settings. Refresh status before trying again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="studio-secondary"
        disabled={busy || (!assigned && billing.plan !== "pro")}
        onClick={() => configure(assigned ? null : profile.id, false)}
        type="button"
      >
        {assigned ? "Remove Pro assignment" : "Use Pro for my portfolio"}
      </button>
      <p>Removing the assignment disables both premium assistants. It does not reset usage.</p>
      {profile.id !== "main" && (
        <button
          className="studio-secondary"
          disabled={busy || (!enabled && billing.plan !== "pro")}
          onClick={() => configure(billing.plan === "pro" ? profile.id : null, !enabled)}
          type="button"
        >
          {enabled ? "Disable portfolio AI chat" : "Enable portfolio AI chat"}
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
