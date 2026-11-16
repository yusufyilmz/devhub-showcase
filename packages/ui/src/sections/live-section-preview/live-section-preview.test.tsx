// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { authorableSectionTypes, profile } from "@shared/config";
import { profileSchema } from "@shared/lib/profiles";
import { createSectionTemplate } from "@shared/lib/section-templates";

import { LiveSectionPreview } from "./live-section-preview";
import { sectionExamples, viewOnlySectionExamples } from "./preview-examples";
import { createSectionExample } from "./section-example";

describe("LiveSectionPreview", () => {
  afterEach(cleanup);

  it("provides a renderable example for every registered and view-only section", () => {
    expect(sectionExamples.map(({ id }) => id)).toEqual([
      ...authorableSectionTypes,
      ...Object.keys(viewOnlySectionExamples),
    ]);
    for (const { id, name } of sectionExamples) {
      const { unmount } = render(<LiveSectionPreview exampleId={id} />);
      const example = screen.getByRole("region", { name: `${name} section example` });
      expect(example.lastElementChild?.firstElementChild, name).toBeTruthy();
      unmount();
    }
  });

  it("uses supplied draft content, including legacy sections", () => {
    const { section } = createSectionExample("services");
    render(
      <LiveSectionPreview
        exampleId="services"
        section={{ ...section, sectionType: undefined, title: "Draft services" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Draft services" })).toBeTruthy();
  });

  it("shows each real block layout, persists it, and retains it in configuration-only templates", () => {
    const cases = [
      ["hero", "hero-centered"],
      ["hero", "hero-cover"],
      ["faq", "faq-stacked"],
      ["faq", "faq-reversed"],
      ["features", "features-bento"],
    ] as const;
    for (const [id, layout] of cases) {
      const sample = createSectionExample(id).section;
      const section = {
        ...sample,
        id: "custom-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as const,
        items: [],
        options: { ...sample.options, layout, mediaUrl: undefined },
      };
      const draft = { ...profile, customSections: [section] };
      const persisted = profileSchema.parse(JSON.parse(JSON.stringify(draft)));
      expect(persisted.customSections?.[0]?.options?.layout).toBe(layout);
      expect(createSectionTemplate(persisted, "Layout variant").sections[0]?.options?.layout).toBe(
        layout,
      );
      const { container, unmount } = render(
        <LiveSectionPreview exampleId={id} exampleLayout={layout} />,
      );
      expect(container.querySelector(`[data-section-layout="${layout}"]`)).toBeTruthy();
      unmount();
    }
    const incompatible = createSectionExample("services").section;
    expect(
      profileSchema.safeParse({
        ...profile,
        customSections: [
          {
            ...incompatible,
            id: "custom-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
            items: [],
            options: { layout: "hero-cover" },
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("keeps live providers and contact form submission disabled", () => {
    const { rerender, container } = render(<LiveSectionPreview exampleId="map" />);
    fireEvent.click(screen.getByRole("button", { name: /load location map/i }));
    expect(container.querySelector("iframe")).toBeNull();
    rerender(<LiveSectionPreview exampleId="youtube" />);
    fireEvent.click(screen.getByRole("button", { name: /load youtube video/i }));
    expect(container.querySelector("iframe")).toBeNull();
    rerender(<LiveSectionPreview exampleId="video" />);
    expect(container.querySelector("video")).toBeNull();
    rerender(<LiveSectionPreview exampleId="contact-form" />);
    expect(container.querySelector("form")).toBeNull();
  });
});
