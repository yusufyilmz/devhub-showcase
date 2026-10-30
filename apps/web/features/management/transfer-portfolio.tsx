"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function TransferPortfolio({
  id,
  revision,
}: {
  id: string;
  revision: number;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function transfer(event: React.FormEvent) {
    event.preventDefault();
    if (
      !window.confirm(
        `Transfer this portfolio to ${email}? You will lose management access. Save or discard your editor changes first.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/managed/${id}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, revision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push("/admin/portfolios");
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not transfer.",
      );
      setBusy(false);
    }
  }
  return (
    <section className="editor-card">
      <h2>Transfer to the owner</h2>
      <p>
        Ask the owner to sign in with Google first. Their account must have no
        portfolio or only an untouched starter. Edited work is never replaced.
        Save or discard your editor changes before transferring.
      </p>
      <form onSubmit={transfer} className="managed-fields">
        <label className="editor-field">
          Owner account email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
          />
        </label>
        <button type="submit" className="studio-secondary" disabled={busy}>
          {busy ? "Transferring…" : "Transfer portfolio"}
        </button>
      </form>
      {error && (
        <p role="alert" className="editor-alert">
          {error}
        </p>
      )}
    </section>
  );
}
