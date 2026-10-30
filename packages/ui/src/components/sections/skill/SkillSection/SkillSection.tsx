import { getPortfolioCopy, type Language } from "@shared/content";
import type { Skill } from "@shared/lib/types";
import type React from "react";
import { List, ListItem, Section } from "../../../../components";
import { SkillCategoryItem } from "../SkillCategoryItem";

export const SkillSection: React.FC<{
  skills: Record<string, Skill[]>;
  language?: Language;
}> = ({ skills = {}, language = "en" }) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      className="mt-8"
      sectionId="skills"
      title={text.skills}
      eyebrow={text.skills}
      subtitle={text.skillsSubtitle}
    >
      <div className="flex h-full">
        <List className="overflow-y-auto mt-2 no-scrollbar w-full mb-10">
          {Object.entries(skills).map(([category, skills]) => (
            <ListItem key={category} className="pl-0 md:pl-4 py-4">
              <SkillCategoryItem name={category} skills={skills} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
