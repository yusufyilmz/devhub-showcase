// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HomeFeaturesSection } from "./features";

describe("Homepage feature reveals", () => {
  afterEach(cleanup);
  it("opens details explicitly and closes them with Escape", () => {
    render(<HomeFeaturesSection />);
    const toggle = screen.getByRole("button", { name: "Show details for your own portfolio" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const details = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(details?.getAttribute("aria-hidden")).toBe("false");
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });
});
