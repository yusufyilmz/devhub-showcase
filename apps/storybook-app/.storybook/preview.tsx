import "@shared/design-system/globals.css";

import type { Preview } from "@storybook/react-vite";

import { PageShell } from "@shared/components/layout";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      if (context.component === PageShell) return <Story />;
      return (
        <PageShell
          appearance={{ accent: "cyan", defaultTheme: "light" }}
          documentLanguage="en"
          embed
          portfolioTheme="studio"
          storageKey="storybook-document-shell"
        >
          <Story />
        </PageShell>
      );
    },
  ],
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        iframeHeight: 480,
        inline: false,
      },
    },
  },
};

export default preview;
