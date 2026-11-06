import type { ComponentProps, ReactNode } from "react";

import {
  copy,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
} from "@shared/config";
import type { PageResources } from "@shared/lib/types";

import { HeroSurface } from "../../layout/hero";
import { ScrollButton } from "../../layout/scroll-button";
import { Section } from "../../layout/section";
import { Footer } from "../../navigation/footer";
import { Header } from "../../navigation/header";
import { AboutMeSection } from "../../sections/about-me-section";
import { EducationsSection } from "../../sections/education-section";
import { ExperienceSection } from "../../sections/experience-section";
import { ProjectsSection } from "../../sections/project-section";
import { ReferralSection } from "../../sections/referral-section";
import { SkillSection } from "../../sections/skills-section";
import { SummarySection } from "../../sections/summary-section";
import { RegisteredSections } from "../published-page/registered-sections";

export function EngineerPage({
  profile,
  sourceProfile = profile,
  resources,
  ownerLink,
  referrals = [],
  extras = false,
  chat,
}: {
  profile: PortfolioProfile;
  sourceProfile?: PortfolioProfile;
  resources: PageResources;
  ownerLink?: ReactNode;
  referrals?: ComponentProps<typeof ReferralSection>["referrals"];
  extras?: boolean;
  chat?: ReactNode;
}) {
  const { experiences, projects, skills, educations } = resources;
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
          <RegisteredSections profile={sourceProfile} renderers={renderers} />
          {extras && <ReferralSection language={profile.portfolioLanguage} referrals={referrals} />}
        </div>
      </main>
      {extras && (
        <>
          <ScrollButton
            sectionIds={Object.values(copy.navbar).map((item) => item.id.split("#")[1] ?? "")}
          />
          {chat}
        </>
      )}
      <Footer profile={profile} />
    </>
  );
}
