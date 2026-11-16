import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { PortfolioProfile } from "@shared/config";

import { AppearanceEditor } from ".";

const sample: PortfolioProfile = {
  about: [],
  appearance: { accent: "cyan", defaultTheme: "light", theme: "studio" },
  education: [],
  email: "",
  experiences: [],
  github: "",
  languages: [],
  linkedin: "",
  location: "Barcelona",
  name: "Mina Chen",
  phone: "",
  projects: [],
  skills: {},
  summary: "I design and build accessible tools for small teams.",
  title: "Product engineer",
  website: "",
};

function Example() {
  const [profile, setProfile] = useState(sample);
  return <AppearanceEditor onChange={setProfile} profile={profile} />;
}

const meta = {
  component: Example,
  title: "UI/Theme/Studio Theme",
} satisfies Meta<typeof Example>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
