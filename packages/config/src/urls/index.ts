import { stripTrailingSlash } from "@shared/utils";
// Base URLs (normalized, no trailing slash)
export const BASE_URLS = {
  api: stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL),
  public: stripTrailingSlash(process.env.NEXT_PUBLIC_PROJECT_URL || ""),
};

export const urls = {
  // Next.js internal API (frontend) – always relative
  auth: {
    google: () => "/api/auth/google",
    session: () => "/api/auth/session",
  },
  base: {
    api: BASE_URLS.api,
    public: BASE_URLS.public,
  },
  billing: {
    action: (action: "checkout" | "portal") => `/api/billing/${action}`,
    pricing: () => "/api/billing/pricing",
    root: () => "/api/billing",
    webhook: () => "/api/billing/webhook",
  },
  boards: {
    board: (boardId: string) => `/api/trello/boards/${boardId}`,
    boardCards: (boardId: string) => `/api/trello/boards/${boardId}/cards`,
    boardCustomFields: (boardId: string) => `/api/trello/boards/${boardId}/customFields`,
    boardLabels: (boardId: string) => `/api/trello/boards/${boardId}/labels`,
    boardLists: (boardId: string) => `/api/trello/boards/${boardId}/lists`,
    boardMember: (boardId: string, memberId: string) =>
      `/api/trello/boards/${boardId}/members/${memberId}`,
    boardMembers: (boardId: string) => `/api/trello/boards/${boardId}/members`,
    boards: () => "/api/trello/boards",
    card: (cardId: string) => `/api/trello/cards/${cardId}`,
    cardCustomFields: (cardId: string) => `/api/trello/cards/${cardId}/customFieldItems`,
    cardMove: (cardId: string) => `/api/trello/cards/${cardId}/move`,
    cards: () => "/api/trello/cards",
    healthCheck: () => "/api/trello/health",
    list: (listId: string) => `/api/trello/lists/${listId}`,
    listArchive: (listId: string) => `/api/trello/lists/${listId}/archive`,
    listArchiveAllCards: (listId: string) => `/api/trello/lists/${listId}/archiveAllCards`,
    listCards: (listId: string) => `/api/trello/lists/${listId}/cards`,
    listCardsFilter: (listId: string, filter: string) =>
      `/api/trello/lists/${listId}/cards/${filter}`,
    listClosed: (listId: string) => `/api/trello/lists/${listId}/closed`,
    listIdBoard: (listId: string) => `/api/trello/lists/${listId}/idBoard`,
    listMoveAllCards: (listId: string) => `/api/trello/lists/${listId}/moveAllCards`,
    listName: (listId: string) => `/api/trello/lists/${listId}/name`,
    lists: () => "/api/trello/lists",
    member: (memberId: string) => `/api/trello/members/${memberId}`,
    memberBoards: (memberId: string) => `/api/trello/members/${memberId}/boards`,
    memberCards: (memberId: string) => `/api/trello/members/${memberId}/cards`,
    memberMe: () => "/api/trello/members/me",
    myBoards: () => "/api/trello/members/me/boards",
  },

  external: {
    googlePeopleMe: () => "https://people.googleapis.com/v1/people/me",
  },
  fitness: {
    assistant: () => "/api/assistant",
    siteUrl: () => new URL(process.env.APP_URL || "https://myfitnessstudio.vercel.app").origin,
    state: () => "/api/state",
  },
  studio: {
    assistant: () => "/api/assistant",
    cv: () => "/api/cv",
    cvImport: () => "/api/cv-import",
    cvVariants: () => "/api/cv-variants",
    googleProfile: () => "/api/google-profile",
    interviewPrep: () => "/api/assistant/job",
    managed: () => "/api/managed",
    managedHistory: (id: string) => `/api/managed/${id}/history`,
    managedPortfolio: (id: string) => `/api/managed/${id}`,
    managedPublication: (id: string) => `/api/managed/${id}/publication`,
    managedTransfer: (id: string) => `/api/managed/${id}/transfer`,
    portfolioUrl: (username: string) => `${urls.base.public}/${encodeURIComponent(username)}`,
    profile: () => "/api/profile",
    profileHistory: () => "/api/profile-history",
    publication: () => "/api/publication",
    sectionTemplates: () => "/api/section-templates",
    siteUrl: () => new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mydevstudio.vercel.app"),
  },

  trello: {
    board: (boardId: string) => `/boards/${boardId}`,
    boardCards: (boardId: string) => `/boards/${boardId}/cards`,
    boardCustomFields: (boardId: string) => `/boards/${boardId}/customFields`,
    boardLabels: (boardId: string) => `/boards/${boardId}/labels`,
    boardLists: (boardId: string) => `/boards/${boardId}/lists`,
    boardMember: (boardId: string, memberId: string) => `/boards/${boardId}/members/${memberId}`,
    boardMembers: (boardId: string) => `/boards/${boardId}/members`,
    boards: () => "/boards",
    // Card endpoints
    card: (cardId: string) => `/cards/${cardId}`,
    cardActions: (cardId: string) => `/cards/${cardId}/actions/comments`,
    cardAttachments: (cardId: string) => `/cards/${cardId}/attachments`,
    cardChecklists: (cardId: string) => `/cards/${cardId}/checklists`,
    cardDue: (cardId: string) => `/cards/${cardId}/due`,
    cardLabel: (cardId: string, labelId: string) => `/cards/${cardId}/idLabels/${labelId}`,
    cardLabels: (cardId: string) => `/cards/${cardId}/idLabels`,
    cardMember: (cardId: string, memberId: string) => `/cards/${cardId}/members/${memberId}`,
    cardMembers: (cardId: string) => `/cards/${cardId}/members`,
    cardMove: (cardId: string) => `/cards/${cardId}/move`,
    cards: () => "/cards",
    healthCheck: () => "/health",

    // List endpoints
    list: (listId: string) => `/lists/${listId}`,
    listArchive: (listId: string) => `/lists/${listId}/archive`,
    listArchiveAllCards: (listId: string) => `/lists/${listId}/archiveAllCards`,
    listCards: (listId: string) => `/lists/${listId}/cards`,
    listCardsFilter: (listId: string, filter: string) => `/lists/${listId}/cards/${filter}`,
    listClosed: (listId: string) => `/lists/${listId}/closed`,
    listIdBoard: (listId: string) => `/lists/${listId}/idBoard`,
    listMoveAllCards: (listId: string) => `/lists/${listId}/moveAllCards`,
    listName: (listId: string) => `/lists/${listId}/name`,
    lists: () => "/lists",

    // Member endpoints
    member: (memberId: string) => `/members/${memberId}`,
    memberBoards: (memberId: string) => `/members/${memberId}/boards`,
    memberCards: (memberId: string) => `/members/${memberId}/cards`,
    memberMe: () => "/members/me",
    memberMeBoardStar: (boardStarId: string) => `/members/me/boardStars/${boardStarId}`,
    memberMeBoardStars: () => "/members/me/boardStars",
    memberNotifications: (memberId: string) => `/members/${memberId}/notifications`,
    memberOrganizations: (memberId: string) => `/members/${memberId}/organizations`,
    memberStarredBoards: (memberId: string) => `/members/${memberId}/boardStars`,
    myBoards: () => "/members/me/boards",
    searchMembers: () => "/search/members",
  },
} as const;

export type Urls = typeof urls;
