// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { authorableSectionTypes } from "@shared/config";

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
