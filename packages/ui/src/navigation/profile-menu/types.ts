import type { ComponentType } from "react";

export type ProfileMenuIcon = ComponentType<{
  "aria-hidden"?: boolean | "true";
  className?: string;
}>;

export type ProfileMenuLink = {
  href: string;
  icon?: ProfileMenuIcon;
  label: string;
};

export type ProfileMenuGroup = {
  id: string;
  items: readonly ProfileMenuLink[];
  label?: string;
};

export type ProfileMenuSignOut = {
  busy?: boolean;
  label?: string;
  onSignOut: () => void;
  pendingLabel?: string;
};

export type ProfileMenuProps = {
  failure?: string;
  groups: readonly ProfileMenuGroup[];
  initials: string;
  menuLabel?: string;
  signOut?: ProfileMenuSignOut;
  subtitle?: string;
  title: string;
};
