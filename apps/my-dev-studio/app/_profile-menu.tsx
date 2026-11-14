"use client";

import "./_profile-menu.css";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { draftStorage } from "@shared/runtime/storage";
import { useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { IconButton } from "@shared/ui/icon-button";
import {
  BookmarkIcon,
  BriefcaseIcon,
  ChatIcon,
  ClipboardListIcon,
  CreditCardIcon,
  EditIcon,
  FoldersIcon,
  LinkedInIcon,
  LogOutIcon,
  SettingsIcon,
} from "@shared/ui/icons";

const jobLinks = [
  { href: "/admin/jobs", icon: BriefcaseIcon, label: "Job Hunter" },
  { href: "/admin/jobs?tab=saved", icon: BookmarkIcon, label: "Saved jobs" },
  { href: "/admin/jobs?tab=applications", icon: ClipboardListIcon, label: "Applications" },
  { href: "/admin/jobs?tab=settings", icon: SettingsIcon, label: "Job settings" },
];

export function ProfileMenu({
  canImportLinkedInAlerts,
  canManagePortfolios,
  initials,
  protectDraft,
  studioHref,
  username,
}: {
  canImportLinkedInAlerts: boolean;
  canManagePortfolios: boolean;
  initials: string;
  protectDraft: boolean;
  studioHref: string;
  username?: string;
}) {
  const request = useStudioRequest();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  async function signOut() {
    if (busy || (protectDraft && !window.confirm("Sign out? Unsaved changes may be lost."))) return;
    setBusy(true);
    setFailure("");
    try {
      const response = await request(urls.auth.session(), { method: "DELETE" });
      if (!response.ok) throw new Error("Could not sign out.");
      draftStorage.clear();
      useUserConfigStore.getState().clearUser();
      window.location.assign("/login");
    } catch {
      setFailure("Could not sign out. Try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Profile menu" className="profile-menu-trigger" variant="outline">
            <span
              aria-hidden="true"
              className="profile-menu-avatar [display:grid] [flex:none] [place-items:center] [width:32px] [height:32px] [font-size:12px] [font-weight:700] [line-height:1] [color:var(--foreground)] [background:color-mix(in_srgb,_var(--foreground)_10%,_var(--card))] [border-radius:50%]"
            >
              {initials}
            </span>
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="profile-menu-panel [&[data-slot='dropdown-menu-content']]:[width:min(18rem,_calc(100vw_-_24px))]"
          collisionPadding={12}
          sideOffset={10}
        >
          <DropdownMenuLabel className="profile-menu-identity [&_.profile-menu-avatar]:[width:72px] [height:72px] [font-size:26px] [color:var(--primary-foreground)] [background:var(--primary)] [border:1px_solid_color-mix(in_srgb,_var(--primary-foreground)_30%,_transparent)] [box-shadow:0_6px_24px_color-mix(in_srgb,_var(--primary)_22%,_transparent)]">
            <span
              aria-hidden="true"
              className="profile-menu-avatar [display:grid] [flex:none] [place-items:center] [width:32px] [height:32px] [font-size:12px] [font-weight:700] [line-height:1] [color:var(--foreground)] [background:color-mix(in_srgb,_var(--foreground)_10%,_var(--card))] [border-radius:50%]"
            >
              {initials}
            </span>
            <span className="profile-menu-name [display:grid] [gap:2px] [min-width:0] [&_>_span]:[overflow:hidden] [text-overflow:ellipsis] [font-size:12px] [color:var(--muted-foreground)] [white-space:nowrap]">
              <strong>My profile</strong>
              {username && <span>@{username}</span>}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuLabel className="profile-menu-heading">Portfolio</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href={studioHref}>
                <EditIcon aria-hidden="true" />
                Edit profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/chat">
                <ChatIcon aria-hidden="true" />
                Studio assistant
              </a>
            </DropdownMenuItem>
            {canManagePortfolios && (
              <DropdownMenuItem asChild>
                <a href="/admin/portfolios">
                  <FoldersIcon aria-hidden="true" />
                  Manage portfolios
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="profile-menu-heading">Jobs</DropdownMenuLabel>
          <DropdownMenuGroup>
            {jobLinks.map(({ href, icon: Icon, label }) => (
              <DropdownMenuItem asChild key={href}>
                <a href={href}>
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </DropdownMenuItem>
            ))}
            {canImportLinkedInAlerts && (
              <DropdownMenuItem asChild>
                <a href="/admin/jobs?tab=linkedin">
                  <LinkedInIcon aria-hidden="true" />
                  LinkedIn alerts
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/admin/billing">
              <CreditCardIcon aria-hidden="true" />
              Plan and billing
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={busy} onSelect={() => signOut()} variant="destructive">
            <LogOutIcon aria-hidden="true" />
            {busy ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {failure && <span role="alert">{failure}</span>}
    </>
  );
}
