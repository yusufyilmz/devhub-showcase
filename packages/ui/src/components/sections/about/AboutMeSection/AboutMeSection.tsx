import { Button } from "@shared/components";
import {
  copy,
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/content";

import { PdfIcon } from "../../../ui/Icons/Icons";
import { Section } from "../../../ui/Section/Section";
import { Typography } from "../../../ui/Typography/Typography";
import { SocialLinks } from "../SocialLinks/SocialLinks";

const { id } = copy.header.sections.aboutMe;

export const AboutMeSection = ({ profile = fallback }: { profile?: PortfolioProfile }) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <Section eyebrow={text.about} sectionId={id} subtitle={text.aboutSubtitle} title={text.about}>
      <div className="about-content">
        <div className="flex flex-col gap-4 text-lg">
          {profile.about.map((paragraph) => (
            <Typography className="text-main-slate" key={paragraph}>
              {paragraph}
            </Typography>
          ))}
          <div className="flex justify-center">
            <Button
              aria-label={text.resume}
              className="whitespace-pre-wrap shine-effect flex items-center text-white px-6 py-3 rounded-lg shadow-sm transition"
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
