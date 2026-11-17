// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { TrelloBoard, TrelloCard, TrelloList } from "../../types";
import { TrelloBoardWorkspace } from "./TrelloBoardWorkspace";

const board: TrelloBoard = {
  closed: false,
  dateLastActivity: "",
  desc: "",
  id: "board",
  name: "Release",
  prefs: { backgroundColor: "", permissionLevel: "private" },
  url: "",
};
const lists: TrelloList[] = [
  { closed: false, id: "todo", idBoard: board.id, name: "To do", pos: 1 },
  { closed: false, id: "done", idBoard: board.id, name: "Done", pos: 2 },
];
const card: TrelloCard = {
  attachments: [],
  checklists: [],
  closed: false,
  dateLastActivity: "",
  desc: "",
  dueComplete: false,
  id: "card",
  idBoard: board.id,
  idList: "todo",
  labels: [],
  members: [],
  name: "Write release notes",
  pos: 1,
  shortUrl: "",
  url: "",
};

describe("Trello workspace", () => {
  afterEach(cleanup);

  it("opens a card from its button, loads comments and sends edited details", async () => {
    const action = vi.fn().mockResolvedValue({ ok: true });
    const readComments = vi.fn().mockResolvedValue({
      comments: [
        { date: "", id: "comment", memberCreator: { fullName: "Alex" }, text: "Ready for review" },
      ],
    });
    render(
      <TrelloBoardWorkspace
        action={action}
        board={board}
        cards={[card]}
        lists={lists}
        readComments={readComments}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: card.name }));
    expect(await screen.findByText("Ready for review")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Publish release notes" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(action).toHaveBeenCalledWith({
      cardId: card.id,
      desc: "",
      name: "Publish release notes",
      type: "editCard",
    });
  });

  it("moves the dragged card to the destination column", async () => {
    const action = vi.fn().mockResolvedValue({ ok: true });
    render(
      <TrelloBoardWorkspace
        action={action}
        board={board}
        cards={[card]}
        lists={lists}
        readComments={vi.fn()}
      />,
    );
    fireEvent.drop(screen.getByRole("heading", { name: "Done" }), {
      dataTransfer: { getData: () => card.id },
    });
    await waitFor(() =>
      expect(action).toHaveBeenCalledWith({ cardId: card.id, listId: "done", type: "moveCard" }),
    );
  });
});
