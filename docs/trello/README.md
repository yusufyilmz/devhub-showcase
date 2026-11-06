# Trello V2 Components - Complete Documentation

## 🎯 Overview

This module provides a complete Trello-like interface built with **Pure UI Components** and a powerful **Zustand store**. The architecture follows a **framework-agnostic** pattern, making it easy to migrate to any UI library (MUI, Ant Design, Chakra UI, etc.).

## 🏗️ Architecture

```tree
src/modules/trello/v2/
├── components/
│   ├── ui/           # ✅ Pure UI Components (Framework Agnostic)
│   └── scaffold/     # ✅ Business Logic Components (Using Pure UI)
├── stores/           # ✅ Zustand Store + Actions + Selectors
├── services/         # ✅ API Integration
├── hooks/            # ✅ Custom Hooks
├── types.ts          # ✅ TypeScript Definitions
└── README.md         # ✅ This Documentation
```

---

## 🧩 Pure UI Components

### **Card Components**

Framework-agnostic card layouts with drag-and-drop support.

```tsx
import { Card, CardBody, CardFooter, CardHeader } from './components/ui/Card'

// Basic Card
<Card className="my-card" style={{ width: '300px' }}>
  <CardHeader>
    <Heading level={3}>Card Title</Heading>
  </CardHeader>
  <CardBody>
    <Typography >Card content goes here</Typography>
  </CardBody>
  <CardFooter>
    <Button variant="default">Action</Button>
  </CardFooter>
</Card>

// Draggable Card
<Card
  draggable
  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'card-id')}
  onClick={() => console.log('Card clicked')}
>
  Content here
</Card>
```

### **Button Components**

Versatile button components with variants and states.

```tsx
import { Button, IconButton } from './components/ui/Button'

// Button Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Ghost</Button>
<Button variant="danger">Danger</Button>

// Button Sizes
<Button size="s">Small</Button>
<Button size="m">Medium</Button>
<Button size="l">Large</Button>

// Icon Button
<IconButton onClick={handleClick} title="Settings">
  ⚙️
</IconButton>

// Disabled State
<Button disabled loading>
  Loading...
</Button>
```

### **Input Components**

Clean input components for forms.

```tsx
import { Input, TextArea } from './components/ui/Input'

// Basic Input
<Input
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
  value={value}
/>

// Text Area
<TextArea
  placeholder="Enter description..."
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

### **Layout Components (Once UI Style)**

Powerful layout system with semantic props.

```tsx
import { Column, Flex, Grid, Row, Sidebar, Stack } from './components/ui/Layout'

// Flexible Layouts
<Flex align="center" gap="md" justify="between" >
  <Typography >Left content</Typography>
  <Button>Right action</Button>
</Flex>

// Stack (Vertical/Horizontal)
<Stack gap="lg" padding="md">
  <Typography >Item 1</Typography>
  <Typography >Item 2</Typography>
</Stack>

<Stack horizontal gap="sm">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Stack>

// Semantic Layout
<Row justify="between" align="center" gap="md">
  <Column gap="sm" flex="1">
    <Heading level={2}>Title</Heading>
    <Typography >Description</Typography>
  </Column>
  <Button>Action</Button>
</Row>

// Grid Layout
<Grid columns={3} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Sidebar
<Sidebar collapsed={false} width="280px">
  <Typography >Sidebar content</Typography>
</Sidebar>
```

#### **Layout Props Reference**

**Spacing (Gap, Padding, Margin):**

- `xs` = 4px, `sm` = 8px, `md` = 16px, `lg` = 24px, `xl` = 32px, `2xl` = 48px

**Alignment:**

- `align`: `start`, `center`, `end`, `stretch`, `baseline`
- `justify`: `start`, `center`, `end`, `between`, `around`, `evenly`

**Sizing:**

- `width`/`height`: `sm`, `md`, `lg`, `xl`, `full`, `auto`, or custom values
- `flex`: `1`, `auto`, `initial`, `none`

**Borders:**

- `border`: boolean or `BorderStyle`
- `borderRadius`: `none`, `sm`, `md`, `lg`, `full`

### **Typography Components**

Semantic typography with consistent styling.

```tsx
import { Heading, Label, Text } from './components/ui/Typography'

