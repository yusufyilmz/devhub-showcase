import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";
import type { AssistantTaskOptions } from "@shared/lib/profiles";

import { AssistantFeedback, AssistantTools, PublishedSources } from "./assistant-tools";

function Example() {
  const [task, setTask] = useState<AssistantTaskOptions | undefined>();
  return (
    <>
      <AssistantTools onChange={setTask} profile={profile} value={task} />
      <AssistantFeedback
        editorHref="/alex/edit"
        feedback={[
          {
            field: "summary",
            issue: "No audience supplied",
            needsInput: true,
            recommendation: "Describe who benefits from your work.",
          },
        ]}
      />
      <PublishedSources
        sources={[
          { href: "/alex#projects", label: "Projects" },
          { href: "/alex#skills", label: "Skills" },
        ]}
      />
    </>
  );
}
const meta = { component: Example, title: "Studio/Assistant tools" } satisfies Meta<typeof Example>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
