import { env } from "@shared/env";
// Trello Module Constants

export const isDev = () => env.NODE_ENV === "development";

import type { TrelloServiceConfig } from "./types";

export const TRELLO_CONFIG = {
  APP_NAME: "MonoKrypton Trello Integration",
  BASE_URL: "https://api.trello.com/1",
  EXPIRATION: "never",
  RESPONSE_TYPE: "token",
  SCOPE: "read,write,account",
} as const;

export const DEFAULT_TRELLO_CONFIG: TrelloServiceConfig = {
  get apiKey() {
    return typeof window === "undefined" ? (env.TRELLO_API_KEY ?? "") : "";
  },
  get token() {
    return typeof window === "undefined" ? (env.TRELLO_API_TOKEN ?? "") : "";
  },
};

export const CLIENT_TRELLO_CONFIG: TrelloServiceConfig = {
  apiKey: env.NEXT_PUBLIC_TRELLO_API_KEY || "",
  token: env.NEXT_PUBLIC_TRELLO_API_TOKEN || "",
};

export const TRELLO_COLORS = {
  BLUE: "blue",
  GREEN: "green",
  GREY: "grey",
  LIME: "lime",
  ORANGE: "orange",
  PINK: "pink",
  PURPLE: "purple",
  RED: "red",
  SKY: "sky",
} as const;

export const TRELLO_LABEL_COLORS = [
  { hex: "#61BD4F", name: "Green", value: "green" },
  { hex: "#F2D600", name: "Yellow", value: "yellow" },
  { hex: "#FF9F1A", name: "Orange", value: "orange" },
  { hex: "#EB5A46", name: "Red", value: "red" },
  { hex: "#C377E0", name: "Purple", value: "purple" },
  { hex: "#0079BF", name: "Blue", value: "blue" },
  { hex: "#00C2E0", name: "Sky", value: "sky" },
  { hex: "#51E898", name: "Lime", value: "lime" },
  { hex: "#FF78CB", name: "Pink", value: "pink" },
  { hex: "#344563", name: "Black", value: "black" },
] as const;

export const TRELLO_PERMISSIONS = {
  ORG: "org",
  PRIVATE: "private",
  PUBLIC: "public",
} as const;

export const TRELLO_MEMBER_TYPES = {
  ADMIN: "admin",
  NORMAL: "normal",
  OBSERVER: "observer",
} as const;

export const TRELLO_CARD_POSITIONS = {
  BOTTOM: "bottom",
  TOP: "top",
} as const;

export const TRELLO_VOTING_PERMISSIONS = {
  DISABLED: "disabled",
  MEMBERS: "members",
  OBSERVERS: "observers",
  ORG: "org",
  PUBLIC: "public",
} as const;

export const TRELLO_COMMENT_PERMISSIONS = {
  DISABLED: "disabled",
  MEMBERS: "members",
  OBSERVERS: "observers",
  ORG: "org",
  PUBLIC: "public",
} as const;

export const TRELLO_INVITATION_PERMISSIONS = {
  ADMINS: "admins",
  MEMBERS: "members",
} as const;

export const TRELLO_CARD_AGING = {
  PIRATE: "pirate",
  REGULAR: "regular",
} as const;

export const TRELLO_BACKGROUNDS = [
  { name: "Blue", value: "blue" },
  { name: "Orange", value: "orange" },
  { name: "Green", value: "green" },
  { name: "Red", value: "red" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
  { name: "Lime", value: "lime" },
  { name: "Sky", value: "sky" },
  { name: "Grey", value: "grey" },
] as const;

// Default board lists
export const DEFAULT_BOARD_LISTS = ["To Do", "In Progress", "Done"] as const;

// API Rate Limits
export const TRELLO_RATE_LIMITS = {
  REQUESTS_PER_10_SECONDS: 300,
  REQUESTS_PER_DAY: 432000,
  REQUESTS_PER_HOUR: 18000,
  REQUESTS_PER_SECOND: 100,
} as const;

// Webhook events
export const TRELLO_WEBHOOK_EVENTS = {
  ADD_ATTACHMENT_TO_CARD: "addAttachmentToCard",
  ADD_CHECKLIST_TO_CARD: "addChecklistToCard",
  ADD_MEMBER_TO_BOARD: "addMemberToBoard",
  ADD_MEMBER_TO_CARD: "addMemberToCard",
  CREATE_BOARD: "createBoard",
  CREATE_CARD: "createCard",
  CREATE_CHECK_ITEM: "createCheckItem",
  CREATE_LIST: "createList",
  DELETE_ATTACHMENT_FROM_CARD: "deleteAttachmentFromCard",
  DELETE_BOARD: "deleteBoard",
  DELETE_CARD: "deleteCard",
  DELETE_CHECK_ITEM: "deleteCheckItem",
  DELETE_LIST: "deleteList",
  REMOVE_CHECKLIST_FROM_CARD: "removeChecklistFromCard",
  REMOVE_MEMBER_FROM_BOARD: "removeMemberFromBoard",
  REMOVE_MEMBER_FROM_CARD: "removeMemberFromCard",
  UPDATE_BOARD: "updateBoard",
  UPDATE_CARD: "updateCard",
  UPDATE_CHECK_ITEM: "updateCheckItem",
  UPDATE_CHECKLIST: "updateChecklist",
  UPDATE_LIST: "updateList",
} as const;

// Error messages
export const TRELLO_ERRORS = {
  BOARD_NOT_FOUND: "Board not found",
  CARD_CREATION_FAILED: "Card creation failed",
  CARD_DELETION_FAILED: "Card deletion failed",
  CARD_NOT_FOUND: "Card not found",
  CARD_UPDATION_FAILED: "Card updation failed",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  INVALID_CREDENTIALS: "Invalid Trello API credentials",
  INVALID_REQUEST: "Invalid request parameters",
  LIST_CREATION_FAILED: "List creation failed",
  LIST_DELETION_FAILED: "List deletion failed",
  LIST_NOT_FOUND: "List not found",
  LIST_UPDATION_FAILED: "List updation failed",
  MEMBER_CREATION_FAILED: "Member creation failed",
  MEMBER_DELETION_FAILED: "Member deletion failed",
  MEMBER_NOT_FOUND: "Member not found",
  MEMBER_UPDATION_FAILED: "Member updation failed",
  NETWORK_ERROR: "Network error occurred",
  NOT_FOUND: "Not found",
  PERMISSION_DENIED: "Permission denied",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
  RATE_LIMITED: "Rate limited",
  WEBHOOK_CREATION_FAILED: "Failed to create webhook",
  WEBHOOK_DELETION_FAILED: "Failed to delete webhook",
} as const;

// Success messages
export const TRELLO_SUCCESS_MESSAGES = {
  BOARD_CREATED: "Board created successfully",
  BOARD_DELETED: "Board deleted successfully",
  BOARD_UPDATED: "Board updated successfully",
  CARD_CREATED: "Card created successfully",
  CARD_DELETED: "Card deleted successfully",
  CARD_UPDATED: "Card updated successfully",
  LIST_CREATED: "List created successfully",
  LIST_DELETED: "List deleted successfully",
  LIST_UPDATED: "List updated successfully",
  WEBHOOK_CREATED: "Webhook created successfully",
  WEBHOOK_DELETED: "Webhook deleted successfully",
} as const;

export const ORGANIZATION_ID = "irQPdZZH";

export const MEMBER_ID = "yusufyilmaz92";
