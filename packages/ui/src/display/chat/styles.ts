import type { CSSProperties } from "react";

import { cva } from "class-variance-authority";

export const chatVariants = cva("relative overflow-hidden backdrop-blur-xl", {
  defaultVariants: {
    shadow: "md",
    size: "md",
    variant: "default",
  },
  variants: {
    shadow: {
      lg: "shadow-[var(--shadow-2xl)]",
      md: "shadow-[var(--shadow-xl)]",
      none: "shadow-none",
      sm: "shadow-[var(--shadow-md)]",
      xl: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
    },
    size: {
      lg: "rounded-[var(--radius-2xl)]",
      md: "rounded-[var(--radius-xl)]",
      sm: "rounded-[var(--radius-lg)]",
    },
    variant: {
      card: "bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 border border-[var(--border)] shadow-[var(--shadow-2xl)]",
      default:
        "bg-gradient-to-br from-[var(--background)] to-[var(--card)] border border-[var(--border)] shadow-[var(--shadow-xl)]",
      ghost: "bg-transparent",
    },
  },
});

export const chatHeaderStyles = {
  chatHeader:
    "w-full p-[var(--spacing-lg)] bg-gradient-to-r from-[var(--background)] to-[var(--card)] backdrop-blur-xl shadow-[var(--shadow-sm)] relative overflow-hidden",
  chatHeader2: "w-full",
  element1: "absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-50",
  element2: "w-full relative z-10",
  element3: "ring-2 ring-[var(--primary)]/20 shadow-[var(--shadow-md)]",
  element4: "flex-1",
  element5: "text-[var(--foreground)] font-bold",
  element6: "text-[var(--muted-foreground)] text-sm",
  element7: "text-[var(--muted-foreground)] text-xs",
  element8: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
  element9: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
} as const;

export const chatInputStyles = {
  chatInput:
    "w-full p-[var(--spacing-lg)] bg-gradient-to-r from-[var(--background)] to-[var(--card)] backdrop-blur-xl shadow-[var(--shadow-sm)] relative overflow-hidden",
  chatInput2: "w-full",
  element1: "absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-30",
  element2: "w-full relative z-10",
  element3:
    "resize-none min-h-[120px] rounded-[var(--radius-lg)] border-2 border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 bg-[var(--background)]/90 backdrop-blur-sm shadow-[var(--shadow-sm)]",
  element4:
    "px-[var(--spacing-lg)] py-[var(--spacing-md)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/80",
  element5: "font-semibold text-[var(--primary-foreground)]",
  element6: "text-[var(--muted-foreground)]",
  element7: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
} as const;

export const chatMessageBubbleStyles = {
  chatMessageBubble: "group mb-4",
  chatMessageBubble2: "justify-end",
  chatMessageBubble3: "justify-start",
  chatMessageBubble4:
    "max-w-[70%] rounded-lg transition-all duration-300 shadow-lg backdrop-blur-md relative overflow-hidden border-2 flex flex-col",
  chatMessageBubble5:
    "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/30 border-blue-400",
  chatMessageBubble6: "bg-white text-gray-800 shadow-md border-gray-200",
  element1: "absolute inset-0 opacity-5",
  element2: "absolute inset-0 bg-gradient-to-br from-white/20 to-transparent",
  element3: "px-4 py-2 border-b border-white/10 relative z-10",
  element4: "ring-2 ring-white/30 shadow-md",
  element5: "font-semibold text-gray-800",
  element6: "text-gray-500 text-xs",
  element7: "opacity-70 text-sm font-medium",
  element8: "px-4 py-3 flex-1 relative z-10",
  element9: "whitespace-pre-wrap leading-relaxed",
  element10: "px-4 py-2 border-t border-white/10 relative z-10",
  element11: "opacity-80 text-sm",
  element12: "opacity-60 text-xs font-medium",
} as const;

