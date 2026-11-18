"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import { cvPath } from "@shared/lib/profiles";
import { draftStorage } from "@shared/runtime/storage";
import { useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
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
  SettingsIcon,
} from "@shared/ui/icons";
import { type ProfileMenuGroup, ProfileMenu as ProfileMenuView } from "@shared/ui/profile-menu";

const jobLinks = [
  { href: "/studio/jobs", icon: BriefcaseIcon, label: "Job Hunter" },
  { href: "/studio/jobs?tab=saved", icon: BookmarkIcon, label: "Saved jobs" },
  { href: "/studio/jobs?tab=applications", icon: ClipboardListIcon, label: "Applications" },
  { href: "/studio/jobs?tab=settings", icon: SettingsIcon, label: "Job settings" },
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

  const portfolio: ProfileMenuGroup = {
    id: "portfolio",
    items: [
      ...(username ? [{ href: cvPath(username), icon: FoldersIcon, label: "My portfolio" }] : []),
      { href: studioHref, icon: EditIcon, label: "Edit profile" },
      { href: "/studio/chat", icon: ChatIcon, label: "Studio assistant" },
      { href: "/studio/calendar", icon: ClipboardListIcon, label: "My Calendar" },
      ...(canManagePortfolios
        ? [{ href: "/studio/portfolios", icon: FoldersIcon, label: "Manage portfolios" }]
        : []),
      ...(canAccessTrello
        ? [{ href: "/studio/trello", icon: DashboardIcon, label: "Trello boards" }]
        : []),
    ],
    label: "Portfolio",
  };
  const jobs: ProfileMenuGroup = {
    id: "jobs",
    items: [
      ...jobLinks,
      ...(canImportLinkedInAlerts
        ? [{ href: "/studio/jobs?tab=linkedin", icon: LinkedInIcon, label: "LinkedIn alerts" }]
        : []),
    ],
    label: "Jobs",
  };
  const billing: ProfileMenuGroup = {
    id: "billing",
    items: [{ href: "/studio/billing", icon: CreditCardIcon, label: "Plan and billing" }],
  };

  return (
    <ProfileMenuView
      failure={failure}
      groups={[portfolio, jobs, billing]}
      initials={initials}
      signOut={{
        busy,
        onSignOut: () => {
          signOut();
        },
      }}
      subtitle={username ? `@${username}` : undefined}
      title="My profile"
    />
  );
}
