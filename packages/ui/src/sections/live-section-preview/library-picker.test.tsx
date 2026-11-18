// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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
  it("shows the complete list and filters it without mounting other previews", () => {
    render(
      <LibraryPicker
        items={[
          {
            content: <p>Services preview</p>,
            description: "What you offer",
            id: "services",
            title: "Services",
          },
          {
            content: <p>Spanish</p>,
            description: "Spoken languages",
            id: "languages",
            title: "Languages",
          },
          { content: <p>Studio reel</p>, description: "Show a film", id: "video", title: "Video" },
        ]}
      />,
    );
    const list = screen.getByRole("group", { name: "Section examples" });
    expect(within(list).getAllByRole("button")).toHaveLength(3);
    fireEvent.change(screen.getByRole("searchbox", { name: "Filter live section examples" }), {
      target: { value: "spoken" },
    });
    fireEvent.click(within(list).getByRole("button", { name: "Languages" }));
    expect(screen.getByRole("region", { name: "Languages section example" })).toBeTruthy();
    expect(screen.queryByText("Studio reel")).toBeNull();
    fireEvent.change(screen.getByRole("searchbox", { name: "Filter live section examples" }), {
      target: { value: "" },
    });
    expect(within(list).getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("region", { name: "Languages section example" })).toBeTruthy();
  });
});
