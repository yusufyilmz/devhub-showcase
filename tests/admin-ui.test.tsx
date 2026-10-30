// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { ProfileEditor } from "../apps/web/features/admin/profile-editor";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

const initial = {
  profile: profileSchema.parse(profile),
  revision: 1,
  updatedAt: "2026-10-28",
  username: "yusufyilmz",
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("edits a profile through labeled fields and publishes using its original revision", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({
      ...initial,
      profile: { ...initial.profile, name: "Updated name" },
      revision: 2,
    }),
    ok: true,
  });
  vi.stubGlobal("fetch", fetcher);
  render(<ProfileEditor initial={initial} />);
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Updated name" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Saved"));
  const payload = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(payload.revision).toBe(1);
  expect(payload.profile.name).toBe("Updated name");
  expect(screen.getByText("Revision 2")).toBeTruthy();
});
it("keeps a draft intact when saving fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      json: async () => ({ error: "Another tab changed this profile." }),
      ok: false,
    }),
  );
  render(<ProfileEditor initial={initial} />);
  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Still here" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Another tab"));
  expect((screen.getByLabelText("Full name") as HTMLInputElement).value).toBe("Still here");
});
it("adds a new project through the project editor", () => {
  render(<ProfileEditor initial={initial} />);
  fireEvent.click(screen.getByRole("button", { name: "Projects" }));
  fireEvent.click(screen.getByRole("button", { name: "+ Add projects" }));
  expect(screen.getAllByLabelText("Project name")).toHaveLength(
    initial.profile.projects.length + 1,
  );
});

it("saves personal PDF settings and publishes only with explicit sharing enabled", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({ ...initial, isPublic: true, revision: 2 }),
    ok: true,
  });
  vi.stubGlobal("fetch", fetcher);
  render(<ProfileEditor initial={initial} />);
  const share = screen.getByLabelText(
    "Publish my profile and CV at a public link",
  ) as HTMLInputElement;
  expect(share.checked).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "PDF" }));
  fireEvent.change(screen.getByLabelText("Page size"), {
    target: { value: "LETTER" },
  });
  fireEvent.change(screen.getByLabelText("Body text size"), {
    target: { value: "11" },
  });
  fireEvent.click(share);
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalled());
  const payload = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(payload.isPublic).toBe(true);
  expect(payload.profile.cvSettings.pageSize).toBe("LETTER");
  expect(payload.profile.cvSettings.fontSize).toBe(11);
});

it("saves the chosen username together with profile and sharing changes", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({ ...initial, revision: 2, username: "new-handle" }),
    ok: true,
  });
  vi.stubGlobal("fetch", fetcher);
  const history = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  render(<ProfileEditor initial={initial} />);
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "new-handle" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Saved"));
  expect(JSON.parse(fetcher.mock.calls[0]?.[1].body).username).toBe("new-handle");
  expect(history).toHaveBeenCalledWith(null, "", "/new-handle/edit");
  history.mockRestore();
});

it("starts new workspaces with a type picker and saves the choice without replacing content or publishing", async () => {
  const fetcher = vi.fn().mockImplementation(async (_url, options) => {
    const input = JSON.parse(options.body);
    return {
      json: async () => ({ ...initial, ...input, revision: 2 }),
      ok: true,
    };
  });
  vi.stubGlobal("fetch", fetcher);
  render(
    <ProfileEditor
      initial={{
        ...initial,
        profile: { ...initial.profile, templateChosen: false },
      }}
    />,
  );
  expect(screen.queryByLabelText("Full name")).toBeNull();
  fireEvent.click(screen.getByRole("radio", { name: /Designer/ }));
  fireEvent.click(screen.getByRole("button", { name: "Use this layout" }));
  expect(fetcher).not.toHaveBeenCalled();
  expect((screen.getByLabelText("Full name") as HTMLInputElement).value).toBe(initial.profile.name);
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalled());
  const input = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(input.profile.portfolioType).toBe("designer");
  expect(input.profile.cvLayout).toBe("editorial");
  expect(input.profile.templateChosen).toBe(true);
  expect(input.profile.projects).toEqual(initial.profile.projects);
  expect(input.isPublic).toBe(false);
  expect(input.revision).toBe(1);
});
it("switches an existing layout without changing the independent CV preference", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({ ...initial, revision: 2 }),
    ok: true,
  });
  vi.stubGlobal("fetch", fetcher);
  render(
    <ProfileEditor
      initial={{
        ...initial,
        profile: { ...initial.profile, cvLayout: "editorial" },
      }}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /^Layout$/ }));
  fireEvent.click(screen.getByRole("radio", { name: /Minimal/ }));
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalled());
  const input = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(input.profile.portfolioType).toBe("minimal");
  expect(input.profile.cvLayout).toBe("editorial");
  expect(input.profile.experiences).toEqual(initial.profile.experiences);
});

it("saves portfolio and CV languages independently without changing the written content", async () => {
  const fetcher = vi.fn().mockImplementation(async (_url, options) => ({
    json: async () => ({
      ...initial,
      ...JSON.parse(options.body),
      revision: 2,
    }),
    ok: true,
  }));
  vi.stubGlobal("fetch", fetcher);
  render(<ProfileEditor initial={initial} />);
  fireEvent.click(screen.getByRole("button", { name: "Language settings" }));
  fireEvent.change(screen.getByLabelText("Portfolio language"), {
    target: { value: "es" },
  });
  fireEvent.change(screen.getByLabelText("CV language"), {
    target: { value: "tr" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalled());
  const input = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(input.profile.portfolioLanguage).toBe("es");
  expect(input.profile.cvLanguage).toBe("tr");
  expect(input.profile.summary).toBe(initial.profile.summary);
  expect(input.profile.experiences).toEqual(initial.profile.experiences);
});

it("previews a theme locally and saves it without changing layout, content or CV format", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({ ...initial, revision: 2 }),
    ok: true,
  });
  vi.stubGlobal("fetch", fetcher);
  render(<ProfileEditor initial={initial} />);
  fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
  fireEvent.click(screen.getByRole("radio", { name: /Paper/ }));
  fireEvent.click(screen.getByRole("button", { name: "Preview light" }));
  const preview = screen.getByRole("region", {
    name: "Portfolio theme preview",
  });
  expect(preview.getAttribute("data-portfolio-theme")).toBe("paper");
  expect(preview.getAttribute("data-theme")).toBe("light");
  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("Accent color"), {
    target: { value: "emerald" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalled());
  const input = JSON.parse(fetcher.mock.calls[0]?.[1].body);
  expect(input.profile.appearance).toEqual({
    accent: "emerald",
    defaultTheme: "dark",
    theme: "paper",
  });
  expect(input.profile.portfolioType).toBe(initial.profile.portfolioType);
  expect(input.profile.cvLayout).toBe(initial.profile.cvLayout);
  expect(input.profile.summary).toBe(initial.profile.summary);
});
