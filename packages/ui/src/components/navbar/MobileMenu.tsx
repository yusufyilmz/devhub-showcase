"use client";

import { useState } from "react";

import { getPortfolioCopy, type Language } from "@shared/config";

import { Drawer } from "../drawer";
import { IconButton } from "../icon-button/IconButton";
import { MenuIcon } from "../icons/Icons";
import { MenuItems } from "./MenuItems";

export function MobileMenu({
  language = "en",
  hiddenLinks = [],
}: {
  language?: Language;
  hiddenLinks?: string[];
}) {
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
        className="md:hidden"
        onClick={toggleMenu}
        size="lg"
        surface="portfolio"
        variant="outline"
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
      <Drawer anchor="right" onClose={toggleMenu} open={isOpen}>
        <div
          className="bg-main-dark h-full flex flex-col justify-start p-4 align-middle"
          role="presentation"
        >
          <MenuItems hiddenLinks={hiddenLinks} language={language} />
          <a className="studio-primary" href="/admin/login">
            {text.createCv}
          </a>
        </div>
      </Drawer>
    </>
  );
}
