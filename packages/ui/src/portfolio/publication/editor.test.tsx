// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { PublicationControls } from "./editor";

describe("explicit saved revision publication", () => {
  afterEach(cleanup);
  it("blocks dirty drafts and requires a separate confirmation", async () => {
    const load = vi.fn().mockResolvedValue({
      currentRevision: 3,
      published: { revision: 1, updated_at: "", username: "old-public-name" },
    });
    const change = vi.fn().mockResolvedValue(undefined);
    const onChanged = vi.fn();
    const props = { change, dirty: true, disabled: false, load, onChanged, profile, revision: 3 };
    const view = render(<PublicationControls {...props} />);
    await screen.findByRole("link", { name: "Open published portfolio ↗" });
    expect(screen.getByRole("link").getAttribute("href")).toBe("/old-public-name");
    expect(
      screen.getByRole("button", { name: "Review publication" }).hasAttribute("disabled"),
    ).toBe(true);
    view.rerender(<PublicationControls {...props} dirty={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Review publication" }));
    expect(screen.getByText("Review website snapshot changes")).toBeTruthy();
    expect(screen.getByText("Review public CV snapshot changes")).toBeTruthy();
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm publication" }));
    await waitFor(() => expect(onChanged).toHaveBeenCalledWith(true));
    expect(change).toHaveBeenCalledWith(true, 3);
  });
  it("invalidates status after conflicts so retry requires a refresh", async () => {
    const load = vi.fn().mockResolvedValue({ currentRevision: 3, published: null });
    const change = vi.fn().mockRejectedValue(new Error("Another revision was saved"));
    render(
      <PublicationControls
        change={change}
        dirty={false}
        disabled={false}
        load={load}
        onChanged={vi.fn()}
        profile={profile}
        revision={3}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Review publication" }).hasAttribute("disabled"),
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "Review publication" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm publication" }));
    await screen.findByRole("alert");
    expect(
      screen.getByRole("button", { name: "Review publication" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});
