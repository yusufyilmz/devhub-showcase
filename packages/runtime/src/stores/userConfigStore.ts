import React from "react";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CHATSIZE } from "@shared/config";

interface UserConfigState {
  activeDir?: string;
  activeMode?: string;
  bgVideo?: boolean;
  borderRadius?: number;
  ccAvatarSize: number;
  chatHeight: number;
  chatWidth: number;
  hoverSidebar: (hover: boolean) => void;
  isCardShadow?: boolean;
  isCollapse?: boolean;
  isHorizontal?: boolean;
  isLanguage?: string;
  isLayout?: string;
  isMobileSidebar?: boolean;
  isSidebarHover?: boolean;
  MiniSidebarWidth?: number;
  open3dFileBrowser: boolean;
  openTitleState: boolean;
  reset: () => void;
  SidebarWidth?: number;
  setActiveMode: (mode: string) => void;
  setBorderRadius: (radius: number) => void;
  setCardShadow: (shadow: boolean) => void;
  setCCAvatarSize: (size: string | number) => void;
  setChatHeight: (height: string | number) => void;
  setChatWidth: (width: string | number) => void;
  setDir: (dir: string) => void;
  setLanguage: (language: string) => void;

  // Actions
  setShowUserConfig: (show: boolean) => void;
  showCaptcha?: boolean;
  showCsvToJson?: boolean;
  showMenu?: boolean;
  showNginxStats?: boolean;
  showParseInbox?: boolean;
  showShaderSnooze?: boolean;
  showUserConfig: boolean;
  TopbarHeight?: number;
  toggle3dFileBrowser: () => void;
  toggleBgVideo: () => void;
  toggleCaptcha: () => void;
  toggleCsvToJson: () => void;
  toggleHorizontal: (horizontal: boolean) => void;
  toggleLayout: (layout: string) => void;
  toggleMenu: () => void;
  toggleMobileSidebar: () => void;
  toggleNginxStats: () => void;
  toggleParseInbox: () => void;
  toggleShaderSnooze: () => void;
  toggleSidebar: () => void;
  toggleTileState: () => void;
  toggleUseVba: () => void;
  useVba: boolean;
}

const initialState = {
  activeDir: "ltr",
  activeMode: "light",
  bgVideo: false,
  borderRadius: 7,
  ccAvatarSize: CHATSIZE.chanelAvatar.default,
  chatHeight: CHATSIZE.default.height,
  chatWidth: CHATSIZE.default.width,
  isCardShadow: true,
  isCollapse: false, // to make sidebar Mini by default
  isHorizontal: true,
  isLanguage: "en",
  isLayout: "full", // This can be full or boxed
  isMobileSidebar: false,
  isSidebarHover: false,
  MiniSidebarWidth: 0,

  open3dFileBrowser: false,
  openTitleState: false,
  SidebarWidth: 270,
  showCaptcha: false,
  showCsvToJson: false,
  showMenu: false,
  showNginxStats: false,
  showParseInbox: false,
  showShaderSnooze: false,
  showUserConfig: false,
  TopbarHeight: 70,
  useVba: false,
};

export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hoverSidebar: (hover: boolean) => set({ isSidebarHover: hover }),

      reset: () => set(initialState),
      setActiveMode: (mode: string) => set({ activeMode: mode }),

      setBorderRadius: (radius: number) => set({ borderRadius: radius }),

      setCardShadow: (shadow: boolean) => set({ isCardShadow: shadow }),

      setCCAvatarSize: (size: string | number) =>
        set({ ccAvatarSize: Number.parseInt(String(size)) }),

      setChatHeight: (height: string | number) =>
        set({ chatHeight: Number.parseInt(String(height)) }),

      setChatWidth: (width: string | number) => set({ chatWidth: Number.parseInt(String(width)) }),

      setDir: (dir: string) => set({ activeDir: dir }),

      setLanguage: (language: string) => set({ isLanguage: language }),

      setShowUserConfig: (show: boolean) => set({ showUserConfig: show }),

      toggle3dFileBrowser: () => set((state) => ({ open3dFileBrowser: !state.open3dFileBrowser })),

      toggleBgVideo: () => set((state) => ({ bgVideo: !state.bgVideo })),

      toggleCaptcha: () => set((state) => ({ showCaptcha: !state.showCaptcha })),

      toggleCsvToJson: () => set((state) => ({ showCsvToJson: !state.showCsvToJson })),

      toggleHorizontal: (horizontal: boolean) => set({ isHorizontal: horizontal }),

      toggleLayout: (layout: string) => set({ isLayout: layout }),

      toggleMenu: () => set((state) => ({ showMenu: !state.showMenu })),

      toggleMobileSidebar: () => set((state) => ({ isMobileSidebar: !state.isMobileSidebar })),

      toggleNginxStats: () => set((state) => ({ showNginxStats: !state.showNginxStats })),

      toggleParseInbox: () => set((state) => ({ showParseInbox: !state.showParseInbox })),

      toggleShaderSnooze: () => set((state) => ({ showShaderSnooze: !state.showShaderSnooze })),

      toggleSidebar: () => set((state) => ({ isCollapse: !state.isCollapse })),

      toggleTileState: () => set((state) => ({ openTitleState: !state.openTitleState })),

      toggleUseVba: () => set((state) => ({ useVba: !state.useVba })),
    }),
    {
      name: "buzzy-userconfig-store", // unique name for localStorage key
      partialize: (state) => ({
        activeDir: state.activeDir,
        bgVideo: state.bgVideo,
        borderRadius: state.borderRadius,
        ccAvatarSize: state.ccAvatarSize,
        chatHeight: state.chatHeight,
        chatWidth: state.chatWidth,
        isCardShadow: state.isCardShadow,
        isCollapse: state.isCollapse,
        isHorizontal: state.isHorizontal,
        isLanguage: state.isLanguage,
        isLayout: state.isLayout,
        MiniSidebarWidth: state.MiniSidebarWidth,
        SidebarWidth: state.SidebarWidth,
        // Only persist these specific properties
        showUserConfig: state.showUserConfig,
        TopbarHeight: state.TopbarHeight,
        useVba: state.useVba,
      }),
      storage: createJSONStorage(() => localStorage),
      // Version control for schema changes
      version: 1,
    },
  ),
);

