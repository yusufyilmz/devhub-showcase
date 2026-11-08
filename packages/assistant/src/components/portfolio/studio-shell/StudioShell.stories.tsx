import { useState } from "react";

import { pageProfile } from "@fixtures/page-profile";
import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@shared/ui/button";
import { ThemeToggle } from "@shared/ui/theme";
import { noopAsync } from "@shared/utils";

import { ReviewSection } from "../../sections/review-section";
import { ProfileFields } from "../profile-fields";
import { StudioHeading } from "../studio-heading/StudioHeading";
import { StudioShell } from "./StudioShell";

const meta = {
  args: { children: null, contentId: "admin-content", tools: <ThemeToggle /> },
  component: StudioShell,
  decorators: [
    (Story, { globals }) => (
      <PortfolioStoryFrame fullBleed mode={globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Studio",
} satisfies Meta<typeof StudioShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function EditorPreview() {
  const [profile, setProfile] = useState(pageProfile);
  const [saved, setSaved] = useState(pageProfile);
  return (
    <main className="studio" id="admin-content">
      <StudioHeading
        actions={
          <Button disabled={profile === saved} onClick={() => setSaved(profile)}>
            Save changes
          </Button>
        }
        description="Update your story, tailor your CV, and preview what you want to share."
        eyebrow="Portfolio editor"
        title="Edit your portfolio"
      />
      {saved !== pageProfile && saved === profile && (
        <p role="status">Draft saved for this preview.</p>
      )}
      <ProfileFields onChange={setProfile} profile={profile} />
    </main>
  );
}

export const Editor: Story = {
  render: (args) => (
    <StudioShell {...args}>
      <EditorPreview />
    </StudioShell>
  ),
};
export const ManagedPortfolios: Story = {
  args: {
    children: (
      <main className="studio" id="admin-content">
        <StudioHeading
          actions={
            <Button href="/admin" variant="outline">
              My portfolio
            </Button>
          }
          description="Create temporary portfolios, import content and manage publishing."
          eyebrow="Platform administration"
          title="Manage portfolios"
        />
        <section className="editor-card">
          <h2>Managed portfolios</h2>
          <p>No temporary portfolios yet.</p>
        </section>
      </main>
    ),
  },
};

export const Reviews: Story = {
  args: {
    children: (
      <main className="studio" id="admin-content">
        <StudioHeading
          description="Review referrals submitted for the portfolio."
          eyebrow="Portfolio moderation"
          title="Pending reviews"
        />
        <ReviewSection
          handleReview={async () => {
            await noopAsync();
            return "saved";
          }}
          reviews={[]}
        />
      </main>
    ),
  },
};
