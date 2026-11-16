import { type ComponentType, useState } from "react";

import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import { sectionStory } from "@fixtures/section-story";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  type AuthorableSectionType,
  authorableSections,
  authorableSectionTypes,
  profile as exampleProfile,
  type PortfolioProfile,
} from "@shared/config";

import { SelectField } from "../../forms";
import { StudioRequestProvider } from "../../providers";
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
} from "../careers-section";
import { EditSection } from "../editors/editors";
import { HeroSettingsEditor } from "../hero-section";
import { SkillsEditor } from "../skills-section/skills-editor";
import { CustomSectionsEditor } from "./custom-sections-editor";
import { SectionOrderEditor } from "./section-order-editor";
import { SectionSettingsEditor } from "./section-settings-editor";
import { SectionTemplatesEditor } from "./section-templates-editor";
import type { CustomSectionsEditorOptions } from "./types";

function SectionEditorExample() {
  const [section, setSection] = useState(() => sectionStory("about").section);

  return (
    <div className="grid min-w-0 gap-md">
      <SelectField
        label="Section editor"
        onChange={(value) => setSection(sectionStory(value as AuthorableSectionType).section)}
        value={section.sectionType ?? "about"}
      >
        {authorableSectionTypes.map((type) => (
          <option key={type} value={type}>
            {authorableSections[type].name}
          </option>
        ))}
      </SelectField>
      <div className="min-w-0" data-section-editor={section.sectionType}>
        <EditSection key={section.sectionType} onChange={setSection} section={section} />
      </div>
    </div>
  );
}

const meta = {
  component: SectionEditorExample,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  title: "Assistant/Sections/Studio/Section Editors",
} satisfies Meta<typeof SectionEditorExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function DraftEditor({ Editor }: { Editor: ComponentType<CustomSectionsEditorOptions> }) {
  const [profile, setProfile] = useState<PortfolioProfile>(() => ({
    ...exampleProfile,
    customSections: [sectionStory("services").section],
  }));
  return <Editor onChange={setProfile} profile={profile} />;
}

export const CustomSections: Story = {
  render: () => <DraftEditor Editor={CustomSectionsEditor} />,
};
export const SectionOrder: Story = { render: () => <DraftEditor Editor={SectionOrderEditor} /> };
export const SectionDisplay: Story = {
  render: () => <DraftEditor Editor={SectionSettingsEditor} />,
};
const templateRequest = async () => Response.json({ revision: 0, templates: [] });

export const Templates: Story = {
  render: () => (
    <StudioRequestProvider request={templateRequest}>
      <DraftEditor Editor={SectionTemplatesEditor} />
    </StudioRequestProvider>
  ),
};
export const Skills: Story = { render: () => <DraftEditor Editor={SkillsEditor} /> };

export const CareerEducation: Story = { render: () => <DraftEditor Editor={EducationEditor} /> };
export const CareerExperience: Story = { render: () => <DraftEditor Editor={ExperienceEditor} /> };
export const CareerLanguages: Story = { render: () => <DraftEditor Editor={LanguagesEditor} /> };
export const CareerProjects: Story = { render: () => <DraftEditor Editor={ProjectsEditor} /> };
export const HeroSettings: Story = { render: () => <DraftEditor Editor={HeroSettingsEditor} /> };
