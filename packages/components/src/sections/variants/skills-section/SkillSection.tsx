import type React from "react";

import { getPortfolioCopy, type Language } from "@shared/config";
import type { Skill } from "@shared/lib/types";
import { List, ListItem } from "@shared/ui/list";
import { Section } from "@shared/ui/section";

import { SkillCategoryItem } from "./SkillCategoryItem";

export const SkillSection: React.FC<{
  skills: Record<string, Skill[]>;
  language?: Language;
}> = ({ skills = {}, language = "en" }) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      className="mt-8"
      eyebrow={text.skills}
      sectionId="skills"
      subtitle={text.skillsSubtitle}
      title={text.skills}
    >
      <div className="flex h-full">
        <List className="overflow-y-auto mt-2 no-scrollbar w-full mb-10">
          {Object.entries(skills).map(([category, skills]) => (
            <ListItem className="pl-0 md:pl-4 py-4" key={category}>
              <SkillCategoryItem name={category} skills={skills} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
