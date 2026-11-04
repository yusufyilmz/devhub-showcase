// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PortfolioChat } from "..";

describe("PremiumWidget", () => {
  beforeEach(() => {
    sessionStorage.clear();
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
  });
  afterEach(cleanup);
  it("opens a labeled dialog, submits bounded questions and renders plain text answers", async () => {
    const send = vi.fn().mockResolvedValue("<script>inert text</script>");
    render(<PortfolioChat identity="alpha" name="Alex" revision={1} send={send} />);
    fireEvent.click(screen.getByRole("button", { name: "Ask about Alex" }));
    const field = screen.getByLabelText("Your question");
    expect((field as HTMLInputElement).maxLength).toBe(2000);
    fireEvent.change(field, { target: { value: "Skills?" } });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Send question" }).hasAttribute("disabled")).toBe(
        false,
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    await waitFor(() => expect(screen.getByText("<script>inert text</script>")).toBeTruthy());
    expect(document.querySelector("script")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    expect(screen.queryByText("<script>inert text</script>")).toBeNull();
  });
  it("does not reuse another portfolio or revision history", async () => {
    sessionStorage.setItem(
      "mydevstudio:premium-chat:v1:other:1",
      JSON.stringify([{ id: "x", role: "user", text: "Other person's question" }]),
    );
    render(<PortfolioChat identity="alpha" name="Alex" revision={2} send={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Ask about Alex" }));
    await screen.findByLabelText("Your question");
    expect(screen.queryByText("Other person's question")).toBeNull();
  });
  it("shows only an opaque support reference and never the raw upstream error", async () => {
    const reference = "11111111-1111-4111-8111-111111111111";
    const send = vi
      .fn()
      .mockRejectedValue(new Error(`private prompt secret Reference: ${reference}`));
    render(<PortfolioChat identity="alpha" name="Alex" revision={2} send={send} />);
    fireEvent.click(screen.getByRole("button", { name: "Ask about Alex" }));
    fireEvent.change(await screen.findByLabelText("Your question"), {
      target: { value: "Skills?" },
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Send question" }).hasAttribute("disabled")).toBe(
        false,
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    expect(await screen.findByText(new RegExp(reference))).toBeTruthy();
    expect(screen.queryByText(/private prompt secret/)).toBeNull();
  });
});
