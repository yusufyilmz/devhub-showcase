// @vitest-environment jsdom
import { useState } from "react";

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { DraftPreviewPane } from "./draft-preview-pane";
import { EditorWorkspace } from "./editor-workspace";

vi.mock("@shared/runtime/browser", () => ({ useIsMobile: () => false }));

const groups = [{ items: ["Profile", "Experience"], label: "Content" }];

function Workspace({ save = () => undefined }: { save?: () => void }) {
  const [active, setActive] = useState("Profile");
  const [draft, setDraft] = useState("Original title");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <EditorWorkspace
        actions={<button type="submit">Save changes</button>}
        active={active}
        groups={groups}
        onNavigate={setActive}
        preview={<p>Private preview: {draft}</p>}
        username="test-owner"
      >
        <p>{active} content</p>
        <input
          aria-label="Draft title"
          onChange={(event) => setDraft(event.target.value)}
          value={draft}
        />
      </EditorWorkspace>
    </form>
  );
}

describe("EditorWorkspace", () => {
  afterEach(cleanup);

  it("starts in preview and opens sidebar sections inside the workspace", () => {
    const { container } = render(<Workspace />);
    const workspace = container.querySelector(".editor-workspace-main");
    expect(screen.getByRole("complementary", { name: "Draft preview" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    const section = screen.getByRole("region", { name: "Edit Experience" });
    expect(workspace?.contains(section)).toBe(true);
    expect(within(section).getByText("Experience content")).toBeTruthy();
    expect(screen.queryByRole("complementary", { name: "Draft preview" })).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.change(screen.getByRole("combobox", { name: "Editor section" }), {
      target: { value: "Profile" },
    });
    expect(screen.getByRole("region", { name: "Edit Profile" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Done editing" }));
    expect(screen.queryByRole("region", { name: "Edit Profile" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit" }));
  });

  it("keeps sections accessible in the compact sidebar", () => {
    render(<Workspace />);
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    const expand = screen.getByRole("button", { name: "Expand sidebar" });
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    const experience = screen.getByRole("button", { name: "Experience" });
    expect(experience.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    fireEvent.click(experience);
    expect(experience.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("region", { name: "Edit Experience" })).toBeTruthy();
    fireEvent.click(expand);
    expect(experience.textContent).toContain("Experience");
    expect(screen.getByText("Your portfolio")).toBeTruthy();
    expect(screen.getByText("Portfolio draft")).toBeTruthy();
  });

  it("retains unsaved edits in preview and saves through the original form", () => {
    const save = vi.fn();
    render(<Workspace save={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Draft title" });
    expect(input.form).not.toBeNull();
    fireEvent.change(input, { target: { value: "Unsaved title" } });
    fireEvent.click(screen.getByRole("button", { name: "Back to preview" }));
    expect(screen.getByText("Private preview: Unsaved title")).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Draft title" }).value).toBe(
      "Unsaved title",
    );
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(save).toHaveBeenCalledOnce();
  });

  it("keeps onboarding in the editor while allowing section navigation", () => {
    const navigate = vi.fn();
    render(
      <EditorWorkspace
        active="Profile"
        groups={groups}
        locked
        onNavigate={navigate}
        preview={null}
        username="test-owner"
        view="edit"
      >
        Draft
      </EditorWorkspace>,
    );
    expect(screen.queryByRole("button", { name: "Back to preview" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Done editing" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    expect(navigate).toHaveBeenCalledWith("Experience");
  });

  it("disables section changes during a save", () => {
    const navigate = vi.fn();
    render(
      <EditorWorkspace
        active="Profile"
        disabled
        groups={groups}
        onNavigate={navigate}
        preview={null}
        username="test-owner"
      >
        Draft
      </EditorWorkspace>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole<HTMLSelectElement>("combobox").disabled).toBe(true);
  });

  it("projects CV contact choices independently and excludes private projects and birthdate", () => {
    render(
      <DraftPreviewPane
        downloadHref="/saved-cv"
        profile={{
          ...profile,
          birthDate: "1990-01-20",
          cvFields: { email: false, phone: false },
          projects: [
            { ...profile.projects[0]!, id: "private", name: "Confidential project", public: false },
          ],
        }}
      >
        <p>Website draft</p>
      </DraftPreviewPane>,
    );
    fireEvent.click(screen.getByRole("button", { name: "CV" }));
    const cv = screen.getByRole("article", { name: "CV content preview" });
    expect(cv.textContent).not.toContain(profile.email);
    expect(cv.textContent).not.toContain(profile.phone);
    expect(cv.textContent).not.toContain("Confidential project");
    expect(cv.textContent).not.toContain("1990-01-20");
    expect(screen.getByRole("link", { name: "Download saved PDF" }).getAttribute("href")).toBe(
      "/saved-cv",
    );
  });
});
