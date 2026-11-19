// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { DraftRecovery } from "./DraftRecovery";
import type { RecoveryController } from "./types";

function controller(): RecoveryController {
  return {
    candidate: null,
    conflict: vi.fn(),
    discard: vi.fn(),
    restore: vi.fn(),
    retry: vi.fn(),
    saved: vi.fn(),
    stale: false,
    status: "failed",
    stop: vi.fn(),
  };
}
describe("DraftRecovery", () => {
  afterEach(cleanup);
  it("makes failed writes retryable", () => {
    const recovery = controller();
    render(<DraftRecovery recovery={recovery} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry recovery save" }));
    expect(recovery.retry).toHaveBeenCalledOnce();
  });
  it("allows review but prevents restoring stale work or restoring during a save", () => {
    const recovery = controller();
    recovery.stale = true;
    recovery.candidate = {
      at: 100,
      revision: 1,
      value: { isPublic: false, profile, step: "details", tab: "Profile", username: "owner" },
      version: 1,
    };
    const view = render(<DraftRecovery recovery={recovery} />);
    expect(
      (screen.getByRole("button", { name: "Restore recovered draft" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.getByText("Review recovered work")).toBeDefined();
    view.rerender(<DraftRecovery disabled recovery={{ ...recovery, stale: false }} />);
    expect(
      (screen.getByRole("button", { name: "Restore recovered draft" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});
