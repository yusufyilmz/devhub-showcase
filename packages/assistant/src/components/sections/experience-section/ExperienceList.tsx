import type React from "react";

import { Timeline } from "@shared/ui/timeline";

import { ExperienceItem } from "./ExperienceItem";
import { experienceListStyles } from "./styles";
import type { ExperienceListProps } from "./types";

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences = [],
  language = "en",
}) => {
  return (
    <Timeline className={experienceListStyles.element1}>
      {experiences.map((experience) => (
        <ExperienceItem experience={experience} key={experience.id} language={language} />
      ))}
    </Timeline>
  );
};
