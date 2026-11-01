# Pure UI Chat Components

## 🎯 Overview

These are **pure presentational components** with **zero business logic**. They're designed to be building blocks for any chat interface.

### What They Are

✅ Pure UI components  
✅ Fully controlled (you manage state)  
✅ Theme-integrated  
✅ Accessible  
✅ TypeScript typed

### What They're NOT

❌ No WebSocket code  
❌ No state management  
❌ No API calls  
❌ No data fetching

## 📦 Components

### 1. ChatBubble

Message bubble with variants and reactions.

**Variants:** `sent`, `received`, `system`  
**Features:** Custom max-width, reactions, timestamps

```tsx
<ChatBubble maxWidth="70%" variant="sent">
  Hello there!
</ChatBubble>;
```

### 2. ChatAvatar

Avatar with online status and typing indicator.

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`  
**Features:** Online badge, typing animation, group avatars

```tsx
<ChatAvatar fallback="JD" online={true} size="md" src="/avatar.jpg" typing={false} />;
```

### 3. ChatInput

Message input with send button and actions.

**Features:** Auto-resize, character count, keyboard shortcuts, action buttons

```tsx
<ChatInput
  maxLength={5000}
  onSubmit={handleSend}
  onValueChange={setMessage}
  showCharacterCount
  value={message}
/>;
```

### 4. ChatList

Scrollable message container.

**Features:** Auto-scroll, load more, empty state, date separators

```tsx
<ChatList onLoadMore={loadMore} showLoadMore showScrollButton>
  {messages.map((msg) => (
    <ChatListItem key={msg.id}>
      <ChatBubble>{msg.text}</ChatBubble>
    </ChatListItem>
  ))}
</ChatList>;
```

### 5. ChatTyping

Animated typing indicator.

**Features:** Three bouncing dots, bubble wrapper, text variant

```tsx
<ChatTyping showBubble size="md" />
<ChatTypingText users={['Alice', 'Bob']} />
```

### 6. ChatMessageActions

Action buttons for messages.

**Features:** Tooltips, grouped actions, quick reactions

```tsx
<ChatMessageActions
  actions={[
    { icon: "👍", label: "React", onClick: handleReact },
    { icon: "↪", label: "Reply", onClick: handleReply },
  ]}
  visible={hovering}
/>;
```

## 🔧 Usage Patterns

### Basic Message Display

```tsx
<ChatListItem isOwn={false}>
  <div className="flex gap-2">
    <ChatAvatar fallback="JD" online />
    <ChatBubbleGroup align="left">
      <ChatBubble variant="received">Hey! How's it going?</ChatBubble>
      <ChatBubbleTimestamp time="2:30 PM" />
    </ChatBubbleGroup>
  </div>
</ChatListItem>;
```

### Message with Reactions

```tsx
<ChatBubbleGroup align="left">
  <ChatBubble variant="received">Great work on the new feature! 🚀</ChatBubble>
  <ChatBubbleReactions
    onReactionClick={handleReaction}
    reactions={[
      { active: true, count: 5, emoji: "👍" },
      { count: 2, emoji: "🔥" },
    ]}
  />
</ChatBubbleGroup>;
```

### Hover Actions

```tsx
const [hoveredId, setHoveredId] = useState(null)

<ChatListItem
  onMouseEnter={() => setHoveredId(msg.id)}
  onMouseLeave={() => setHoveredId(null)}
>
  <div className="relative">
    <ChatBubble>{msg.text}</ChatBubble>
    
    <ChatMessageActions
      actions={messageActions}
      visible={hoveredId === msg.id}
    />
  </div>
</ChatListItem>
```

### Group Chat with Typing

```tsx
<ChatAvatarGroup
  avatars={participants}
  max={3}
/>

<ChatTypingText 
  users={['Alice', 'Bob']}
  size="sm"
