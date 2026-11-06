import type { ComponentProps, ReactNode } from "react";

import { ChatSection } from "@shared/assistant/chat-section";
import {
  copy,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent,
} from "@shared/config";
import type { ChatMessage } from "@shared/lib/types";
import { getPortfolioResources } from "@shared/services/portfolio";
import { Footer } from "@shared/ui/footer";
import { Header } from "@shared/ui/header";
import { HeroSurface } from "@shared/ui/layout";
import { RegisteredSections } from "@shared/ui/portfolio";
import { ScrollButton } from "@shared/ui/scroll-button";
import { Section } from "@shared/ui/section";
import {
  AboutMeSection,
  EducationsSection,
  ExperienceSection,
  PortfolioProjectsSection as ProjectsSection,
  ReferralSection,
  SkillSection,
  SummarySection,
} from "@shared/ui/sections";

interface EngineerPortfolioProps {
  chatIdentity?: {
    id: string;
    username: string;
    name: string;
    revision: number;
  };
  extras?: boolean;
  handleSendMessage: (input: ChatMessage, sessionId: string) => Promise<ChatMessage>;
  ownerLink?: ReactNode;
  profile: PortfolioProfile;
  referrals?: ComponentProps<typeof ReferralSection>["referrals"];
}

export function EngineerPortfolio({
  profile,
  ownerLink,
  referrals = [],
  extras = false,
  chatIdentity,
  handleSendMessage,
}: EngineerPortfolioProps) {
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
  const showChat = Boolean(extras && chatIdentity);
  return (
    <>
      <Header profile={profile} />
      {!showChat && ownerLink}
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
          {chatIdentity && (
            <ChatSection
              handleSendMessage={handleSendMessage}
              identity={chatIdentity}
              leading={ownerLink}
            />
          )}
        </>
      )}
      <Footer profile={profile} />
    </>
  );
}
