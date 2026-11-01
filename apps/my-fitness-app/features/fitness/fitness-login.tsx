"use client";

import { SiteLoginScreen } from "@shared/auth/components";
import { ThemeToggle } from "@shared/ui/theme";

export function FitnessLogin({ errorCode }: { errorCode?: string }) {
  return (
    <SiteLoginScreen brandActions={<ThemeToggle />} errorCode={errorCode} site="my-fitness-app" />
  );
}
