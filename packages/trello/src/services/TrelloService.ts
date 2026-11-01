import { createComponentLogger } from "@shared/utils/client-logger";

import { DEFAULT_TRELLO_CONFIG } from "../constants";
// Main Trello Service - Orchestrates all Trello operations
import type {
  CreateBoardOptions,
  CreateCardOptions,
  TrelloApiResponse,
  TrelloBoard,
  TrelloCard,
  TrelloList,
  TrelloServiceConfig,
  UpdateCardOptions,
} from "../types";
import { TrelloBoardService } from "./TrelloBoard";
import { TrelloCardService } from "./TrelloCard";
import { TrelloClient } from "./TrelloClient";
// import { TrelloCustomFieldsService } from './TrelloCustomFields'
import { TrelloListService } from "./TrelloList";
import { TrelloMemberService } from "./TrelloMember";

const logger = createComponentLogger("TrelloService");

export class TrelloService {
  private client: TrelloClient;
  readonly boardService: TrelloBoardService;
  readonly listService: TrelloListService;
  readonly cardService: TrelloCardService;
  readonly memberService: TrelloMemberService;
  // readonly customFieldsService: TrelloCustomFieldsService

  constructor(config: TrelloServiceConfig = DEFAULT_TRELLO_CONFIG) {
    logger.info("🏗️ Initializing TrelloService", {
      apiKeyLength: config.apiKey?.length || 0,
      hasApiKey: !!config.apiKey,
      hasToken: !!config.token,
      isDefaultConfig: config === DEFAULT_TRELLO_CONFIG,
      timestamp: new Date().toISOString(),
      tokenLength: config.token?.length || 0,
    });

    this.client = new TrelloClient(config);

    // Initialize service modules
    this.boardService = new TrelloBoardService(this.client);
    this.listService = new TrelloListService(this.client);
    this.cardService = new TrelloCardService(this.client);
    this.memberService = new TrelloMemberService(this.client);
    // this.customFieldsService = new TrelloCustomFieldsService(this.client)

    logger.info("✅ TrelloService initialized successfully", {
      servicesInitialized: ["boards", "lists", "cards", "members", "customFields"],
      timestamp: new Date().toISOString(),
    });
  }

  // Convenience methods that delegate to the appropriate service

  // Board Operations
  async getBoards(): Promise<TrelloApiResponse<TrelloBoard[]>> {
    logger.info("📋 TrelloService.getBoards() - Delegating to boards service");
    const result = await this.boardService.getBoards();

    logger.info("📋 TrelloService.getBoards() - Result received", {
      dataLength: Array.isArray(result.data) ? result.data.length : "N/A",
      dataType: Array.isArray(result.data) ? "array" : typeof result.data,
      error: result.error || null,
      hasData: !!result.data,
      success: result.success,
    });

    return result;
  }

  async getBoard(boardId: string): Promise<TrelloApiResponse<TrelloBoard>> {
    return this.boardService.getBoard(boardId);
  }

  async createBoard(options: CreateBoardOptions): Promise<TrelloApiResponse<TrelloBoard>> {
    return this.boardService.createBoard(options);
  }

  async deleteBoard(boardId: string): Promise<TrelloApiResponse<boolean>> {
    return this.boardService.deleteBoard(boardId);
  }

  async getListsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloList[]>> {
    return this.boardService.getListsOnBoard(boardId);
  }

  async getCardsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloCard[]>> {
    return this.boardService.getCardsOnBoard(boardId);
  }

  async getCard(cardId: string): Promise<TrelloApiResponse<TrelloCard>> {
    return this.cardService.getCard(cardId);
  }

  // List Operations
  async createList(
    boardId: string,
    name: string,
    pos?: string | number,
  ): Promise<TrelloApiResponse<TrelloList>> {
    return this.listService.createList(boardId, name, pos);
  }

  async updateList(
    listId: string,
    updates: Partial<TrelloList>,
  ): Promise<TrelloApiResponse<TrelloList>> {
    return this.listService.updateList(listId, updates);
  }

  // Card Operations
  async createCard(
    listId: string,
    options: CreateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.cardService.createCard(listId, options);
  }

  async updateCard(
    cardId: string,
    options: UpdateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.cardService.updateCard(cardId, options);
  }

  async deleteCard(cardId: string): Promise<TrelloApiResponse<boolean>> {
    return this.cardService.deleteCard(cardId);
  }

