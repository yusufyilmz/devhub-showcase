import Link from "next/link";
import type React from "react";

import { getPortfolioCopy } from "@shared/config";
import { formatDateRange } from "@shared/lib/utils";

import { CardBody } from "../../cards";
import { List, ListItem } from "../../display/list";
import { TimelineBody, TimelineHeader, TimelineIcon, TimelineItem } from "../../display/timeline";
import { Typography } from "../../display/typography";
import { Divider } from "../../layout/divider";
import { RevealCard } from "../../layout/reveal-card";
import { SkillItem } from "../skills-section/SkillItem";
import { experienceItemStyles } from "./styles";
import type { ExperienceProps } from "./types";

export const ExperienceItem: React.FC<ExperienceProps> = ({ experience, language = "en" }) => {
  const text = getPortfolioCopy(language);
  const skills = experience.projects.flatMap((project) => project.skills);
  const uniqueSkills = new Set(skills.map((skill) => skill.name));

  return (
    <TimelineItem className={experienceItemStyles.element1}>
      <TimelineHeader className={experienceItemStyles.element2}>
        <TimelineIcon />
        <Typography className={experienceItemStyles.element3}>
          {formatDateRange(experience.startedAt, experience.finishedAt, language)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className={experienceItemStyles.element4}>
        <RevealCard
          brief={experience.achievements[0]}
          className={experienceItemStyles.element5}
          heading={
            <CardBody className={experienceItemStyles.element6}>
              <Typography className={experienceItemStyles.element7} variant="h3">
                <Link
                  className={experienceItemStyles.element8}
                  href={experience.company?.link ?? "#"}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {experience.company?.name}
                </Link>
              </Typography>
              <Typography className={experienceItemStyles.element9} variant="h4">
                {experience.role}
              </Typography>
            </CardBody>
          }
          id={`experience-${experience.id}`}
          language={language}
          title={experience.company?.name ?? experience.role}
        >
          <Divider className={experienceItemStyles.element10} />
          <CardBody className={experienceItemStyles.element11}>
            <List className={experienceItemStyles.element12}>
              {experience.achievements.map((achievement) => (
                <ListItem key={achievement}>
                  <Typography className={experienceItemStyles.element13} variant="overline">
                    {achievement}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardBody>
          <CardBody className={experienceItemStyles.element14}>
            <div className={experienceItemStyles.element15}>
              {[...uniqueSkills].map((skill) => skill && <SkillItem key={skill} name={skill} />)}
            </div>
          </CardBody>
          <CardBody className={experienceItemStyles.element16}>
            {experience.projects.length > 0 && (
              <div className={experienceItemStyles.element17}>
                <h4>{text.selectedProjects}</h4>
                {experience.projects.map((project) => (
                  <div key={project.id}>
                    <h5>{project.title}</h5>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </RevealCard>
      </TimelineBody>
    </TimelineItem>
  );
};
