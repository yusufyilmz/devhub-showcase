"use client";

import { useState } from "react";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { TextField } from "@shared/ui/text-field";

import { passwordGateStyles } from "./styles";
import type { PasswordGateProps } from "./types";

export function PasswordGate({ unlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Card asChild className={passwordGateStyles.root} interaction="static">
      <main id="admin-content">
        <h1 className={passwordGateStyles.title}>This portfolio is protected</h1>
        <p className={passwordGateStyles.text}>
          Enter the password shared by its owner to view the portfolio and CV. Access lasts one
          hour.
        </p>
        <form
          className={passwordGateStyles.form}
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy) return;
            setBusy(true);
            setError("");
            try {
              await unlock(password);
              setPassword("");
            } catch (reason) {
              setError(
                reason instanceof Error ? reason.message : "Could not unlock this portfolio.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <TextField
            autoComplete="current-password"
            disabled={busy}
            label="Portfolio password"
            maxLength={128}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          {error && <p role="alert">{error}</p>}
          <Button disabled={busy || !password} type="submit">
            {busy ? "Unlocking…" : "Unlock portfolio"}
          </Button>
        </form>
      </main>
    </Card>
  );
}
