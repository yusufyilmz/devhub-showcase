"use client";
import { useEffect, useState } from "react";
export function ChatSettings() {
  const [data, setData] = useState<{
    profileId: string;
    assigned: boolean;
    plan: string;
    enabled: boolean;
    usage: number;
    limit: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/admin/profile", { signal: controller.signal }),
      fetch("/api/admin/billing", { signal: controller.signal }),
    ])
      .then(async ([profile, billing]) => {
        if (!profile.ok || !billing.ok) throw new Error("Unavailable");
        const [p, b] = await Promise.all([profile.json(), billing.json()]);
        setData({
          assigned: b.assignedProfileId === p.id,
          enabled: b.chatEnabled && b.assignedProfileId === p.id,
          limit: b.limits.portfolio_chat,
          plan: b.plan,
          profileId: p.id,
          usage: b.usage.portfolio_chat,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Could not load chat settings.");
      });
    return () => controller.abort();
  }, []);
  async function configure(profileId: string | null, chatEnabled: boolean) {
    if (!data) return;
    setBusy(true);
    setError("");
    try {
      const result = await fetch("/api/admin/billing", {
        body: JSON.stringify({
          chatEnabled,
          profileId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      if (!result.ok) throw new Error("Unavailable");
      setData({ ...data, assigned: profileId !== null, enabled: chatEnabled });
    } catch {
      setError("Could not update chat settings.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>Portfolio AI features</h2>
      <p>
        Assign Pro to your portfolio to use the private editing assistant. Public visitor chat is a
        separate opt-in.
      </p>
      <p>
        Enable a visitor assistant using only published portfolio information. Visitor questions
        consume your Pro allowance, including failed or uncertain provider attempts.
      </p>
      {data && (
        <>
          <button
            className="studio-secondary"
            disabled={busy || (!data.assigned && data.plan !== "pro")}
            onClick={() => configure(data.assigned ? null : data.profileId, false)}
            type="button"
          >
            {data.assigned ? "Remove Pro assignment" : "Use Pro for my portfolio"}
          </button>
          <p>Removing the assignment disables both premium assistants. It does not reset usage.</p>
          <p>
            Chat usage: {data.usage} / {data.limit} attempts this billing period.
          </p>
          {data.profileId === "main" ? (
            <p>Your existing portfolio assistant keeps its legacy configuration.</p>
          ) : (
            <button
              className="studio-secondary"
              disabled={busy || (!data.enabled && data.plan !== "pro")}
              onClick={() => configure(data.plan === "pro" ? data.profileId : null, !data.enabled)}
              type="button"
            >
              {data.enabled ? "Disable portfolio AI chat" : "Enable portfolio AI chat"}
            </button>
          )}
          {data.plan !== "pro" && <p>An active Pro subscription is required to enable chat.</p>}
        </>
      )}
      {!data && !error && <p role="status">Loading chat settings…</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
