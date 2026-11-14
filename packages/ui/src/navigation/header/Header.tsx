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
      <header className="site-navigation [position:sticky] [top:0] [z-index:100] [container-type:inline-size] [background:color-mix(in_srgb,_var(--background)_88%,_transparent)] [border-bottom:1px_solid_color-mix(in_srgb,_var(--border)_55%,_transparent)] [backdrop-filter:blur(18px)]">
        <div className="site-navigation-inner [display:flex] [gap:30px] [align-items:center] [justify-content:space-between] [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [min-height:72px] [margin-inline:auto] @max-[1000px]:[width:calc(100%_-_52px)] @max-[760px]:[flex-wrap:wrap] @max-[760px]:[gap:var(--spacing-xs)] @max-[760px]:[width:100%] @max-[760px]:[min-height:64px] @max-[760px]:[padding:var(--spacing-xs)_var(--spacing-s)]">
          {brand}
          {links.length > 0 && (
            <nav
              aria-label={navigationLabel}
              className="site-navigation-links [display:flex] [gap:clamp(0.25rem,_1vw,_1rem)] [align-items:center] [&_a]:[font-size:12px] [text-decoration:none] [&_:where(a)]:[color:var(--muted-foreground)] [&_:where(a):hover]:[color:var(--primary)] @max-[1000px]:[gap:20px] @max-[1000px]:[&_:where(a)]:[font-size:10px] @max-[760px]:[display:none]"
            >
              {links.map(({ href, label }) => (
                <Button href={href} key={href} size="sm" variant="ghost">
                  {label}
                </Button>
              ))}
            </nav>
          )}
          <div className="site-navigation-actions [display:flex] [gap:clamp(0.25rem,_1vw,_1rem)] [align-items:center] [gap:18px] @max-[760px]:[flex-wrap:wrap] @max-[760px]:[gap:6px] @max-[760px]:[min-width:0] @max-[760px]:[max-width:100%] @max-[760px]:[&_.theme-toggle]:[width:32px] @max-[760px]:[&_.theme-toggle]:[min-width:32px] @max-[760px]:[&_.theme-toggle]:[height:32px]">
            {actions}
            {links.length > 0 && (
              <div className="site-navigation-menu [display:none] @max-[760px]:[display:block]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label={menuLabel} size="icon-sm" variant="ghost">
                      <Menu aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="site-navigation-dropdown [:root_&[data-slot='dropdown-menu-content']]:[width:min(18rem,_calc(100vw_-_24px))]"
                    collisionPadding={12}
                    sideOffset={10}
                  >
                    <DropdownMenuLabel className="site-navigation-dropdown-heading [:root_&[data-slot='dropdown-menu-label']]:[padding:12px_12px_6px]">
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