// Headings
<Heading level={1}>Main Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3} onClick={handleClick} title="Click to edit">
  Interactive Heading
</Heading>

// Text Variants
<Typography  size="l" weight="bold">Large Bold Text</Typography>
<Typography  color="#666" size="s" >Small Gray Text</Typography>
<Typography  italic underline>Styled Text</Typography>

// Labels/Badges
<Label color="#0079bf" small>
  Status Badge
</Label>
```

### **Container Components**

Layout containers for different content types.

```tsx
import { BoardContainer, Container, Header, ListContainer, Panel } from './components/ui/Container'

// General Containers
<Container className="main-container">
  <Header>
    <Heading level={1}>Page Title</Heading>
  </Header>
  <Panel>
    <Typography >Panel content with background</Typography>
  </Panel>
</Container>

// Specialized Containers
<BoardContainer>
  <ListContainer>
    <Typography >List content</Typography>
  </ListContainer>
</BoardContainer>
```

### **MarkdownRenderer Component**

Rich markdown rendering for card descriptions and content.

```tsx
import { MarkdownRenderer } from './components/ui/MarkdownRenderer'

// Basic Usage
<MarkdownRenderer>
  {`**Bold text** and *italic text*

  ## Headings
  - Bullet points
  - [Links](https://example.com)

  \`\`\`typescript
  const code = "syntax highlighting"
  \`\`\`
  `}
</MarkdownRenderer>

// Compact Mode (perfect for Trello cards)
<MarkdownRenderer compact maxHeight="150px">
  {cardDescription}
</MarkdownRenderer>

// With Task Lists (GitHub Flavored Markdown)
<MarkdownRenderer>
  {`### Todo List
  - [x] Completed task
  - [ ] Pending task
  - [ ] Another pending task`}
</MarkdownRenderer>

// Math Equations Support
<MarkdownRenderer>
  {"Calculate performance: $Score = \\frac{Tasks}{Total} \\times 100$"}
</MarkdownRenderer>
```

#### **MarkdownRenderer Props:**

- `compact?: boolean` - Smaller fonts and tighter spacing
- `maxHeight?: string` - Max height with scroll (e.g. "200px")
- `allowRawHTML?: boolean` - Enable/disable raw HTML (default: false)
- `enableMath?: boolean` - Enable LaTeX math equations (default: true)
- `enableGFM?: boolean` - Enable GitHub Flavored Markdown (default: true)

### **Modal Component**

Flexible modal/dialog for overlays and detailed views.

```tsx
import { Modal, ModalFooter } from './components/ui/Modal'

// Basic Modal
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  size="m"
  title="Modal Title"
>
  <Typography >Modal content goes here</Typography>
</Modal>

// Large Modal with Footer
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Detailed View"
  size="l"
  closeOnBackdropClick={true}
  closeOnEscape={true}
>
  <MarkdownRenderer>
    {longContent}
  </MarkdownRenderer>

  <ModalFooter>
    <Button onClick={() => setIsModalOpen(false)} variant="secondary" >
      Close
    </Button>
    <Button variant="default">
      Save Changes
    </Button>
  </ModalFooter>
</Modal>
```

#### **Modal Props:**

- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal should close
- `title?: string` - Optional title in header
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size
- `closeOnBackdropClick?: boolean` - Close when clicking outside (default: true)
- `closeOnEscape?: boolean` - Close on Escape key (default: true)
- `showCloseButton?: boolean` - Show X button in header (default: true)

---

## 🎯 Trello Scaffold Components

### **TrelloBoardPage**

Complete Trello board application with store integration.

```tsx
import { TrelloBoardPage } from "./pages/TrelloBoardPage";

