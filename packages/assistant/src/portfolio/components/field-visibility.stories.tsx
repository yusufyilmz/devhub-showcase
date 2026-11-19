import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { FieldVisibilityEditor } from "./field-visibility";

function Example() {
  const [draft, setDraft] = useState(profile);
  return <FieldVisibilityEditor onChange={setDraft} profile={draft} />;
}
const meta = { component: Example, title: "Assistant/Portfolio/Field Visibility" } satisfies Meta<
  typeof Example
>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