// Actions object for external use (similar to your Redux pattern)
export const userConfigActions = {
  hoverSidebar: (hover: boolean) => useUserConfigStore.getState().hoverSidebar(hover),
  reset: () => useUserConfigStore.getState().reset(),
  setActiveMode: (mode: string) => useUserConfigStore.getState().setActiveMode(mode),
  setBorderRadius: (radius: number) => useUserConfigStore.getState().setBorderRadius(radius),
  setCardShadow: (shadow: boolean) => useUserConfigStore.getState().setCardShadow(shadow),
  setCCAvatarSize: (size: string | number) => useUserConfigStore.getState().setCCAvatarSize(size),
  setChatHeight: (height: string | number) => useUserConfigStore.getState().setChatHeight(height),
  setChatWidth: (width: string | number) => useUserConfigStore.getState().setChatWidth(width),
  setDir: (dir: string) => useUserConfigStore.getState().setDir(dir),
  setLanguage: (language: string) => useUserConfigStore.getState().setLanguage(language),
  setShowUserConfig: (show: boolean) => useUserConfigStore.getState().setShowUserConfig(show),
  toggle3dFileBrowser: () => useUserConfigStore.getState().toggle3dFileBrowser(),
  toggleBgVideo: () => useUserConfigStore.getState().toggleBgVideo(),
  toggleCaptcha: () => useUserConfigStore.getState().toggleCaptcha(),
  toggleCsvToJson: () => useUserConfigStore.getState().toggleCsvToJson(),
  toggleHorizontal: (horizontal: boolean) =>
    useUserConfigStore.getState().toggleHorizontal(horizontal),
  toggleLayout: (layout: string) => useUserConfigStore.getState().toggleLayout(layout),
  toggleMenu: () => useUserConfigStore.getState().toggleMenu(),
  toggleMobileSidebar: () => useUserConfigStore.getState().toggleMobileSidebar(),
  toggleNginxStats: () => useUserConfigStore.getState().toggleNginxStats(),
  toggleParseInbox: () => useUserConfigStore.getState().toggleParseInbox(),
  toggleShaderSnooze: () => useUserConfigStore.getState().toggleShaderSnooze(),
  toggleSidebar: () => useUserConfigStore.getState().toggleSidebar(),
  toggleTileState: () => useUserConfigStore.getState().toggleTileState(),
  toggleUseVba: () => useUserConfigStore.getState().toggleUseVba(),
};

// Selectors for optimized re-renders
export const userconfigSelectors = {
  // Other selectors
  activeDir: (state: UserConfigState) => state.activeDir,
  activeMode: (state: UserConfigState) => state.activeMode,
  bgVideo: (state: UserConfigState) => state.bgVideo,

  // Style selectors
  borderRadius: (state: UserConfigState) => state.borderRadius,
  ccAvatarSize: (state: UserConfigState) => state.ccAvatarSize,
  chatHeight: (state: UserConfigState) => state.chatHeight,

  // Chat selectors
  chatWidth: (state: UserConfigState) => state.chatWidth,
  isCardShadow: (state: UserConfigState) => state.isCardShadow,
  // Theme selectors
  // Layout selectors
  isCollapse: (state: UserConfigState) => state.isCollapse,
  isHorizontal: (state: UserConfigState) => state.isHorizontal,
  isLanguage: (state: UserConfigState) => state.isLanguage,
  isLayout: (state: UserConfigState) => state.isLayout,
  isMobileSidebar: (state: UserConfigState) => state.isMobileSidebar,
  isSidebarHover: (state: UserConfigState) => state.isSidebarHover,
  open3dFileBrowser: (state: UserConfigState) => state.open3dFileBrowser,
  openTitleState: (state: UserConfigState) => state.openTitleState,
  showCaptcha: (state: UserConfigState) => state.showCaptcha,
  showCsvToJson: (state: UserConfigState) => state.showCsvToJson,

  // UI State selectors
  showMenu: (state: UserConfigState) => state.showMenu,
  showNginxStats: (state: UserConfigState) => state.showNginxStats,
  showParseInbox: (state: UserConfigState) => state.showParseInbox,
  showShaderSnooze: (state: UserConfigState) => state.showShaderSnooze,
  useVba: (state: UserConfigState) => state.useVba,
};

// Convenience getters for external use

export const getSidebarCollapsed = () => useUserConfigStore.getState().isCollapse;
export const getChatDimensions = () => ({
  height: useUserConfigStore.getState().chatHeight,
  width: useUserConfigStore.getState().chatWidth,
});

// Hook to safely use the userconfig store with hydration handling
export const useUserConfigStoreSafe = <T>(
  selector: (state: UserConfigState) => T,
  fallback?: T,
) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const storeValue = useUserConfigStore(selector);

  // Return fallback during SSR or before hydration
  if (!isClient && fallback !== undefined) {
    return fallback;
  }

  return storeValue;
};
