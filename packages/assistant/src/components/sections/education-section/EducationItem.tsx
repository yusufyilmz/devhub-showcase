import Link from "next/link";

import { formatPortfolioPeriod as formatDateRange, getPortfolioCopy } from "@shared/config";
import { RevealCard } from "@shared/ui/cards";
import { TimelineBody, TimelineHeader, TimelineIcon, TimelineItem } from "@shared/ui/timeline";
import { Typography } from "@shared/ui/typography";

import { educationItemStyles } from "./styles";
import type { EducationItemOptions } from "./types";

export function EducationItem({ education, language = "en" }: EducationItemOptions) {
  const text = getPortfolioCopy(language);
  return (
    <TimelineItem>
      <TimelineHeader>
        <TimelineIcon />
        <Typography className={educationItemStyles.element1}>
          {formatDateRange(education.startedAt, education.finishedAt, language)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className={educationItemStyles.element2}>
        <RevealCard
          brief={education.description}
          className={educationItemStyles.element3}
          heading={
            <>
              <h3>{education.institution}</h3>
              <p className={educationItemStyles.element4}>
                {education.degree} {text.inField} {education.fieldOfStudy}
              </p>
            </>
          }
          language={language}
          title={education.institution}
        >
          <p className={educationItemStyles.element5}>{education.description}</p>
          {education.institutionLink && (
            <Link
              className={educationItemStyles.element6}
              href={education.institutionLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {text.visitInstitution}
            </Link>
          )}
        </RevealCard>
      </TimelineBody>
    </TimelineItem>
  );
}
