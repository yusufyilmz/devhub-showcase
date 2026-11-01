# Enhanced Chat Components 🎨

Premium versions of chat components built with Styled Components for a beautiful, modern chat interface.

## Overview

The enhanced chat components leverage `AppearanceCard`, `Paper`, `StyledTextField`, `ActionButton`, and `StyledIconButton` to create a premium chat experience with:

- ✨ Glass morphism effects
- 🎯 Smooth hover animations
- 💫 Glow effects
- 🎨 Premium gradients
- 📱 Responsive design
- 🌓 Dark mode support

## Components

### EnhancedChatBubble

Enhanced message bubble with hover effects and animations.

```tsx
import { EnhancedChatBubble } from "@shared/ui/components/chat/chat-bubble-enhanced";

<EnhancedChatBubble enableGlow enableHover maxWidth="80%" variant="sent">
  Your message here
</EnhancedChatBubble>;
```

**Features:**

- Hover scale effects
- Optional glow on hover
- Glass morphism support
- Gradient backgrounds for sent messages
- Smooth animations

### EnhancedChatInput

Premium input field with styled buttons and character count.

```tsx
import {
  EnhancedChatInput,
  EnhancedChatInputAction,
} from "@shared/ui/components/chat/chat-input-enhanced";

<EnhancedChatInput
  glassInput
  leftActions={
    <>
      <EnhancedChatInputAction icon={<Paperclip />} label="Attach" />
      <EnhancedChatInputAction icon={<Image />} label="Image" />
    </>
  }
  maxLength={500}
  onSubmit={handleSend}
  onValueChange={setValue}
  rightActions={
    <>
      <EnhancedChatInputAction icon={<Smile />} label="Emoji" />
      <EnhancedChatInputAction colorScheme="info" icon={<Mic />} label="Voice" />
    </>
  }
  sendButtonColor="primary"
  showCharacterCount
  value={value}
  variant="glass"
/>;
```

**Features:**

- Uses `StyledTextField` for input
- `ActionButton` for send button
- `StyledIconButton` for action buttons
- Character count indicator
- Glass effect support
- Smooth animations

### EnhancedChatList

Scrollable message container with premium background effects.

```tsx
import {
  EnhancedChatList,
  EnhancedChatListItem,
  EnhancedChatListSeparator,
} from "@shared/ui/components/chat/chat-list-enhanced";

<EnhancedChatList glassEffect showBottomFade showScrollButton showTopFade>
  <EnhancedChatListSeparator label="Today" sticky />

  <EnhancedChatListItem isOwn={false}>
    <EnhancedChatBubble variant="received">Message content</EnhancedChatBubble>
  </EnhancedChatListItem>
</EnhancedChatList>;
```

**Features:**

- Uses `Paper` for background
- Gradient fade overlays
- Smooth scroll animations
- Floating scroll-to-bottom button
- Glass morphism support
- Sticky date separators

### EnhancedChatBubbleReactions

Interactive reaction buttons with smooth animations.

```tsx
<EnhancedChatBubbleReactions
  onReactionClick={(emoji) => console.log("Clicked:", emoji)}
  reactions={[
    { active: true, count: 12, emoji: "👍" },
    { active: false, count: 8, emoji: "❤️" },
  ]}
/>;
```

**Features:**

- Hover scale effects
- Active state styling
- Smooth transitions
- Count badges

## Complete Example

