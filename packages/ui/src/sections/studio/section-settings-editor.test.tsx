// @vitest-environment jsdom

import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPortfolioSections,
  type PortfolioProfile,
  profile,
  selectPortfolioContent,
} from "@shared/config";
import { profileSchema } from "@shared/lib/profiles";

import { RegisteredSections } from "../../../../assistant/src/components/portfolio/index";
import { ProfileEditor } from "../../../../assistant/src/components/studio/workspace/index";
import { SectionSettingsEditor } from "./section-settings-editor";

const sampleProject = profile.projects[0];
if (!sampleProject) throw new Error("Expected a sample project");

function DraftSettings({ draft }: { draft: PortfolioProfile }) {
  const [value, setValue] = useState(draft);
  return <SectionSettingsEditor onChange={setValue} onlySection="projects" profile={value} />;
}

describe("SectionSettings", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  it("previews the chosen layout with current draft content and excludes private projects", () => {
    const draft: PortfolioProfile = {
      ...profile,
      projects: [
        { ...sampleProject, id: "draft", name: "My draft project", public: true },
        { ...sampleProject, id: "private", name: "My private project", public: false },
      ],
    };
    render(<DraftSettings draft={draft} />);
    fireEvent.click(screen.getByText("Section visibility and layout"));
    const preview = screen.getByRole("region", { name: "Projects live preview" });
    expect(within(preview).getByText("My draft project")).toBeTruthy();
    expect(within(preview).queryByText("My private project")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tabs" }));
    expect(within(preview).getByRole("tab", { name: "My draft project" })).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Show section"));
    expect(within(preview).getByText("This section is hidden.")).toBeTruthy();
  });

  it("updates the live preview as project fields change and shows an empty state", () => {
    const onChange = vi.fn();
    const draft = { ...profile, projects: [] };
    const { rerender } = render(
      <SectionSettingsEditor onChange={onChange} onlySection="projects" profile={draft} />,
    );
    fireEvent.click(screen.getByText("Section visibility and layout"));
    const preview = within(screen.getByRole("region", { name: "Projects live preview" }));
    expect(preview.getByText("Add or include content to preview this section.")).toBeTruthy();
    rerender(
      <SectionSettingsEditor
        onChange={onChange}
        onlySection="projects"
        profile={{
          ...draft,
          projects: [{ ...sampleProject, name: "Newly entered project", public: true }],
        }}
      />,
    );
    expect(preview.getByText("Newly entered project")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });
  it("round trips compatible settings and rejects cross section renderers, duplicates and executable settings", () => {
    const sectionSettings = {
      projects: { itemIds: [], renderer: "project-carousel", visible: false },
    };
    expect(
      profileSchema.parse(JSON.parse(JSON.stringify({ ...profile, sectionSettings })))
        .sectionSettings,
    ).toEqual(sectionSettings);
    for (const invalid of [
      { about: { renderer: "project-carousel" } },
      { projects: { itemIds: ["same", "same"] } },
      { projects: { html: "<script/>" } },
      { custom: { visible: true } },
    ])
      expect(profileSchema.safeParse({ ...profile, sectionSettings: invalid }).success).toBe(false);
  });
  it("selects content by stable IDs, never reveals private projects and leaves the original document intact", () => {
    const source: PortfolioProfile = {
      ...profile,
      projects: [
        {
          ...sampleProject,
          id: "private",
          name: "Private secret",
          public: false,
        },
        {
          ...sampleProject,
          id: "chosen",
          name: "Chosen work",
          public: true,
        },
        { ...sampleProject, id: "other", name: "Other work", public: true },
      ],
      sectionSettings: {
        experience: { itemIds: [] },
        projects: { itemIds: ["private", "chosen"] },
      },
    };
    const before = JSON.stringify(source);
    const selected = selectPortfolioContent(source);
    expect(selected.projects.map(({ id }) => id)).toEqual(["chosen"]);
    expect(selected.experiences).toEqual([]);
    expect(JSON.stringify(source)).toBe(before);
    const configured = {
      ...source,
      sectionSettings: {
        ...source.sectionSettings,
        projects: {
          ...source.sectionSettings?.projects,
          renderer: "project-tabs" as const,
        },
      },
    };
    const markup = renderToStaticMarkup(
      <RegisteredSections
        profile={configured}
        renderers={Object.fromEntries(
          getPortfolioSections(configured).map(({ renderer }) => [renderer, null]),
        )}
      />,
    );
    expect(markup).toContain("Chosen work");
    expect(markup).not.toContain("Private secret");
    expect(markup).not.toContain("Other work");
  });
  it("saves editor choices, visibility and item selection and restores them after reloading", async () => {
    const initial = {
      profile: profileSchema.parse(profile),
      revision: 1,
      updatedAt: "2026-10-30",
      username: "example-person",
    };
    let saved = initial;
    const fetcher = vi.fn(async (_url, options) => {
      const payload = JSON.parse(options.body);
      saved = {
        ...initial,
        profile: profileSchema.parse(payload.profile),
        revision: 2,
      };
      return { json: async () => saved, ok: true };
    });
    vi.stubGlobal("fetch", fetcher);
    const editor = render(<ProfileEditor initial={initial} />);
    fireEvent.click(screen.getByRole("button", { name: "Section display" }));
    const projects = screen.getByRole("group", { name: "Projects" });
    fireEvent.click(within(projects).getByRole("button", { name: "Carousel" }));
    fireEvent.click(within(projects).getByLabelText("All items, including future additions"));
    const first = sampleProject;
    fireEvent.click(
      within(projects).getByLabelText(`${first.name}${first.public ? "" : " (private)"}`),
    );
    const about = screen.getByRole("group", { name: "About" });
    fireEvent.click(within(about).getByLabelText("Show section"));
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Saved"));
    expect(saved.profile.sectionSettings?.projects).toEqual({
      itemIds: [first.id],
      renderer: "project-carousel",
    });
    expect(saved.profile.sectionSettings?.about?.visible).toBe(false);
    editor.unmount();
    render(<ProfileEditor initial={saved} />);
    fireEvent.click(screen.getByRole("button", { name: "Section display" }));
    const reloadedProjects = within(screen.getByRole("group", { name: "Projects" }));
    expect(reloadedProjects.getByRole("button", { name: "Carousel", pressed: true })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reset Projects to default" }));
    expect(
      reloadedProjects.getByRole("button", { name: "Layout default", pressed: true }),
    ).toBeTruthy();
  });
});
