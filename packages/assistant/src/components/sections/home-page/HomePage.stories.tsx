import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";

import { HomePage } from "./HomePage";

const meta = {
  args: {
    action: { href: "/login", label: "Create your portfolio", signedIn: false },
    exampleHref: "/?path=/story/pages-portfolio--designer",
    examples: (
      <section className="home-container py-lg" id="examples">
        <Card className="px-lg" layout="plain" surface="portfolio">
          <h2>Explore a sample portfolio</h2>
          <p>See the work and experience sections in a fictional portfolio.</p>
          <Button href="/?path=/story/pages-portfolio--designer" variant="outline">
            Open sample portfolio
          </Button>
        </Card>
      </section>
    ),
    planDetails: <p>Optional monthly sandbox subscription.</p>,
  },
  component: HomePage,
  decorators: [
    (Story, { globals }) => (
      <PortfolioStoryFrame fullBleed mode={globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Assistant/Sections/Home Page",
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visitor: Story = {};
export const SignedIn: Story = {
  args: { action: { href: "/admin", label: "Open your studio", signedIn: true } },
};
