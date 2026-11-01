import { urls } from "@shared/config/urls";

import { TRELLO_ERRORS, TRELLO_SUCCESS_MESSAGES } from "../constants";
// Trello List Operations
import type { TrelloApiResponse, TrelloCard, TrelloList } from "../types";
import type { TrelloClient } from "./TrelloClient";

export class TrelloListService {
  constructor(private client: TrelloClient) {}

  // Get a specific list
  async getList(listId: string): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>("GET", urls.trello.list(listId));

      return {
        data: list,
        message: "List retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_NOT_FOUND);
    }
  }

  // Create a new list on a board
  async createList(
    boardId: string,
    name: string,
    pos?: string | number,
  ): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>(
        "POST",
        urls.trello.boardLists(boardId),
        {
          query: {
            name,
            pos: pos || "bottom",
          },
        },
      );

      return {
        data: list,
        message: TRELLO_SUCCESS_MESSAGES.LIST_CREATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_CREATION_FAILED);
    }
  }

  // Update a list
  async updateList(
    listId: string,
    updates: Partial<TrelloList>,
  ): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>("PUT", urls.trello.list(listId), {
        data: updates,
      });

      return {
        data: list,
        message: TRELLO_SUCCESS_MESSAGES.LIST_UPDATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  // Rename a list
  async renameList(listId: string, name: string): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>("PUT", urls.trello.listName(listId), {
        query: { value: name },
      });

      return {
        data: list,
        message: TRELLO_SUCCESS_MESSAGES.LIST_UPDATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  // Archive a list
  async archiveList(listId: string): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>(
        "PUT",
        urls.trello.listClosed(listId),
        {
          query: { value: true },
        },
      );

      return {
        data: list,
        message: "List archived successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  // Move list to different board
  async moveListToBoard(listId: string, boardId: string): Promise<TrelloApiResponse<TrelloList>> {
    try {
      const list = await this.client.makeRequest<TrelloList>(
        "PUT",
        urls.trello.listIdBoard(listId),
        {
          query: { value: boardId },
        },
      );

      return {
        data: list,
        message: "List moved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  // Get cards in a list
  async getCardsInList(listId: string): Promise<TrelloApiResponse<TrelloCard[]>> {
    try {
      const cards = await this.client.makeRequest<TrelloCard[]>(
        "GET",
        urls.trello.listCards(listId),
      );

      return {
        data: cards,
        message: "Cards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_NOT_FOUND);
    }
  }

  // Get cards in list with filters
  async getCardsInListWithFilter(
    listId: string,
    filter: "all" | "closed" | "none" | "open" | "visible" = "open",
  ): Promise<TrelloApiResponse<TrelloCard[]>> {
    try {
      const cards = await this.client.makeRequest<TrelloCard[]>(
        "GET",
        urls.trello.listCardsFilter(listId, filter),
      );

      return {
        data: cards,
        message: "Cards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_NOT_FOUND);
    }
  }

  // Move all cards from one list to another
  async moveAllCards(
    fromListId: string,
    toListId: string,
    boardId: string,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(
        "POST",
        urls.trello.listMoveAllCards(fromListId),
        {
          query: {
            idBoard: boardId,
            idList: toListId,
          },
        },
      );

      return {
        data: result,
        message: "All cards moved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  // Archive all cards in a list
  async archiveAllCards(listId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.listArchiveAllCards(listId));

      return {
        data: result,
        message: "All cards archived successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.LIST_UPDATION_FAILED);
    }
  }

  private handleError(error: unknown, defaultMessage: string): TrelloApiResponse<any> {
    let errorMessage = defaultMessage;

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        errorMessage = TRELLO_ERRORS.INVALID_CREDENTIALS;
      } else if (error.message.includes("403")) {
        errorMessage = TRELLO_ERRORS.INSUFFICIENT_PERMISSIONS;
      } else if (error.message.includes("404")) {
        errorMessage = TRELLO_ERRORS.LIST_NOT_FOUND;
      } else if (error.message.includes("429")) {
        errorMessage = TRELLO_ERRORS.RATE_LIMITED;
      }
    }

    return {
      error: errorMessage,
      message: defaultMessage,
      success: false,
    };
  }
}
