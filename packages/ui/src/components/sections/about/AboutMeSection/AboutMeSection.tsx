import {
  copy,
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/content";
import { Button, PdfIcon, Section, Typography } from "../../../../components";
import { SocialLinks } from "../SocialLinks";

const { id } = copy.header.sections.aboutMe;

export const AboutMeSection = ({
  profile = fallback,
}: {
  profile?: PortfolioProfile;
}) => {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <Section
      sectionId={id}
      title={text.about}
      subtitle={text.aboutSubtitle}
      eyebrow={text.about}
    >
      <div className="about-content">
        <div className="flex flex-col gap-4 text-lg">
          {profile.about.map((paragraph) => (
            <Typography key={paragraph} className="text-main-slate">
              {paragraph}
            </Typography>
          ))}
          <div className="flex justify-center">
            <Button
              aria-label={text.resume}
              variant="text"
              href={profile.cvUrl ?? "/cv.pdf"}
              target="_blank"
              endIcon={<PdfIcon />}
              rel="noopener noreferrer"
              className="whitespace-pre-wrap shine-effect flex items-center text-white px-6 py-3 rounded-lg shadow-sm transition"
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
