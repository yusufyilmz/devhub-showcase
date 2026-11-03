// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { WorkMedia } from "./work-media";

describe("media consent and recovery", () => {
  afterEach(cleanup);
  it("keeps an original link before consent, on provider failure and after unloading", () => {
    const view = render(<WorkMedia title="Demo film" youtubeId="M7lc1UVf-VE" />);
    expect(view.container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    );
    fireEvent.click(screen.getByRole("button", { name: "Load YouTube video: Demo film" }));
    const frame = view.container.querySelector("iframe")!;
    expect(frame.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/M7lc1UVf-VE");
    fireEvent.load(frame);
    expect(screen.getByRole("status").textContent).toContain("unavailable or blocked");
    expect(screen.getByRole("link")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Unload video" }));
    expect(view.container.querySelector("iframe")).toBeNull();
    view.rerender(<WorkMedia title="Unsafe" youtubeId="https://evil.test/embed" />);
    expect(view.container.querySelector("iframe")).toBeNull();
  });
  it("replaces broken images with readable context and does not inject social scripts", () => {
    const view = render(
      <WorkMedia
        imageUrl="/missing.png"
        sourceUrl="https://www.instagram.com/p/ABC_123/?tracking=1"
        title="Portrait"
      />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("status").textContent).toContain("Image unavailable");
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "https://www.instagram.com/p/ABC_123/",
    );
    expect(view.container.querySelector("script, iframe")).toBeNull();
    view.rerender(
      <WorkMedia sourceUrl="https://www.pinterest.com/pin/123456/" title="Collection" />,
    );
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "https://www.pinterest.com/pin/123456/",
    );
    view.rerender(<WorkMedia sourceUrl="https://instagram.com.evil.test/p/ABC/" title="Invalid" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
