// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AboutSection } from "../about-section/AboutSection";
import { TextSection } from "../text-section/TextSection";

const item = {
  body: "A paragraph that stays in the section.",
  id: "note",
  title: "Note",
  url: "",
};

describe("Intro section spacing", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps text content in a composed frame without an outer margin", () => {
    render(
      <TextSection
        section={{
          id: "custom-text",
          items: [item],
          options: { description: "A short introduction." },
          renderer: "text",
          title: "Notes",
          visible: true,
        }}
      />,
    );

    const frame = document.getElementById("custom-text");
    expect(frame?.getAttribute("data-section-context")).toBe("composed");
    expect(frame?.getAttribute("data-section-width")).toBe("reading");
    expect(frame?.className.includes("my-0")).toBe(true);
    expect(frame?.className.includes("py-14")).toBe(false);
    expect(screen.getByRole("heading", { level: 2, name: "Notes" })).toBeTruthy();
    expect(screen.getByText("A paragraph that stays in the section.")).toBeTruthy();
    expect(screen.getByText("A short introduction.").tagName).toBe("P");
  });

  it("hides an empty text section", () => {
    const { container } = render(
      <TextSection
        section={{
          id: "custom-empty",
          items: [],
          renderer: "text",
          title: "Empty",
          visible: true,
        }}
      />,
    );
    expect(container.childElementCount).toBe(0);
  });

  it("keeps the editorial about story beside its heading", () => {
    render(
      <AboutSection
        section={{
          id: "custom-about",
          items: [item, { ...item, body: "A second fact.", id: "fact", title: "Fact" }],
          options: { description: "Studio notes.", layout: "about-editorial" },
          renderer: "cards",
          title: "About",
          visible: true,
        }}
      />,
    );

    const frame = document.getElementById("custom-about");
    expect(frame?.getAttribute("data-section-layout")).toBe("about-editorial");
    expect(frame?.className.includes("py-xl")).toBe(false);
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Note" })).toBeTruthy();
    expect(screen.getByText("A second fact.")).toBeTruthy();
  });
});
