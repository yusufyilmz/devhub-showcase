// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { BoardCreationState } from "../../board-creation";
import { TrelloBoardCreateForm } from "./TrelloBoardCreateForm";

describe("Trello board creation form", () => {
  afterEach(cleanup);

  it("keeps the draft after failure, then offers the created board", async () => {
    const create = vi
      .fn<(_: BoardCreationState, form: FormData) => Promise<BoardCreationState>>()
      .mockResolvedValueOnce({
        fields: { name: "Choose a name." },
        message: "Check the fields.",
        status: "error",
      })
      .mockResolvedValueOnce({
        href: "https://trello.com/b/abc",
        name: "Roadmap",
        status: "created",
      });

    render(<TrelloBoardCreateForm action={create} boardsHref="/studio/trello" />);
    const name = screen.getByRole("textbox", { name: "Board name" });
    fireEvent.change(name, { target: { value: "Roadmap" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Starting layout" }), {
      target: { value: "blank" },
    });
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Create board" })));
    expect(screen.getByText("Choose a name.")).toBeDefined();
    expect(document.activeElement).toBe(name);
    expect((name as HTMLInputElement).value).toBe("Roadmap");
    expect(create.mock.calls[0]?.[1].get("layout")).toBe("blank");

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Create board" })));
    expect(screen.getByRole("link", { name: "Open in Trello" }).getAttribute("href")).toBe(
      "https://trello.com/b/abc",
    );
    expect(screen.getByRole("link", { name: "Back to boards" }).getAttribute("href")).toBe(
      "/studio/trello",
    );
  });
});
