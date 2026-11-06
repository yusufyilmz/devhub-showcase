# Trello Scaffold Components

A complete set of modular, styleable Trello board components built with React, TypeScript, and Zustand.

## 🏗️ Architecture Overview

The scaffold system is built with the following principles:

- **Modular Design**: Each component is independent and reusable
- **Minimal Styling**: Basic styles for functionality, easy to override
- **Store Integration**: All components work seamlessly with the enhanced trelloStore
- **TypeScript First**: Full type safety throughout
- **Performance Optimized**: Uses Zustand best practices with shallow comparison

## 📦 Components

### Core Components

#### `TrelloBoardBackground`

The container component that handles board backgrounds and theming.

```typescript
<TrelloBoardBackground board={board} className="custom-bg">
  {children}
</TrelloBoardBackground>
```

#### `TrelloCard`

Individual card component with full CRUD operations, drag & drop, and metadata display.

```typescript
<TrelloCard
  card={card}
  draggable={true}
  showActions={true}
  onClick={handleCardClick}
  onEdit={handleCardEdit}
  onDelete={handleCardDelete}
/>
```

**Features:**

- ✅ Inline editing (name & description)
- ✅ Due dates, labels, checklists, attachments
- ✅ Member avatars and assignments
- ✅ Drag & drop support
- ✅ Action menu (edit, delete)
- ✅ Visual feedback and hover states

#### `TrelloList`

List container component that holds cards and provides list management.

```typescript
<TrelloList
  list={list}
  onCardClick={handleCardClick}
  showActions={true}
  allowDragDrop={true}
/>
```

**Features:**

- ✅ Add new cards with name and description
- ✅ Inline list title editing
- ✅ Card count display
- ✅ Drag & drop card acceptance
- ✅ Auto-sorted cards by position
- ✅ Loading and empty states

#### `TrelloBoard`

Main board component that orchestrates lists and provides board-level functionality.

```typescript
<TrelloBoard
  board={board}
  onBoardUpdate={handleBoardUpdate}
  onCardClick={handleCardClick}
  showActions={true}
  allowDragDrop={true}
/>
```

**Features:**

- ✅ Board title editing
- ✅ Add new lists
- ✅ Board statistics (lists, cards, completed)
- ✅ Auto-loads board data
- ✅ Background theming support
- ✅ Error handling display
- ✅ Empty state with call-to-action

### Layout Components

#### `TrelloBoardHeader`

Global header with navigation and user information.

```typescript
<TrelloBoardHeader
  showBoardSwitcher={true}
  showUserInfo={true}
  onBoardSelect={handleBoardSelect}
/>
```

#### `TrelloBoardSidebar`

Collapsible sidebar for board navigation and management.

```typescript
<TrelloBoardSidebar
  collapsed={false}
  onBoardSelect={handleBoardSelect}
  onCreateBoard={handleCreateBoard}
  onToggleCollapse={handleToggleCollapse}
/>
```

**Features:**

- ✅ Board list with stats
- ✅ Create new boards
- ✅ Collapsible design
- ✅ Global statistics
- ✅ Visual board indicators

## 🚀 Complete Example Usage

```typescript
import { CLIENT_TRELLO_CONFIG } from '@/modules/trello/v2/constants'
import type { TrelloBoardPage } from '@/modules/trello/v2/pages/TrelloBoardPage'

// Complete board application with all features
export const MyTrelloApp = () => {
  return (
    <TrelloBoardPage
      initialConfig={CLIENT_TRELLO_CONFIG}
      initialBoardId="your-board-id"
    />
  )
}
```

## 🎨 Custom Styling

All components accept `className` and `style` props for easy customization:

```typescript
// Custom CSS classes
<TrelloCard
  card={card}
  className="my-custom-card dark-theme"
  style={{
    backgroundColor: '#2c3e50',
    color: 'white',
    borderRadius: '12px'
  }}
/>

// Theme-based styling
<TrelloBoardBackground
  board={board}
  className={`board-bg ${isDarkMode ? 'dark' : 'light'}`}
>
  <TrelloBoard board={board} className="custom-board" />
</TrelloBoardBackground>
```

## 🔄 Store Integration

All components use the enhanced trelloStore with proper selector patterns:

