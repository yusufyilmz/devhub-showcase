# Chat UI Components

Pure presentational chat components with **no business logic**. Use these building blocks to create any chat interface.

## 📦 Components

### ChatBubble

Message bubble with variants for sent/received messages.

```tsx
import { ChatBubble, ChatBubbleGroup, ChatBubbleReactions, ChatBubbleTimestamp } from "@shared/ui";

<ChatBubbleGroup align="right">
  <ChatBubble maxWidth="70%" variant="sent">
    Hello! How are you?
  </ChatBubble>
  <ChatBubbleTimestamp time="2:30 PM" />
  <ChatBubbleReactions
    onReactionClick={(emoji) => console.log(emoji)}
    reactions={[
      { active: true, count: 3, emoji: "👍" },
      { count: 1, emoji: "❤️" },
    ]}
  />
</ChatBubbleGroup>;
```

**Props:**
- `variant`: `'sent'` | `'received'` | `'system'`
- `size`: `'sm'` | `'md'` | `'lg'`
- `rounded`: `'sm'` | `'md'` | `'lg'` | `'full'`
- `maxWidth`: CSS width value

### ChatAvatar

Avatar with online status and typing indicator.

```tsx
import { ChatAvatar, ChatAvatarGroup } from '@shared/ui'

<ChatAvatar
  alt="John Doe"
  fallback="JD"
  online={true}
  size="md"
  src="/avatar.jpg"
  typing={false}
/>

<ChatAvatarGroup
  avatars={[
    { fallback: 'U1', src: '/user1.jpg' },
    { fallback: 'U2', src: '/user2.jpg' },
    { fallback: 'U3', src: '/user3.jpg' },
  ]}
  max={3}
  size="sm"
/>
```

**Props:**
- `size`: `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'`
- `online`: boolean - shows online badge
- `typing`: boolean - shows typing animation

### ChatInput

Message input with send button and actions.

```tsx
import { ChatInput, ChatInputAction } from '@shared/ui'

const [message, setMessage] = useState('')

<ChatInput
  value={message}
  onValueChange={setMessage}
  onSubmit={(value) => console.log('Send:', value)}
  placeholder="Type a message..."
  maxLength={5000}
  showCharacterCount={true}
  leftActions={
    <>
      <ChatInputAction icon="📎" label="Attach file" />
      <ChatInputAction icon="😊" label="Add emoji" />
    </>
  }
/>
```

**Features:**
- ✅ Auto-resizing textarea
- ✅ Character counter
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Custom action buttons
- ✅ Controlled component

### ChatList

Scrollable message container with load more.

```tsx
import { ChatList, ChatListEmpty, ChatListItem, ChatListSeparator } from "@shared/ui";

<ChatList
  loading={false}
  onLoadMore={() => console.log("Load more")}
  showLoadMore={true}
  showScrollButton={true}
>
  <ChatListSeparator label="Today" />

  <ChatListItem isOwn={false}>
    <ChatBubble variant="received">Hello!</ChatBubble>
  </ChatListItem>

  <ChatListItem isOwn={true}>
    <ChatBubble variant="sent">Hi there!</ChatBubble>
  </ChatListItem>

  <ChatListEmpty description="Start chatting!" icon="💬" title="No messages" />
</ChatList>;
```

**Features:**
- ✅ Auto-scroll detection
- ✅ Scroll to bottom button
- ✅ Load more button
- ✅ Empty state
- ✅ Date separators

### ChatTyping

Animated typing indicator.

```tsx
import { ChatTyping, ChatTypingText } from '@shared/ui'

<ChatTyping showBubble={true} size="md" />

<ChatTypingText
  users={['Alice', 'Bob']}
  size="sm"
/>
// Shows: "Alice and Bob are typing..."
```

**Props:**
- `size`: `'sm'` | `'md'` | `'lg'`
- `showBubble`: boolean - wrap in bubble
- `users`: string or array - for ChatTypingText

### ChatMessageActions

Action buttons with tooltips.

