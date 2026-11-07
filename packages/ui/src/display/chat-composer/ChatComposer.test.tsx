// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChatComposer } from "./ChatComposer";

describe("ChatComposer", () => {
  afterEach(cleanup);
  it("listens on input focus and returns to idle after blur or stopping", () => {
    const props = {
      companion: { agent: "fitness" as const },
      onChange: vi.fn(),
      onSubmit: vi.fn(),
      value: "",
    };
    const { rerender } = render(<ChatComposer {...props} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(screen.getByRole("img", { name: "Assistant: listening" })).toBeTruthy();
    fireEvent.blur(input);
    expect(screen.getByRole("img", { name: "Assistant: idle" })).toBeTruthy();
    rerender(<ChatComposer {...props} busy onStop={vi.fn()} />);
    expect(screen.getByRole("img", { name: "Assistant: thinking" })).toBeTruthy();
    rerender(<ChatComposer {...props} />);
    expect(screen.getByRole("img", { name: "Assistant: idle" })).toBeTruthy();
  });
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
