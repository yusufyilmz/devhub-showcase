import type React from "react";

import type { Language } from "@shared/config";
import type { ExperienceWithCompanyProjectAndSkills } from "@shared/lib/types";

import { Timeline } from "../../display/timeline";
import { ExperienceItem } from "./ExperienceItem";

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
