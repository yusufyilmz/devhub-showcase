import type { PortfolioProfile } from "@shared/config";

import { Navbar } from "../navbar/Navbar";

export function Header({ profile }: { profile?: PortfolioProfile }) {
  return (
    <header className="site-header">
      <Navbar profile={profile} />
    </header>
  );
}
