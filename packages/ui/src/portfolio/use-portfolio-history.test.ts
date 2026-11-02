// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { usePortfolioHistory } from "./use-portfolio-history";

describe("portfolio session history", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });
  it("restores deletion, clears redo on a new edit and resets after save/discard", () => {
    const { result } = renderHook(() => usePortfolioHistory(profile));
    act(() => result.current.setDraft((p) => ({ ...p, projects: [] })));
    act(() => result.current.undo());
    expect(result.current.draft.projects).toEqual(profile.projects);
    act(() => result.current.redo());
    expect(result.current.draft.projects).toEqual([]);
    act(() => result.current.undo());
    act(() => result.current.setDraft((p) => ({ ...p, title: "New role" })));
    expect(result.current.canRedo).toBe(false);
    act(() => result.current.resetDraft(profile));
    expect(result.current.canUndo).toBe(false);
  });
  it("groups typing in one field into one reversible action", () => {
    const input = document.createElement("input");
    document.body.append(input);
    input.focus();
    const { result } = renderHook(() => usePortfolioHistory(profile));
    act(() => {
      result.current.setDraft((p) => ({ ...p, title: "A" }));
      result.current.setDraft((p) => ({ ...p, title: "AB" }));
    });
    act(() => result.current.undo());
    expect(result.current.draft.title).toBe(profile.title);
    act(() => result.current.redo());
    expect(result.current.draft.title).toBe("AB");
  });
  it("disables history shortcuts while saving", () => {
    const { result, rerender } = renderHook(
      ({ disabled }) => usePortfolioHistory(profile, disabled),
      { initialProps: { disabled: false } },
    );
    act(() => result.current.setDraft((p) => ({ ...p, title: "Changed" })));
    rerender({ disabled: true });
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "z" })));
    expect(result.current.draft.title).toBe("Changed");
  });
});
