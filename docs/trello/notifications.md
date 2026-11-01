# Notification-Enhanced Trello Hooks - Usage Guide

## 🎯 Overview

All Trello hooks now integrate with the `NotificationProvider` following the same pattern as `useApiRequest`. This means **consumers don't need to handle errors manually** - the hooks will automatically show notifications for success/error states.

## 🔧 Enhanced Hook Features

### **Automatic Notifications**

- ✅ **Success notifications** - "Boards loaded successfully", "Board created successfully"
- ❌ **Error notifications** - "Failed to load boards: API error details"
- 🎯 **Customizable messages** - Override default messages with custom text
- 🔄 **Callback support** - `onSuccess` and `onError` callbacks for additional logic

## 📚 Hook Examples

### **useTrelloBoards Hook**

#### **Basic Usage (Default notifications):**

```tsx
import { useTrelloBoards } from "@/modules/trello/v2/hooks/useTrelloBoards";
import { TrelloApiService } from "@/modules/trello/v2/services/TrelloApiService";

function TrelloBoardsList() {
  const trelloService = new TrelloApiService();

  // ✅ Automatic error notifications enabled by default
  const { boards, loading, refetch, createBoard } = useTrelloBoards(trelloService);

  return (
    <div>
      <button onClick={refetch}>Refresh Boards</button>

      {boards.map((board) => (
        <div key={board.id}>{board.name}</div>
      ))}
    </div>
  );
}
```

#### **Custom Notifications:**

```tsx
function TrelloBoardsWithCustomNotifications() {
  const trelloService = new TrelloApiService();

  const { boards, loading, refetch, createBoard } = useTrelloBoards(trelloService, {
    errorMessage: "Oops! Could not load your boards",
    onError: (error) => {
      console.error("Board loading failed:", error);
      // Error tracking, fallback logic, etc.
    },

    // ✅ Custom callbacks
    onSuccess: (boards) => {
      console.log(`Loaded ${boards.length} boards`);
      // Analytics tracking, etc.
    },
    showErrorNotification: true,
    // ✅ Enable success notifications
    showSuccessNotification: true,

    // ✅ Custom messages
    successMessage: "Your boards have been loaded! 🎉",
  });

  const handleCreateBoard = async () => {
    // ✅ Notifications handled automatically
    const newBoard = await createBoard("My New Board", "Board description");
    if (newBoard) {
      console.log("Board created:", newBoard.id);
    }
  };

  return (
    <div>
      <button onClick={handleCreateBoard}>Create New Board</button>

      <button onClick={refetch}>{loading ? "Loading..." : "Refresh Boards"}</button>
    </div>
  );
}
```

#### **Silent Mode (No notifications):**

```tsx
function SilentBoardsLoader() {
  const trelloService = new TrelloApiService();

  const { boards, loading, refetch } = useTrelloBoards(trelloService, {
    // ✅ Handle errors manually if needed
    onError: (error) => {
      // Custom error handling without notifications
      console.warn("Silent error:", error.message);
    },
    showErrorNotification: false,
    // ✅ Disable all notifications
    showSuccessNotification: false,
  });

  return <div>Silent boards loading...</div>;
}
```

## 🚀 Real-World Examples

### **1. Dashboard with Success Feedback**

