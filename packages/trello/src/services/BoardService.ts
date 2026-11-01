import { urls } from "@shared/config/urls";

// Client-side Trello service that routes all requests through our backend API
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

const boardUrls = urls.next.boards;

export class BoardService {
  private baseUrl: string;
  private config: TrelloServiceConfig;

  constructor(config: TrelloServiceConfig, baseUrl = "") {
    this.config = config;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<TrelloApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null as T, // Ensures type compatibility with TrelloApiResponse<T>
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          success: false,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : "Network error occurred",
        success: false,
      };
    }
  }

  // Board Operations
  async getBoards(): Promise<TrelloApiResponse<TrelloBoard[]>> {
    return this.makeRequest<TrelloBoard[]>(boardUrls.boards());
  }

  async getBoard(boardId: string): Promise<TrelloApiResponse<TrelloBoard>> {
    return this.makeRequest<TrelloBoard>(boardUrls.board(boardId));
  }

  async createBoard(options: CreateBoardOptions): Promise<TrelloApiResponse<TrelloBoard>> {
    return this.makeRequest<TrelloBoard>(boardUrls.boards(), {
      body: JSON.stringify({
        ...options,
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  async deleteBoard(boardId: string): Promise<TrelloApiResponse<boolean>> {
    return this.makeRequest<boolean>(boardUrls.board(boardId), {
      body: JSON.stringify({
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "DELETE",
    });
  }

  async getListsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloList[]>> {
    return this.makeRequest<TrelloList[]>(boardUrls.boardLists(boardId));
  }

  async getCardsOnBoard(boardId: string): Promise<TrelloApiResponse<TrelloCard[]>> {
    return this.makeRequest<TrelloCard[]>(boardUrls.boardCards(boardId));
  }

  // List Operations
  async getList(listId: string): Promise<TrelloApiResponse<TrelloList>> {
    return this.makeRequest<TrelloList>(boardUrls.list(listId));
  }

  async createList(
    boardId: string,
    name: string,
    pos?: string | number,
  ): Promise<TrelloApiResponse<TrelloList>> {
    return this.makeRequest<TrelloList>(boardUrls.lists(), {
      body: JSON.stringify({
        apiKey: this.config.apiKey,
        boardId,
        name,
        pos,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  async updateList(
    listId: string,
    updates: Partial<TrelloList>,
  ): Promise<TrelloApiResponse<TrelloList>> {
    return this.makeRequest<TrelloList>(boardUrls.list(listId), {
      body: JSON.stringify({
        ...updates,
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "PUT",
    });
  }

  async archiveList(listId: string): Promise<TrelloApiResponse<TrelloList>> {
    return this.makeRequest<TrelloList>(boardUrls.listArchive(listId), {
      body: JSON.stringify({
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  // Card Operations
  async getCard(cardId: string): Promise<TrelloApiResponse<TrelloCard>> {
    return this.makeRequest<TrelloCard>(boardUrls.card(cardId));
  }

  async createCard(
    listId: string,
    options: CreateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.makeRequest<TrelloCard>(boardUrls.cards(), {
      body: JSON.stringify({
        ...options,
        apiKey: this.config.apiKey,
        listId,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  async updateCard(
    cardId: string,
    options: UpdateCardOptions,
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.makeRequest<TrelloCard>(boardUrls.card(cardId), {
      body: JSON.stringify({
        ...options,
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "PUT",
    });
  }

  async deleteCard(cardId: string): Promise<TrelloApiResponse<boolean>> {
    return this.makeRequest<boolean>(boardUrls.card(cardId), {
      body: JSON.stringify({
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "DELETE",
    });
  }

  async moveCard(
    cardId: string,
    listId: string,
    position?: number | "top" | "bottom",
  ): Promise<TrelloApiResponse<TrelloCard>> {
    return this.makeRequest<TrelloCard>(boardUrls.cardMove(cardId), {
      body: JSON.stringify({
        apiKey: this.config.apiKey,
        listId,
        position,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  // Member Operations
  async getCurrentMember(): Promise<TrelloApiResponse<any>> {
    return this.makeRequest<any>(boardUrls.memberMe());
  }

  async getMember(memberId: string): Promise<TrelloApiResponse<any>> {
    return this.makeRequest<any>(boardUrls.member(memberId));
  }

  async getMemberBoards(memberId?: string): Promise<TrelloApiResponse<TrelloBoard[]>> {
    const endpoint = memberId ? boardUrls.memberBoards(memberId) : boardUrls.myBoards();
    return this.makeRequest<TrelloBoard[]>(endpoint);
  }

  async getBoardCustomFields(boardId: string): Promise<TrelloApiResponse<any[]>> {
    return this.makeRequest<any[]>(boardUrls.boardCustomFields(boardId));
  }

  async createCustomField(boardId: string, fieldData: any): Promise<TrelloApiResponse<any>> {
    return this.makeRequest<any>(boardUrls.boardCustomFields(boardId), {
      body: JSON.stringify({
        ...fieldData,
        apiKey: this.config.apiKey,
        token: this.config.token,
      }),
      method: "POST",
    });
  }

  async getCardCustomFields(cardId: string): Promise<TrelloApiResponse<any[]>> {
    return this.makeRequest<any[]>(boardUrls.cardCustomFields(cardId));
  }

  // Utility Methods
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(boardUrls.healthCheck());
      return response.success;
    } catch {
      return false;
    }
  }

  getConfig(): TrelloServiceConfig {
    return { ...this.config };
  }
}