```tsx
import { ChatMessageActions, ChatQuickReactions } from '@shared/ui'

<ChatMessageActions
  actions={[
    { icon: '👍', label: 'React', onClick: () => {} },
    { icon: '↪', label: 'Reply', onClick: () => {} },
    { icon: '✎', label: 'Edit', onClick: () => {} },
    { icon: '🗑', label: 'Delete', onClick: () => {}, variant: 'destructive' },
  ]}
  align="right"
  position="top"
  visible={hovering}
/>

<ChatQuickReactions
  emojis={['👍', '❤️', '😂', '😮']}
  onReact={(emoji) => console.log(emoji)}
/>
```

## 🎨 Complete Example

```tsx
import {
  ChatAvatar,
  ChatBubble,
  ChatBubbleGroup,
  ChatBubbleReactions,
  ChatBubbleTimestamp,
  ChatInput,
  ChatList,
  ChatListItem,
  ChatListSeparator,
  ChatMessageActions,
  ChatTypingText,
} from "@shared/ui";

function ChatDemo() {
  const [message, setMessage] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen">
      {/* Message List */}
      <ChatList className="flex-1">
        <ChatListSeparator label="Today" />

        {/* Received Message */}
        <ChatListItem
          isOwn={false}
          onMouseEnter={() => setHoveredId("msg-1")}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex gap-2">
            <ChatAvatar fallback="JD" online={true} size="sm" src="/avatar.jpg" />

            <div className="relative">
              <ChatBubbleGroup align="left">
                <ChatBubble maxWidth="400px" variant="received">
                  Hey! How's it going?
                </ChatBubble>
                <ChatBubbleTimestamp time="2:30 PM" />
              </ChatBubbleGroup>

              <ChatMessageActions
                actions={[
                  { icon: "👍", label: "React", onClick: () => {} },
                  { icon: "↪", label: "Reply", onClick: () => {} },
                ]}
                visible={hoveredId === "msg-1"}
              />
            </div>
          </div>
        </ChatListItem>

        {/* Sent Message */}
        <ChatListItem isOwn={true}>
          <ChatBubbleGroup align="right">
            <ChatBubble maxWidth="400px" variant="sent">
              Great! Just working on the new chat UI.
            </ChatBubble>
            <ChatBubbleTimestamp time="2:31 PM" />
            <ChatBubbleReactions
              onReactionClick={(emoji) => console.log(emoji)}
              reactions={[
                { active: true, count: 2, emoji: "👍" },
                { count: 1, emoji: "🔥" },
              ]}
            />
          </ChatBubbleGroup>
        </ChatListItem>

        {/* Typing Indicator */}
        <ChatListItem isOwn={false}>
          <div className="flex gap-2">
            <ChatAvatar fallback="JD" size="sm" typing={true} />
            <ChatTyping showBubble={true} size="md" />
          </div>
        </ChatListItem>
      </ChatList>

      {/* Input */}
      <ChatInput
        onSubmit={(value) => {
          console.log("Send:", value);
          setMessage("");
        }}
        onValueChange={setMessage}
        placeholder="Type a message..."
        value={message}
      />
    </div>
  );
}
```

## 🎯 Key Features

### Pure Presentational

- ✅ No business logic
- ✅ No WebSocket code
- ✅ No state management
- ✅ Just props in, UI out

### Fully Controlled

- ✅ You control all state
- ✅ You handle all events
- ✅ You manage data flow

### Theme Integrated

- ✅ Uses your theme system
- ✅ Respects dark mode
- ✅ System props support

### Accessible

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader friendly

## 🔧 Customization

All components support:
- `className` - Custom CSS classes
- System props (margin, padding, colors, etc.)
- Full TypeScript support
- CVA variants

## 📚 Documentation

For more examples and advanced usage, see:
- Component source files for full prop definitions
- Storybook (if available)
- Your main UI library documentation

---

**These are pure UI components** - combine them with your business logic (WebSocket, state management, etc.) to build complete chat applications!
