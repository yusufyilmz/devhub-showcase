import { urls } from "@shared/config/urls";

import { TRELLO_ERRORS, TRELLO_SUCCESS_MESSAGES } from "../constants";
// Trello Card Operations
import type { CreateCardOptions, TrelloApiResponse, TrelloCard, UpdateCardOptions } from "../types";
import type { TrelloClient } from "./TrelloClient";

export class TrelloCardService {
  constructor(private client: TrelloClient) {}

  // Get a specific card
  async getCard(cardId: string): Promise<TrelloApiResponse<TrelloCard>> {
    try {
      const card = await this.client.makeRequest<TrelloCard>("GET", urls.trello.card(cardId), {
        query: {
          actions: "commentCard",
          attachments: true,
          checklists: "all",
          labels: true,
          members: true,
          memberships: true,
        },
      });

      return {
        data: card,
        message: "Card retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_NOT_FOUND);
    }
  }

  // Create a new card
  async createCard(
    listId: string,
    options: CreateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    try {
      const cardData: any = {
        desc: options.desc || "",
        idList: listId,
        name: options.name,
        pos: options.pos || "bottom",
      };

      if (options.due) cardData.due = options.due;
      if (options.idMembers) cardData.idMembers = options.idMembers.join(",");
      if (options.idLabels) cardData.idLabels = options.idLabels.join(",");
      if (options.urlSource) cardData.urlSource = options.urlSource;

      const card = await this.client.makeRequest<TrelloCard>("POST", urls.trello.cards(), {
        query: cardData,
      });

      return {
        data: card,
        message: TRELLO_SUCCESS_MESSAGES.CARD_CREATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_CREATION_FAILED);
    }
  }

  // Update a card
  async updateCard(
    cardId: string,
    options: UpdateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    try {
      const updates: any = {};

      if (options.name !== undefined) updates.name = options.name;
      if (options.desc !== undefined) updates.desc = options.desc;
      if (options.closed !== undefined) updates.closed = options.closed;
      if (options.idList !== undefined) updates.idList = options.idList;
      if (options.pos !== undefined) updates.pos = options.pos;
      if (options.due !== undefined) updates.due = options.due;
      if (options.dueComplete !== undefined) updates.dueComplete = options.dueComplete;

      const card = await this.client.makeRequest<TrelloCard>("PUT", urls.trello.card(cardId), {
        data: updates,
      });

      return {
        data: card,
        message: TRELLO_SUCCESS_MESSAGES.CARD_UPDATED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Delete a card
  async deleteCard(cardId: string): Promise<TrelloApiResponse<boolean>> {
    try {
      await this.client.makeRequest("DELETE", urls.trello.card(cardId));

      return {
        data: true,
        message: TRELLO_SUCCESS_MESSAGES.CARD_DELETED,
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_DELETION_FAILED);
    }
  }

  // Move card to different list
  async moveCard(
    cardId: string,
    listId: string,
    position?: number | "top" | "bottom",
  ): Promise<TrelloApiResponse<TrelloCard>> {
    try {
      const updates: any = { idList: listId };
      if (position !== undefined) {
        updates.pos = position;
      }

      const card = await this.client.makeRequest<TrelloCard>("PUT", urls.trello.card(cardId), {
        data: updates,
      });

      return {
        data: card,
        message: "Card moved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Add member to card
  async addMemberToCard(cardId: string, memberId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.cardMembers(cardId), {
        query: { value: memberId },
      });

      return {
        data: result,
        message: "Member added to card successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Remove member from card
  async removeMemberFromCard(cardId: string, memberId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(
        "DELETE",
        urls.trello.cardMember(cardId, memberId),
      );

      return {
        data: result,
        message: "Member removed from card successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Add label to card
  async addLabelToCard(cardId: string, labelId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.cardLabels(cardId), {
        data: { value: labelId },
      });

      return {
        data: result,
        message: "Label added to card successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Remove label from card
  async removeLabelFromCard(cardId: string, labelId: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(
        "DELETE",
        urls.trello.cardLabel(cardId, labelId),
      );

      return {
        data: result,
        message: "Label removed from card successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
    }
  }

  // Add comment to card
  async addCommentToCard(cardId: string, text: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.cardActions(cardId), {
        query: { text },
      });

      return {
        data: result,
        message: "Comment added successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_CREATION_FAILED);
    }
  }

  // Add attachment to card
  async addAttachmentToCard(
    cardId: string,
    url: string,
    name?: string,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const attachmentData: any = { url };
      if (name) attachmentData.name = name;

      const result = await this.client.makeRequest("POST", urls.trello.cardAttachments(cardId), {
        query: attachmentData,
      });

      return {
        data: result,
        message: "Attachment added successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_CREATION_FAILED);
    }
  }

  // Get card attachments
  async getCardAttachments(cardId: string): Promise<TrelloApiResponse<any[]>> {
    try {
      const attachments = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.cardAttachments(cardId),
      );

      return {
        data: attachments,
        message: "Attachments retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_NOT_FOUND);
    }
  }

  // Add checklist to card
  async addChecklistToCard(cardId: string, name: string): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest("POST", urls.trello.cardChecklists(cardId), {
        query: { name },
      });

      return {
        data: result,
        message: "Checklist added successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_CREATION_FAILED);
    }
  }

  // Get card checklists
  async getCardChecklists(cardId: string): Promise<TrelloApiResponse<any[]>> {
    try {
      const checklists = await this.client.makeRequest<any[]>(
        "GET",
        urls.trello.cardChecklists(cardId),
      );

      return {
        data: checklists,
        message: "Checklists retrieved successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_NOT_FOUND);
    }
  }

  // Set due date on card
  async setDueDate(cardId: string, due: string | null): Promise<TrelloApiResponse<TrelloCard>> {
    try {
      const card = await this.client.makeRequest<TrelloCard>("PUT", urls.trello.cardDue(cardId), {
        query: { value: due },
      });

      return {
        data: card,
        message: "Due date updated successfully",
        success: true,
      };
    } catch (error) {
      return this.handleError(error, TRELLO_ERRORS.CARD_UPDATION_FAILED);
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
        errorMessage = TRELLO_ERRORS.CARD_NOT_FOUND;
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
