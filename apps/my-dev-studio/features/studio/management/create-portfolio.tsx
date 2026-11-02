"use client";

import "./management.css";

import { useState } from "react";

import { type PortfolioProfile, type PortfolioType, portfolioTypes } from "@shared/config";
import { urls } from "@shared/config/urls";
import { createEmptyProfile } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import { Button } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { NativeSelect as LibraryNativeSelect } from "@shared/ui/native-select";

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : "Could not process the portfolio.";
}
export function CreatePortfolio({ onCreated }: { onCreated: (id: string) => void }) {
  const request = useStudioRequest();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<PortfolioType>("designer");
  const [imported, setImported] = useState<PortfolioProfile | null>(null);
  const [error, showError] = useState("");
  const [busy, setBusy] = useState(false);
  async function readImport(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 250000) throw new Error("The import must be smaller than 250 KB.");
      const input = JSON.parse(await file.text());
      const profile = input.profile ?? input;
      if (typeof profile.name !== "string")
        throw new Error("Choose a portfolio profile JSON file.");
      setImported(profile);
      setName(profile.name);
      setEmail(profile.email ?? "");
      setType(profile.portfolioType ?? "designer");
      if (typeof input.username === "string") setUsername(input.username);
      showError("");
    } catch (reason) {
      showError(errorMessage(reason));
    }
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    showError("");
    setBusy(true);
    try {
      const base = imported ?? createEmptyProfile({ email: email || "pending@example.com" });
      const profile = {
        ...base,
        email: email || "pending@example.com",
        name,
        portfolioType: type,
        templateChosen: true,
      };
      const response = await request(urls.next.studio.managed(), {
        body: JSON.stringify({ profile, username }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onCreated(result.id);
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Could not create the portfolio.");
      setBusy(false);
    }
  }
  return (
    <section className="editor-card">
      <h2>Create a temporary portfolio</h2>
      <p>
        Create a private portfolio without a separate login. You manage it until it is transferred
        to a confirmed account.
      </p>
      <form onSubmit={create}>
        <fieldset className="managed-fields" disabled={busy}>
          <legend className="sr-only">New managed portfolio</legend>
          <LibraryLabel className="editor-field" unstyled>
            Import portfolio JSON
            <LibraryInput
              accept=".json,application/json"
              onChange={(event) => readImport(event.target.files?.[0])}
              type="file"
              unstyled
            />
          </LibraryLabel>
          {imported && (
            <p role="status">
              Imported {imported.name}. Existing project images and links will be preserved.
            </p>
          )}
          <LibraryLabel className="editor-field" unstyled>
            Name
            <LibraryInput
              maxLength={200}
              onChange={(event) => setName(event.target.value)}
              required
              unstyled
              value={name}
            />
          </LibraryLabel>
          <LibraryLabel className="editor-field" unstyled>
            Username
            <LibraryInput
              maxLength={50}
              minLength={3}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              unstyled
              value={username}
            />
          </LibraryLabel>
          <LibraryLabel className="editor-field" unstyled>
            Contact email
            <LibraryInput
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              unstyled
              value={email}
            />
          </LibraryLabel>
          <LibraryLabel className="editor-field" unstyled>
            Portfolio layout
            <LibraryNativeSelect
              onChange={(event) => setType(event.target.value as PortfolioType)}
              unstyled
              value={type}
            >
              {portfolioTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </LibraryNativeSelect>
          </LibraryLabel>
          <p>
            New portfolios are private. A missing email uses pending@example.com until you replace
            it. Review imported contact details before publishing.
          </p>
          <Button className="studio-primary" type="submit">
            {busy ? "Creating…" : "Create private portfolio"}
          </Button>
          {imported && (
            <Button
              className="studio-secondary"
              onClick={() => setImported(null)}
              type="button"
              variant="outline"
            >
              Clear imported content
            </Button>
          )}
        </fieldset>
        {error && (
          <p className="editor-alert" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
