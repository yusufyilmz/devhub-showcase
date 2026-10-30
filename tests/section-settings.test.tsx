// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { ProfileEditor } from "../apps/web/features/admin/profile-editor";
import { RegisteredSections } from "../apps/web/features/portfolio/registered-sections";
import {
  getPortfolioSections,
  type PortfolioProfile,
  selectPortfolioContent,
} from "../packages/content/src";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

const sampleProject = profile.projects[0];
if (!sampleProject) throw new Error("Expected a sample project");
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
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
  fireEvent.change(within(projects).getByLabelText("Display style"), {
    target: { value: "project-carousel" },
  });
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
  expect(
    (
      within(screen.getByRole("group", { name: "Projects" })).getByLabelText(
        "Display style",
      ) as HTMLSelectElement
    ).value,
  ).toBe("project-carousel");
  fireEvent.click(screen.getByRole("button", { name: "Reset Projects to default" }));
  expect(
    (
      within(screen.getByRole("group", { name: "Projects" })).getByLabelText(
        "Display style",
      ) as HTMLSelectElement
    ).value,
  ).toBe("");
});
