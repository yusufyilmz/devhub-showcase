import "@shared/design-system/globals.css";

import type { Preview } from "@storybook/react-vite";

import { ThemePreview } from "./theme-preview";

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemePreview globals={context.globals}>
        <Story />
      </ThemePreview>
    ),
  ],
  globalTypes: {
    brand: {
      description: "Semantic color palette",
      toolbar: { dynamicTitle: true, icon: "paintbrush", items: ["white", "sand", "aqua"] },
    },
    mode: {
      description: "Color mode",
      toolbar: { dynamicTitle: true, icon: "circlehollow", items: ["light", "dark"] },
    },
    radius: {
      toolbar: {
        dynamicTitle: true,
        icon: "outline",
        items: ["square", "small", "base", "rounded", "pill"],
      },
    },
    spacing: {
      toolbar: {
        dynamicTitle: true,
        icon: "grow",
        items: ["compact", "comfortable", "relaxed", "spacious"],
      },
    },
  },
  initialGlobals: { brand: "white", mode: "light", radius: "base", spacing: "comfortable" },
  parameters: {
    a11y: { test: "todo" },
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { story: { iframeHeight: 480, inline: false } },
  },
};

export default preview;
