import type React from "react";

import { capitalizeFirstLetter } from "@shared/lib/utils";

import { Card, CardBody } from "../../cards";
import { Typography } from "../../display/typography";
import { Divider } from "../../layout/divider";
import { SkillItem } from "./SkillItem";
import { skillCategoryItemStyles } from "./styles";
import type { SkillCategoryItemProps } from "./types";

export const SkillCategoryItem: React.FC<SkillCategoryItemProps> = ({ name, skills }) => {
  return (
    <Card className={skillCategoryItemStyles.element1} surface="portfolio">
      <CardBody className={skillCategoryItemStyles.element2}>
        <Typography className={skillCategoryItemStyles.element3} variant="h3">
          {capitalizeFirstLetter(name)}
        </Typography>
        <Divider className={skillCategoryItemStyles.element4} />
        <div className={skillCategoryItemStyles.element5}>
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