function App() {
  return <TrelloBoardPage />;
}
```

### **TrelloBoardPageSSR** ⭐️

**Server-Side Rendered** board page for optimal performance and SEO.

```tsx
// ✅ Next.js App Router page with SSR
// src/app/(utils)/trello/board/[boardId]/page.tsx

import { TrelloBoardPageSSR } from "@/shared/trello/v2/pages/TrelloBoardPageSSR";

export default async function TrelloBoardPage({ params }: { params: { boardId: string } }) {
  // Fetch board data server-side
  const boardData = await fetchBoardData(params.boardId);

  return <TrelloBoardPageSSR boardId={params.boardId} initialData={boardData} />;
}
```

**✨ SSR Board features:**

- **Server-side data fetching** - Board loads instantly
- **SEO optimized** - Board title and description in meta tags
- **Clean full-screen layout** - No sidebar or complex navigation
- **Pre-populated store** - Zustand store initialized with server data
- **Performance focused** - Parallel API calls, minimal client requests
- **Error handling** - Graceful fallbacks for missing boards
- **Direct board access** - `/trello/board/[boardId]` routes

### **TrelloBoard**

Main board component with lists and cards.

```tsx
import { TrelloBoard } from "./components/scaffold/TrelloBoard";

<TrelloBoard
  className="custom-board"
  onCardClick={(cardId) => console.log("Card clicked:", cardId)}
  onListUpdate={(listId, updates) => console.log("List updated")}
  showActions={true}
/>;
```

### **TrelloBoardHeader**

Board header with title, menu, and user info.

```tsx
import { TrelloBoardHeader } from "./components/scaffold/TrelloBoardHeader";

<TrelloBoardHeader
  onBoardSelect={(board) => console.log("Board selected:", board)}
  showBoardSwitcher={true}
  showUserInfo={true}
/>;
```

### **TrelloBoardSidebar**

Collapsible sidebar with board navigation.

```tsx
import { TrelloBoardSidebar } from "./components/scaffold/TrelloBoardSidebar";

<TrelloBoardSidebar
  collapsed={sidebarCollapsed}
  onBoardSelect={(board) => handleBoardSelection(board)}
  onCreateBoard={() => handleCreateBoard()}
  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
/>;
```

### **TrelloList**

List component with cards and add functionality.

```tsx
import { TrelloList } from "./components/scaffold/TrelloList";

<TrelloList
  list={listData}
  onCardAdd={(listId, cardName, cardDesc) => handleAddCard(listId, cardName, cardDesc)}
  onCardClick={(cardId) => handleCardClick(cardId)}
  onListUpdate={(listId, updates) => handleListUpdate(listId, updates)}
  showActions={true}
/>;
```

### **TrelloCard**

Individual card component with editing capabilities and **rich markdown descriptions**.

```tsx
import { TrelloCard } from "./components/scaffold/TrelloCard";

<TrelloCard
  card={{
    desc: `**Priority:** High 🔥

### Steps to reproduce:
1. Go to login page
2. Enter invalid email
3. Click submit

**Expected:** Show validation error
**Actual:** Form submits anyway

\`\`\`typescript
// Fix needed in validation.ts
const isValidEmail = (email: string) => {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)
}
\`\`\`

- [x] Reproduce bug
- [ ] Write test case  
- [ ] Implement fix`,
    id: "card123",
    name: "Fix login bug",
  }}
  onClick={(card) => handleCardClick(card)}
  onDelete={(cardId) => handleCardDelete(cardId)}
  onEdit={(card) => handleCardEdit(card)}
  showActions={true}
