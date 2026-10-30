import type { ComponentProps, ReactNode } from "react";

import { HeroSurface } from "@shared/components/hero-surface";
import {
  copy,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent,
} from "@shared/content";
import { getPortfolioResources } from "@shared/lib/portfolio";
import {
  AboutMeSection,
  ChatSection,
  EducationsSection,
  ExperienceSection,
  Footer,
  Header,
  ProjectsSection,
  ReferralSection,
  ScrollButton,
  Section,
  SkillSection,
  SummarySection,
} from "@shared/ui/components";

import { handleSendMessageAction } from "../../app/actions";
import { RegisteredSections } from "./registered-sections";

export function EngineerPortfolio({
  profile,
  ownerLink,
  referrals = [],
  extras = false,
}: {
  profile: PortfolioProfile;
  ownerLink?: ReactNode;
  referrals?: ComponentProps<typeof ReferralSection>["referrals"];
  extras?: boolean;
}) {
  const canonicalProfile = profile;
  profile = selectPortfolioContent(profile);
  const { experiences, projects, skills, educations } = getPortfolioResources(profile);
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const renderers: Partial<Record<SectionRendererId, ReactNode>> = {
    "about-card": <AboutMeSection profile={profile} />,
    "education-timeline": educations.length > 0 && (
      <EducationsSection educations={educations} language={profile.portfolioLanguage} />
    ),
    "language-list": profile.languages.length > 0 && (
      <Section
        eyebrow={text.spokenLanguages}
        sectionId="languages"
        subtitle=""
        title={text.spokenLanguages}
      >
        <p>
          {profile.languages.map((item) => `${item.language} (${item.proficiency})`).join(" · ")}
        </p>
      </Section>
    ),
    "project-cards": projects.length > 0 && (
      <ProjectsSection language={profile.portfolioLanguage} projects={projects} />
    ),
    "skill-groups": Object.keys(skills).length > 0 && (
      <SkillSection language={profile.portfolioLanguage} skills={skills} />
    ),
    timeline: experiences.length > 0 && (
      <ExperienceSection experiences={experiences} language={profile.portfolioLanguage} />
    ),
  };
  return (
    <>
      <Header profile={profile} />
      {ownerLink}
      <main className="portfolio-main" id="main-content">
        <div className="portfolio-inner">
          <HeroSurface
            labels={{ pause: text.pauseBackground, play: text.playBackground }}
            media={profile.hero}
          >
            <SummarySection profile={profile} />
          </HeroSurface>
          <RegisteredSections profile={canonicalProfile} renderers={renderers} />
          {extras && <ReferralSection language={profile.portfolioLanguage} referrals={referrals} />}
        </div>
      </main>
      {extras && (
        <>
          <ScrollButton
            sectionIds={Object.values(copy.navbar).map((item) => item.id.split("#")[1] ?? "")}
          />
          <ChatSection handleSendMessage={handleSendMessageAction} />
        </>
      )}
      <Footer profile={profile} />
    </>
  );
}
