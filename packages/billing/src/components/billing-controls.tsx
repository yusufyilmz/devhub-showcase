"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { StudioButton } from "@shared/ui/button";

import { billingErrorMessage } from "../constants/messages";
import { useBillingRequest } from "../provider/billing-context";

const stripeHosts = new Set(["checkout.stripe.com", "billing.stripe.com"]);

export function BillingControls() {
  const request = useBillingRequest();
  const [busy, setBusy] = useState(false);
  const [error, showError] = useState("");
  async function open(action: "checkout" | "portal") {
    setBusy(true);
    showError("");
    try {
      const response = await request(urls.billing.action(action), { method: "POST" });
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
      <StudioButton className="mr-2" disabled={busy} onClick={() => open("checkout")} type="button">
        Try Pro checkout
      </StudioButton>{" "}
      <StudioButton
        disabled={busy}
        onClick={() => open("portal")}
        tone="secondary"
        type="button"
        variant="outline"
      >
        Manage subscription
      </StudioButton>
      {error && (
        <p aria-label="Billing error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
