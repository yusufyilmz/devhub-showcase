import "@shared/ui/foundation.css";

import type { Preview } from "@storybook/react-vite";
import { useGlobals } from "storybook/preview-api";

import { ThemeContext } from "../../../packages/ui/src/theme/theme-toggle";
import { BRANDS } from "../../../packages/ui/src/theme/types";
import { ThemePreview } from "./theme-preview";

const preview: Preview = {
  decorators: [
    (Story) => {
      const [globals, updateGlobals] = useGlobals();
      const mode = globals.mode === "dark" ? "dark" : "light";
      return (
        <ThemePreview globals={globals}>
          <ThemeContext.Provider
            value={{
              mode,
              toggle: () => updateGlobals({ mode: mode === "dark" ? "light" : "dark" }),
            }}
          >
            <Story />
          </ThemeContext.Provider>
        </ThemePreview>
      );
    },
  ],
  globalTypes: {
    brand: {
      description: "Semantic color palette",
      toolbar: { dynamicTitle: true, icon: "paintbrush", items: [...BRANDS] },
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
  },
};

export default preview;