```tsx
function TrelloDashboard() {
  const trelloService = new TrelloApiService();

  const { boards, createBoard, deleteBoard } = useTrelloBoards(trelloService, {
    onSuccess: (boards) => {
      // Update analytics
      analytics.track("boards_loaded", { count: boards.length });
    },
    showSuccessNotification: true,
    successMessage: "✨ Dashboard updated successfully!",
  });

  const handleQuickCreateBoard = async () => {
    // ✅ User gets automatic success notification
    const board = await createBoard("Quick Board");

    if (board) {
      // ✅ Automatic "Board created successfully" notification
      console.log("New board ready:", board.id);
    }
  };

  return (
    <div className="dashboard">
      <button onClick={handleQuickCreateBoard}>+ Quick Create Board</button>

      <div className="boards-grid">
        {boards.map((board) => (
          <div className="board-card" key={board.id}>
            <h3>{board.name}</h3>
            <button onClick={() => deleteBoard(board.id)}>
              Delete
              {/* ✅ Automatic "Board deleted successfully" notification */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **2. Board Management with Custom Error Handling**

```tsx
function BoardManager() {
  const trelloService = new TrelloApiService();
  const [retryCount, setRetryCount] = useState(0);

  const { boards, loading, refetch, createBoard } = useTrelloBoards(trelloService, {
    errorMessage: "Failed to sync with Trello",

    onError: async (error) => {
      // ✅ Custom retry logic
      if (retryCount < 3) {
        console.log(`Retrying... (${retryCount + 1}/3)`);
        setRetryCount((prev) => prev + 1);
        setTimeout(() => refetch(), 2000);
      } else {
        console.error("Max retries reached:", error);
        // Maybe show a more detailed error modal
      }
    },

    onSuccess: () => {
      setRetryCount(0); // Reset on success
    },
    showErrorNotification: true,
    showSuccessNotification: true,
  });

  return (
    <div>
      <h2>Board Manager</h2>
      {loading && <div>Syncing with Trello...</div>}

      <div>
        {boards.length} boards loaded
        {retryCount > 0 && <span> (Retrying... {retryCount}/3)</span>}
      </div>
    </div>
  );
}
```

### **3. Article-to-Trello Integration (Enhanced)**

```tsx
function ArticleToTrelloConverter({ article }: { article: CurrentArticle }) {
  const trelloService = new TrelloApiService();

  // ✅ Success notifications for better UX
  const { boards, loading } = useTrelloBoards(trelloService, {
    autoFetch: true,
    errorMessage: "Could not connect to Trello",
    showSuccessNotification: true,
    successMessage: "Trello boards loaded - ready to convert!",
  });

  if (loading) {
    return <div>Connecting to Trello...</div>;
  }

  return (
    <div className="article-converter">
      <h3>Convert "{article.title}" to Trello</h3>

      <select>
        <option>Select a board...</option>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>

      <button>
        Convert to Card
        {/* ✅ Card creation will also show success notification */}
      </button>
    </div>
  );
}
```

## 🎨 Notification Types & Styling

### **Success Notifications:**

- 🎉 **Board loaded** - "Boards loaded successfully"
- ✅ **Board created** - "Board 'My Board' created successfully"
- 🗑️ **Board deleted** - "Board deleted successfully"
- 📋 **Lists loaded** - "Lists loaded successfully"
- 🆕 **Card created** - "Card created successfully"

### **Error Notifications:**

- ❌ **Network errors** - "Failed to load boards: Network error"
- 🔒 **Auth errors** - "Failed to load boards: Unauthorized"
- 🚫 **API errors** - "Failed to create board: Invalid parameters"
- ⚠️ **Unknown errors** - "Failed to load boards: Unknown error"

### **Notification Positioning:**

All notifications appear in the **top-right corner** via `NotificationProvider` with:
- **Success**: Green background, auto-dismiss after 4 seconds
- **Error**: Red background, auto-dismiss after 8 seconds (longer for reading)
- **Info**: Blue background, auto-dismiss after 6 seconds

## 🛠️ Migration Guide

### **Before (Manual Error Handling):**

```tsx
// ❌ Old way - manual error handling
function OldComponent() {
  const { boards, loading, error, refetch } = useTrelloBoards(trelloService);

  useEffect(() => {
    if (error) {
      alert("Error: " + error); // Manual error display
    }
  }, [error]);

  return (
    <div>
      {error && <div className="error">Error: {error}</div>}
      {loading && <div>Loading...</div>}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### **After (Automatic Notifications):**

```tsx
// ✅ New way - automatic notifications
function NewComponent() {
  const { boards, loading, refetch } = useTrelloBoards(trelloService, {
    errorMessage: "Failed to load boards",
    showErrorNotification: true, // ✅ Automatic error notifications
  });

  return (
    <div>
      {/* ✅ No manual error UI needed */}
      {loading && <div>Loading...</div>}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## 📋 Available Options

All Trello hooks now support these notification options:

```typescript
interface TrelloHookNotificationOptions {
  errorMessage?: string; // Custom error message prefix
  onError?: (error: Error) => void; // Error callback
  onSuccess?: (data: any) => void; // Success callback
  showErrorNotification?: boolean; // Default: true
  showSuccessNotification?: boolean; // Default: false
  successMessage?: string; // Custom success message
}
```

## 🎯 Best Practices

### **✅ DO:**

- Enable success notifications for user-triggered actions (create, delete)
- Use custom error messages that are user-friendly
- Implement `onSuccess` callbacks for analytics/tracking
- Use silent mode for background/polling operations

### **❌ DON'T:**

- Show success notifications for every data fetch (too noisy)
- Use technical error messages that confuse users
- Forget to handle edge cases in error callbacks
- Mix manual error handling with automatic notifications

---

**🎉 Result:** Clean, user-friendly error handling with professional notifications throughout your Trello integration!
