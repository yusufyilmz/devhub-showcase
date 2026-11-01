"use client";

import { useState } from "react";

import { getPortfolioCopy, type Language } from "@shared/config";

import { Drawer } from "../Drawer";
import { MenuIcon } from "../Icons/Icons";
import { IconButton } from "../icon-button/IconButton";
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
        className="hover:scale-105 text-main-lightest-slate transition-transform md:hidden"
        onClick={toggleMenu}
      >
        <MenuIcon fontSize="large" />
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
