"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { useStudioRequest } from "@shared/runtime/studio";
import { Button } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

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
      const response = await request(urls.studio.managedTransfer(id), {
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
        <LibraryLabel className="editor-field" unstyled>
          Owner account email
          <LibraryInput
            disabled={busy}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            unstyled
            value={email}
          />
        </LibraryLabel>
        <Button className="studio-secondary" disabled={busy} type="submit" variant="outline">
          {busy ? "Transferring…" : "Transfer portfolio"}
        </Button>
      </form>
      {error && (
        <p className="editor-alert" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
