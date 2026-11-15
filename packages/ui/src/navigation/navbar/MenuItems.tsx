import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button";
import { SheetClose } from "../../overlays/sheet";
import type { MenuItemsOptions } from "./types";

export function MenuItems({
  language = "en",
  hiddenLinks = [],
  closeOnSelect = false,
}: MenuItemsOptions) {
  const text = getPortfolioCopy(language);
  const items = [
    ["#about-me", text.about],
    ["#experiences", text.navExperience],
    ["#projects", text.navProjects],
    ["#skills", text.skills],
    ["#educations", text.navEducation],
    ["#referrals", text.navTestimonials],
  ];
  return (
    <>
      {items
        .filter(([id]) => !hiddenLinks.includes(id ?? ""))
        .map(([id, title]) => {
          const link = (
            <Button href={id} key={id} variant="text">
              {title}
            </Button>
          );
          return closeOnSelect ? (
            <SheetClose asChild key={id}>
              {link}
            </SheetClose>
          ) : (
            link
          );
        })}
    </>
  );
}
