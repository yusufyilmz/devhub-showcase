import type React from "react";

import type { Skill } from "@shared/lib/types";
import { capitalizeFirstLetter } from "@shared/lib/utils";
import { Card, CardBody } from "@shared/ui/card";
import { Divider } from "@shared/ui/divider";
import { Typography } from "@shared/ui/typography";

import { SkillItem } from "./SkillItem";

export const SkillCategoryItem: React.FC<{ name: string; skills: Skill[] }> = ({
  name,
  skills,
}) => {
  return (
    <Card className="section-card" surface="portfolio">
      <CardBody className="flex flex-col">
        <Typography className="text-left font-semibold text-main-white mb-3 text-2xl" variant="h3">
          {capitalizeFirstLetter(name)}
        </Typography>
        <Divider className="bg-main-light-slate mb-6 mt-0" />
        <div className="flex justify-start flex-wrap gap-2">
          {skills.map((skill) =>
            skill?.name ? (
              <SkillItem
                experienceYear={skill.experienceYear ?? undefined}
                key={skill.id}
                name={skill.name}
              />
            ) : null,
          )}
        </div>
      </CardBody>
    </Card>
  );
};
