import type React from "react";

import { TimelineBody, TimelineHeader, TimelineIcon, TimelineItem } from "@shared/components";
import { CardBody } from "@shared/components/cards";
import { getPortfolioCopy, type Language } from "@shared/content";
import type { ExperienceWithCompanyProjectAndSkills } from "@shared/lib/types";
import { formatDateRange } from "@shared/lib/utils";
import Link from "next/link";

import { Divider } from "../../../ui/Divider/Divider";
import { List } from "../../../ui/List/List";
import { ListItem } from "../../../ui/List/ListItem";
import { RevealCard } from "../../../ui/RevealCard/RevealCard";
import { Typography } from "../../../ui/Typography/Typography";
import { SkillItem } from "../../skill/SkillItem/SkillItem";

type ExperienceProps = {
  language?: Language;
  experience: ExperienceWithCompanyProjectAndSkills;
};

export const ExperienceItem: React.FC<ExperienceProps> = ({ experience, language = "en" }) => {
  const text = getPortfolioCopy(language);
  const skills = experience.projects.flatMap((project) => project.skills);
  const uniqueSkills = new Set(skills.map((skill) => skill.name));

  return (
    <TimelineItem className="w-full">
      <TimelineHeader className="h-4">
        <TimelineIcon />
        <Typography className="text-xs font-light pb-0 text-main-light-slate mt-2">
          {formatDateRange(experience.startedAt, experience.finishedAt, language)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-0 my-8 md:mx-8">
        <RevealCard
          brief={experience.achievements[0]}
          className="experience-card group"
          heading={
            <CardBody className="pb-0 flex flex-col gap-2">
              <Typography
                className="text-2xl font-bold text-textColor-light group-hover:underline group-hover:text-main-blue"
                variant="h3"
              >
                <Link
                  className="focus:outline-hidden focus:ring-2 focus:ring-main-blue"
                  href={experience.company?.link ?? "#"}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {experience.company?.name}
                </Link>
              </Typography>
              <Typography className="font-semibold text-textColor-secondary" variant="h4">
                {experience.role}
              </Typography>
            </CardBody>
          }
          id={`experience-${experience.id}`}
          language={language}
          title={experience.company?.name ?? experience.role}
        >
          <Divider className="bg-main-light-slate" />
          <CardBody className="pt-0">
            <List className="list-disc list-inside text-main-white">
              {experience.achievements.map((achievement) => (
                <ListItem key={achievement}>
                  <Typography className="text-textColor-lightSlate font-light" variant="overline">
                    {achievement}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardBody>
          <CardBody className="pt-0">
            <div className="flex justify-start flex-wrap gap-2">
              {[...uniqueSkills].map((skill) => skill && <SkillItem key={skill} name={skill} />)}
            </div>
          </CardBody>
          <CardBody className="pt-0 pl-0">
            {experience.projects.length > 0 && (
              <div className="reveal-projects">
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
