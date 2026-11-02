import type React from "react";

import { getPortfolioCopy } from "@shared/config";

import { Timeline } from "../../display/timeline";
import { Section } from "../../layout/section";
import { EducationItem } from "./EducationItem";
import { educationSectionStyles } from "./styles";
import type { EducationsSectionProps } from "./types";

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
      <div className={educationSectionStyles.element1}>
        <Timeline>
          {educations.map((education) => (
            <EducationItem education={education} key={education.id} language={language} />
          ))}
        </Timeline>
      </div>
    </Section>
  );
};
