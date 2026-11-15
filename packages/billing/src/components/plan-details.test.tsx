// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { urls } from "@shared/config/urls";

import { StudioPlanDetails } from "./plan-details";

describe("PricingUi", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  it.each([
    [900, "eur", "€9.00"],
    [1000, "jpy", "¥1,000"],
    [500, "isk", "ISK"],
  ])("formats Stripe amount %s in %s without charging", async (amount, currency, label) => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        amount,
        available: true,
        chatLimit: 100,
        currency,
        editorLimit: 10,
        interval: "month",
        mode: "test",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<StudioPlanDetails />);
    expect(
      await screen.findByText(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))),
    ).toBeTruthy();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(urls.billing.pricing());
    expect(await screen.findByText(/100 visitor chat attempts/)).toBeTruthy();
  });
  it("keeps a useful free-plan message when pricing is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<StudioPlanDetails />);
    expect(await screen.findByText(/Your free portfolio remains available/)).toBeTruthy();
  });
});
