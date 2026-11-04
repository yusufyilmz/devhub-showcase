"use client";

import "./support.css";

import { useEffect, useId, useState } from "react";

import { Button } from "../../buttons/button";
import { Checkbox } from "../../forms/checkbox";
import { Label } from "../../forms/label";
import { NativeSelect } from "../../forms/native-select";
import { TextField } from "../../forms/text-field";
import type { SupportAccount, SupportProps, SupportReason, SupportSummary } from "./types";

export function AccountSupport({ load, inspect, disable }: SupportProps) {
  const [accounts, setAccounts] = useState<SupportAccount[]>([]);
  const [next, setNext] = useState<string>();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SupportSummary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    let current = true;
    load()
      .then((data) => {
        if (current) {
          setAccounts(data.accounts);
          setNext(data.next);
        }
      })
      .catch(() => {
        if (current) setError("Support unavailable. Check your access and migration setup.");
      })
      .finally(() => {
        if (current) setBusy(false);
      });
    return () => {
      current = false;
    };
  }, [load]);
  async function search(account: string) {
    setBusy(true);
    setError("");
    setSelected(null);
    try {
      setSelected(await inspect(account));
    } catch {
      setError("Could not inspect this studio account. Check access and the account ID.");
    } finally {
      setBusy(false);
    }
  }
  async function more(after?: string) {
    setBusy(true);
    setError("");
    try {
      const data = await load(after);
      setAccounts(data.accounts);
      setNext(data.next);
    } catch {
      setError("Could not load accounts. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="studio account-support" id="admin-content">
      <header className="studio-heading">
        <div>
          <p className="eyebrow">PLATFORM ADMINISTRATION</p>
          <h1>Account support</h1>
          <p>
            Inspect operational status. Private profile, CV and conversation content stays outside
            this dashboard.
          </p>
        </div>
        <a href="/admin/portfolios">Managed portfolios</a>
      </header>
      {error && <p role="alert">{error}</p>}
      <section className="editor-card">
        <h2>Find a studio account</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy) search(query);
          }}
        >
          <TextField
            disabled={busy}
            label="Account ID"
            onChange={(event) => setQuery(event.target.value)}
            required
            value={query}
          />
          <Button disabled={busy || !query.trim()} type="submit">
            Inspect account
          </Button>
        </form>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              <Button disabled={busy} onClick={() => search(account.id)} variant="unstyled">
                {account.id}
              </Button>{" "}
              · {account.confirmed ? "Confirmed" : "Unconfirmed"}
            </li>
          ))}
        </ul>
        <Button disabled={busy} onClick={() => more()}>
          First accounts
        </Button>
        {next && (
          <Button disabled={busy} onClick={() => more(next)}>
            Next accounts
          </Button>
        )}
      </section>
      {selected && (
        <AccountDetails
          disable={disable}
          key={selected.id}
          onBusy={setBusy}
          refresh={() => search(selected.id)}
          summary={selected}
        />
      )}
    </main>
  );
}
function AccountDetails({
  summary,
  disable,
  refresh,
  onBusy,
}: {
  summary: SupportSummary;
  disable: SupportProps["disable"];
  refresh: () => Promise<void>;
  onBusy: (busy: boolean) => void;
}) {
  const reasonId = useId();
  const confirmId = useId();
  const [reason, setReason] = useState<SupportReason>("customer_request");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  async function change() {
    setBusy(true);
    onBusy(true);
    setError("");
    try {
      await disable(summary.id, reason, requestId);
      await refresh();
    } catch {
      setError(
        "Could not confirm the change. Retry uses the same request ID; inspect the audit before starting a new action.",
      );
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  const billing = summary.billing;
  return (
    <section aria-label="Account details" className="editor-card">
      <h2>Account status</h2>
      <p>
        {summary.id} · {summary.confirmed ? "Confirmed" : "Unconfirmed"} · Created{" "}
        {summary.created_at}
      </p>
      <h3>Publication</h3>
      <ul>
        {summary.profiles.map((profile) => (
          <li key={profile.id}>
            {profile.id} · Draft revision {profile.revision} · Website{" "}
            {profile.websitePublished ? "published" : "unpublished"} · CV{" "}
            {profile.cvPublished ? "published" : "unpublished"}
          </li>
        ))}
      </ul>
      <h3>Subscription and AI usage</h3>
      <p>
        Recorded plan: {billing.plan} · Status: {billing.status} · Current access:{" "}
        {billing.active ? "Pro" : "Free"}
      </p>
      <p>
        Visitor chat: {billing.chatUsed} / {billing.chatLimit} attempts · Private assistant:{" "}
        {billing.editorUsed} / {billing.editorLimit} attempts
      </p>
      <p>
        Visitor chat {billing.chatEnabled ? "enabled" : "disabled"}. Failed and reserved attempts
        count toward usage.
      </p>
      <h3>Disable visitor chat</h3>
      <p>
        This changes opt-in only. It does not cancel a subscription, refund attempts, publish
        content or prevent an owner from opting in again.
      </p>
      <Label htmlFor={reasonId}>
        Support reason{" "}
        <NativeSelect
          disabled={busy}
          id={reasonId}
          onChange={(event) => {
            setReason(event.target.value as SupportReason);
            setRequestId(crypto.randomUUID());
            setConfirmed(false);
          }}
          value={reason}
        >
          <option value="customer_request">Customer request</option>
          <option value="incident_response">Incident response</option>
          <option value="configuration_review">Configuration review</option>
        </NativeSelect>
      </Label>
      <Label htmlFor={confirmId}>
        <Checkbox
          checked={confirmed}
          disabled={busy}
          id={confirmId}
          onCheckedChange={(value) => setConfirmed(value === true)}
        />{" "}
        I confirm disabling visitor chat for this account.
      </Label>
      {error && <p role="alert">{error}</p>}
      <Button disabled={busy || !confirmed || !billing.chatEnabled} onClick={change}>
        Disable visitor chat
      </Button>
      <Button disabled={busy} onClick={refresh}>
        Refresh account
      </Button>
      <h3>Support audit</h3>
      {!summary.audit.length && <p>No support changes recorded.</p>}
      <ul>
        {summary.audit.map((entry) => (
          <li key={entry.request_id}>
            {entry.created_at} · Actor {entry.actor_id} · {entry.action} · {entry.reason} ·{" "}
            {entry.before_enabled ? "enabled" : "disabled"} → disabled · Request {entry.request_id}
          </li>
        ))}
      </ul>
    </section>
  );
}
