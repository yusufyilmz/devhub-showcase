// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AccountSupport } from "./screen";
import type { SupportSummary } from "./types";

const account = {
  confirmed: true,
  created_at: "2026-11-04",
  id: "22222222-2222-4222-8222-222222222222",
};
const summary: SupportSummary = {
  ...account,
  audit: [],
  billing: {
    active: true,
    chatEnabled: true,
    chatLimit: 100,
    chatUsed: 2,
    editorLimit: 10,
    editorUsed: 0,
    plan: "pro",
    status: "active",
  },
  profiles: [],
};

describe("support confirmation and logical retries", () => {
  afterEach(cleanup);
  it("requires explicit confirmation and keeps the same request identity after a failed response", async () => {
    const disable = vi.fn().mockRejectedValue(new Error("unavailable"));
    render(
      <AccountSupport
        disable={disable}
        inspect={async () => summary}
        load={async () => ({ accounts: [account] })}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: account.id }));
    const button = await screen.findByRole("button", { name: "Disable visitor chat" });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(button);
    await screen.findByRole("alert");
    fireEvent.click(button);
    await waitFor(() => expect(disable).toHaveBeenCalledTimes(2));
    expect(disable.mock.calls[0]).toEqual(disable.mock.calls[1]);
    expect(disable.mock.calls[0]?.slice(0, 2)).toEqual([account.id, "customer_request"]);
  });
  it("refreshes metadata after success without offering entitlement or publication changes", async () => {
    let enabled = true;
    const inspect = vi.fn(async () => ({
      ...summary,
      billing: { ...summary.billing, chatEnabled: enabled },
    }));
    const disable = vi.fn(async () => {
      enabled = false;
    });
    render(
      <AccountSupport
        disable={disable}
        inspect={inspect}
        load={async () => ({ accounts: [account] })}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: account.id }));
    await screen.findByRole("button", { name: "Disable visitor chat" });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Disable visitor chat" }));
    await waitFor(() => expect(inspect).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Disable visitor chat" }).hasAttribute("disabled"),
      ).toBe(true),
    );
    expect(screen.queryByRole("button", { name: /grant|publish|refund/i })).toBeNull();
  });
});
