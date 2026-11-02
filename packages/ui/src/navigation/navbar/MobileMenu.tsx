"use client";

import { useState } from "react";

import { getPortfolioCopy } from "@shared/config";

import { IconButton } from "../../buttons/icon-button/IconButton";
import { MenuIcon } from "../../display/icons/Icons";
import { Drawer } from "../../overlays/drawer";
import { MenuItems } from "./MenuItems";
import { mobileMenuStyles } from "./styles";
import type { MobileMenuOptions } from "./types";

export function MobileMenu({ language = "en", hiddenLinks = [] }: MobileMenuOptions) {
  const text = getPortfolioCopy(language);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton
        aria-expanded={isOpen}
        aria-label={text.menu}
        className={mobileMenuStyles.element1}
        onClick={toggleMenu}
        size="lg"
        surface="portfolio"
        variant="outline"
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
      <Drawer anchor="right" onClose={toggleMenu} open={isOpen}>
        <div className={mobileMenuStyles.element2} role="presentation">
          <MenuItems hiddenLinks={hiddenLinks} language={language} />
          <a className={mobileMenuStyles.element3} href="/login">
            {text.createCv}
          </a>
        </div>
      </Drawer>
    </>
  );
}
