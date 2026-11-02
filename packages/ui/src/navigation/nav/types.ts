import type * as React from "react";

import type { Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

import type { SidebarGroup } from "../sidebar/Sidebar";

export type NavMainOptions = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export type NavProjectsOptions = {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
};

export type NavUserOptions = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export type NavDocumentsOptions = {
  items: {
    name: string;
    url: string;
    icon: Icon;
  }[];
};

export type NavSecondaryOptions = {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>;
