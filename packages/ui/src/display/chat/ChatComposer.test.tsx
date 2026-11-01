// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChatComposer } from "./ChatComposer";

describe("ChatComposer", () => {
  afterEach(cleanup);
  it("uses an accessible icon action and keeps Shift+Enter for multiline messages", () => {
    const submit = vi.fn();
    render(<ChatComposer onChange={vi.fn()} onSubmit={submit} value="Refine my summary" />);
    const input = screen.getByRole("textbox", { name: "Your message" });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(submit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(submit).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Send message" }).textContent).toBe("");
  });
  it("does not submit when allowance is disabled and exposes a working stop action", () => {
    const submit = vi.fn();
    const stop = vi.fn();
    const { rerender } = render(
      <ChatComposer disabled onChange={vi.fn()} onSubmit={submit} value="Question" />,
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(submit).not.toHaveBeenCalled();
    rerender(<ChatComposer busy onChange={vi.fn()} onStop={stop} onSubmit={submit} value="" />);
    fireEvent.click(screen.getByRole("button", { name: "Stop generating" }));
    expect(stop).toHaveBeenCalledOnce();
  });
});
