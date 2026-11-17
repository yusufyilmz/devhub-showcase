import type { TrelloComment } from "./types";

type Details = { name: string; desc: string };

export type BoardCommand =
  | ({ type: "editBoard" } & Details)
  | { type: "deleteBoard" }
  | { type: "addList"; name: string }
  | ({ type: "addCard"; listId: string } & Details)
  | ({ type: "editCard"; cardId: string } & Details)
  | { type: "deleteCard"; cardId: string }
  | { type: "moveCard"; cardId: string; listId: string; beforeCardId?: string }
  | { type: "addComment"; cardId: string; text: string };

export type BoardCommandResult =
  | { ok: true; comment?: TrelloComment }
  | { ok: false; error: string };
export type BoardCommentsResult = { comments: TrelloComment[] } | { error: string };
