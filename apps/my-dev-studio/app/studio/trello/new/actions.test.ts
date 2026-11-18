import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  config: vi.fn(),
  create: vi.fn(),
  guard: vi.fn(),
  revalidate: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/services/management/get-portfolios", () => ({
  requirePortfolioAdmin: mocks.guard,
}));
vi.mock("@/services/trello/get-config", () => ({ trelloConfig: mocks.config }));
vi.mock("@shared/trello/service", () => ({
  TrelloService: class {
    boardService = { createBoard: mocks.create };
  },
}));

import { createTrelloBoard } from "./actions";

describe("createTrelloBoard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.guard.mockResolvedValue({});
    mocks.config.mockReturnValue({ workspaceId: "workspace-id" });
  });

  it("rejects users without administrator access before calling Trello", async () => {
    mocks.guard.mockRejectedValue(new Error("Forbidden"));

    await expect(createTrelloBoard({ status: "idle" }, new FormData())).resolves.toMatchObject({
      status: "error",
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects whitespace names and oversized descriptions", async () => {
    const fields = new FormData();
    fields.set("name", "   ");
    fields.set("description", "x".repeat(1001));

    await expect(createTrelloBoard({ status: "idle" }, fields)).resolves.toMatchObject({
      fields: { description: expect.any(String), name: expect.any(String) },
      status: "error",
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("creates a private board with normalized fields and refreshes the directory", async () => {
    mocks.create.mockResolvedValue({
      data: { id: "a".repeat(24), shortLink: "ABC123" },
      success: true,
    });
    const fields = new FormData();
    fields.set("name", " Roadmap ");
    fields.set("description", " Next quarter ");
    fields.set("layout", "blank");
    fields.set("prefs_permissionLevel", "public");

    await expect(createTrelloBoard({ status: "idle" }, fields)).resolves.toEqual({
      href: "https://trello.com/b/ABC123",
      name: "Roadmap",
      status: "created",
      workspaceHref: `/studio/trello/boards/${"a".repeat(24)}`,
    });
    expect(mocks.create).toHaveBeenCalledWith({
      defaultLists: false,
      desc: "Next quarter",
      idOrganization: "workspace-id",
      name: "Roadmap",
      prefs_permissionLevel: "private",
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/studio/trello");
  });

  it("leaves the directory intact when Trello does not confirm creation", async () => {
    mocks.create.mockResolvedValue({ success: false });
    const fields = new FormData();
    fields.set("name", "Roadmap");

    await expect(createTrelloBoard({ status: "idle" }, fields)).resolves.toMatchObject({
      message: expect.stringContaining("Check the board list"),
      status: "error",
    });
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});
