import { TrelloService } from "@shared/trello/service";

import { requirePortfolioAdmin } from "@/services/management/get-portfolios";
import { trelloConfig } from "@/services/trello/get-config";

export const boardIdPattern = /^[a-f0-9]{24}$/i;

export async function openBoard(boardId: string) {
  if (!boardIdPattern.test(boardId)) return null;
  const admin = await requirePortfolioAdmin().catch(() => null);
  const config = admin && trelloConfig();
  if (!config) return null;

  const service = new TrelloService(config);
  const { success, data } = await service.boardService.getBoards();
  if (!success)
    return { error: "Could not verify access to this Trello board.", ok: false as const };
  const board = data?.find(({ id, closed }) => id === boardId && !closed);
  return board ? { board, ok: true as const, service } : null;
}
