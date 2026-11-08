// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NotificationNow } from "./assistant-utilities";

describe("shared Fitness notification action", () => {
  afterEach(cleanup);
  it("uses the app-supplied device callback only after an explicit action", async () => {
    const notify = vi.fn(async () => true);
    render(<NotificationNow notify={notify} />);
    expect(notify).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox", { name: "Notification message" }), {
      target: { value: "Fictional workout reminder" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send to this device" }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("shown on this device"),
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Fictional workout reminder",
        title: "My Fitness Studio",
        url: "/?view=Today",
      }),
    );
  });
  it("reports unavailable device permission instead of claiming success", async () => {
    render(<NotificationNow notify={vi.fn(async () => false)} />);
    fireEvent.click(screen.getByRole("button", { name: "Send to this device" }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("Allow notifications"),
    );
  });
});
