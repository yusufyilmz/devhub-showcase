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

const jobLinks = [
  { href: "/admin/jobs", label: "Job Hunter" },
  { href: "/admin/jobs?tab=saved", label: "Saved jobs" },
  { href: "/admin/jobs?tab=applications", label: "Applications" },
  { href: "/admin/jobs?tab=settings", label: "Job settings" },
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
            <span aria-hidden="true" className="profile-menu-avatar">
              {initials}
            </span>
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="profile-menu-panel"
          collisionPadding={12}
          sideOffset={10}
        >
          <DropdownMenuLabel className="profile-menu-identity">
            <span aria-hidden="true" className="profile-menu-avatar">
              {initials}
            </span>
            <span className="profile-menu-name">
              <strong>My profile</strong>
              {username && <span>@{username}</span>}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="profile-menu-heading">Portfolio</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href={studioHref}>Edit profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/chat">Studio assistant</a>
            </DropdownMenuItem>
            {canManagePortfolios && (
              <DropdownMenuItem asChild>
                <a href="/admin/portfolios">Manage portfolios</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="profile-menu-heading">Jobs</DropdownMenuLabel>
          <DropdownMenuGroup>
            {jobLinks.map(({ href, label }) => (
              <DropdownMenuItem asChild key={href}>
                <a href={href}>{label}</a>
              </DropdownMenuItem>
            ))}
            {canImportLinkedInAlerts && (
              <DropdownMenuItem asChild>
                <a href="/admin/jobs?tab=linkedin">LinkedIn alerts</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/admin/billing">Plan and billing</a>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={busy} onSelect={() => signOut()} variant="destructive">
            {busy ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {failure && <span role="alert">{failure}</span>}
    </>
  );
}
