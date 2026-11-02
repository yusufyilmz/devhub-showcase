"use client";

import "@shared/ui/auth-login.css";

import type { ReactNode } from "react";

import { copy, type LoginSiteId } from "@shared/config";
import { urls } from "@shared/config/urls";

import { LoginPanel } from "./login-panel";
import { LoginTitle } from "./login-title";

function resolveLoginError(errors: Record<string, string>, error?: string) {
  return typeof error === "string" && Object.hasOwn(errors, error) ? (errors[error] ?? "") : "";
}

export function SiteLoginScreen({
  site,
  initialError,
  errorCode,
  brandActions,
}: {
  site: LoginSiteId;
  initialError?: string;
  errorCode?: string;
  brandActions?: ReactNode;
}) {
  const siteCopy = copy.loginSites[site];
  const resolvedError = initialError ?? resolveLoginError(siteCopy.errors, errorCode);

  return (
    <LoginPanel
      backHref={siteCopy.backHref}
      backLabel={siteCopy.backLabel}
      brand={siteCopy.brand}
      brandActions={brandActions}
      contentId={"contentId" in siteCopy ? siteCopy.contentId : undefined}
      description={siteCopy.description}
      eyebrow={siteCopy.eyebrow}
      googleAction={urls.next.auth.google()}
      initialError={resolvedError}
      sessionEndpoint={urls.next.auth.session()}
      submitLabel={siteCopy.submitLabel}
      successPath={siteCopy.successPath}
      title={<LoginTitle emphasis={siteCopy.titleEmphasis} lines={[...siteCopy.titleLines]} />}
    />
  );
}
