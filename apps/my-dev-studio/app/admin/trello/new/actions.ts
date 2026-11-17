"use server";

import { revalidatePath } from "next/cache";

import {
  type BoardCreationState,
  parseBoardCreation,
  trelloBoardHref,
} from "@shared/trello/board-creation";
import { TrelloService } from "@shared/trello/service";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

import { trelloConfig } from "../_config";

export async function createTrelloBoard(
  _previous: BoardCreationState,
  form: FormData,
): Promise<BoardCreationState> {
  const admin = await requirePortfolioAdmin().catch(() => null);
  if (!admin) return { message: "Administrator access is required.", status: "error" };

  const config = trelloConfig();
  if (!config) return { message: "Trello is not connected.", status: "error" };

  const parsed = parseBoardCreation(form);
  if ("fields" in parsed) {
    return { fields: parsed.fields, message: "Check the highlighted fields.", status: "error" };
  }

  const { data, success } = await new TrelloService(config).boardService.createBoard({
    ...parsed.options,
    idOrganization: config.workspaceId,
  });
  if (!success || !data) {
    return {
      message: "Trello did not confirm creation. Check the board list before trying again.",
      status: "error",
    };
  }

  revalidatePath("/admin/trello");
  return {
    href: trelloBoardHref(data),
    name: parsed.options.name,
    status: "created",
    workspaceHref: `/admin/trello/boards/${encodeURIComponent(data.id)}`,
  };
}
