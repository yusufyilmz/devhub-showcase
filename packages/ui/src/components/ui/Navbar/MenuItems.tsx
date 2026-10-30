import { Button } from "@shared/components";
import { getPortfolioCopy, type Language } from "@shared/content";

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
            aria-label={title}
            className="text-main-white border-none whitespace-pre"
            href={id}
            key={id}
            variant="text"
          >
            {title}
          </Button>
        ))}
    </>
  );
}
