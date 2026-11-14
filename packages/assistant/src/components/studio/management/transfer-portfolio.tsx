"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { useStudioRequest } from "@shared/runtime/studio";
import { StudioButton } from "@shared/ui/button";
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
    <section className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]">
      <h2>Transfer to the owner</h2>
      <p>
        Ask the owner to sign in with Google first. Their account must have no portfolio or only an
        untouched starter. Edited work is never replaced. Save or discard your editor changes before
        transferring.
      </p>
      <form
        className="mt-6 grid min-w-0 gap-4 border-0 p-0 [&_input]:max-w-full [&_select]:max-w-full"
        onSubmit={transfer}
      >
        <LibraryLabel
          className="editor-field flex min-w-0 flex-col gap-[9px] text-xs text-muted-foreground [&_small]:text-[10px] [&_small]:leading-normal [&_small]:opacity-80"
          unstyled
        >
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
        <StudioButton disabled={busy} tone="secondary" type="submit" variant="outline">
          {busy ? "Transferring…" : "Transfer portfolio"}
        </StudioButton>
      </form>
      {error && (
        <p
          className="editor-alert mb-6 rounded-[10px] border border-border px-5 py-4 text-xs leading-[1.8] whitespace-pre-line text-destructive [&_button]:mt-2.5 [&_button]:underline"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
