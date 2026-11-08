// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { RevisionHistory } from "./editor";

describe("restore reviewed saved work", () => {
  afterEach(cleanup);
  it("requires inspection and explicit restore, and refuses a stale draft", async () => {
    const load = vi.fn().mockResolvedValue({
      currentRevision: 3,
      retention: { count: 20, days: 90 },
      revisions: [{ created_at: "2026-11-03", revision: 1 }],
    });
    const older = { ...profile, title: "Earlier title" };
    const read = vi.fn().mockResolvedValue({
      createdAt: "2026-11-03",
      currentRevision: 3,
      profile: older,
      revision: 1,
    });
    const onChange = vi.fn();
    const props = { load, onChange, profile, read, revision: 3 };
    const view = render(<RevisionHistory {...props} />);
    await waitFor(() =>
      expect(screen.getByRole("combobox").closest("fieldset")?.disabled).toBe(false),
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect revision" }));
    await screen.findByRole("button", { name: "Restore reviewed revision to draft" });
    expect(onChange).not.toHaveBeenCalled();
    view.rerender(
      <RevisionHistory {...props} profile={{ ...profile, title: "New local title" }} />,
    );
    expect(
      screen
        .getByRole("button", { name: "Restore reviewed revision to draft" })
        .hasAttribute("disabled"),
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Inspect revision" }));
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Restore reviewed revision to draft" })
          .hasAttribute("disabled"),
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "Restore reviewed revision to draft" }));
    expect(onChange).toHaveBeenCalledWith(older);
    expect(profile.title).not.toBe("Earlier title");
  });
});
