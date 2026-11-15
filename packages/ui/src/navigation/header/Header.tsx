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
      <header className={headerStyles.shell}>
        <div className={headerStyles.inner}>
          {brand}
          {links.length > 0 && (
            <nav aria-label={navigationLabel} className={headerStyles.links}>
              {links.map(({ href, label }) => (
                <Button href={href} key={href} size="sm" variant="ghost">
                  {label}
                </Button>
              ))}
            </nav>
          )}
          <div className={headerStyles.actions}>
            {actions}
            {links.length > 0 && (
              <div className={headerStyles.menu}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label={menuLabel} size="icon-sm" variant="ghost">
                      <Menu aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={headerStyles.dropdown}
                    collisionPadding={12}
                    sideOffset={10}
                  >
                    <DropdownMenuLabel className={headerStyles.dropdownHeading}>
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
