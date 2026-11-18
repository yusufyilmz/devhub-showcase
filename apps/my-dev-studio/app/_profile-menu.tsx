"use client";

import "./_profile-menu.css";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { cvPath } from "@shared/lib/profiles";
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
  DashboardIcon,
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
  canAccessTrello,
  canImportLinkedInAlerts,
  canManagePortfolios,
  initials,
  protectDraft,
  studioHref,
  username,
}: {
  canAccessTrello: boolean;
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
          <IconButton
            aria-label="Profile menu"
            className="profile-menu-trigger size-10 shrink-0 rounded-full border border-border bg-card p-[3px] text-primary shadow-none hover:border-primary data-[state=open]:border-primary"
            variant="outline"
          >
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
          className="profile-menu-panel min-w-0 [&[data-slot='dropdown-menu-content']]:[width:min(18rem,_calc(100vw_-_24px))]"
          collisionPadding={12}
          sideOffset={10}
        >
          <DropdownMenuLabel className="profile-menu-identity grid justify-items-center gap-[10px] px-[12px] pt-[20px] pb-[16px] text-center [&_.profile-menu-avatar]:[width:72px] [&_.profile-menu-avatar]:[height:72px] [&_.profile-menu-avatar]:[font-size:26px] [&_.profile-menu-avatar]:[color:var(--primary-foreground)] [&_.profile-menu-avatar]:[background:var(--primary)] [&_.profile-menu-avatar]:[border:1px_solid_color-mix(in_srgb,_var(--primary-foreground)_30%,_transparent)] [&_.profile-menu-avatar]:[box-shadow:0_6px_24px_color-mix(in_srgb,_var(--primary)_22%,_transparent)]">
            <span
              aria-hidden="true"
              className="profile-menu-avatar [display:grid] [flex:none] [place-items:center] [width:32px] [height:32px] [font-size:12px] [font-weight:700] [line-height:1] [color:var(--foreground)] [background:color-mix(in_srgb,_var(--foreground)_10%,_var(--card))] [border-radius:50%]"
            >
              {initials}
            </span>
            <span className="profile-menu-name [display:grid] [gap:2px] [min-width:0] [&_>_span]:[overflow:hidden] [&_>_span]:[text-overflow:ellipsis] [&_>_span]:[font-size:12px] [&_>_span]:[color:var(--muted-foreground)] [&_>_span]:[white-space:nowrap]">
              <strong>My profile</strong>
              {username && <span>@{username}</span>}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuLabel className="profile-menu-heading px-[10px] pt-[6px] pb-[2px] text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Portfolio
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {username && (
              <DropdownMenuItem asChild>
                <a href={cvPath(username)}>
                  <FoldersIcon aria-hidden="true" />
                  My portfolio
                </a>
              </DropdownMenuItem>
            )}
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
            <DropdownMenuItem asChild>
              <a href="/admin/calendar">
                <ClipboardListIcon aria-hidden="true" />
                My Calendar
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
            {canAccessTrello && (
              <DropdownMenuItem asChild>
                <a href="/admin/trello">
                  <DashboardIcon aria-hidden="true" />
                  Trello boards
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="profile-menu-heading px-[10px] pt-[6px] pb-[2px] text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Jobs
          </DropdownMenuLabel>
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
