// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Section } from "./Section";
import { SectionFrame } from "./section-frame";
import { SectionHeading } from "./section-heading";

describe("SectionFrame", () => {
  afterEach(() => {
    cleanup();
  });

  it("preserves_heading_landmarks", () => {
    render(
      <>
        <SectionHeading
          description="A studio practice across product and brand."
          eyebrow="Profile"
          id="about-title"
          level={2}
          title="About"
        />
        <SectionHeading id="page-title" level={1} title="Home" />
        <SectionHeading id="note-title" level={3} title="Note" />
      </>,
    );

    const about = screen.getByRole("heading", { level: 2, name: "About" });
    expect(about.id).toBe("about-title");
    expect(screen.getByRole("heading", { level: 1, name: "Home" }).id).toBe("page-title");
    expect(screen.getByRole("heading", { level: 3, name: "Note" }).id).toBe("note-title");
    expect(screen.queryByRole("heading", { name: "Profile" })).toBeNull();
    expect(screen.getByText("A studio practice across product and brand.").tagName).toBe("P");
    expect(screen.queryByRole("heading", { name: "Legacy title" })).toBeNull();

    cleanup();
    render(
      <Section sectionId="legacy" subtitle="Still available" title="Legacy title">
        Legacy body
      </Section>,
    );
    const legacy = screen.getByRole("heading", { level: 2, name: "Legacy title" });
    expect(legacy.tagName).toBe("H2");
    expect(screen.getByText("Still available").tagName).toBe("P");
  });

  it("standalone_and_composed_keep_content", () => {
    render(
      <>
        <SectionFrame
          context="standalone"
          heading={<SectionHeading id="hero-title" level={2} title="Hero" />}
          id="hero"
          surface="plain"
          width="contained"
        >
          <p>Standalone introduction</p>
        </SectionFrame>
        <SectionFrame
          context="composed"
          heading={<SectionHeading id="about-title" level={2} title="About" />}
          id="about"
          surface="muted"
          width="reading"
        >
          <p>Composed biography</p>
        </SectionFrame>
      </>,
    );

    expect(screen.getByText("Standalone introduction")).toBeTruthy();
    expect(screen.getByText("Composed biography")).toBeTruthy();
    expect(document.getElementById("hero")?.getAttribute("data-section-context")).toBe(
      "standalone",
    );
    expect(document.getElementById("about")?.getAttribute("data-section-context")).toBe("composed");
    expect(document.getElementById("hero")?.tagName).toBe("SECTION");
    expect(document.getElementById("about")?.querySelector("p")?.textContent).toBe(
      "Composed biography",
    );
  });

  it("nested_controls_keep_accessible_names", () => {
    render(
      <SectionFrame
        context="composed"
        heading={
          <SectionHeading
            description="Write when you are ready."
            eyebrow="Contact"
            id="contact-title"
            level={2}
            title="Start a project"
          />
        }
        id="contact"
        surface="card"
        width="contained"
      >
        <form>
          <label htmlFor="visitor-name">Your name</label>
          <input id="visitor-name" />
          <button type="button">Send message</button>
        </form>
      </SectionFrame>,
    );

    expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Your name" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Start a project" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Start a project" })).toBeNull();
  });
});
