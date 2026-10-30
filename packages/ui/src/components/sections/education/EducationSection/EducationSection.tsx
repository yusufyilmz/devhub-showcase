import { getPortfolioCopy, type Language } from "@shared/content";
import type { Education } from "@shared/lib/types";
import type React from "react";
import { Section, Timeline } from "../../../../components";
import { EducationItem } from "../EducationItem/EducationItem";

interface EducationsSectionProps {
  educations: Education[];
  language?: Language;
}

export const EducationsSection: React.FC<EducationsSectionProps> = ({
  educations = [],
  language = "en",
}) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      sectionId="educations"
      title={text.education}
      subtitle={text.educationSubtitle}
      eyebrow={text.education}
    >
      <div className="flex items-center md:min-h-[calc(100vh-4rem)]">
        <Timeline>
          {educations.map((education) => (
            <EducationItem
              key={education.id}
              education={education}
              language={language}
            />
          ))}
        </Timeline>
      </div>
    </Section>
  );
};
