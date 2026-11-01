"use client";

import { useState } from "react";

import { useStudioRequest } from "../context/studio-request";

export function TransferPortfolio({
  id,
  onTransferred,
  revision,
}: {
  id: string;
  onTransferred: () => void;
  revision: number;
}) {
  const request = useStudioRequest();
  const [email, setEmail] = useState("");
  const [error, showError] = useState("");
  const [busy, setBusy] = useState(false);
  async function transfer(event: React.FormEvent) {
    event.preventDefault();
    if (
      !window.confirm(
        `Transfer this portfolio to ${email}? You will lose management access. Save or discard your editor changes first.`,
      )
    )
      return;
    setBusy(true);
    showError("");
    try {
      const response = await request(`/api/admin/managed/${id}/transfer`, {
        body: JSON.stringify({ email, revision }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onTransferred();
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Could not transfer.");
      setBusy(false);
    }
  }
  return (
    <section className="editor-card">
      <h2>Transfer to the owner</h2>
      <p>
        Ask the owner to sign in with Google first. Their account must have no portfolio or only an
        untouched starter. Edited work is never replaced. Save or discard your editor changes before
        transferring.
      </p>
      <form className="managed-fields" onSubmit={transfer}>
        <label className="editor-field">
          Owner account email
          <input
            disabled={busy}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <button className="studio-secondary" disabled={busy} type="submit">
          {busy ? "Transferring…" : "Transfer portfolio"}
        </button>
      </form>
      {error && (
        <p className="editor-alert" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
