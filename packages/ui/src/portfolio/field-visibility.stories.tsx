import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { FieldVisibilityEditor } from "./field-visibility";

function Example() {
  const [draft, setDraft] = useState(profile);
  return <FieldVisibilityEditor onChange={setDraft} profile={draft} />;
}
const meta = { component: Example, title: "Studio/Output field visibility" } satisfies Meta<
  typeof Example
>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
