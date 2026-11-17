import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ guard: vi.fn(), refresh: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.refresh }));
vi.mock("@/features/management/managed-portfolios", () => ({ requirePortfolioAdmin: mocks.guard }));
vi.mock("../../_config", () => ({ trelloConfig: () => ({ apiKey: "fixture", token: "fixture" }) }));

import { readComments, updateBoard } from "./actions";

const boardId = "a".repeat(24);
const cardId = "b".repeat(24);
const listId = "c".repeat(24);
const foreignBoard = "d".repeat(24);
const firstCardId = "e".repeat(24);
const secondCardId = "f".repeat(24);
const comment = { data: { text: "Looks good" }, date: "2026-11-17", id: "comment" };

function trelloFixture(cardBoard = boardId) {
  const fetchTrello = vi.fn(async (input: string, options: RequestInit) => {
    const { pathname } = new URL(input);
    if (pathname === "/1/members/me/boards") return Response.json([{ closed: false, id: boardId }]);
    if (pathname === `/1/cards/${cardId}` && options.method === "GET") {
      return Response.json({ idBoard: cardBoard });
    }
    if (pathname === `/1/lists/${listId}`) return Response.json({ idBoard: boardId });
    if (pathname === `/1/boards/${boardId}/cards`) {
      return Response.json([
        { id: firstCardId, idList: listId, pos: 100 },
        { id: secondCardId, idList: listId, pos: 200 },
      ]);
    }
    if (pathname.endsWith("/actions")) return Response.json([comment]);
    if (pathname.endsWith("/actions/comments")) return Response.json(comment);
    return Response.json({});
  });
  vi.stubGlobal("fetch", fetchTrello);
  return fetchTrello;
}

describe("Studio Trello board actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.guard.mockResolvedValue({});
  });
  afterEach(() => vi.unstubAllGlobals());

  it("does not contact Trello for a user without administrator access", async () => {
    const fetchTrello = trelloFixture();
    mocks.guard.mockRejectedValue(new Error("Forbidden"));
    await expect(updateBoard(boardId, { type: "deleteBoard" })).resolves.toMatchObject({
      ok: false,
    });
    expect(fetchTrello).not.toHaveBeenCalled();
  });

  it("rejects a card from another board before attempting a move", async () => {
    const fetchTrello = trelloFixture(foreignBoard);
    await expect(updateBoard(boardId, { cardId, listId, type: "moveCard" })).resolves.toMatchObject(
      { ok: false },
    );
    expect(fetchTrello.mock.calls.every(([, request]) => request.method === "GET")).toBe(true);
  });

  it("moves a card and revalidates the workspace", async () => {
    const fetchTrello = trelloFixture();
    await expect(updateBoard(boardId, { cardId, listId, type: "moveCard" })).resolves.toEqual({
      ok: true,
    });
    expect(fetchTrello.mock.calls.at(-1)?.[1]).toMatchObject({
      body: JSON.stringify({ idList: listId, pos: "bottom" }),
      method: "PUT",
    });
    expect(mocks.refresh).toHaveBeenCalledWith(`/admin/trello/boards/${boardId}`);
  });

  it("loads and posts comments for a card on the selected board", async () => {
    const fetchTrello = trelloFixture();
    await expect(readComments(boardId, cardId)).resolves.toMatchObject({
      comments: [{ text: "Looks good" }],
    });
    await expect(
      updateBoard(boardId, { cardId, text: " Looks good ", type: "addComment" }),
    ).resolves.toMatchObject({
      comment: { text: "Looks good" },
      ok: true,
    });
    const [request, options] = fetchTrello.mock.calls.at(-1) ?? [];
    expect(new URL(request ?? "").pathname).toBe(`/1/cards/${cardId}/actions/comments`);
    expect(options?.method).toBe("POST");
  });

  it("places a card before the target using positions from Trello", async () => {
    const fetchTrello = trelloFixture();
    await expect(
      updateBoard(boardId, {
        beforeCardId: secondCardId,
        cardId,
        listId,
        type: "moveCard",
      }),
    ).resolves.toEqual({ ok: true });
    expect(fetchTrello.mock.calls.at(-1)?.[1]).toMatchObject({
      body: JSON.stringify({ idList: listId, pos: 150 }),
      method: "PUT",
    });
  });
});
