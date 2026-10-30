import type { PortfolioProfile } from "@shared/content";
import { Navbar } from "../Navbar";
export function Header({ profile }: { profile?: PortfolioProfile }) {
  return (
    <header className="site-header">
      <Navbar profile={profile} />
    </header>
  );
}
