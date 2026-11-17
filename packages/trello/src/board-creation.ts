import type { CreateBoardOptions, TrelloBoard } from "./types";

export const BOARD_NAME_LIMIT = 100;
export const BOARD_DESCRIPTION_LIMIT = 1000;

type BoardFields = Partial<Record<"name" | "description", string>>;

export type BoardCreationState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: BoardFields }
  | { status: "created"; name: string; href: string | null; workspaceHref?: string };

export function parseBoardCreation(
  form: FormData,
): { options: CreateBoardOptions } | { fields: BoardFields } {
  const name = form.get("name");
  const description = form.get("description");
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedDescription = typeof description === "string" ? description.trim() : "";
  const fields: BoardFields = {};

  if (!trimmedName) fields.name = "Enter a board name.";
  else if (trimmedName.length > BOARD_NAME_LIMIT) {
    fields.name = `Use ${BOARD_NAME_LIMIT} characters or fewer.`;
  }
  if (trimmedDescription.length > BOARD_DESCRIPTION_LIMIT) {
    fields.description = `Use ${BOARD_DESCRIPTION_LIMIT} characters or fewer.`;
  }
  if (fields.name || fields.description) return { fields };

  return {
    options: {
      defaultLists: form.get("layout") === "starter",
      desc: trimmedDescription || undefined,
      name: trimmedName,
      prefs_permissionLevel: "private",
    },
  };
}

export function trelloBoardHref(board: Pick<TrelloBoard, "shortLink" | "shortUrl" | "url">) {
  if (board.shortLink && /^[a-zA-Z0-9]+$/.test(board.shortLink)) {
    return `https://trello.com/b/${board.shortLink}`;
  }
  for (const candidate of [board.shortUrl, board.url]) {
    const url = candidate ? URL.parse(candidate) : null;
    if (url?.origin === "https://trello.com" && /^\/b\/[a-zA-Z0-9]+(?:\/|$)/.test(url.pathname)) {
      return `https://trello.com${url.pathname}`;
    }
  }
  return null;
}
