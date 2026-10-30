"use client";

import { getPortfolioCopy, type Language } from "@shared/content";
import { useState } from "react";
import { Drawer, IconButton, MenuIcon } from "../../../components";
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
        aria-label={text.menu}
        onClick={toggleMenu}
        className="hover:scale-105 text-main-lightest-slate transition-transform md:hidden"
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleMenu}>
        <div
          className="bg-main-dark h-full flex flex-col justify-start p-4 align-middle"
          role="presentation"
        >
          <MenuItems language={language} hiddenLinks={hiddenLinks} />
          <a href="/admin/login" className="studio-primary">
            {text.createCv}
          </a>
        </div>
      </Drawer>
    </>
  );
}
