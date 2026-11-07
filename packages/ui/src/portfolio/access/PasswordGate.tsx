"use client";

import "../../styles/portfolio/password-gate.css";

import { useState } from "react";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { TextField } from "../../forms/text-field";
import { passwordGateStyles } from "./styles";
import type { PasswordGateProps } from "./types";

export function PasswordGate({ unlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Card asChild className={passwordGateStyles.root} interaction="static">
      <main id="admin-content">
        <h1>This portfolio is protected</h1>
        <p>
          Enter the password shared by its owner to view the portfolio and CV. Access lasts one
          hour.
        </p>
        <form
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
