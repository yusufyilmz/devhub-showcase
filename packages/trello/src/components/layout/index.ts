// Trello Scaffold Components
//
// This file exports all the scaffold components for the Trello board system.
// These components are designed to be minimal, functional, and easily styleable.
//
// Usage:
// import { TrelloBoard, TrelloCard, TrelloList } from '@/modules/trello/v2/components/scaffold'

// ============================================================================
// ✅ ORIGINAL COMPONENTS (using raw HTML elements)
// ============================================================================

// // Core Board Components
// export { TrelloBoardBackground } from '../old/TrelloBoardBackground'
// export { TrelloCard } from '../old/TrelloCard'
// export { TrelloList } from '../old/TrelloList'
// export { TrelloBoard } from '../old/TrelloBoard'

// // Layout & Navigation Components
// export { TrelloBoardHeader } from '../old/TrelloBoardHeader'
// export { TrelloBoardSidebar } from '../old/TrelloBoardSidebar'

// Utility Components
export { TrelloErrorBoundary } from "./TrelloErrorBoundary";

// ============================================================================
// ✅ REFACTORED COMPONENTS (using pure UI components - framework agnostic!)
//
// These components use pure UI building blocks instead of raw HTML elements.
// They can be easily migrated to MUI, Ant Design, Chakra UI, or any other
// UI library by simply changing the import statements. Business logic remains
// exactly the same!
//
// Usage:
// import { TrelloBoard } from '@/modules/trello/v2/components/scaffold'
// ============================================================================

// Re-export pages for convenience
// Re-export store functions for convenience
// Re-export types for convenience
export type {
  CreateBoardOptions,
  CreateCardOptions,
  TrelloBoard as TrelloBoardType,
  TrelloCard as TrelloCardType,
  TrelloLabel,
  TrelloList as TrelloListType,
  TrelloMember,
  UpdateCardOptions,
} from "../../types";
