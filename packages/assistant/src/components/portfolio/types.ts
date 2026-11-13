import type { PortfolioProfile, PortfolioType } from "@shared/config";
import type { AssistantTaskOptions } from "@shared/lib/profiles";

export type LanguageSettingsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type PortfolioTypePickerOptions = {
  value: PortfolioType;
  onChange: (type: PortfolioType) => void;
};

export type ProfileFieldsOptions = {
  onImprove?: () => void;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type FieldVisibilityOptions = ProfileFieldsOptions & {
  surfaces?: readonly ("website" | "cv")[];
};

export type ProfileFieldsOptions2 = string | string[];

export type CompletionItem = {
  label: string;
  tab: "Profile" | "Projects" | "Experience" | "Skills";
  complete: boolean;
  reason: string;
  essential: boolean;
};
export type PortfolioHistoryState = {
  past: PortfolioProfile[];
  present: PortfolioProfile;
  future: PortfolioProfile[];
};
export type EditorGuidanceProps = {
  profile: PortfolioProfile;
  onNavigate: (tab: CompletionItem["tab"], label: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
};

export type { SetupStep } from "./recovery/types";
export type GuidedOnboardingProps = {
  profession?: PortfolioType;
  onProfessionChange?: (profession: PortfolioType) => void;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  onContinue: () => void;
  onImport: () => void;
  onGoogleImport: () => void;
  onAskAssistant?: () => void;
  managed: boolean;
  children?: import("react").ReactNode;
  startStep?: "work" | "layout" | "start";
  onStartStep?: (step: "work" | "layout" | "start") => void;
  onOpen?: (step: "details" | "review") => void;
  reached?: number;
};
export type SetupNavigationProps = {
  disabled?: boolean;
  step: import("./recovery/types").SetupStep;
  onStep: (step: import("./recovery/types").SetupStep) => void;
  onImport: () => void;
  onManual: () => void;
  onAskAssistant?: () => void;
  onPreview?: () => void;
  onOpen?: (step: "work" | "layout" | "start") => void;
  canReview?: boolean;
  reached?: number;
};
export type ProposalComparisonProps = { before: unknown; after: unknown };

export type AssistantToolsProps = {
  profile: PortfolioProfile;
  value: AssistantTaskOptions | undefined;
  onChange: (value: AssistantTaskOptions | undefined) => void;
  disabled?: boolean;
};

export type AssistantFeedbackProps = {
  feedback: NonNullable<import("@shared/lib/profiles").AiEditProposal["feedback"]>;
  onNavigate?: (tab: string) => void;
  editorHref?: string;
};

export type PublishedSourcesProps = { sources: { label: string; href: string }[] };

export type TemplatePickerProps = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
