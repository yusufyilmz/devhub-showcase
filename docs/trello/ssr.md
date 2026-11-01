# Server-Side Rendered Trello Board - Usage Guide

## 🎯 Overview

The new SSR Trello Board provides **instant loading** and **SEO optimization** by fetching all board data server-side and pre-populating the client store.

## 📁 File Structure

```tree
src/app/(utils)/trello/board/[boardId]/
├── page.tsx        # ✅ Server-side page with data fetching
└── layout.tsx      # ✅ Clean full-screen layout

src/modules/trello/v2/pages/
└── TrelloBoardPageSSR.tsx  # ✅ Client component with store initialization
```

## 🚀 Quick Start

### **1. Access via URL**

```bash
http://localhost:3000/trello/board/YOUR_BOARD_ID
```

**Example:**

```bash
http://localhost:3000/trello/board/irQPdZZH
```

### **2. Programmatic Navigation**

```tsx
import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();

  const openBoard = (boardId: string) => {
    router.push(`/trello/board/${boardId}`);
  };

  return <Button onClick={() => openBoard("irQPdZZH")}>Open Board</Button>;
}
```

## ⚡️ Performance Benefits

### **❌ Traditional Client-Side Loading:**

1. Page loads → Empty board
2. Fetch board data → Loading spinner
3. Fetch lists → Still loading
4. Fetch cards → Finally ready
5. **Total: 3-4 server requests + loading states**

### **✅ SSR Board Loading:**

1. Page loads → **Fully populated board instantly**
2. All data pre-loaded server-side
3. Store pre-initialized with data
4. **Total: 0 client requests, instant display**

## 🔧 Implementation Details

### **Server-Side Data Fetching**

```tsx
// src/app/(utils)/trello/board/[boardId]/page.tsx

async function fetchBoardData(boardId: string) {
  const trelloService = new TrelloService();

  // ✅ Parallel requests for optimal performance
  const [boardResult, listsResult, cardsResult, membersResult] = await Promise.all([
    trelloService.getBoard(boardId),
    trelloService.getListsOnBoard(boardId),
    trelloService.getCardsOnBoard(boardId),
    trelloService.boards.getBoardMembers(boardId),
  ]);

  return {
    board: boardResult.data,
    cards: cardsResult.data || [],
    lists: listsResult.data || [],
    members: membersResult.data || [],
  };
}
```

### **Client-Side Store Initialization**

```tsx
// src/modules/trello/v2/pages/TrelloBoardPageSSR.tsx

useEffect(() => {
  // ✅ Pre-populate Zustand store with server data
  trelloActions.setBoards([initialData.board]);
  trelloActions.setSelectedBoard(initialData.board);
  trelloActions.setLists(initialData.lists);
  trelloActions.setCards(initialData.cards);
  trelloActions.setMembers(initialData.members);

  setIsInitialized(true);
}, [initialData]);
```

## 🎨 UI Features

### **Clean Full-Screen Experience**

- **No sidebar** - Just the board
- **Minimal header** - Board title and user info
- **Full-screen board** - Maximum workspace
- **Dynamic background** - Uses board's background color/image

### **All Existing Features Work**

- ✅ **Card editing** - Click cards to open detail modal
- ✅ **Rich descriptions** - Markdown rendering in cards
- ✅ **Drag & drop** - Move cards between lists (client-side)
- ✅ **Real-time updates** - Store updates reflect immediately
- ✅ **Error boundaries** - Graceful error handling

## 🔍 SEO Optimization

### **Dynamic Meta Tags**

```tsx
export async function generateMetadata({ params }: TrelloBoardPageProps) {
  const boardResult = await trelloService.getBoard(params.boardId);

  return {
    description: boardResult.data.desc || `Trello board: ${boardResult.data.name}`,
    title: `${boardResult.data.name} | Trello Board`,
  };
}
```

**Result:**

```html
<title>My Project Board | Trello Board</title>
<meta content="Track project progress and tasks" name="description" />
```

## 🛠️ Error Handling

### **Board Not Found**

```tsx
// Automatically redirects to 404 page
if (!boardData) {
  notFound();
}
```

### **API Errors**

```tsx
// Graceful error display with retry option
if (error) {
  return (
    <div>
      <Typography>Failed to load board</Typography>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}
```

## 📈 Use Cases

### **✅ Perfect For:**

- **Direct board links** - Share boards via URL
- **Embedded boards** - Iframe or widget embedding
- **SEO requirements** - Search engine indexing
- **Performance critical** - Instant loading needed
- **Mobile users** - Slow connections benefit from SSR

### **🤔 Consider Traditional Client-Side For:**

- **Complex sidebar navigation** - Multiple boards switching
- **Real-time collaboration** - WebSocket heavy features
- **Highly interactive** - Frequent state changes

## 🌟 Example Implementation

```tsx
// ✅ Full working example
// src/app/(utils)/trello/board/[boardId]/page.tsx

export default async function TrelloBoardPage({ params }: TrelloBoardPageProps) {
  const { boardId } = params;

  // Server-side data fetching
  const boardData = await fetchBoardData(boardId);

  if (!boardData) {
    notFound(); // 404 for invalid boards
  }

  // Pre-loaded, instant rendering
  return <TrelloBoardPageSSR boardId={boardId} initialData={boardData} />;
}
```

**Result:** Lightning-fast, SEO-friendly Trello boards with zero loading states! ⚡️
