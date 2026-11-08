import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { TemplatePicker } from "./template-picker";

function Example() {
  const [draft, setDraft] = useState(profile);
  return <TemplatePicker onChange={setDraft} profile={draft} />;
}
const meta = { component: Example, title: "Studio/Profession templates" } satisfies Meta<
  typeof Example
>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
