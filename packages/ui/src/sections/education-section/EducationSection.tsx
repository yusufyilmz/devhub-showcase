import type React from "react";

import { getPortfolioCopy, type Language } from "@shared/config";
import type { Education } from "@shared/lib/types";

import { Timeline } from "../../display/timeline";
import { Section } from "../../layout/section";
import { EducationItem } from "./EducationItem";

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
