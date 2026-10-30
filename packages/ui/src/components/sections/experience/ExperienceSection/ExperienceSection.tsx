import { getPortfolioCopy, type Language } from "@shared/content";
import type { ExperienceWithCompanyProjectAndSkills } from "@shared/lib/types";

import { Section } from "../../../ui/Section/Section";
import { ExperienceList } from "../ExperienceList/ExperienceList";
export function ExperienceSection({
  experiences,
  language = "en",
}: {
  experiences: ExperienceWithCompanyProjectAndSkills[];
  language?: Language;
}) {
  const text = getPortfolioCopy(language);
  return (
    <Section
      eyebrow={text.experience}
      sectionId="experiences"
      subtitle={text.experienceSubtitle}
      title={text.experience}
    >
      <div className="mt-8">
        <ExperienceList experiences={experiences} language={language} />
      </div>
    </Section>
  );
}
