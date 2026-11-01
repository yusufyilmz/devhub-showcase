import { create } from "zustand";

import { createComponentLogger } from "@shared/utils/client-logger";

import { chatV2LogDebug } from "./utils";

type Post = {
  uuid: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

type Channel = {
  id: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
};

type PublicProfile = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
};

type MessagesByChannel = Record<number, Post[]>;

const EMPTY_POSTS: Post[] = [];

const storeLogger = createComponentLogger("ChatV2Store");

export interface ChatState {
  activeChannelId: number | null;
  appendMessage: (channelId: number, post: Post) => void;
  channels: Channel[];

  clear: () => void;
  hydrateFromSnapshot: (payload: {
    channels: Channel[];
    posts: Record<number | string, Post[]>;
    profiles: Record<string, PublicProfile>;
  }) => void;
  messagesByChannel: MessagesByChannel;
  profiles: Record<string, PublicProfile>;
  removeMessage: (channelId: number, uuid: string) => void;

  setActiveChannel: (channelId: number | null) => void;

  setChannels: (channels: Channel[]) => void;
  setChannelTyping: (channelId: number, isTyping: boolean) => void;

  setMessagesForChannel: (channelId: number, posts: Post[]) => void;

  setProfiles: (profiles: Record<string, PublicProfile>) => void;
  setSubscribeAck: (ack: boolean) => void;
  setSubscribeSent: (sent: boolean) => void;

  setWsStatus: (status: number | null) => void;
  subscribeAck: boolean;
  subscribeSent: boolean;
  typingChannels: Record<number, boolean>;
  updateChannelMeta: (channelId: number, updates: Partial<Channel>) => void;
  updateMessage: (channelId: number, uuid: string, updates: Partial<Post>) => void;
  upsertChannel: (channel: Channel) => void;
  wsStatus: number | null;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  activeChannelId: null,

  appendMessage: (channelId, post) => {
    set((state) => {
      const existing = state.messagesByChannel[channelId] ?? [];
      const alreadyExists = existing.some((entry) => entry.uuid === post.uuid);

      chatV2LogDebug(storeLogger, "appendMessage", {
        channelId,
        duplicate: alreadyExists,
        existingMessages: existing.length,
        uuid: post.uuid,
      });

      const nextMessages: MessagesByChannel = {
        ...state.messagesByChannel,
        [channelId]: alreadyExists ? existing : [...existing, post],
      };

      return {
        messagesByChannel: nextMessages,
      };
    });
  },
  channels: [],

  clear: () => {
    chatV2LogDebug(storeLogger, "clear store state");
    set({
      activeChannelId: null,
      channels: [],
      messagesByChannel: {},
      profiles: {},
      subscribeAck: false,
      subscribeSent: false,
      typingChannels: {},
      wsStatus: null,
    });
  },

  hydrateFromSnapshot: ({ channels, posts, profiles }) => {
    chatV2LogDebug(storeLogger, "hydrateFromSnapshot called", {
      channels: channels.length,
      postsKeys: Object.keys(posts).length,
      profileCount: Object.keys(profiles ?? {}).length,
    });
    const normalizedPosts: MessagesByChannel = {};
    for (const [key, value] of Object.entries(posts)) {
      const numericKey = Number(key);
      if (Number.isNaN(numericKey)) continue;
      normalizedPosts[numericKey] = value;
    }

    set({
      channels,
      messagesByChannel: normalizedPosts,
      profiles,
    });
  },
  messagesByChannel: {},
  profiles: {},

  removeMessage: (channelId, uuid) => {
    set((state) => {
      const existing = state.messagesByChannel[channelId] ?? [];
      chatV2LogDebug(storeLogger, "removeMessage", {
        channelId,
        existingMessages: existing.length,
        uuid,
      });
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: existing.filter((entry) => entry.uuid !== uuid),
        },
      };
    });
  },

  setActiveChannel: (channelId) => {
    chatV2LogDebug(storeLogger, "setActiveChannel", { channelId });
    set({ activeChannelId: channelId });
  },

  setChannels: (channels) => {
    chatV2LogDebug(storeLogger, "setChannels", { count: channels.length });
    set({ channels });
  },

  setChannelTyping: (channelId, isTyping) => {
    set((state) => ({
      typingChannels: {
        ...state.typingChannels,
        [channelId]: isTyping,
      },
    }));
    chatV2LogDebug(storeLogger, "setChannelTyping", { channelId, isTyping });
  },

  setMessagesForChannel: (channelId, posts) => {
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: posts,
      },
    }));
    chatV2LogDebug(storeLogger, "setMessagesForChannel", {
      channelId,
      count: posts.length,
    });
  },

  setProfiles: (profiles) => {
    chatV2LogDebug(storeLogger, "setProfiles", {
      count: Object.keys(profiles ?? {}).length,
    });
    set({ profiles });
  },

  setSubscribeAck: (ack) => {
    chatV2LogDebug(storeLogger, "setSubscribeAck", { ack });
    set({ subscribeAck: ack });
  },

  setSubscribeSent: (sent) => {
    chatV2LogDebug(storeLogger, "setSubscribeSent", { sent });
    set({ subscribeSent: sent });
  },

  setWsStatus: (status) => {
    chatV2LogDebug(storeLogger, "setWsStatus", { status });
    set({ wsStatus: status });
  },
  subscribeAck: false,
  subscribeSent: false,
  typingChannels: {},

  updateChannelMeta: (channelId, updates) => {
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === channelId ? { ...channel, ...updates } : channel,
      ),
    }));
    chatV2LogDebug(storeLogger, "updateChannelMeta", {
      channelId,
      updates,
    });
  },

  updateMessage: (channelId, uuid, updates) => {
    set((state) => {
      const existing = state.messagesByChannel[channelId] ?? [];
      chatV2LogDebug(storeLogger, "updateMessage", {
        channelId,
        exists: existing.some((entry) => entry.uuid === uuid),
        uuid,
      });
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: existing.map((entry) =>
            entry.uuid === uuid ? { ...entry, ...updates } : entry,
          ),
        },
      };
    });
  },

  upsertChannel: (channel) => {
    set((state) => {
      const exists = state.channels.some((item) => item.id === channel.id);
      chatV2LogDebug(storeLogger, "upsertChannel", {
        channelId: channel.id,
        exists,
      });
      return {
        channels: exists
          ? state.channels.map((item) => (item.id === channel.id ? { ...item, ...channel } : item))
          : [...state.channels, channel],
      };
    });
  },
  wsStatus: null,
}));

export const chatSelectors = {
  activeChannel: (state: ChatState) =>
    state.channels.find((channel) => channel.id === state.activeChannelId) ?? null,
  activeChannelId: (state: ChatState) => state.activeChannelId,
  activeMessages: (state: ChatState) =>
    state.activeChannelId
      ? (state.messagesByChannel[state.activeChannelId] ?? EMPTY_POSTS)
      : EMPTY_POSTS,
  channels: (state: ChatState) => state.channels,
  channelTyping: (state: ChatState) => state.typingChannels,
  isActiveChannelTyping: (state: ChatState) =>
    state.activeChannelId ? !!state.typingChannels[state.activeChannelId] : false,
  messagesByChannel: (state: ChatState) => state.messagesByChannel,
  profiles: (state: ChatState) => state.profiles,
  subscribeAck: (state: ChatState) => state.subscribeAck,
  subscribeSent: (state: ChatState) => state.subscribeSent,
  wsStatus: (state: ChatState) => state.wsStatus,
};

export const getChatState = () => useChatStore.getState();
