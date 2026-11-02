import "../chrome.css";

import { Slot } from "@radix-ui/react-slot";

import { Navbar } from "../navbar/Navbar";
import { headerStyles } from "./styles";
import type { HeaderOptions } from "./types";

export function Header({ profile, asChild = false, children }: HeaderOptions) {
  if (asChild) return <Slot>{children}</Slot>;
  return (
    <header className={headerStyles.element1}>
      <Navbar profile={profile} />
    </header>
  );
}
