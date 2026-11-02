import type React from "react";

import { skillItemStyles } from "./styles";
import type { SkillItemProps } from "./types";

export const SkillItem: React.FC<SkillItemProps> = ({ name, experienceYear }) => {
  return (
    <div className={skillItemStyles.element1}>
      {`${name}${experienceYear ? ` (${experienceYear})` : ""}`}
    </div>
  );
};
