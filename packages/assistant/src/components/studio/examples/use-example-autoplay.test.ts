// @vitest-environment jsdom
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useExampleAutoplay } from "./use-example-autoplay";

function createTrack() {
  const list = document.createElement("ul");
  const first = document.createElement("li");
  const second = document.createElement("li");
  list.append(first, second);
  Object.defineProperties(list, {
    clientWidth: { value: 300 },
    scrollWidth: { value: 600 },
  });
  Object.defineProperty(second, "offsetLeft", { value: 300 });
  list.scrollBy = vi.fn();
  list.scrollTo = vi.fn();
  return list;
}

describe("useExampleAutoplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private readonly callback: IntersectionObserverCallback) {}
        observe() {
          this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
        }
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("advances one card every six seconds and loops at the end", () => {
    const list = createTrack();
    renderHook(() => useExampleAutoplay({ current: list }, 2, false));

    vi.advanceTimersByTime(5999);
    expect(list.scrollBy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(list.scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: 300 });

    list.scrollLeft = 300;
    vi.advanceTimersByTime(6000);
    expect(list.scrollTo).toHaveBeenCalledWith({ behavior: "smooth", left: 0 });
  });

  it("pauses on request and respects reduced motion after resuming", () => {
    const list = createTrack();
    const track = { current: list };
    const { rerender } = renderHook(({ paused }) => useExampleAutoplay(track, 2, paused), {
      initialProps: { paused: true },
    });
    vi.advanceTimersByTime(6000);
    expect(list.scrollBy).not.toHaveBeenCalled();

    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduced-motion") }));
    rerender({ paused: false });
    vi.advanceTimersByTime(6000);
    expect(list.scrollBy).not.toHaveBeenCalled();
  });
});
