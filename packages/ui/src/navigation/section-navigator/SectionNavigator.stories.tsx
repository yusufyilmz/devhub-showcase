import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionNavigator } from "./SectionNavigator";

const meta = { component: SectionNavigator, title: "Navigation/SectionNavigator" } satisfies Meta<
  typeof SectionNavigator
>;
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
