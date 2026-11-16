// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { StudioRequestContext } from "@shared/runtime/studio";

import { CreatePortfolio } from "./create-portfolio";

const navigation = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => navigation }));

describe("CreatePortfolio dialog", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("browses without creating and preserves the draft after a failed create", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ error: "Username is already taken." }, { status: 409 }),
      )
      .mockResolvedValueOnce(Response.json({ id: "new-portfolio" }));
    render(
      <StudioRequestContext.Provider value={request}>
        <CreatePortfolio />
      </StudioRequestContext.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Create a portfolio" }));
    const dialog = screen.getByRole("dialog", { name: "New managed portfolio" });
    fireEvent.change(within(dialog).getByLabelText("Section example"), {
      target: { value: "faq" },
    });
    expect(within(dialog).getByRole("region", { name: "FAQ section example" })).toBeTruthy();
    expect(request).not.toHaveBeenCalled();
    fireEvent.change(within(dialog).getByLabelText("Name", { exact: true }), {
      target: { value: "Alex Morgan" },
    });
    fireEvent.change(within(dialog).getByLabelText("Username", { exact: true }), {
      target: { value: "alex-morgan" },
    });
    const submit = within(dialog).getByRole("button", { name: "Create private portfolio" });
    fireEvent.submit(submit.closest("form")!);
    await within(dialog).findByRole("alert");
    expect(request).toHaveBeenCalledTimes(1);
    expect((within(dialog).getByLabelText("Name", { exact: true }) as HTMLInputElement).value).toBe(
      "Alex Morgan",
    );
    fireEvent.submit(submit.closest("form")!);
    await waitFor(() =>
      expect(navigation.push).toHaveBeenCalledWith("/admin/portfolios/new-portfolio"),
    );
    expect(request).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
