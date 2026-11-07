import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { SectionsSettings } from "./sections-settings";

function Example() {
  const [destination, setDestination] = useState("");
  return (
    <div className="grid max-w-3xl gap-s">
      <SectionsSettings onNavigate={setDestination} profile={profile} />
      {destination && <p role="status">Opened {destination}</p>}
    </div>
  );
}

const meta = { component: Example, title: "Studio/Sections settings" } satisfies Meta<
  typeof Example
>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
