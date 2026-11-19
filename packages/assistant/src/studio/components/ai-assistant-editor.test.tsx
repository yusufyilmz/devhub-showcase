// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { validateProfile } from "@shared/lib/profiles";

import { AiAssistantEditor } from "./ai-assistant-editor";

const request = vi.hoisted(() => vi.fn());
vi.mock("@shared/runtime/studio", () => ({ useStudioRequest: () => request }));
const draft = validateProfile(profile);
const proposal = {
  changes: [
    { field: "title", reason: "Concise role", value: JSON.stringify("Frontend engineer") },
    {
      field: "summary",
      reason: "Shorter introduction",
      value: JSON.stringify("A suggested summary."),
    },
  ],
  summary: "Refine introduction",
};
async function generate() {
  fireEvent.change(screen.getByLabelText("What would you like to change?"), {
    target: { value: "Shorten the intro" },
  });
  fireEvent.click(await screen.findByRole("button", { name: "Generate proposal" }));
  return screen.findByRole("heading", { name: "Review proposed changes" });
}
describe("AI field review", () => {
  beforeEach(() => {
    request.mockReset();
    sessionStorage.clear();
    request.mockImplementation(async (_url, init) =>
      Response.json(
        init?.method === "POST"
          ? { proposal, revision: 4 }
          : { enabled: true, limit: 10, usage: 0 },
      ),
    );
  });
  afterEach(cleanup);
  it("requires a decision and changes only accepted fields, with undo available", async () => {
    const onChange = vi.fn();
    render(
      <AiAssistantEditor
        managed={false}
        onChange={onChange}
        profile={draft}
        profileId="owner"
        revision={4}
      />,
    );
    await generate();
    const apply = screen.getByRole("button", { name: "Apply selected changes to draft" });
    expect((apply as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("checkbox", { name: "title" }));
    fireEvent.click(apply);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ summary: draft.summary, title: "Frontend engineer" }),
    );
    expect(screen.getByText(/Applied to your draft/)).toBeDefined();
  });
  it("disables an existing proposal when the draft or revision changes", async () => {
    const onChange = vi.fn();
    const view = render(
      <AiAssistantEditor
        managed={false}
        onChange={onChange}
        profile={draft}
        profileId="owner"
        revision={4}
      />,
    );
    await generate();
    fireEvent.click(screen.getByRole("button", { name: "Accept all proposed changes" }));
    view.rerender(
      <AiAssistantEditor
        managed={false}
        onChange={onChange}
        profile={{ ...draft, title: "Manual change" }}
        profileId="owner"
        revision={5}
      />,
    );
    expect(
      (screen.getByRole("button", { name: "Apply selected changes to draft" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });
  it("rejects a response for a different saved revision", async () => {
    request.mockImplementation(async (_url, init) =>
      Response.json(
        init?.method === "POST"
          ? { proposal, revision: 3 }
          : { enabled: true, limit: 10, usage: 0 },
      ),
    );
    const onChange = vi.fn();
    render(
      <AiAssistantEditor
        managed={false}
        onChange={onChange}
        profile={draft}
        profileId="owner"
        revision={4}
      />,
    );
    fireEvent.change(screen.getByLabelText("What would you like to change?"), {
      target: { value: "Shorten the intro" },
    });
    fireEvent.click(await screen.findByRole("button", { name: "Generate proposal" }));
    expect(await screen.findByText(/proposal revision does not match/)).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();
  });
});
