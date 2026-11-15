import { describe, expect, it } from "vitest";

import { pathToMetaTitle, rewriteStoryTitle } from "./rewrite-titles.ts";

describe("pathToMetaTitle", () => {
  it("names UI stories from the package, area, and component", () => {
    expect(pathToMetaTitle("packages/ui/src/layout/flex/Flex.stories.tsx")).toBe("UI/Layout/Flex");
    expect(pathToMetaTitle("packages/ui/src/cards/project-card/ProjectCard.stories.tsx")).toBe(
      "UI/Cards/Project Card",
    );
    expect(pathToMetaTitle("packages/ui/src/layout/hero/hero-surface.stories.tsx")).toBe(
      "UI/Layout/Hero/Hero Surface",
    );
    expect(pathToMetaTitle("packages/ui/src/layout/section/SectionGrid.stories.tsx")).toBe(
      "UI/Layout/Section/Section Grid",
    );
    expect(
      pathToMetaTitle("packages/ui/src/buttons/download-cv-button/DownloadCVButton.stories.tsx"),
    ).toBe("UI/Buttons/Download CV Button");
    expect(
      pathToMetaTitle("packages/ui/src/forms/notification-preferences/index.stories.tsx"),
    ).toBe("UI/Forms/Notification Preferences");
    expect(pathToMetaTitle("packages/ui/src/feedback/empty-state/Examples.stories.tsx")).toBe(
      "UI/Feedback/Empty State",
    );
    expect(pathToMetaTitle("packages/ui/src/forms/input-otp/Examples.stories.tsx")).toBe(
      "UI/Forms/Input OTP",
    );
  });

  it("drops the assistant components folder and keeps section leaves", () => {
    expect(
      pathToMetaTitle("packages/assistant/src/components/chat/chat-bubble/ChatBubble.stories.tsx"),
    ).toBe("Assistant/Chat/Chat Bubble");
    expect(
      pathToMetaTitle("packages/assistant/src/components/sections/home-section/hero.stories.tsx"),
    ).toBe("Assistant/Sections/Home Section/Hero");
    expect(
      pathToMetaTitle(
        "packages/assistant/src/components/sections/faq-section/FAQSection.stories.tsx",
      ),
    ).toBe("Assistant/Sections/FAQ Section");
    expect(
      pathToMetaTitle(
        "packages/assistant/src/components/sections/youtube-section/YouTubeSection.stories.tsx",
      ),
    ).toBe("Assistant/Sections/YouTube Section");
  });

  it("names stories that live in the Storybook app", () => {
    expect(pathToMetaTitle("apps/storybook-app/src/stories/BillingPage.stories.tsx")).toBe(
      "Storybook/Billing Page",
    );
    expect(pathToMetaTitle("apps/storybook-app/src/themes.stories.tsx")).toBe("Storybook/Themes");
  });
});

describe("rewriteStoryTitle", () => {
  it("replaces the meta title and leaves args.title alone", () => {
    const source = `const meta = {
  args: { title: "Keep the project name" },
  title: "Storybook App UI/Cards/Project Card/Projectcard",
} satisfies Meta;
`;
    const { next, previousTitle } = rewriteStoryTitle(source, "UI/Cards/Project Card");
    expect(previousTitle).toBe("Storybook App UI/Cards/Project Card/Projectcard");
    expect(next).toContain('args: { title: "Keep the project name" }');
    expect(next).toContain('title: "UI/Cards/Project Card"');
  });

  it("leaves title props outside meta and inside JSX", () => {
    const source = `const items = [{ title: "First project" }];
const meta = {
  decorators: [(Story) => <Heading title="Subscription settings" />],
  title: "Old",
};
`;
    const { next } = rewriteStoryTitle(source, "Storybook/Billing Page");
    expect(next).toContain('title: "First project"');
    expect(next).toContain('title="Subscription settings"');
    expect(next).toContain('title: "Storybook/Billing Page"');
  });

  it("updates a typed meta object", () => {
    const source = `const meta: Meta<typeof Button> = {
  title: "Storybook App UI/Buttons/Button",
} satisfies Meta<typeof Button>;
`;
    const { next } = rewriteStoryTitle(source, "UI/Buttons/Button");
    expect(next).toContain('title: "UI/Buttons/Button"');
  });

  it("updates an exported meta object and a STORY_TITLE constant", () => {
    const source = `const STORY_TITLE = "Old";
export default { title: STORY_TITLE };
`;
    const { next, previousTitle } = rewriteStoryTitle(source, "Storybook/Themes");
    expect(previousTitle).toBe("Old");
    expect(next).toContain('const STORY_TITLE = "Storybook/Themes"');
    expect(next).toContain("title: STORY_TITLE");
  });
});
