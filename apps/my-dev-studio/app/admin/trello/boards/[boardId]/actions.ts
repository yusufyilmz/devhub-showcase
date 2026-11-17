"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";

import type { BoardCommand, BoardCommandResult, BoardCommentsResult } from "@shared/trello/pages";
import type { TrelloService } from "@shared/trello/service";

import { boardIdPattern, openBoard } from "./_access";

const id = z.string().regex(boardIdPattern);
const name = z.string().trim().min(1).max(100);
const details = { desc: z.string().trim().max(1000), name };
const commandSchema = z.discriminatedUnion("type", [
  z.object({ ...details, type: z.literal("editBoard") }),
  z.object({ type: z.literal("deleteBoard") }),
  z.object({ name, type: z.literal("addList") }),
  z.object({ ...details, listId: id, type: z.literal("addCard") }),
  z.object({ ...details, cardId: id, type: z.literal("editCard") }),
  z.object({ cardId: id, type: z.literal("deleteCard") }),
  z.object({ beforeCardId: id.optional(), cardId: id, listId: id, type: z.literal("moveCard") }),
  z.object({ cardId: id, text: z.string().trim().min(1).max(1000), type: z.literal("addComment") }),
]);

async function onBoard(service: TrelloService, boardId: string, command: BoardCommand) {
  const [card, list] = await Promise.all([
    "cardId" in command ? service.getCard(command.cardId) : null,
    "listId" in command ? service.listService.getList(command.listId) : null,
  ]);
  return (
    (!card || (card.success && card.data?.idBoard === boardId && !card.data.closed)) &&
    (!list || (list.success && list.data?.idBoard === boardId && !list.data.closed))
  );
}

async function moveCard(
  service: TrelloService,
  boardId: string,
  command: Extract<BoardCommand, { type: "moveCard" }>,
) {
  const { beforeCardId, cardId, listId } = command;
  if (!beforeCardId) return service.moveCard(cardId, listId, "bottom");
  const cards = await service.getCardsOnBoard(boardId);
  if (!cards.success || !Array.isArray(cards.data)) return { success: false };
  const column = cards.data
    .filter((card) => card.id !== cardId && card.idList === listId && !card.closed)
    .sort((left, right) => left.pos - right.pos);
  const index = column.findIndex(({ id }) => id === beforeCardId);
  const target = column[index];
  if (!target) return { success: false };
  const previous = column[index - 1];
  if (!previous) return service.moveCard(cardId, listId, "top");
  const position = previous.pos + (target.pos - previous.pos) / 2;
  if (!Number.isFinite(position) || position <= previous.pos || position >= target.pos) {
    return { success: false };
  }
  return service.moveCard(cardId, listId, position);
}

async function apply(
  service: TrelloService,
  boardId: string,
  command: Exclude<BoardCommand, { type: "addComment" }>,
) {
  switch (command.type) {
    case "editBoard":
      return service.boardService.updateBoard(boardId, { desc: command.desc, name: command.name });
    case "deleteBoard":
      return service.boardService.permanentlyDeleteBoard(boardId);
    case "addList":
      return service.createList(boardId, command.name, "bottom");
    case "addCard":
      return service.createCard(command.listId, { desc: command.desc, name: command.name });
    case "editCard":
      return service.updateCard(command.cardId, { desc: command.desc, name: command.name });
    case "deleteCard":
      return service.deleteCard(command.cardId);
    case "moveCard":
      return moveCard(service, boardId, command);
  }
}

export async function updateBoard(
  boardId: string,
  input: BoardCommand,
): Promise<BoardCommandResult> {
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { error: "Check the required fields and their lengths.", ok: false };
  const access = await openBoard(boardId);
  if (!access) return { error: "This board is not available to you.", ok: false };
  if (!access.ok) return access;
  const { service } = access;
  const command = parsed.data;
  if (!(await onBoard(service, boardId, command))) {
    return { error: "This card or list is no longer available on this board.", ok: false };
  }
  if (command.type === "addComment") {
    const response = await service.cardService.addCommentToCard(command.cardId, command.text);
    return response.success && response.data
      ? { comment: response.data, ok: true }
      : {
          error: "Trello could not confirm the comment. Reload comments before retrying.",
          ok: false,
        };
  }
  const result = await apply(service, boardId, command);
  if (!result.success) {
    return {
      error: "Trello could not confirm the change. Check the board and the token’s permissions.",
      ok: false,
    };
  }
  revalidatePath("/admin/trello");
  revalidatePath(`/admin/trello/boards/${boardId}`);
  if (command.type === "deleteBoard") redirect("/admin/trello");
  return { ok: true };
}

export async function readComments(boardId: string, cardId: string): Promise<BoardCommentsResult> {
  if (!id.safeParse(cardId).success) return { error: "Invalid card." };
  const access = await openBoard(boardId);
  if (!access?.ok) return { error: "Could not access this board." };
  const card = await access.service.getCard(cardId);
  if (!card.success || card.data?.idBoard !== boardId || card.data.closed) {
    return { error: "This card is no longer available on this board." };
  }
  const result = await access.service.cardService.getComments(cardId);
  return result.success && result.data
    ? { comments: result.data }
    : { error: "Could not load Trello comments." };
}
