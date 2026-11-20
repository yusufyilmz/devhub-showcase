// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HomeChatLauncher } from "./chat-launcher";
import { chatLauncherStyles } from "./styles";

describe("HomeChatLauncher", () => {
  afterEach(cleanup);

  it("renders a transparent launcher with wrapping suggestion tags", () => {
    render(<HomeChatLauncher />);

    expect(chatLauncherStyles.panel).not.toContain("bg-popover");
    expect(chatLauncherStyles.panel).not.toContain("shadow-md");
    expect(chatLauncherStyles.suggestions).toContain("flex-wrap");

    const group = screen.getByRole("group", { name: "Starter prompts" });
    const choices = within(group).getAllByRole("button");
    expect(choices).toHaveLength(3);
    for (const choice of choices) {
      expect(choice.className).toContain("rounded-full");
      expect(choice.getAttribute("aria-pressed")).toBe("false");
    }
  });

  it("fills the chat composer when a suggestion tag is selected", () => {
    render(<HomeChatLauncher />);

    const suggestion = screen.getByRole("button", {
      name: "Refine my professional summary",
    });
    fireEvent.click(suggestion);

    expect(screen.getByRole("textbox", { name: "Your message" })).toHaveProperty(
      "value",
      "Refine my professional summary",
    );
    expect(suggestion.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Send message" }).hasAttribute("disabled")).toBe(
      false,
    );
  });
});
