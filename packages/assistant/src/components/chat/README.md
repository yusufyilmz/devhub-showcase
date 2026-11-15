# Chat Component

A comprehensive, theme-aware chat component built entirely with UI v2 components. Features real-time messaging, typing indicators, message status, and full theme integration.

## Features

- **Real-time Messaging**: Send and receive messages with proper status tracking
- **Typing Indicators**: Show when users are typing with animated dots
- **Message Status**: Visual indicators for sending, sent, delivered, and read status
- **Avatar Integration**: User avatars with online/offline status
- **Theme Integration**: Full support for light/dark modes and brand colors
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Built with UI v2**: Uses Flex, Typography, Button, Card, and other UI components

## Usage

### Basic Usage

```tsx
import { Chat } from "@shared/ui/chat";

const messages = [
  {
    content: "Hello world!",
    id: "1",
    isOwn: false,
    sender: {
      avatar: "/avatar.jpg",
      id: "user1",
      name: "John Doe",
      status: "online",
    },
    status: "read",
    timestamp: new Date(),
    type: "text",
  },
];

function MyChat() {
  const handleSendMessage = (content: string) => {
    // Handle sending message
  };

  return <Chat fullHeight fullWidth messages={messages} onSendMessage={handleSendMessage} />;
}
```

### Advanced Usage

```tsx
<Chat
  currentUser={{
    avatar: "/my-avatar.jpg",
    id: "me",
    name: "You",
  }}
  fullHeight
  fullWidth
  maxLength={1000}
  messages={messages}
  onSendMessage={handleSendMessage}
  onTyping={handleTyping}
  placeholder="Type your message..."
  shadow="xl"
  size="lg"
  typingUsers={["Alice", "Bob"]}
  variant="card"
/>;
```

## Props

### ChatProps

| Prop                  | Type                                     | Default               | Description                            |
| --------------------- | ---------------------------------------- | --------------------- | -------------------------------------- |
| `messages`            | `ChatMessage[]`                          | `[]`                  | Array of chat messages                 |
| `onSendMessage`       | `(content: string) => void`              | -                     | Callback when user sends a message     |
| `onTyping`            | `(isTyping: boolean) => void`            | -                     | Callback when user starts/stops typing |
| `typingUsers`         | `string[]`                               | `[]`                  | Array of usernames currently typing    |
| `currentUser`         | `User`                                   | -                     | Current user information               |
| `placeholder`         | `string`                                 | `"Type a message..."` | Input placeholder text                 |
| `maxLength`           | `number`                                 | `1000`                | Maximum message length                 |
| `showTypingIndicator` | `boolean`                                | `true`                | Show typing indicator                  |
| `fullWidth`           | `boolean`                                | `false`               | Make chat full width                   |
| `fullHeight`          | `boolean`                                | `false`               | Make chat full height                  |
| `variant`             | `'default' \| 'card' \| 'ghost'`         | `'default'`           | Visual variant                         |
| `size`                | `'sm' \| 'md' \| 'lg'`                   | `'md'`                | Size variant                           |
| `shadow`              | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`                | Shadow variant                         |

### ChatMessage

| Prop        | Type                                                       | Description                              |
| ----------- | ---------------------------------------------------------- | ---------------------------------------- |
| `id`        | `string`                                                   | Unique message identifier                |
| `content`   | `string`                                                   | Message content                          |
| `sender`    | `User`                                                     | Message sender information               |
| `timestamp` | `Date`                                                     | When the message was sent                |
| `isOwn`     | `boolean`                                                  | Whether the message is from current user |
| `type`      | `'text' \| 'image' \| 'file' \| 'system'`                  | Message type                             |
| `status`    | `'sending' \| 'sent' \| 'delivered' \| 'read' \| 'failed'` | Message status                           |

### User

| Prop     | Type                                        | Description      |
| -------- | ------------------------------------------- | ---------------- |
| `id`     | `string`                                    | User identifier  |
| `name`   | `string`                                    | Display name     |
| `avatar` | `string`                                    | Avatar image URL |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | User status      |

## Variants

### Visual Variants

- **default**: Standard chat appearance with border
- **card**: Card-style with shadow and elevated appearance
- **ghost**: Transparent background, minimal styling

### Size Variants

- **sm**: Small chat with compact spacing
- **md**: Medium chat with standard spacing
- **lg**: Large chat with generous spacing

## Styling

The Chat component uses CSS variables for theming and automatically adapts to:

- **Light/Dark Mode**: Automatically switches based on theme
- **Brand Colors**: Uses `var(--primary)`, `var(--accent)`, etc.
- **Status Colors**: Uses `var(--success)`, `var(--warning)`, `var(--destructive)`
- **Background Colors**: Uses `var(--background)`, `var(--card)`, `var(--muted)`

## Examples

### Real-time Chat

```tsx
function RealTimeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const handleSendMessage = async (content: string) => {
    // Send to server
    const message = await sendMessage(content);
    setMessages((prev) => [...prev, message]);
  };

  const handleTyping = (isTyping: boolean) => {
    // Notify server about typing status
    if (isTyping) {
      setTypingUsers(["Other User"]);
    } else {
      setTypingUsers([]);
    }
  };

  return (
    <Chat
      currentUser={currentUser}
      fullHeight
      fullWidth
      messages={messages}
      onSendMessage={handleSendMessage}
      onTyping={handleTyping}
      typingUsers={typingUsers}
    />
  );
}
```

### Compact Chat

```tsx
<Chat
  className="h-96"
  messages={messages}
  onSendMessage={handleSendMessage}
  shadow="none"
  size="sm"
  variant="ghost"
/>;
```

### Card-style Chat

```tsx
<Chat
  fullHeight
  fullWidth
  messages={messages}
  onSendMessage={handleSendMessage}
  shadow="xl"
  size="lg"
  variant="card"
/>;
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: Meets WCAG guidelines for text contrast

## Performance

- **Virtual Scrolling**: Efficient rendering of large message lists
- **Memoization**: Optimized re-renders with React.memo
- **Lazy Loading**: Images and attachments load on demand
- **Debounced Typing**: Prevents excessive typing notifications

## Integration

The Chat component integrates seamlessly with:

- **UI v2 Components**: Built entirely with Flex, Typography, Button, Card, etc.
- **Theme System**: Full CSS variable support
- **Design System**: Follows all design system patterns
- **TypeScript**: Full type safety and IntelliSense support