```typescript
// ✅ Consolidated selectors with shallow comparison
const { boards, lists, cards, loading } = useTrelloStore(
  (state) => ({
    boards: trelloSelectors.boards(state),
    cards: trelloSelectors.cardsByList(listId)(state),
    lists: trelloSelectors.listsByBoard(boardId)(state),
    loading: trelloSelectors.loading(state),
  }),
  shallow,
);

// ✅ Actions for mutations
await trelloActions.createCard(listId, {
  desc: "Task description",
  name: "New Task",
  pos: "bottom",
});
```

## 🛠️ Available Actions

### Board Actions

- `fetchBoards()` - Load all boards
- `createBoard(options)` - Create new board
- `deleteBoard(boardId)` - Delete board
- `updateBoardApi(boardId, updates)` - Update board

### List Actions

- `fetchBoardLists(boardId)` - Load board lists
- `createList(boardId, name, pos)` - Create new list
- `updateListApi(listId, updates)` - Update list

### Card Actions

- `fetchBoardCards(boardId)` - Load board cards
- `createCard(listId, options)` - Create new card
- `updateCardApi(cardId, options)` - Update card
- `deleteCard(cardId)` - Delete card
- `moveCard(cardId, listId, position)` - Move card between lists

### Member Actions

- `fetchCurrentMember()` - Load current user
- `fetchMemberBoards(memberId)` - Load member's boards

### Utility Actions

- `healthCheck()` - API connectivity check
- `showError(error)` - Set error message
- `clearError()` - Clear errors

## 📊 Available Selectors

### Basic Selectors

- `boards` - All boards
- `lists` - All lists
- `cards` - All cards
- `currentMember` - Current user info
- `selectedBoard` - Currently selected board
- `loading` - Loading states object
- `error` - Current error message

### Computed Selectors

- `listsByBoard(boardId)` - Lists for specific board
- `cardsByList(listId)` - Cards for specific list
- `boardById(boardId)` - Find board by ID
- `cardsCountForBoard(boardId)` - Count cards in board
- `isLoadingBoards` - Board loading state
- `hasBoards` - Whether any boards exist

## 🎯 Performance Features

- **Zustand Best Practices**: Consolidated selectors with shallow comparison
- **Lazy Loading**: Components load data as needed
- **Optimistic Updates**: UI updates immediately, syncs with API
- **Drag & Drop**: Native HTML5 drag and drop with visual feedback
- **Memory Efficient**: Automatic cleanup of related data

## 🔧 Customization Points

Each component exposes multiple customization hooks:

1. **Visual Styling**: `className`, `style` props
2. **Behavior Control**: `showActions`, `allowDragDrop`, `disabled` flags
3. **Event Handlers**: `onClick`, `onEdit`, `onDelete`, `onUpdate` callbacks
4. **Data Filtering**: Custom selectors for specific use cases
5. **Loading States**: Custom loading and empty state components

## 🌟 Key Benefits

- ✅ **Complete API Integration** - All Trello endpoints supported
- ✅ **Real-time Updates** - Store automatically syncs with API
- ✅ **Type Safety** - Full TypeScript support throughout
- ✅ **Performance Optimized** - Minimal re-renders, efficient updates
- ✅ **Modular Design** - Use only what you need
- ✅ **Easy Styling** - Override any visual aspect
- ✅ **Production Ready** - Error handling, loading states, edge cases
- ✅ **Developer Friendly** - Clear APIs, good defaults, extensive documentation

## 🚀 Getting Started

1. **Import the page component:**

   ```typescript
   import { TrelloBoardPage } from "@/shared/trello/v2/pages/TrelloBoardPage";
   ```

2. **Use with your Trello credentials:**

   ```typescript
   <TrelloBoardPage initialConfig={{
     apiKey: 'your-trello-api-key',
     token: 'your-trello-token'
   }} />
   ```

3. **Customize as needed:**

   ```typescript
   <TrelloBoardPage
     className="my-trello-app"
     style={{ fontFamily: 'Inter, sans-serif' }}
     initialBoardId="specific-board-id"
   />
   ```

That's it! You now have a fully functional Trello board with all CRUD operations, drag & drop, and real-time updates.