/>
// Shows: "Alice and Bob are typing..."
```

## 🎨 Styling

All components support:
- `className` prop
- System props (m, p, background, etc.)
- CVA variants
- Theme variables

```tsx
<ChatBubble background="primary" className="custom-class" m={2} p={4} variant="sent" />;
```

## ♿ Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management

## 📝 TypeScript

Fully typed with TypeScript:

```tsx
import type {
  ChatAvatarProps,
  ChatBubbleProps,
  ChatInputProps,
  ChatListProps,
  ChatMessageAction,
  ChatTypingProps,
} from "@shared/ui";
```

## 🔗 Integration

### With React State

```tsx
function MyChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = (value: string) => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        isOwn: true,
        text: value,
      },
    ]);
    setInput("");
  };

  return (
    <>
      <ChatList>
        {messages.map((msg) => (
          <ChatListItem isOwn={msg.isOwn} key={msg.id}>
            <ChatBubble variant={msg.isOwn ? "sent" : "received"}>{msg.text}</ChatBubble>
          </ChatListItem>
        ))}
      </ChatList>

      <ChatInput onSubmit={handleSend} onValueChange={setInput} value={input} />
    </>
  );
}
```

### With WebSocket (Your Logic)

```tsx
function MyChat() {
  const { messages, sendMessage, isTyping } = useWebSocket();
  const [input, setInput] = useState("");

  return (
    <>
      <ChatList>
        {messages.map((msg) => (
          <ChatListItem key={msg.id}>
            <ChatBubble>{msg.text}</ChatBubble>
          </ChatListItem>
        ))}

        {isTyping && <ChatTyping showBubble />}
      </ChatList>

      <ChatInput
        onSubmit={(v) => {
          sendMessage(v); // Your logic
          setInput("");
        }}
        onValueChange={(v) => {
          setInput(v);
          sendTypingIndicator(); // Your logic
        }}
        value={input}
      />
    </>
  );
}
```

## 🎯 Design Principles

### Composition Over Configuration

Build complex UIs by composing simple components.

```tsx
// ✅ Good - Compose
<ChatBubbleGroup>
  <ChatBubble>Message</ChatBubble>
  <ChatBubbleTimestamp time="2:30" />
  <ChatBubbleReactions reactions={[...]} />
</ChatBubbleGroup>

// ❌ Avoid - Single monolithic component
<Message 
  text="Message"
  time="2:30"
  reactions={[...]}
  showAvatar
  showActions
  // ... 50 props
/>
```

### Controlled Components

You control all state.

```tsx
// ✅ Good - Controlled
<ChatInput
  onSubmit={handleSend}
  onValueChange={setInput}
  value={input}
/>

// ❌ Avoid - Uncontrolled
<ChatInput defaultValue="..." />
```

### Separation of Concerns

UI components handle presentation, you handle logic.

```tsx
// ✅ Good - Separated
function MyChat() {
  const { messages, send } = useChatLogic() // Your logic
  
  return (
    <ChatList>
      {messages.map(msg => (
        <ChatBubble>{msg.text}</ChatBubble>
      ))}
    </ChatList>
  )
}

// ❌ Avoid - Mixed
<ChatList 
  onConnect={...}
  onDisconnect={...}
  websocketUrl="..."
  // UI component shouldn't know about WebSocket
/>
```

## 📚 Examples

See `example.tsx` for complete working examples:
- Simple chat
- Advanced chat with reactions
- Group chat
- Empty state
- Quick reactions

## 🔗 Related

- **Business Logic Version**: `/packages/assistant/src/chat` - Full chat system with WebSocket
- **UI Library**: Other components in `/packages/ui`
- **Theme System**: Theme variables and customization

---

**Remember:** These are pure UI components. Combine them with your own:
- State management (useState, Zustand, Redux, etc.)
- WebSocket handling
- API calls
- Business logic

This separation makes them:
- ✅ Reusable across projects
- ✅ Easy to test
- ✅ Simple to maintain
- ✅ Framework agnostic
