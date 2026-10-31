// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { AiAssistantEditor } from "../apps/web/features/admin/ai-assistant-editor";
import { profile } from "../packages/content/src/index";

const proposal = {
  changes: [{ field: "title", reason: "Concise requested title", value: '"Frontend engineer"' }],
  summary: "Refine your role",
};
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url, options) =>
      Response.json(
        options?.method === "POST"
          ? { proposal, revision: 2 }
          : { enabled: true, limit: 10, usage: 0 },
      ),
    ),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function generate() {
  fireEvent.change(screen.getByLabelText("What would you like to change?"), {
    target: { value: "Shorten title" },
  });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Generate proposal" }).hasAttribute("disabled")).toBe(
      false,
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Generate proposal" }));
  await screen.findByText("Refine your role");
}
it("requires explicit apply and updates only the draft", async () => {
  const change = vi.fn();
  render(
    <AiAssistantEditor
      managed={false}
      onChange={change}
      profile={profile}
      profileId="alpha"
      revision={2}
    />,
  );
  await generate();
  expect(change).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Apply selected changes to draft" }));
  expect(change.mock.calls[0]?.[0].title).toBe("Frontend engineer");
  expect(screen.getByText(/Applied to your draft/)).toBeTruthy();
});
it("blocks stale proposals and avoids assistant access for managed editors", async () => {
  const change = vi.fn();
  const view = render(
    <AiAssistantEditor
      managed={false}
      onChange={change}
      profile={profile}
      profileId="alpha"
      revision={2}
    />,
  );
  await generate();
  view.rerender(
    <AiAssistantEditor
      managed={false}
      onChange={change}
      profile={{ ...profile, title: "Manually changed" }}
      profileId="alpha"
      revision={2}
    />,
  );
  expect(
    screen
      .getByRole("button", { name: "Apply selected changes to draft" })
      .hasAttribute("disabled"),
  ).toBe(true);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <AiAssistantEditor
      managed={true}
      onChange={change}
      profile={profile}
      profileId="managed"
      revision={2}
    />,
  );
  expect(screen.queryByRole("button", { name: "Generate proposal" })).toBeNull();
});
