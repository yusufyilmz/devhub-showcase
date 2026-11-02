import "../chrome.css";

import type { ReactNode } from "react";

import { Slot } from "@radix-ui/react-slot";

import type { PortfolioProfile } from "@shared/config";

import { Navbar } from "../navbar/Navbar";

export function Header({
  profile,
  asChild = false,
  children,
}: {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
}) {
  if (asChild) return <Slot>{children}</Slot>;
  return (
    <header className="site-header">
      <Navbar profile={profile} />
    </header>
  );
}
