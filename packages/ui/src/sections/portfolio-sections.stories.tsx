import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
  Education as EducationRecord,
  ExperienceWithCompanyProjectAndSkills,
  ProjectWithCompanyAndSkills,
  Skill,
} from "@shared/lib/types";

import { AboutMeSection } from "./about-me-section";
import { PortfolioAboutSection } from "./about-section";
import { JsonBlogPage, Post, Posts } from "./blog-page-section";
import { CVSection } from "./cv-section";
import { EducationsSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { ProjectForm, ProjectList, ProjectsSection } from "./project-section";
import { ReferralSection } from "./referral-section";
import { ReviewSection } from "./review-section";
import { SkillSection } from "./skills-section";
import { SummarySection } from "./summary-section";
import { TableOfContents } from "./table-of-contents-section";

const timestamp = "2025-06-01T12:00:00Z";
const company = {
  created_at: timestamp,
  id: "example-company",
  link: "https://example.com",
  name: "Atlas Studio",
  updated_at: timestamp,
};
const education = {
  createdAt: timestamp,
  degree: "MA",
  description: "Studied accessible design for public services.",
  fieldOfStudy: "Interaction Design",
  finishedAt: "2022-06-01",
  gpa: null,
  id: "example-education",
  institution: "North Design School",
  institutionLink: "https://example.com/design-school",
  startedAt: "2020-09-01",
  updatedAt: timestamp,
} satisfies EducationRecord;
const project = {
  company,
  description: "A searchable archive for a local design studio.",
  id: "example-project",
  imageUrl: null,
  link: "https://example.com/archive",
  public: true,
  role: "Product designer",
  skills: [],
  title: "The Atlas archive",
} satisfies ProjectWithCompanyAndSkills;
const experience = {
  achievements: ["Made reference material easier to discover and share."],
  company,
  companyId: company.id,
  createdAt: timestamp,
  finishedAt: null,
  id: "example-experience",
  projects: [project],
  role: "Product designer",
  startedAt: "2023-06-01",
  updatedAt: timestamp,
} satisfies ExperienceWithCompanyProjectAndSkills;

const skill = {
  createdAt: timestamp,
  experienceYear: null,
  id: "example-skill",
  name: "Interaction design",
  projects: [],
  type: "Design",
  updatedAt: timestamp,
} satisfies Skill;

const referral = {
  contactInfo: null,
  createdAt: timestamp,
  feedback: "Alex made the archive easier for our team to use.",
  id: "example-referral",
  name: "Morgan Lee",
  recommendation: "I would work with Alex again.",
  relationship: "Project collaborator",
  sessionId: "example-session",
  updatedAt: timestamp,
};

const meta = {
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  title: "Assistant/Sections/Portfolio Sections",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <SummarySection featured /> };
export const AboutMe: Story = { render: () => <AboutMeSection /> };
export const Education: Story = {
  render: () => <EducationsSection educations={[education]} />,
};
export const Experience: Story = {
  render: () => <ExperienceSection experiences={[experience]} />,
};
export const Projects: Story = {
  render: () => <ProjectsSection projects={[project]} />,
};
export const Skills: Story = { render: () => <SkillSection skills={{ Design: [skill] }} /> };
export const CurriculumVitae: Story = { render: () => <CVSection /> };
export const Referrals: Story = { render: () => <ReferralSection referrals={[referral]} /> };
export const ReviewQueue: Story = {
  render: () => (
    <ReviewSection
      handleReview={async () => "saved"}
      reviews={[
        {
          comment: null,
          createdAt: timestamp,
          id: "example-review",
          referral,
          referralId: referral.id,
          state: "PENDING",
          updatedAt: timestamp,
        },
      ]}
    />
  ),
};
export const ReviewError: Story = {
  render: () => <ReviewSection handleReview={async () => "error"} reviews={null} />,
};

export const ProjectEditor: Story = {
  render: () => (
    <ProjectForm action="Save project" isSubmitting={false} onSubmit={() => undefined} />
  ),
};
export const ProjectEditorSaving: Story = {
  render: () => <ProjectForm action="Saving project" isSubmitting onSubmit={() => undefined} />,
};

export const AboutProject: Story = { render: () => <PortfolioAboutSection /> };
export const ProjectLinks: Story = { render: () => <ProjectList projects={[project]} /> };
export const Blog: Story = { render: () => <JsonBlogPage {...sectionStory("blog-page")} /> };
export const PostList: Story = { render: () => <Posts {...sectionStory("posts-grid")} /> };
export const Article: Story = {
  render: () => (
    <Post
      item={{
        body: "A short note on making an archive easier to explore.",
        id: "example-post",
        title: "Designing for discovery",
        url: "",
      }}
    />
  ),
};
export const Contents: Story = {
  render: () => (
    <TableOfContents
      {...sectionStory("table-of-contents")}
      anchors={[
        { id: "introduction", title: "Introduction" },
        { id: "work", title: "Selected work" },
      ]}
    />
  ),
};
