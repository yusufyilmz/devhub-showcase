"use client";

import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button";
import { IconButton } from "../../buttons/icon-button/IconButton";
import { MenuIcon } from "../../display/icons/Icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../overlays/sheet";
import { MenuItems } from "./MenuItems";
import type { MobileMenuOptions } from "./types";

export function MobileMenu({ language = "en", hiddenLinks = [] }: MobileMenuOptions) {
  const text = getPortfolioCopy(language);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <IconButton aria-label={text.menu} className="md:hidden" size="lg" variant="outline">
          <MenuIcon fontSize="medium" />
        </IconButton>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="z-[300] w-[min(19rem,calc(100vw-2rem))] border-border/75"
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>{text.menu}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-xs px-md pb-md [&>a]:min-h-10 [&>a]:justify-start">
          <MenuItems closeOnSelect hiddenLinks={hiddenLinks} language={language} />
          <SheetClose asChild>
            <Button className="mt-sm" href="/login" variant="outline">
              {text.createCv}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
