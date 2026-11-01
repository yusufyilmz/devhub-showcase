"use client";

import type { ComponentProps, ReactNode } from "react";

import { ChatSection } from "@shared/assistant/chat-section";
import {
  copy,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent,
} from "@shared/config";
import { getPortfolioResources } from "@shared/lib/portfolio";
import type { ChatMessage } from "@shared/lib/types";
import { Footer } from "@shared/ui/footer";
import { Header } from "@shared/ui/header";
import { HeroSurface, ScrollButton, Section } from "@shared/ui/layout";
import {
  AboutMeSection,
  EducationsSection,
  ExperienceSection,
  PortfolioProjectsSection as ProjectsSection,
  ReferralSection,
  SkillSection,
  SummarySection,
} from "@shared/ui/sections";

import { handleSendMessageAction } from "../../../app/actions";
import { RegisteredSections } from "../sections/registered-sections";

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

export function EngineerPortfolioView({
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

export function EngineerPortfolio(
  props: Omit<ComponentProps<typeof EngineerPortfolioView>, "handleSendMessage">,
) {
  const username = props.chatIdentity?.username;
  return (
    <EngineerPortfolioView
      {...props}
      handleSendMessage={(message, sessionId) => {
        if (!username) return Promise.reject(new Error("Chat is unavailable"));
        return handleSendMessageAction(username, message, sessionId);
      }}
    />
  );
}
