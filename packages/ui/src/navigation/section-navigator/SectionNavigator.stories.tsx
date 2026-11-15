import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionNavigator } from "./SectionNavigator";

const meta = {
  component: SectionNavigator,
  title: "UI/Navigation/Section Navigator",
} satisfies Meta<typeof SectionNavigator>;
export default meta;
export const Automatic: StoryObj<typeof meta> = {
  render: () => (
    <main>
      {["Introduction", "Work", "Contact"].map((title) => (
        <section key={title} style={{ minHeight: "80vh", padding: 60 }}>
          <h2>{title}</h2>
          <p>Explore this section from the page rail.</p>
        </section>
      ))}
      <SectionNavigator />
    </main>
  ),
};

export const ExplicitTargets: StoryObj<typeof meta> = {
  render: () => (
    <main>
      <section className="min-h-[65vh] p-8" id="work">
        <h2>Selected work</h2>
      </section>
      <section className="min-h-[65vh] p-8" id="contact">
        <h2>Contact</h2>
      </section>
      <SectionNavigator
        sections={[
          { description: "Recent design and code projects", id: "work", title: "Selected work" },
          { description: "How to get in touch", id: "contact", title: "Contact" },
        ]}
      />
    </main>
  ),
};

export const SingleSection: StoryObj<typeof meta> = {
  render: () => (
    <main>
      <section id="introduction">
        <h2>Introduction</h2>
      </section>
      <SectionNavigator sections={[{ id: "introduction", title: "Introduction" }]} />
    </main>
  ),
};
