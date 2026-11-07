import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";
import type { AssistantTaskOptions } from "@shared/lib/profiles";

import { AssistantFeedback, AssistantTools, PublishedSources } from "./assistant-tools";

function Example() {
  const [task, setTask] = useState<AssistantTaskOptions | undefined>();
  return (
    <div className="grid max-w-3xl gap-md">
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
    </div>
  );
}
const meta = { component: Example, title: "Studio/Assistant tools" } satisfies Meta<typeof Example>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
