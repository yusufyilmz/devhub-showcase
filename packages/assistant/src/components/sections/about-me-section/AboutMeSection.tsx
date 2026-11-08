import { copy, profile as fallback, getPortfolioCopy } from "@shared/config";
import { Button } from "@shared/ui/button";
import { PdfIcon } from "@shared/ui/icons";
import { Section } from "@shared/ui/section";
import { Typography } from "@shared/ui/typography";

import { SocialLinks } from "../social-links-section/SocialLinks";
import { aboutMeSectionStyles } from "./styles";
import type { AboutMeSectionOptions } from "./types";

const { id } = copy.header.sections.aboutMe;

export const AboutMeSection = ({ profile = fallback }: AboutMeSectionOptions) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <Section eyebrow={text.about} sectionId={id} subtitle={text.aboutSubtitle} title={text.about}>
      <div className={aboutMeSectionStyles.element1}>
        <div className={aboutMeSectionStyles.element2}>
          {profile.about.map((paragraph) => (
            <Typography className={aboutMeSectionStyles.element3} key={paragraph}>
              {paragraph}
            </Typography>
          ))}
          <div className={aboutMeSectionStyles.element4}>
            <Button
              aria-label={text.resume}
              className={aboutMeSectionStyles.element5}
              endIcon={<PdfIcon />}
              href={profile.cvUrl ?? "/cv.pdf"}
              rel="noopener noreferrer"
              target="_blank"
              variant="text"
            >
              {text.resume}
            </Button>
          </div>
        </div>
        <SocialLinks profile={profile} />
      </div>
    </Section>
  );
};
