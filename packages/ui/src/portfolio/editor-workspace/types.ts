import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type DraftPreviewPaneProps = {
  profile: PortfolioProfile;
  downloadHref: string;
  children: ReactNode;
};

export type EditorNavigationGroup = {
  label: string;
  items: readonly string[];
};

export type EditorWorkspaceProps = {
  active: string;
  actions?: ReactNode;
  notice?: ReactNode;
  view?: "edit" | "preview";
  onViewChange?: (view: "edit" | "preview") => void;
  groups: readonly EditorNavigationGroup[];
  username: string;
  disabled?: boolean;
  onNavigate: (section: string) => void;
  preview: ReactNode;
  children: ReactNode;
};
