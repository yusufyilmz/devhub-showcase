// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  afterEach(cleanup);

  it("fills the same fraction of the track that it reports to assistive technology", () => {
    const { rerender } = render(<Progress aria-label="Upload" max={200} value={50} />);
    const progress = screen.getByRole("progressbar", { name: "Upload" });
    const indicator = progress.querySelector<HTMLElement>('[data-slot="progress-indicator"]');

    expect(progress.getAttribute("aria-valuemax")).toBe("200");
    expect(progress.getAttribute("aria-valuenow")).toBe("50");
    expect(indicator?.style.width).toBe("25%");

    rerender(<Progress aria-label="Upload" max={200} value={200} />);
    expect(progress.getAttribute("data-state")).toBe("complete");
    expect(indicator?.style.width).toBe("100%");

    rerender(<Progress aria-label="Upload" value={null} />);
    expect(progress.getAttribute("data-state")).toBe("indeterminate");
    expect(progress.hasAttribute("aria-valuenow")).toBe(false);
    expect(indicator?.style.width).toBe("0%");
  });
});