  async moveCard(
    cardId: string,
    listId: string,
    position?: number | "top" | "bottom",
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.cardService.moveCard(cardId, listId, position);
  }

  // Member Operations
  async getCurrentMember(): Promise<TrelloApiResponse<any>> {
    return this.memberService.getCurrentMember();
  }

  async getMember(memberId: string): Promise<TrelloApiResponse<any>> {
    return this.memberService.getMember(memberId);
  }

  async getMemberBoards(memberId?: string): Promise<TrelloApiResponse<any[]>> {
    return this.memberService.getMemberBoards(memberId);
  }

  async addMemberToBoard(
    boardId: string,
    memberId: string,
    type: "normal" | "admin" | "observer" = "normal",
  ): Promise<TrelloApiResponse<any>> {
    return this.boardService.addMemberToBoard(boardId, memberId, type);
  }

  // Label Operations
  async getBoardLabels(boardId: string): Promise<TrelloApiResponse<any[]>> {
    return this.boardService.getBoardLabels(boardId);
  }

  async addLabelToBoard(
    boardId: string,
    name: string,
    color: string,
  ): Promise<TrelloApiResponse<any>> {
    return this.boardService.addLabelToBoard(boardId, name, color);
  }

  // Webhook Operations (using client directly)
  async createWebhook(
    callbackURL: string,
    idModel: string,
    description?: string,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const config = this.client.getConfig();
      const webhook = await this.client.makeRequest("POST", `/tokens/${config.token}/webhooks`, {
        data: {
          callbackURL,
          description: description || "Webhook",
          idModel,
        },
      });

      return {
        data: webhook,
        message: "Webhook created successfully",
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to create webhook",
        message: "Failed to create webhook",
        success: false,
      };
    }
  }

  async deleteWebhook(webhookId: string): Promise<TrelloApiResponse<boolean>> {
    try {
      await this.client.makeRequest("DELETE", `/webhooks/${webhookId}`);

      return {
        data: true,
        message: "Webhook deleted successfully",
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to delete webhook",
        message: "Failed to delete webhook",
        success: false,
      };
    }
  }

  // Custom request method for advanced usage
  async makeCustomRequest(
    method: string,
    path: string,
    params?: any,
  ): Promise<TrelloApiResponse<any>> {
    try {
      const result = await this.client.makeRequest(method as any, path, params);

      return {
        data: result,
        message: "Request completed successfully",
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        message: "Request failed",
        success: false,
      };
    }
  }

  // Configuration Methods
  updateConfig(newConfig: Partial<TrelloServiceConfig>): void {
    this.client.updateConfig(newConfig);
  }

  getConfig(): TrelloServiceConfig {
    return this.client.getConfig();
  }

  // // Custom Fields Operations
  // async enableCustomFieldsPowerUp(
  //   boardId: string,
  //   powerUpType: string
  // ): Promise<TrelloApiResponse<any>> {
  //   return this.customFieldsService.enableCustomFieldsPowerUp(boardId, powerUpType)
  // }

  // async getBoardCustomFields(boardId: string): Promise<TrelloApiResponse<any[]>> {
  //   return this.customFieldsService.getBoardCustomFields(boardId)
  // }

  // async createCustomField(boardId: string, fieldData: any): Promise<TrelloApiResponse<any>> {
  //   return this.customFieldsService.createCustomField(boardId, fieldData)
  // }

  // async getCardCustomFields(cardId: string): Promise<TrelloApiResponse<any[]>> {
  //   return this.customFieldsService.getCardCustomFields(cardId)
  // }

  // async setCardCustomFieldValue(
  //   cardId: string,
  //   customFieldId: string,
  //   value: any
  // ): Promise<TrelloApiResponse<any>> {
  //   return this.customFieldsService.setCardCustomFieldValue(cardId, customFieldId, value)
  // }

  // async setCardCustomFields(cardId: string, customFields: any[]): Promise<TrelloApiResponse<any>> {
  //   return this.customFieldsService.setCardCustomFields(cardId, customFields)
  // }

  // async clearCardCustomFieldValue(
  //   cardId: string,
  //   customFieldId: string
  // ): Promise<TrelloApiResponse<any>> {
  //   return this.customFieldsService.clearCardCustomFieldValue(cardId, customFieldId)
  // }

  // Health Check
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }
}
