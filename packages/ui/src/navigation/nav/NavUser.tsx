"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../../display/avatar/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu/DropdownMenu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../sidebar/Sidebar";
import { navUserStyles } from "./styles";
import type { NavUserOptions } from "./types";

export function NavUser({ user }: NavUserOptions) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className={navUserStyles.element1} size="lg">
              <Avatar className={navUserStyles.element2}>
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className={navUserStyles.element3}>CN</AvatarFallback>
              </Avatar>
              <div className={navUserStyles.element4}>
                <span className={navUserStyles.element5}>{user.name}</span>
                <span className={navUserStyles.element6}>{user.email}</span>
              </div>
              <ChevronsUpDown className={navUserStyles.element7} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={navUserStyles.element8}
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className={navUserStyles.element9}>
              <div className={navUserStyles.element10}>
                <Avatar className={navUserStyles.element11}>
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback className={navUserStyles.element12}>CN</AvatarFallback>
                </Avatar>
                <div className={navUserStyles.element13}>
                  <span className={navUserStyles.element14}>{user.name}</span>
                  <span className={navUserStyles.element15}>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
