import { getPortfolioCopy } from "@shared/config";
import { Section } from "@shared/ui/section";

import { ExperienceList } from "./ExperienceList";
import { experienceSectionStyles } from "./styles";
import type { ExperienceSectionOptions } from "./types";

export function ExperienceSection({ experiences, language = "en" }: ExperienceSectionOptions) {
  const text = getPortfolioCopy(language);
  return (
    <Section
      eyebrow={text.experience}
      sectionId="experiences"
      subtitle={text.experienceSubtitle}
      title={text.experience}
    >
      <div className={experienceSectionStyles.element1}>
        <ExperienceList experiences={experiences} language={language} />
      </div>
    </Section>
  );
}
