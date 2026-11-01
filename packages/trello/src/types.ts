// Trello Module Types
export interface TrelloConfig {
  apiKey: string;
  token: string;
}

export interface TrelloBoard {
  closed: boolean;
  dateLastActivity: string;
  desc: string;
  id: string;
  lists?: TrelloList[];
  memberships?: TrelloBoardMembership[];
  name: string;
  prefs: {
    backgroundColor: string;
    backgroundImage?: string;
    permissionLevel: string;
  };
  shortLink?: string;
  shortUrl?: string;
  url: string;
}

export interface TrelloBoardMembership {
  id: string;
  idMember: string;
  memberType: "admin" | "normal" | "observer";
  unconfirmed: boolean;
}

export interface TrelloList {
  cards?: TrelloCard[];
  closed: boolean;
  id: string;
  idBoard: string;
  name: string;
  pos: number;
}

export interface TrelloCard {
  attachments: TrelloAttachment[];
  checklists: TrelloChecklist[];
  closed: boolean;
  customFieldItems?: TrelloCustomFieldItem[];
  dateLastActivity: string;
  desc: string;
  due?: string;
  dueComplete: boolean;
  id: string;
  idBoard: string;
  idList: string;
  labels: TrelloLabel[];
  members: TrelloMember[];
  name: string;
  pos: number;
  shortUrl: string;
  url: string;
}

export interface TrelloCustomField {
  display: {
    cardFront: boolean;
  };
  fieldGroup: string;
  id: string;
  idModel: string; // Board ID
  modelType: "board";
  name: string;
  options?: TrelloCustomFieldOption[];
  pos: number;
  type: "text" | "number" | "date" | "checkbox" | "list";
}

export interface TrelloCustomFieldOption {
  color: string;
  id: string;
  idCustomField: string;
  pos: number;
  value: {
    text: string;
  };
}

export interface TrelloCustomFieldItem {
  id: string;
  idCustomField: string;
  idModel: string; // Card ID
  idValue?: string;
  modelType: "card";
  value?: {
    text?: string;
    number?: string;
    date?: string;
    checked?: string;
  };
}

export interface TrelloLabel {
  color: string;
  id: string;
  idBoard: string;
  name: string;
}

export interface TrelloMember {
  avatarHash?: string;
  avatarUrl?: string;
  fullName: string;
  id: string;
  initials: string;
  username: string;
}

export interface TrelloChecklist {
  checkItems: TrelloCheckItem[];
  id: string;
  idBoard: string;
  idCard: string;
  name: string;
  pos: number;
}

export interface TrelloCheckItem {
  due?: string;
  id: string;
  name: string;
  pos: number;
  state: "complete" | "incomplete";
}

export interface TrelloAttachment {
  bytes?: number;
  date: string;
  id: string;
  mimeType?: string;
  name: string;
  previews?: TrelloAttachmentPreview[];
  url: string;
}

export interface TrelloAttachmentPreview {
  bytes: number;
  height: number;
  id: string;
  scaled: boolean;
  url: string;
  width: number;
}

export interface TrelloComment {
  date: string;
  id: string;
  memberCreator: {
    id: string;
    fullName: string;
    username: string;
  };
  text: string;
}

// Article Integration Custom Fields
export const ARTICLE_CUSTOM_FIELDS = {
  ARTICLE_ID: "Article ID",
  ARTICLE_LINK: "Article Link",
  ARTICLE_TITLE: "Article Title",
  CONVERTED_DATE: "Converted Date",
  CONVERTED_FROM: "Converted From",
} as const;

export interface ArticleCustomFields {
  articleId?: string;
  articleLink?: string;
  articleTitle?: string;
  convertedDate?: string;
  convertedFrom?: "article" | "trello";
}

export interface TrelloWebhook {
  active: boolean;
  callbackURL: string;
  description: string;
  id: string;
  idModel: string;
}

// API Response Types
export interface TrelloApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface TrelloBoardsResponse extends TrelloApiResponse<TrelloBoard[]> {}
export interface TrelloBoardResponse extends TrelloApiResponse<TrelloBoard> {}
export interface TrelloListsResponse extends TrelloApiResponse<TrelloList[]> {}
export interface TrelloCardsResponse extends TrelloApiResponse<TrelloCard[]> {}
export interface TrelloCardResponse extends TrelloApiResponse<TrelloCard> {}

// Component Props Types
export interface TrelloBoardCardProps {
  board: TrelloBoard;
  onBoardClick?: (board: TrelloBoard) => void;
  onBoardDelete?: (boardId: string) => void;
  onBoardEdit?: (board: TrelloBoard) => void;
  onBoardView?: (board: TrelloBoard) => void;
}

export interface TrelloListProps {
  list: TrelloList;
  onCardAdd?: (listId: string, cardName: string) => void;
  onListUpdate?: (list: TrelloList) => void;
}

export interface TrelloCardProps {
  card: TrelloCard;
  onCardClick?: (card: TrelloCard) => void;
  onCardDelete?: (cardId: string) => void;
  onCardUpdate?: (card: TrelloCard) => void;
}