/>;
```

**✨ Card descriptions now support:**

- **Rich formatting** (bold, italic, links)
- **Code blocks** with syntax highlighting
- **Task lists** with checkboxes
- **Tables** for specifications
- **Math equations** for technical content
- **Compact preview** with "View Details" button
- **Full-screen modal** for reading complete descriptions
- **No horizontal scrolling** - content wraps properly

---

## 🗄️ Zustand Store Integration

### **Store Setup**

```tsx
import { shallow } from "zustand/shallow";

import { trelloActions, trelloSelectors, useTrelloStore } from "./stores/trelloStore";

// Component using the store
function MyComponent() {
  // ✅ Use selectors with shallow comparison
  const { boards, selectedBoard, loading } = useTrelloStore(
    (state) => ({
      boards: trelloSelectors.boards(state),
      loading: trelloSelectors.loading(state),
      selectedBoard: trelloSelectors.selectedBoard(state),
    }),
    shallow,
  );

  // ✅ Use actions
  const handleCreateBoard = async () => {
    const newBoard = await trelloActions.createBoard({
      defaultLists: true,
      desc: "Board description",
      name: "New Board",
    });
    console.log("Created board:", newBoard);
  };

  return (
    <div>
      {loading.boards ? (
        <Typography>Loading boards...</Typography>
      ) : (
        <Stack gap="md">
          {boards.map((board) => (
            <Typography key={board.id}>{board.name}</Typography>
          ))}
          <Button onClick={handleCreateBoard}>Create Board</Button>
        </Stack>
      )}
    </div>
  );
}
```

### **Available Actions**

```tsx
// Board Actions
await trelloActions.fetchBoards();
await trelloActions.createBoard({ desc: "Description", name: "New Board" });
await trelloActions.updateBoard(boardId, { name: "Updated Name" });
await trelloActions.deleteBoard(boardId);

// List Actions
await trelloActions.fetchBoardLists(boardId);
await trelloActions.createList({ idBoard: boardId, name: "New List" });
await trelloActions.updateList(listId, { name: "Updated List" });
await trelloActions.deleteList(listId);

// Card Actions
await trelloActions.fetchListCards(listId);
await trelloActions.createCard({
  desc: "Description",
  idList: listId,
  name: "New Card",
});
await trelloActions.updateCard(cardId, { name: "Updated Card" });
await trelloActions.deleteCard(cardId);

// Member Actions
await trelloActions.fetchCurrentMember();
await trelloActions.fetchBoardMembers(boardId);
```

### **Available Selectors**

```tsx
// Get data
const boards = trelloSelectors.boards(state);
const selectedBoard = trelloSelectors.selectedBoard(state);
const boardLists = trelloSelectors.boardLists(state, boardId);
const listCards = trelloSelectors.listCards(state, listId);

// Get state
const loading = trelloSelectors.loading(state);
const errors = trelloSelectors.errors(state);
const currentMember = trelloSelectors.currentMember(state);
```

---

## 🔄 Migration Benefits

### **Easy Framework Migration**

```tsx
// ❌ Before: Raw HTML elements
<div className="card">
  <h3>Title</h3>
  <button onClick={handleClick}>Action</button>
</div>

// ✅ After: Pure UI components
<Card>
  <CardHeader>
    <Heading level={3}>Title</Heading>
  </CardHeader>
  <CardFooter>
    <Button onClick={handleClick}>Action</Button>
  </CardFooter>
</Card>

// 🚀 Migrate to MUI easily:
<MuiCard>
  <MuiCardHeader>
    <MuiTypography variant="h3">Title</MuiTypography>
  </MuiCardHeader>
  <MuiCardActions>
    <MuiButton onClick={handleClick}>Action</MuiButton>
  </MuiCardActions>
