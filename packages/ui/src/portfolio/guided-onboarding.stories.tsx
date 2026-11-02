import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { GuidedOnboarding, SetupNavigation } from "./guided-onboarding";
import { ProfileFields } from "./profile-fields";
import type { SetupStep } from "./recovery/types";

function Example() {
  const [draft, setDraft] = useState({ ...profile, name: "Alex Demo" });
  const [step, setStep] = useState<SetupStep>("template");
  if (step === "template")
    return (
      <GuidedOnboarding
        managed={false}
        onChange={setDraft}
        onContinue={() => setStep("details")}
        onGoogleImport={() => setStep("details")}
        onImport={() => setStep("details")}
        profile={draft}
      />
    );
  return (
    <>
      <SetupNavigation
        onImport={() => setStep("details")}
        onManual={() => setStep("details")}
        onStep={setStep}
        step={step}
      />
      <ProfileFields onChange={setDraft} profile={draft} />
    </>
  );
}
const meta = { component: Example, title: "Studio/Guided onboarding" } satisfies Meta<
  typeof Example
>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