// Hook Types
export interface UseTrelloBoardsOptions {
  autoFetch?: boolean;
  errorMessage?: string;
  onError?: (error: Error) => void;
  onSuccess?: (boards: TrelloBoard[]) => void;
  refreshInterval?: number;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

export interface UseTrelloBoardsReturn {
  boards: TrelloBoard[];
  createBoard: (name: string, description?: string) => Promise<TrelloBoard | null>;
  deleteBoard: (boardId: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export interface UseTrelloListsOptions {
  autoFetch?: boolean;
  boardId: string;
}

export interface UseTrelloListsReturn {
  createList: (name: string) => Promise<TrelloList | null>;
  error: string | null;
  lists: TrelloList[];
  loading: boolean;
  refetch: () => Promise<void>;
  updateList: (listId: string, updates: Partial<TrelloList>) => Promise<TrelloList | null>;
}

export interface UseTrelloCardsOptions {
  autoFetch?: boolean;
  listId: string;
}

export interface UseTrelloCardsReturn {
  cards: TrelloCard[];
  createCard: (name: string, description?: string) => Promise<TrelloCard | null>;
  deleteCard: (cardId: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
  updateCard: (cardId: string, updates: Partial<TrelloCard>) => Promise<TrelloCard | null>;
}

// Store Types
export interface TrelloLoadingState {
  boards: boolean;
  cards: boolean;
  creating: boolean;
  currentMember: boolean;
  deleting: boolean;
  lists: boolean;
  members: boolean;
  updating: boolean;
}

export interface TrelloStore {
  addBoard: (board: TrelloBoard) => void;
  addCard: (card: TrelloCard) => void;
  addList: (list: TrelloList) => void;
  // State
  boards: TrelloBoard[];
  cards: TrelloCard[];
  clearError: () => void;
  createBoard: (options: CreateBoardOptions) => Promise<TrelloBoard | null>;
  createCard: (listId: string, options: CreateCardOptions) => Promise<TrelloCard | null>;
  createList: (boardId: string, name: string, pos?: string | number) => Promise<TrelloList | null>;
  currentMember: TrelloMember | null;
  deleteBoard: (boardId: string) => Promise<boolean>;
  deleteCard: (cardId: string) => Promise<boolean>;
  error: string | null;
  fetchBoard: (boardId: string) => Promise<TrelloBoard | null>;
  fetchBoardCards: (boardId: string) => Promise<void>;
  fetchBoardLists: (boardId: string) => Promise<void>;

  // API Actions
  fetchBoards: () => Promise<void>;
  fetchCurrentMember: () => Promise<void>;
  fetchMemberBoards: (memberId?: string) => Promise<void>;
  getArticleMetadata: (cardId: string, boardId: string) => Promise<any | null>;

  // Custom Fields Actions
  getBoardCustomFields: (boardId: string) => Promise<any[]>;

  healthCheck: () => Promise<boolean>;
  lists: TrelloList[];
  loading: TrelloLoadingState;
  members: TrelloMember[];
  moveCard: (
    cardId: string,
    listId: string,
    position?: number | "top" | "bottom",
  ) => Promise<TrelloCard | null>;
  removeBoard: (boardId: string) => void;
  removeCard: (cardId: string) => void;
  removeList: (listId: string) => void;
  selectedBoard: TrelloBoard | null;
  selectedCard: TrelloCard | null;
  selectedList: TrelloList | null;
  setArticleMetadata: (cardId: string, boardId: string, articleData: any) => Promise<boolean>;

  // Basic Actions
  setBoards: (boards: TrelloBoard[]) => void;
  setCards: (cards: TrelloCard[]) => void;
  setCurrentMember: (member: TrelloMember | null) => void;
  setLists: (lists: TrelloList[]) => void;
  setLoading: (key: keyof TrelloLoadingState, loading: boolean) => void;
  setMembers: (members: TrelloMember[]) => void;
  setSelectedBoard: (board: TrelloBoard | null) => void;
  setSelectedCard: (card: TrelloCard | null) => void;
  setSelectedList: (list: TrelloList | null) => void;
  showError: (error: string | null) => void;
  updateBoard: (boardId: string, updates: Partial<TrelloBoard>) => void;
  updateBoardApi: (boardId: string, updates: Partial<TrelloBoard>) => Promise<TrelloBoard | null>;
  updateCard: (cardId: string, updates: Partial<TrelloCard>) => void;
  updateCardApi: (cardId: string, options: UpdateCardOptions) => Promise<TrelloCard | null>;
  updateList: (listId: string, updates: Partial<TrelloList>) => void;
  updateListApi: (listId: string, updates: Partial<TrelloList>) => Promise<TrelloList | null>;
}

// Service Types
export interface TrelloServiceConfig {
  apiKey: string;
  token: string;
  // baseUrl?: string
}

export interface CreateBoardOptions {
  defaultLabels?: boolean;
  defaultLists?: boolean;
  desc?: string;
  keepFromSource?: string;
  name: string;
  powerUps?: string;
  prefs_background?: string;
  prefs_cardAging?: "regular" | "pirate";
  prefs_cardCovers?: boolean;
  prefs_comments?: "disabled" | "members" | "observers" | "org" | "public";
  prefs_invitations?: "members" | "admins";
  prefs_permissionLevel?: "private" | "org" | "public";
  prefs_selfJoin?: boolean;
  prefs_voting?: "disabled" | "members" | "observers" | "org" | "public";
}

export interface CreateCardOptions {
  desc?: string;
  due?: string;
  dueComplete?: boolean;
  fileSource?: File;
  idCardSource?: string;
  idLabels?: string[];
  idMembers?: string[];
  keepFromSource?: string;
  name: string;
  pos?: number | "top" | "bottom";
  urlSource?: string;
}

export interface UpdateCardOptions {
  closed?: boolean;
  desc?: string;
  due?: string;
  dueComplete?: boolean;
  idAttachmentCover?: string;
  idBoard?: string;
  idLabels?: string[];
  idList?: string;
  idMembers?: string[];
  name?: string;
  pos?: number | "top" | "bottom";
  subscribed?: boolean;
}
