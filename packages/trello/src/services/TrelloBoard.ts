import { urls } from "@shared/config/urls";
import { createComponentLogger } from "@shared/utils/client-logger";

import { ORGANIZATION_ID, TRELLO_ERRORS, TRELLO_SUCCESS_MESSAGES } from "../constants";
// Trello Board Operations
import type {
  CreateBoardOptions,
  TrelloApiResponse,
  TrelloBoard,
  TrelloCard,
  TrelloList,
} from "../types";
import type { TrelloClient } from "./TrelloClient";

const logger = createComponentLogger("TrelloBoardService");

const MEMBER_ID = "yusufyilmaz92";

export class TrelloBoardService {
  constructor(private client: TrelloClient) {}

  // Get all boards for the authenticated user
  async getBoards(): Promise<TrelloApiResponse<TrelloBoard[]>> {
    logger.info("🔍 TrelloBoardService.getBoards() - Starting request", {
      endpoint: `/members/${MEMBER_ID}/boards`,
      memberId: MEMBER_ID,
      timestamp: new Date().toISOString(),
    });

    try {
      const boards = await this.client.makeRequest<TrelloBoard[]>(
        "GET",
        urls.trello.memberBoards(MEMBER_ID),
      );

      const first = Array.isArray(boards) && boards.length > 0 ? boards[0] : undefined;
      logger.info("✅ TrelloBoardService.getBoards() - Success", {
        boardCount: Array.isArray(boards) ? boards.length : 0,
        dataType: Array.isArray(boards) ? "array" : typeof boards,
        firstBoardId: first?.id ?? null,
        firstBoardName: first?.name ?? null,
      });

      return {
        data: boards,
        message: "Boards retrieved successfully",
        success: true,
      };
    } catch (error) {
      logger.error("❌ TrelloBoardService.getBoards() - Error", {
        endpoint: `/members/${MEMBER_ID}/boards`,
        error: error instanceof Error ? error.message : String(error),
        memberId: MEMBER_ID,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Get a specific board by ID
  async getBoard(boardId: string): Promise<TrelloApiResponse<TrelloBoard>> {
    try {
      const board = await this.client.makeRequest<TrelloBoard>("GET", urls.trello.board(boardId), {
        query: {
          cards: "visible",
          lists: "open",
          members: "all",
          memberships: "all",
        },
      });

      return {
        data: board,
        message: "Board retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Create a new board
  async createBoard(options: CreateBoardOptions): Promise<TrelloApiResponse<TrelloBoard>> {
    try {
      const board = await this.client.makeRequest<TrelloBoard>("POST", urls.trello.boards(), {
        query: {
          defaultLabels: options.defaultLabels || true,
          defaultLists: options.defaultLists || true,
          desc: options.desc || "",
          idOrganization: ORGANIZATION_ID,
          name: options.name,
          prefs_permissionLevel: options.prefs_permissionLevel || "private",
        },
      });

      return {
        data: board,
        message: TRELLO_SUCCESS_MESSAGES.BOARD_CREATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Update a board
  async updateBoard(
    boardId: string,
    updates: Partial<TrelloBoard>,
  ): Promise<TrelloApiResponse<TrelloBoard>> {
    try {
      const board = await this.client.makeRequest<TrelloBoard>("PUT", urls.trello.board(boardId), {
        data: updates,
      });

      return {
        data: board,
        message: TRELLO_SUCCESS_MESSAGES.BOARD_UPDATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Delete (close) a board
  async deleteBoard(boardId: string): Promise<TrelloApiResponse<boolean>> {
    try {
      await this.client.makeRequest("PUT", urls.trello.board(boardId), {
        data: { closed: true },
      });

      return {
        data: true,
        message: TRELLO_SUCCESS_MESSAGES.BOARD_DELETED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Get lists on a board
  async getListsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloList[]>> {
    try {
      const lists = await this.client.makeRequest<TrelloList[]>(
        "GET",
        urls.trello.boardLists(boardId),
      );

      return {
        data: lists,
        message: "Lists retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Get cards on a board
  async getCardsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloCard[]>> {
    try {
      const cards = await this.client.makeRequest<TrelloCard[]>(
        "GET",
        urls.trello.boardCards(boardId),
      );

      return {
        data: cards,
        message: "Cards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Get board members
  async getBoardMembers(boardId: string): Promise<TrelloApiResponse<any[]>> {
    try {
      const members = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.boardMembers(boardId),
      );

      return {
        data: members,
        message: "Members retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Add member to board
  async addMemberToBoard(
    boardId: string,
    memberId: string,
    type: "normal" | "admin" | "observer" = "normal",
  ): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(
        "PUT",
        urls.trello.boardMember(boardId, memberId),
        {
          data: { type },
        },
      );

      return {
        data: result,
        message: "Member added successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Get board labels
  async getBoardLabels(boardId: string): Promise<TrelloApiResponse<any[]>> {
    try {
      const labels = await this.client.makeRequest<any[]>("GET", urls.trello.boardLabels(boardId));

      return {
        data: labels,
        message: "Labels retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
    }
  }

  // Add label to board
  async addLabelToBoard(
    boardId: string,
    name: string,
    color: string,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.boardLabels(boardId), {
        data: { color, name },
      });

      return {
        data: result,
        message: "Label added successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.BOARD_NOT_FOUND);
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
        errorMessage = TRELLO_ERRORS.NOT_FOUND;
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
