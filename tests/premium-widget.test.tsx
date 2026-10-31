// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { PortfolioChat } from "../packages/components/src/portfolio-chat";

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
  expect(field.getAttribute("maxlength")).toBe("2000");
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
