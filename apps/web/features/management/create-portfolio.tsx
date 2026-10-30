"use client";
import { useState } from "react";

import { type PortfolioProfile, type PortfolioType, portfolioTypes } from "@shared/content";
import { createEmptyProfile } from "@shared/lib/user-profile";
import { useRouter } from "next/navigation";

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : "Could not process the portfolio.";
}
export function CreatePortfolio() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<PortfolioType>("designer");
  const [imported, setImported] = useState<PortfolioProfile | null>(null);
  const [error, setError] = useState("");
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
      setError("");
    } catch (reason) {
      setError(errorMessage(reason));
    }
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError("");
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
      const response = await fetch("/api/admin/managed", {
        body: JSON.stringify({ profile, username }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push(`/admin/portfolios/${result.id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the portfolio.");
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
          <label className="editor-field">
            Import portfolio JSON
            <input
              accept=".json,application/json"
              onChange={(event) => readImport(event.target.files?.[0])}
              type="file"
            />
          </label>
          {imported && (
            <p role="status">
              Imported {imported.name}. Existing project images and links will be preserved.
            </p>
          )}
          <label className="editor-field">
            Name
            <input
              maxLength={200}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>
          <label className="editor-field">
            Username
            <input
              maxLength={50}
              minLength={3}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              value={username}
            />
          </label>
          <label className="editor-field">
            Contact email
            <input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </label>
          <label className="editor-field">
            Portfolio layout
            <select onChange={(event) => setType(event.target.value as PortfolioType)} value={type}>
              {portfolioTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <p>
            New portfolios are private. A missing email uses pending@example.com until you replace
            it. Review imported contact details before publishing.
          </p>
          <button className="studio-primary" type="submit">
            {busy ? "Creating…" : "Create private portfolio"}
          </button>
          {imported && (
            <button className="studio-secondary" onClick={() => setImported(null)} type="button">
              Clear imported content
            </button>
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
