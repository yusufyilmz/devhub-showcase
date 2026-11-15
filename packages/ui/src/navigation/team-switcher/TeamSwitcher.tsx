"use client";

import React from "react";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu/DropdownMenu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../sidebar/Sidebar";
import { teamSwitcherStyles } from "./styles";
import type { TeamSwitcherOptions } from "./types";

export function TeamSwitcher({ teams }: TeamSwitcherOptions) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className={teamSwitcherStyles.element1} size="lg">
              <div className={teamSwitcherStyles.element2}>
                <activeTeam.logo className={teamSwitcherStyles.element3} />
              </div>
              <div className={teamSwitcherStyles.element4}>
                <span className={teamSwitcherStyles.element5}>{activeTeam.name}</span>
                <span className={teamSwitcherStyles.element6}>{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className={teamSwitcherStyles.element7} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className={teamSwitcherStyles.element8}
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className={teamSwitcherStyles.element9}>Teams</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={(name) => {
                const team = teams.find((option) => option.name === name);
                if (team) setActiveTeam(team);
              }}
              value={activeTeam.name}
            >
              {teams.map((team, index) => (
                <DropdownMenuRadioItem
                  className={teamSwitcherStyles.element10}
                  key={team.name}
                  value={team.name}
                >
                  <div className={teamSwitcherStyles.element11}>
                    <team.logo className={teamSwitcherStyles.element12} />
                  </div>
                  <span className="min-w-0 flex-1 wrap-anywhere">{team.name}</span>
                  <DropdownMenuShortcut className="shrink-0">⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={teamSwitcherStyles.element13}>
              <div className={teamSwitcherStyles.element14}>
                <Plus className={teamSwitcherStyles.element15} />
              </div>
              <div className={teamSwitcherStyles.element16}>Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