</MuiCard>
```

### **Rich Content Support**

The MarkdownRenderer makes card descriptions incredibly powerful:

````tsx
// ❌ Before: Plain text only
<div>{card.desc}</div>

// ✅ After: Rich markdown content
<MarkdownRenderer compact maxHeight="150px">
  {card.desc}
</MarkdownRenderer>

// 🚀 Now supports:
// - **Bold** and *italic* formatting
// - [Clickable links](https://example.com)
// - `code snippets` and ```code blocks```
// - Task lists: [x] Done, [ ] Todo
// - Tables, math equations, and more!
````

### **Consistent API**

All components follow the same patterns:

- `className` and `style` props for customization
- Semantic prop names (`gap`, `justify="between"`, `align="center"`)
- Event handlers with clear naming (`onClick`, `onEdit`, `onDelete`)
- Optional props with sensible defaults

---

## 🎨 Styling & Customization

### **CSS Classes**

Every component includes CSS classes for styling:

```css
/* Card styling */
.ui-card {
  /* Base card styles */
}
.ui-card--dragging {
  /* Dragging state */
}

/* Button styling */
.ui-button {
  /* Base button styles */
}
.ui-button--primary {
  /* Primary variant */
}
.ui-button--small {
  /* Small size */
}

/* Layout styling */
.ui-flex {
  /* Flex container */
}
.ui-stack {
  /* Stack container */
}
```

### **Style Props**

```tsx
// Inline styles
<Card style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
  Content
</Card>

// CSS classes
<Button className="my-custom-button-class">
  Custom Button
</Button>
```

---

## 🚀 Getting Started

### **1. Install Dependencies**

```bash
# Already included in the monorepo
pnpm install
```

### **2. Basic Usage**

```tsx
import React from "react";

import { TrelloBoardPage } from "./src/modules/trello/v2/pages/TrelloBoardPage";

function App() {
  return (
    <div className="app">
      <TrelloBoardPage />
    </div>
  );
}

export default App;
```

### **3. Custom Implementation**

```tsx
import React from "react";

import { shallow } from "zustand/shallow";

import { Button, Card, Heading, Stack } from "./src/modules/trello/v2/components/ui";
import { trelloSelectors, useTrelloStore } from "./src/modules/trello/v2/stores/trelloStore";

