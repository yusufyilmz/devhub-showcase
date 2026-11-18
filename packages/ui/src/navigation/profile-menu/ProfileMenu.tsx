"use client";

import { Fragment } from "react";

import { IconButton } from "../../buttons/icon-button/IconButton";
import { LogOutIcon } from "../../display/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu/DropdownMenu";
import { profileMenuStyles } from "./styles";
import type { ProfileMenuProps } from "./types";

export function ProfileMenu({
  failure,
  groups,
  initials,
  menuLabel = "Profile menu",
  signOut,
  subtitle,
  title,
}: ProfileMenuProps) {
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={menuLabel}
            className={profileMenuStyles.trigger}
            variant="outline"
          >
            <span aria-hidden="true" className={profileMenuStyles.avatar}>
              {initials}
            </span>
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={profileMenuStyles.panel}
          collisionPadding={12}
          sideOffset={10}
        >
          <DropdownMenuLabel className={profileMenuStyles.identity}>
            <span aria-hidden="true" className={profileMenuStyles.avatarLarge}>
              {initials}
            </span>
            <span className={profileMenuStyles.name}>
              <strong>{title}</strong>
              {subtitle ? <span>{subtitle}</span> : null}
            </span>
          </DropdownMenuLabel>
          {visibleGroups.map((group, index) => (
            <Fragment key={group.id}>
              {index > 0 ? <DropdownMenuSeparator /> : null}
              {group.label ? (
                <DropdownMenuLabel className={profileMenuStyles.heading}>
                  {group.label}
                </DropdownMenuLabel>
              ) : null}
              <DropdownMenuGroup>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem asChild key={`${item.href}:${item.label}`}>
                      <a href={item.href}>
                        {Icon ? <Icon aria-hidden="true" /> : null}
                        {item.label}
                      </a>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </Fragment>
          ))}
          {signOut ? (
            <>
              {visibleGroups.length > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                disabled={signOut.busy}
                onSelect={() => signOut.onSignOut()}
                variant="destructive"
              >
                <LogOutIcon aria-hidden="true" />
                {signOut.busy
                  ? (signOut.pendingLabel ?? "Signing out…")
                  : (signOut.label ?? "Sign out")}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {failure ? <span role="alert">{failure}</span> : null}
    </>
  );
}
