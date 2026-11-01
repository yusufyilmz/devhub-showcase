"use client";

import { useState } from "react";

import { billingErrorMessage } from "@shared/lib/billing";

import { useStudioRequest } from "../studio-request";

const stripeHosts = new Set(["checkout.stripe.com", "billing.stripe.com"]);

export function BillingControls() {
  const request = useStudioRequest();
  const [busy, setBusy] = useState(false);
  const [error, showError] = useState("");
  async function open(action: "checkout" | "portal") {
    setBusy(true);
    showError("");
    try {
      const response = await request(`/api/billing/${action}`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        showError(billingErrorMessage(data.code));
        setBusy(false);
        return;
      }
      const target = new URL(data.url);
      if (
        target.protocol !== "https:" ||
        target.username ||
        target.password ||
        target.port ||
        !stripeHosts.has(target.hostname)
      )
        throw new Error("Invalid billing destination.");
      window.location.assign(target.href);
    } catch {
      showError(billingErrorMessage("unavailable"));
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
