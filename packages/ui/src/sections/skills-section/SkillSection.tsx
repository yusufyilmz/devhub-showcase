import type React from "react";

import { getPortfolioCopy } from "@shared/config";

import { List, ListItem } from "../../display/list";
import { Section } from "../../layout/section";
import { SkillCategoryItem } from "./SkillCategoryItem";
import { skillSectionStyles } from "./styles";
import type { SkillSectionProps } from "./types";

export const SkillSection: React.FC<SkillSectionProps> = ({ skills = {}, language = "en" }) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      className={skillSectionStyles.element1}
      eyebrow={text.skills}
      sectionId="skills"
      subtitle={text.skillsSubtitle}
      title={text.skills}
    >
      <div className={skillSectionStyles.element2}>
        <List className={skillSectionStyles.element3}>
          {Object.entries(skills).map(([category, skills]) => (
            <ListItem className={skillSectionStyles.element4} key={category}>
              <SkillCategoryItem name={category} skills={skills} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
