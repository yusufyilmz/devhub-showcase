import { urls } from "@shared/config/urls";

import { TRELLO_ERRORS } from "../constants";
// Trello Member Operations
import type { TrelloApiResponse } from "../types";
import type { TrelloClient } from "./TrelloClient";

const MEMBER_ID = "yusufyilmaz92";

export class TrelloMemberService {
  constructor(private client: TrelloClient) {}

  // Get current authenticated member
  async getCurrentMember(): Promise<TrelloApiResponse<any>> {
    try {
      const member = await this.client.makeRequest("GET", urls.trello.memberMe());

      return {
        data: member,
        message: "Member retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member by ID
  async getMember(memberId: string): Promise<TrelloApiResponse<any>> {
    try {
      const member = await this.client.makeRequest("GET", urls.trello.member(memberId));

      return {
        data: member,
        message: "Member retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member's boards
  async getMemberBoards(memberId = MEMBER_ID): Promise<TrelloApiResponse<any[]>> {
    try {
      const boards = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.memberBoards(memberId),
      );

      return {
        data: boards,
        message: "Member boards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member's cards
  async getMemberCards(memberId = MEMBER_ID): Promise<TrelloApiResponse<any[]>> {
    try {
      const cards = await this.client.makeRequest<any[]>("GET", urls.trello.memberCards(memberId));

      return {
        data: cards,
        message: "Member cards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member's organizations
  async getMemberOrganizations(memberId = MEMBER_ID): Promise<TrelloApiResponse<any[]>> {
    try {
      const organizations = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.memberOrganizations(memberId),
      );

      return {
        data: organizations,
        message: "Member organizations retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Update member information
  async updateMember(
    memberId: string,
    updates: Record<string, any>,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const member = await this.client.makeRequest("PUT", urls.trello.member(memberId), {
        data: updates,
      });

      return {
        data: member,
        message: "Member updated successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member's notifications
  async getMemberNotifications(memberId = MEMBER_ID): Promise<TrelloApiResponse<any[]>> {
    try {
      const notifications = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.memberNotifications(memberId),
      );

      return {
        data: notifications,
        message: "Notifications retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Search members
  async searchMembers(query: string, limit = 8): Promise<TrelloApiResponse<any[]>> {
    try {
      const members = await this.client.makeRequest<any[]>("GET", urls.trello.searchMembers(), {
        query: {
          limit: limit.toString(),
          query,
        },
      });

      return {
        data: members,
        message: "Members search completed successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Get member's starred boards
  async getMemberStarredBoards(memberId = MEMBER_ID): Promise<TrelloApiResponse<any[]>> {
    try {
      const starredBoards = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.memberStarredBoards(memberId),
      );

      return {
        data: starredBoards,
        message: "Starred boards retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Star a board
  async starBoard(
    boardId: string,
    pos: string | number = "bottom",
  ): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.memberMeBoardStars(), {
        query: {
          idBoard: boardId,
          pos: pos.toString(),
        },
      });

      return {
        data: result,
        message: "Board starred successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
    }
  }

  // Unstar a board
  async unstarBoard(boardStarId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(
        "DELETE",
        urls.trello.memberMeBoardStar(boardStarId),
      );

      return {
        data: result,
        message: "Board unstarred successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.MEMBER_NOT_FOUND);
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
