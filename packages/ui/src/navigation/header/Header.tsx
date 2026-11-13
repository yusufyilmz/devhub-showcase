import "../chrome.css";

import { Slot } from "@radix-ui/react-slot";
import { Menu } from "lucide-react";

import { Button } from "../../buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu";
import { Navbar } from "../navbar/Navbar";
import { headerStyles } from "./styles";
import type { HeaderOptions } from "./types";

export function Header({
  profile,
  asChild = false,
  children,
  brand,
  links = [],
  actions,
  navigationLabel = "Main navigation",
  menuLabel = "Open navigation",
}: HeaderOptions) {
  if (asChild) return <Slot>{children}</Slot>;
  if (brand) {
    return (
      <header className="site-navigation">
        <div className="site-navigation-inner">
          {brand}
          {links.length > 0 && (
            <nav aria-label={navigationLabel} className="site-navigation-links">
              {links.map(({ href, label }) => (
                <Button href={href} key={href} size="sm" variant="ghost">
                  {label}
                </Button>
              ))}
            </nav>
          )}
          <div className="site-navigation-actions">
            {actions}
            {links.length > 0 && (
              <div className="site-navigation-menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label={menuLabel} size="icon-sm" variant="ghost">
                      <Menu aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="site-navigation-dropdown"
                    collisionPadding={12}
                    sideOffset={10}
                  >
                    <DropdownMenuLabel className="site-navigation-dropdown-heading">
                      {navigationLabel}
                    </DropdownMenuLabel>
                    {links.map(({ href, label }) => (
                      <DropdownMenuItem asChild key={href}>
                        <a href={href}>{label}</a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className={headerStyles.element1}>
      <Navbar profile={profile} />
    </header>
  );
}