function CustomTrelloView() {
  const { boards } = useTrelloStore(
    (state) => ({ boards: trelloSelectors.boards(state) }),
    shallow,
  );

  return (
    <Stack gap="lg" padding="md">
      <Heading level={1}>My Boards</Heading>
      <Stack gap="md">
        {boards.map((board) => (
          <Card key={board.id}>
            <Heading level={3}>{board.name}</Heading>
            <Button variant="default">Open Board</Button>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
```

---

## 📚 API Reference

### **Component Props**

All components accept these base props:

- `className?: string` - CSS classes
- `style?: React.CSSProperties` - Inline styles
- `children?: ReactNode` - Child elements

### **Layout Components**

**Flex/Row/Column/Stack:**

- `gap?: SpacingValue` - Gap between items
- `align?: AlignItems` - Cross-axis alignment
- `justify?: JustifyContent` - Main-axis alignment
- `wrap?: boolean` - Allow wrapping
- `direction?: 'row' | 'column'` - Flex direction
- `horizontal?: boolean` - Stack only: horizontal direction
- `vertical?: boolean` - Stack only: vertical direction

**Grid:**

- `columns?: number` - Number of columns
- `rows?: number` - Number of rows
- `gap?: SpacingValue` - Gap between items
- `gapX?: SpacingValue` - Horizontal gap
- `gapY?: SpacingValue` - Vertical gap

### **Button Component**

- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `loading?: boolean`
- `onClick?: () => void`
- `title?: string`

### **Typography Components**

- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `weight?: 'normal' | 'medium' | 'semibold' | 'bold'`
- `color?: string`
- `italic?: boolean`
- `underline?: boolean`

---

## 🔧 Development

### **Adding New UI Components**

1. Create the component in `components/ui/`
2. Export it from `components/ui/index.ts`
3. Follow the pure UI pattern (no business logic)
4. Add TypeScript interfaces
5. Include CSS classes for styling

### **Adding New Trello Components**

1. Create the component in `components/scaffold/`
2. Use only pure UI components (no raw HTML)
3. Connect to Zustand store using selectors
4. Export from `components/scaffold/index.ts`

---

## 🔗 Integration Components

### **ArticleToTrelloButton** ⭐️

**Convert any article to a Trello task** with full metadata mapping and intelligent content transformation.

```tsx
import { articleSelectors, useArticleStore } from "@/shared/article/store/articleStore";
import { ArticleToTrelloButton } from "@/shared/trello/v2/components/integration";

function ArticleContent() {
  const currentArticle = useArticleStore(articleSelectors.currentArticle);

  return (
    <div>
      <h1>{currentArticle.title}</h1>

      {/* ✅ Convert article to Trello card */}
      <ArticleToTrelloButton
        article={currentArticle}
        disabled={false} // optional
        size="medium" // or "small", "large"
        variant="button" // or "icon"
      />

      <div>{/* Article content */}</div>
    </div>
  );
}
```

**✨ Article Integration Features:**

- **🎯 Smart mapping** - Article title → Card title, content → Description
- **📋 Rich descriptions** - Article metadata, content preview, and full link
- **🎛️ Board/List selection** - Interactive dialog for target selection
- **🔄 Error handling** - Graceful failure with retry options
- **⏳ Loading states** - Progress indicators during conversion
- **📊 Article metadata** - Created date, modified date, views, author
- **📝 Content preview** - Truncated markdown with link to full article
- **⚡ Real-time updates** - New cards appear in board immediately

**📋 Generated Card Content Example:**

```markdown
**Article:** Building Scalable React Components
**Link:** /article/scalable-react-components-52307777
**Summary:** A comprehensive guide to building maintainable React components...
**Created:** 12/10/2024
**Modified:** 12/10/2024

**Content:**

# Introduction to Component Architecture

When building large-scale React applications, component architecture becomes crucial...

[Content truncated - see full article via link]

**Full Article:** /article/scalable-react-components-52307777
```

**🎨 Integration Props:**

```typescript
interface ArticleToTrelloButtonProps {
  article: CurrentArticle; // Article data from store
  className?: string; // Custom CSS classes
  disabled?: boolean; // Disable the button
  size?: "small" | "medium" | "large";
  variant?: "button" | "icon"; // Display style
}
```

**🚀 Usage Examples:**

_Button variant with full text:_

```tsx
<ArticleToTrelloButton article={currentArticle} size="medium" variant="button" />;
// Renders: [🗃️] Convert to Trello Task
```

_Icon variant for compact spaces:_

```tsx
<ArticleToTrelloButton article={currentArticle} size="small" variant="icon" />;
// Renders: [🗃️] (icon only)
```

**🔄 Conversion Flow:**

1. **Click button** → Opens conversion dialog
2. **Initialize Trello** → Fetches user's boards automatically
3. **Select board** → Loads lists for selected board
4. **Select list** → Choose target list for the card
5. **Review content** → Article title and description auto-populated
6. **Create card** → Converts article to Trello card with rich metadata
7. **Success feedback** → Confirmation with link to new card

---

## 🎯 Best Practices

### **✅ Do:**

- Use pure UI components instead of raw HTML
- Use Zustand selectors with shallow comparison
- Include TypeScript interfaces for all props
- Use semantic prop names (`gap="md"`, `justify="between"`)
- Call all hooks unconditionally at the top level

### **❌ Don't:**

- Mix raw HTML elements with pure UI components
- Call hooks conditionally or inside loops
- Use hardcoded pixel values (use semantic spacing)
- Include business logic in UI components
- Forget to export new components

---

## 🏁 Conclusion

This Trello V2 module demonstrates a **scalable, maintainable, and framework-agnostic** approach to building complex UI components. The pure UI component pattern makes it incredibly easy to migrate to any design system or UI library, while the Zustand store provides powerful state management.

**Happy coding! 🚀**
