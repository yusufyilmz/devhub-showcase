import type React from "react";

import { Timeline } from "@shared/components";
import type { Language } from "@shared/content";
import type { ExperienceWithCompanyProjectAndSkills } from "@shared/lib/types";

import { ExperienceItem } from "../ExperienceItem/ExperienceItem";

interface ExperienceListProps {
  experiences: ExperienceWithCompanyProjectAndSkills[];
  language?: Language;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences = [],
  language = "en",
}) => {
  return (
    <Timeline className="w-full">
      {experiences.map((experience) => (
        <ExperienceItem experience={experience} key={experience.id} language={language} />
      ))}
    </Timeline>
  );
};
