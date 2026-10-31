"use client";
import { useEffect, useState } from "react";
export function ChatSettings() {
  const [data, setData] = useState<{
    profileId: string;
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
  async function toggle() {
    if (!data) return;
    setBusy(true);
    setError("");
    try {
      const result = await fetch("/api/admin/billing", {
        body: JSON.stringify({
          chatEnabled: !data.enabled,
          profileId: data.enabled ? null : data.profileId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      if (!result.ok) throw new Error("Unavailable");
      setData({ ...data, enabled: !data.enabled });
    } catch {
      setError("Could not update chat settings.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>Portfolio AI chat</h2>
      <p>
        Enable a visitor assistant using only published portfolio information. Visitor questions
        consume your Pro allowance, including failed or uncertain provider attempts.
      </p>
      {data && (
        <>
          <p>
            Chat usage: {data.usage} / {data.limit} attempts this billing period.
          </p>
          {data.profileId === "main" ? (
            <p>Your existing portfolio assistant keeps its legacy configuration.</p>
          ) : (
            <button
              className="studio-secondary"
              disabled={busy || (!data.enabled && data.plan !== "pro")}
              onClick={toggle}
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
