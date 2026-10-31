"use client";
import { useState } from "react";

import { billingErrorMessage } from "@/lib/billing/errors";
export function BillingControls() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function open(action: "checkout" | "portal") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/billing/${action}`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(billingErrorMessage(data.code));
        setBusy(false);
        return;
      }
      const target = new URL(data.url);
      if (
        target.protocol !== "https:" ||
        target.username ||
        target.password ||
        target.port ||
        !["checkout.stripe.com", "billing.stripe.com"].includes(target.hostname)
      )
        throw new Error("Invalid billing destination.");
      window.location.assign(target.href);
    } catch {
      setError(billingErrorMessage("unavailable"));
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="studio-primary"
        disabled={busy}
        onClick={() => open("checkout")}
        type="button"
      >
        Try Pro checkout
      </button>{" "}
      <button
        className="studio-secondary"
        disabled={busy}
        onClick={() => open("portal")}
        type="button"
      >
        Manage subscription
      </button>
      {error && (
        <p aria-label="Billing error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
