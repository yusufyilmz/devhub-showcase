import { getPortfolioCopy, type Language } from "@shared/config";

import { Button } from "../../buttons/button";

export function MenuItems({
  language = "en",
  hiddenLinks = [],
}: {
  language?: Language;
  hiddenLinks?: string[];
}) {
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
          <Button
            asChild
            className="text-main-white border-none whitespace-pre"
            key={id}
            variant="text"
          >
            <a aria-label={title} href={id}>
              {title}
            </a>
          </Button>
        ))}
    </>
  );
}
