"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { Button } from "@shared/ui/button";

import { useAccountStatus, useBillingRequest } from "../provider/billing-context";
import { AccountOverview, type AccountStatus } from "./account-overview";

export function ChatSettings() {
  const { data, error, loading, refresh } = useAccountStatus();
  return (
    <section
      aria-labelledby="portfolio-ai-settings-title"
      className="mt-7 border-t border-[rgb(var(--border-rgb))] pt-7"
    >
      <h2 className="mb-3 text-[22px] leading-[1.3] font-semibold" id="portfolio-ai-settings-title">
        Portfolio AI features
      </h2>
      <p>
        Assign Pro to your portfolio to use the private editing assistant. Visitor chat is a
        separate opt-in and uses only published portfolio information.
      </p>
      <Button
        className="studio-secondary"
        disabled={loading}
        onClick={refresh}
        type="button"
        variant="outline"
      >
        Refresh status
      </Button>
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
  const request = useBillingRequest();
  const [busy, setBusy] = useState(false);
  const [error, showError] = useState("");
  const { billing, profile } = data;
  const assigned = billing.assignedProfileId === profile.id;
  const enabled = assigned && billing.chatEnabled;
  async function configure(profileId: string | null, chatEnabled: boolean) {
    setBusy(true);
    showError("");
    try {
      const result = await request(urls.billing.root(), {
        body: JSON.stringify({ chatEnabled, profileId }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      if (!result.ok) throw new Error("Unavailable");
      refresh();
    } catch {
      showError("Could not update AI settings. Refresh status before trying again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        className="studio-secondary"
        disabled={busy || (!assigned && billing.plan !== "pro")}
        onClick={() => configure(assigned ? null : profile.id, false)}
        type="button"
        variant="outline"
      >
        {assigned ? "Remove Pro assignment" : "Use Pro for my portfolio"}
      </Button>
      <p>Removing the assignment disables both premium assistants. It does not reset usage.</p>
      {profile.id !== "main" && (
        <Button
          className="studio-secondary"
          disabled={busy || (!enabled && billing.plan !== "pro")}
          onClick={() => configure(billing.plan === "pro" ? profile.id : null, !enabled)}
          type="button"
          variant="outline"
        >
          {enabled ? "Disable portfolio AI chat" : "Enable portfolio AI chat"}
        </Button>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
