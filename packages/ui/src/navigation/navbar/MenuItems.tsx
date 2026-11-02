import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button";
import { menuItemsStyles } from "./styles";
import type { MenuItemsOptions } from "./types";

export function MenuItems({ language = "en", hiddenLinks = [] }: MenuItemsOptions) {
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
        .map(([id, title]) => (
          <Button asChild className={menuItemsStyles.element1} key={id} variant="text">
            <a aria-label={title} href={id}>
              {title}
            </a>
          </Button>
        ))}
    </>
  );
}
