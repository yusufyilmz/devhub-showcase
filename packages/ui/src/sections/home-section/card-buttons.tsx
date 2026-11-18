import type { ReactNode } from "react";

import type { PageAction } from "./types";

export type CardButton = "cv" | "pro" | "studio" | "templates";

export function cardButton(
  button: CardButton,
  action: PageAction,
): { href: string; label: ReactNode } {
  if (button === "pro") {
    return {
      href: action.signedIn ? "/studio/billing" : "/login",
      label: action.signedIn ? "Try Pro sandbox" : "Sign in to try Pro",
    };
  }

  if (button === "cv") {
    return {
      href: action.href,
      label: (
        <>
          Start with your CV <span aria-hidden="true">↗</span>
        </>
      ),
    };
  }

  if (button === "templates") {
    return { href: action.href, label: "Explore your studio →" };
  }

  return { href: action.href, label: action.label };
}
