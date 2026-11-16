import { afterEach, describe, expect, it, vi } from "vitest";

import { TrelloBoardService } from "./TrelloBoard";
import { TrelloClient } from "./TrelloClient";

describe("Trello board requests", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("lists open boards for the connected member", async () => {
    const fetchBoard = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal("fetch", fetchBoard);
    const boards = new TrelloBoardService(new TrelloClient({ apiKey: "test", token: "test" }));

    await expect(boards.getBoards()).resolves.toMatchObject({ data: [], success: true });
    const url = new URL(fetchBoard.mock.calls[0]?.[0]);
    expect(url.pathname).toBe("/1/members/me/boards");
    expect(url.searchParams.get("filter")).toBe("open");
  });

  it("honors disabled starter lists and labels without a hard-coded workspace", async () => {
    const fetchBoard = vi.fn().mockResolvedValue(Response.json({ id: "board-id" }));
    vi.stubGlobal("fetch", fetchBoard);
    const boards = new TrelloBoardService(new TrelloClient({ apiKey: "test", token: "test" }));

    await expect(
      boards.createBoard({ defaultLabels: false, defaultLists: false, name: "Roadmap" }),
    ).resolves.toMatchObject({ success: true });
    const url = new URL(fetchBoard.mock.calls[0]?.[0]);
    expect(url.searchParams.get("defaultLists")).toBe("false");
    expect(url.searchParams.get("defaultLabels")).toBe("false");
    expect(url.searchParams.get("prefs_permissionLevel")).toBe("private");
    expect(url.searchParams.has("idOrganization")).toBe(false);
  });

  it("reports persistent rate limits after two retries", async () => {
    vi.useFakeTimers();
    const fetchBoard = vi.fn(() => Promise.resolve(new Response(null, { status: 429 })));
    vi.stubGlobal("fetch", fetchBoard);
    const boards = new TrelloBoardService(new TrelloClient({ apiKey: "test", token: "test" }));

    const request = boards.createBoard({ name: "Roadmap" });
    await vi.runAllTimersAsync();

    await expect(request).resolves.toMatchObject({ success: false });
    expect(fetchBoard).toHaveBeenCalledTimes(3);
  });
});
