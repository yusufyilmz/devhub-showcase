// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LibraryPicker } from "./library-picker";

describe("Homepage section picker", () => {
  afterEach(cleanup);
  it("shows only the selected preview and keeps button names concise", () => {
    render(
      <LibraryPicker
        items={[
          {
            content: <p>Services example</p>,
            description: "What you offer",
            id: "services",
            title: "Services",
          },
          {
            content: <p>Timeline example</p>,
            description: "Your journey",
            id: "timeline",
            title: "Timeline",
          },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Services section example" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Timeline section example" })).toBeNull();
    const timeline = screen.getByRole("button", { name: "Timeline" });
    fireEvent.click(timeline);
    expect(timeline.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("region", { name: "Timeline section example" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Services section example" })).toBeNull();
  });
});
