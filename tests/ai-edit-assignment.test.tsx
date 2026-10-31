// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { ChatSettings } from "../apps/web/app/admin/billing/chat-settings";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("assigns Pro for private editing without opting into visitor chat", async () => {
  const fetchMock = vi.fn(async (url: RequestInfo | URL, options?: RequestInit) => {
    if (options?.method === "PUT") return Response.json({ saved: true });
    return Response.json(
      String(url).endsWith("/profile")
        ? { id: "alpha" }
        : {
            assignedProfileId: null,
            chatEnabled: false,
            limits: { portfolio_chat: 100 },
            plan: "pro",
            usage: { portfolio_chat: 0 },
          },
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<ChatSettings />);
  fireEvent.click(await screen.findByRole("button", { name: "Use Pro for my portfolio" }));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Remove Pro assignment" })).toBeTruthy(),
  );
  const request = fetchMock.mock.calls.find((call) => call[1]?.method === "PUT");
  expect(JSON.parse(String(request?.[1]?.body))).toEqual({
    chatEnabled: false,
    profileId: "alpha",
  });
  expect(screen.getByRole("button", { name: "Enable portfolio AI chat" })).toBeTruthy();
});
