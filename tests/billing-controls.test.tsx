// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { BillingControls } from "../apps/web/app/admin/billing/controls";
import { billingMessages } from "../apps/web/lib/billing/errors";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("shows safe actionable errors without displaying upstream payloads", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      Response.json({ code: "no_subscription", error: "secret upstream value" }, { status: 503 }),
    );
  vi.stubGlobal("fetch", fetchMock);
  render(<BillingControls />);
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Manage subscription" }));
  expect((await screen.findByRole("alert")).textContent).toBe(billingMessages.no_subscription);
  expect(screen.queryByText("secret upstream value")).toBeNull();
  fetchMock.mockResolvedValue(
    Response.json({ code: "unknown", error: "another secret" }, { status: 503 }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Try Pro checkout" }));
  expect((await screen.findByRole("alert")).textContent).toBe(billingMessages.unavailable);
});
it("rejects non-Stripe and credential-bearing redirect destinations", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  render(<BillingControls />);
  for (const url of [
    "https://evil.test/checkout",
    "https://user:password@checkout.stripe.com/test",
    "https://billing.stripe.com:8080/test",
  ]) {
    fetchMock.mockResolvedValue(Response.json({ url }));
    fireEvent.click(screen.getByRole("button", { name: "Try Pro checkout" }));
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "Try Pro checkout" }).hasAttribute("disabled")).toBe(
      false,
    );
  }
});