```tsx
import { useState } from "react";

import { Image, Mic, Paperclip, Smile } from "lucide-react";

import {
  EnhancedChatBubble,
  EnhancedChatBubbleGroup,
  EnhancedChatBubbleReactions,
  EnhancedChatBubbleTimestamp,
} from "@shared/ui/components/chat/chat-bubble-enhanced";
import {
  EnhancedChatInput,
  EnhancedChatInputAction,
} from "@shared/ui/components/chat/chat-input-enhanced";
import {
  EnhancedChatList,
  EnhancedChatListItem,
  EnhancedChatListSeparator,
} from "@shared/ui/components/chat/chat-list-enhanced";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = (value: string) => {
    setMessages([
      ...messages,
      {
        content: value,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        variant: "sent",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col">
      <EnhancedChatList className="flex-1" glassEffect showBottomFade showTopFade>
        <EnhancedChatListSeparator label="Today" />

        {messages.map((msg) => (
          <EnhancedChatListItem isOwn={msg.variant === "sent"} key={msg.id}>
            <EnhancedChatBubbleGroup align={msg.variant === "sent" ? "right" : "left"}>
              <EnhancedChatBubble
                enableGlow={msg.variant === "sent"}
                enableHover
                variant={msg.variant}
              >
                {msg.content}
              </EnhancedChatBubble>
              <EnhancedChatBubbleTimestamp showIcon time={msg.timestamp} />
            </EnhancedChatBubbleGroup>
          </EnhancedChatListItem>
        ))}
      </EnhancedChatList>

      <EnhancedChatInput
        leftActions={
          <>
            <EnhancedChatInputAction icon={<Paperclip />} label="Attach" />
            <EnhancedChatInputAction icon={<Image />} label="Image" />
          </>
        }
        onSubmit={handleSend}
        onValueChange={setInput}
        placeholder="Type a message..."
        rightActions={
          <>
            <EnhancedChatInputAction icon={<Smile />} label="Emoji" />
            <EnhancedChatInputAction colorScheme="info" icon={<Mic />} label="Voice" />
          </>
        }
        sendButtonColor="primary"
        value={input}
      />
    </div>
  );
}
```

## Variants

### Glass Morphism Chat

Perfect for overlays or premium interfaces:

```tsx
<div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
  <EnhancedChatList glassEffect>
    <EnhancedChatBubble glassEffect variant="received">
      Message with glass effect
    </EnhancedChatBubble>
  </EnhancedChatList>

  <EnhancedChatInput glassInput onValueChange={setInput} value={input} variant="glass" />
</div>;
```

### Minimal Chat

Clean and simple:

```tsx
<EnhancedChatInput
  onValueChange={setInput}
  placeholder="Type..."
  value={input}
  variant="minimal"
/>;
```

## Props Reference

### EnhancedChatBubbleProps

| Prop          | Type                               | Default      | Description           |
| ------------- | ---------------------------------- | ------------ | --------------------- |
| `variant`     | `'sent' \| 'received' \| 'system'` | `'received'` | Message type          |
| `enableHover` | `boolean`                          | `true`       | Enable hover effects  |
| `enableGlow`  | `boolean`                          | `false`      | Enable glow on hover  |
| `maxWidth`    | `string`                           | `'75%'`      | Maximum bubble width  |
| `glassEffect` | `boolean`                          | `false`      | Glass morphism effect |

### EnhancedChatInputProps

| Prop                 | Type                                | Default     | Description                |
| -------------------- | ----------------------------------- | ----------- | -------------------------- |
| `value`              | `string`                            | -           | Input value (controlled)   |
| `onValueChange`      | `(value: string) => void`           | -           | Change handler             |
| `onSubmit`           | `(value: string) => void`           | -           | Submit handler             |
| `variant`            | `'default' \| 'glass' \| 'minimal'` | `'default'` | Visual variant             |
| `glassInput`         | `boolean`                           | `false`     | Use glass effect for input |
| `sendButtonColor`    | `'primary' \| 'success' \| 'info'`  | `'primary'` | Send button color          |
| `showCharacterCount` | `boolean`                           | `false`     | Show character count       |
| `maxLength`          | `number`                            | `5000`      | Maximum characters         |

### EnhancedChatListProps

| Prop               | Type                              | Default     | Description                  |
| ------------------ | --------------------------------- | ----------- | ---------------------------- |
| `variant`          | `'default' \| 'muted' \| 'glass'` | `'default'` | Background variant           |
| `glassEffect`      | `boolean`                         | `false`     | Glass morphism background    |
| `showTopFade`      | `boolean`                         | `true`      | Gradient fade at top         |
| `showBottomFade`   | `boolean`                         | `true`      | Gradient fade at bottom      |
| `showScrollButton` | `boolean`                         | `true`      | Show scroll to bottom button |

## Styling

All enhanced components:

- ✅ Use CSS variables for theming
- ✅ Support dark mode out of the box
- ✅ Respect the global theme settings
- ✅ Can be customized with className prop
- ✅ Include smooth transitions and animations

## Migration from Basic Components

The enhanced components maintain the same API as the basic components, so migration is straightforward:

```tsx
// Before
import { ChatBubble } from "@shared/ui/components/chat";
// After
import { EnhancedChatBubble as ChatBubble } from "@shared/ui/components/chat/chat-bubble-enhanced";
```

You can also use both side-by-side and gradually migrate.
