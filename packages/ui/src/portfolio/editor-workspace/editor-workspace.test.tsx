// @vitest-environment jsdom
import { useState } from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { DraftPreviewPane } from "./draft-preview-pane";
import { EditorWorkspace } from "./editor-workspace";

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

  it("starts with the preview and opens a lightbox for the selected editing section", () => {
    render(<Workspace />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Private preview: Original title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("dialog", { name: "Edit Profile" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Editor section" }), {
      target: { value: "Experience" },
    });
    expect(screen.getByRole("dialog", { name: "Edit Experience" })).toBeTruthy();
    expect(screen.getByText("Experience content")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close editor" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("retains unsaved edits on close and preserves the original save form inside the lightbox", () => {
    const save = vi.fn();
    render(<Workspace save={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "Draft title" });
    expect(input.form).not.toBeNull();
    fireEvent.change(input, { target: { value: "Unsaved title" } });
    fireEvent.click(screen.getByRole("button", { name: "Close editor" }));
    expect(screen.getByText("Private preview: Unsaved title")).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Draft title" }).value).toBe(
      "Unsaved title",
    );
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(save).toHaveBeenCalledOnce();
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
