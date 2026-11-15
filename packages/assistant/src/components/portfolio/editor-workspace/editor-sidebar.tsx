"use client";

import { FileText, type LucideIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@shared/ui/sidebar";

import type { EditorNavigationGroup } from "./types";

type EditorSidebarProps = {
  active: string;
  disabled?: boolean;
  groups: readonly EditorNavigationGroup[];
  onNavigate: (section: string) => void;
  sectionIcons?: Readonly<Record<string, LucideIcon>>;
  sectionListId: string;
  username: string;
};

const markClass =
  "bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium";
const labelClass = "grid flex-1 text-left text-sm leading-tight";

export function EditorSidebar({
  active,
  disabled,
  groups,
  onNavigate,
  sectionIcons,
  sectionListId,
  username,
}: EditorSidebarProps) {
  const portfolioName = username || "Your draft";
  const initial = portfolioName.slice(0, 1).toUpperCase();
  return (
    <Sidebar collapsible="icon">
      <nav aria-label="Editor sections" className="flex h-full min-h-0 flex-col" id={sectionListId}>
        <SidebarHeader>
          <div className="editor-sidebar-heading [display:flex] [gap:4px] [align-items:center] [[data-collapsible='icon']_&]:[justify-content:center]">
            <SidebarMenu className="editor-sidebar-brand [[data-collapsible='icon']_&]:[display:none] min-w-0 flex-1">
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip={portfolioName}>
                  <span className={markClass}>{initial}</span>
                  <span className={labelClass}>
                    <span className="truncate font-medium">Your portfolio</span>
                    <span className="truncate text-xs">{portfolioName}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <EditorSidebarToggle
              className="editor-sidebar-toggle [flex-shrink:0]"
              controlsId={sectionListId}
              placement="sidebar"
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {groups
            .filter((entry) => entry.items.length > 0)
            .map((entry) => (
              <SidebarGroup key={entry.label}>
                <SidebarGroupLabel>{entry.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {entry.items.map((item) => {
                      const Icon = sectionIcons?.[item] ?? FileText;
                      return (
                        <SidebarMenuItem key={item}>
                          <SidebarMenuButton
                            disabled={disabled}
                            isActive={active === item}
                            onClick={() => onNavigate(item)}
                            tooltip={item}
                          >
                            <Icon aria-hidden="true" />
                            <span>{item}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip={portfolioName}>
                <span className={markClass}>{initial}</span>
                <span className={labelClass}>
                  <span className="truncate font-medium">{portfolioName}</span>
                  <span className="truncate text-xs">Portfolio draft</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </nav>
      <SidebarRail />
    </Sidebar>
  );
}

export function EditorSidebarToggle({
  className,
  controlsId,
  placement,
}: {
  className?: string;
  controlsId: string;
  placement: "sidebar" | "toolbar";
}) {
  const { isMobile, open, openMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  if ((placement === "sidebar" && isMobile) || (placement === "toolbar" && !isMobile)) return null;
  return (
    <SidebarTrigger
      aria-controls={controlsId}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      className={className}
    />
  );
}