export const chatTypingIndicatorStyles = {
  chatTypingIndicator: "justify-start mb-6",
  element1:
    "max-w-[70%] rounded-[var(--radius-lg)] px-[var(--spacing-md)] py-[var(--spacing-md)] bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-md)] border border-[var(--border)]/50 relative overflow-hidden",
  element2: "absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-50",
  element3: "relative z-10",
  element4: "bg-[var(--primary)] animate-bounce",
  element5: "bg-[var(--primary)] animate-bounce",
  element6: "bg-[var(--primary)] animate-bounce",
  element7: "text-[var(--muted-foreground)] font-medium",
} as const;

export const chatStyles = {
  chat: "flex flex-col h-full w-full",
  chat2: "w-full",
  chat3: "h-full",
  element1: "border-b border-[var(--border)]",
  element2:
    "flex-1 p-[var(--spacing-lg)] overflow-y-auto bg-gradient-to-b from-[var(--muted)]/20 to-[var(--background)]",
  element3: "min-h-0",
  element4: "h-48",
  element5:
    "bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/20 shadow-[var(--shadow-md)]",
  element6: "text-[var(--primary)]",
  element7: "text-[var(--foreground)] font-bold",
  element8: "text-[var(--muted-foreground)] text-center",
  element9: "border-t border-[var(--border)]",
} as const;

export const chatComposerStyles = {
  element1: "studio-chat-composer",
  element2: "sr-only",
  element3: "studio-chat-send",
} as const;

export const chatSidebarStyles = {
  chatSidebar:
    "w-80 border-r border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-2xl overflow-hidden",
  chatSidebar2:
    "w-full justify-start gap-4 rounded-none border-0 p-4 text-left transition-all duration-200",
  chatSidebar3: "bg-[var(--primary)]/10 text-[var(--primary)] border-r-2 border-[var(--primary)]",
  chatSidebar4: "hover:bg-[var(--muted)]/50 text-[var(--foreground)]",
  element1: "border-b border-[var(--border)]",
  element2:
    "bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/80 shadow-[var(--primary)]/30",
  element3: "text-sm font-bold text-white",
  element4: "font-bold text-[var(--foreground)]",
  element5: "text-[var(--muted-foreground)] leading-relaxed",
  element6: "border-b border-[var(--border)]",
  element7:
    "w-full bg-[var(--background)]/80 border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20",
  element8: "border-b border-[var(--border)]",
  element9:
    "w-full justify-start gap-4 rounded-2xl hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-[var(--accent)]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border-2 border-[var(--border)] hover:border-[var(--primary)]/30",
  element10:
    "bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/80 shadow-[var(--primary)]/30",
  element11: "text-lg font-bold text-white",
  element12: "font-semibold",
  element13: "flex-1 overflow-y-auto",
  element14: "border-b border-[var(--border)] last:border-b-0",
  element15: "bg-[var(--muted)]/30",
  element16: "font-semibold text-[var(--muted-foreground)] uppercase tracking-wide",
  element17: "min-w-0 flex-1",
  element18: "mb-1",
  element19: "font-semibold truncate",
  element20: "text-[var(--muted-foreground)] truncate",
  element21: "border-t border-[var(--border)]",
  element22: "w-full",
  element23: "text-[var(--muted-foreground)]",
  element24: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
} as const;

export const studioChatScreenStyles = {
  element1: "studio-chat-screen",
  element2: "studio-chat-sidebar",
  element3: "studio-chat-brand",
  element4: "studio-chat-sidebar-label",
  element5: "studio-chat-current",
  element6: "studio-chat-sidebar-note",
  element7: "studio-chat-main",
  element8: "studio-chat-topbar",
  element9: "studio-chat-subtitle",
  element10: "studio-chat-mobile-nav",
  element11: "studio-chat-body",
  element12: "studio-chat-thread",
  element13: "studio-chat-message",
  element14: "sr-only",
  element15: "studio-chat-progress",
  element16: "studio-chat-welcome",
  element17: "studio-chat-eyebrow",
  element18: "studio-chat-compose-area",
  element19: "studio-chat-error",
  element20: "studio-chat-suggestions",
  element21: "studio-chat-notice",
} as const;

export const chatTypingIndicatorInlineStyle1: CSSProperties = { animationDelay: "0.1s" };

export const chatTypingIndicatorInlineStyle2: CSSProperties = { animationDelay: "0.2s" };
