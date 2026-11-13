import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { EditorGuidance } from "./editor-guidance";
import { usePortfolioHistory } from "./use-portfolio-history";

const meta = {
  component: EditorGuidance,
  title: "Assistant/Portfolio/Editor Guidance",
} satisfies Meta<typeof EditorGuidance>;
export default meta;
function Example() {
  const { draft, undo, redo, canUndo, canRedo } = usePortfolioHistory(profile);
  return (
    <EditorGuidance
      canRedo={canRedo}
      canUndo={canUndo}
      onNavigate={() => {
        /* Navigation is supplied by the app. */
      }}
      profile={draft}
      redo={redo}
      undo={undo}
    />
  );
}
export const Default: StoryObj<typeof EditorGuidance> = { render: () => <Example /> };
