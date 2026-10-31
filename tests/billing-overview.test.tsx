// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { ChatSettings } from "../apps/web/app/admin/billing/chat-settings";
import { AccountOverview } from "../apps/web/features/billing/account-overview";
import { type BillingSummary, entitlementSummary } from "../packages/lib/src/billing";

const billing: BillingSummary = {
  ...entitlementSummary(null),
  access: "active",
  assignedProfileId: "alpha",
  chatEnabled: true,
  limits: { portfolio_chat: 20, studio_assistant: 5 },
  periodEnd: "2026-11-07T12:00:00Z",
  plan: "pro",
  usage: { portfolio_chat: 3, studio_assistant: 5 },
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("shows separate exhausted/private states and clamped remaining allowances", () => {
  render(
    <AccountOverview
      aiConfigured={true}
      billing={billing}
      profile={{ id: "alpha", isPublic: false }}
    />,
  );
  expect(screen.getByText(/No attempts remain/)).toBeTruthy();
  expect(screen.getByText(/Your portfolio is private/)).toBeTruthy();
  expect(screen.getByText(/5 \/ 5 attempts used. 0 remaining/)).toBeTruthy();
  expect(screen.getByText(/3 \/ 20 attempts used. 17 remaining/)).toBeTruthy();
  expect(screen.getByLabelText("Private editing assistant usage").getAttribute("value")).toBe("5");
  expect(
    screen
      .getByText(/Access period ends/)
      .querySelector("time")
      ?.getAttribute("datetime"),
  ).toBe(billing.periodEnd);
});
it("refreshes usage without writes or AI calls and recovers from storage failure", async () => {
  let unavailable = true;
  const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
    if (unavailable) return Response.json({}, { status: 503 });
    return Response.json(
      String(url).endsWith("/profile")
        ? { id: "alpha", isPublic: false }
        : { ...billing, aiConfigured: true },
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<ChatSettings />);
  await screen.findByRole("alert");
  expect(screen.queryByRole("button", { name: "Enable portfolio AI chat" })).toBeNull();
  unavailable = false;
  fireEvent.click(screen.getByRole("button", { name: "Refresh status" }));
  await screen.findByText("Pro is active");
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByText(/No attempts remain/)).toBeTruthy();
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Refresh status" }).hasAttribute("disabled")).toBe(
      false,
    ),
  );
  expect(
    fetchMock.mock.calls.every(([url]) =>
      ["/api/admin/billing", "/api/admin/profile"].includes(String(url)),
    ),
  ).toBe(true);
});
it("keeps refresh failures visible instead of leaving stale ready controls", async () => {
  const fetchMock = vi.fn(async (url: RequestInfo | URL) =>
    Response.json(
      String(url).endsWith("/profile")
        ? { id: "alpha", isPublic: true }
        : { ...billing, aiConfigured: true },
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
  render(<ChatSettings />);
  await screen.findByText("Pro is active");
  fetchMock.mockResolvedValue(Response.json({}, { status: 503 }));
  fireEvent.click(screen.getByRole("button", { name: "Refresh status" }));
  await screen.findByRole("alert");
  expect(screen.queryByText("Pro is active")).toBeNull();
  expect(screen.queryByRole("button", { name: "Remove Pro assignment" })).toBeNull();
});
