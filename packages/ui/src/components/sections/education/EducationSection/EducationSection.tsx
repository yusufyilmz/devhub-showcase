import type React from "react";

import { Timeline } from "@shared/components";
import { getPortfolioCopy, type Language } from "@shared/content";
import type { Education } from "@shared/lib/types";

import { Section } from "../../../ui/Section/Section";
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
      eyebrow={text.education}
      sectionId="educations"
      subtitle={text.educationSubtitle}
      title={text.education}
    >
      <div className="flex items-center md:min-h-[calc(100vh-4rem)]">
        <Timeline>
          {educations.map((education) => (
            <EducationItem education={education} key={education.id} language={language} />
          ))}
        </Timeline>
      </div>
    </Section>
  );
};
