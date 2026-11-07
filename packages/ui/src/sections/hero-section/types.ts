import type { ComponentProps, ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type HeroBlockProps = Omit<ComponentProps<"section">, "title"> & {
  title: ReactNode;
  headingId: string;
  headingLevel?: "h1" | "h2";
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  notes?: ReactNode;
  visual?: ReactNode;
  variant?: "standard" | "landing";
};

export type HeroSettingsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
