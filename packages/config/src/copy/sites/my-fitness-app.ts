export const myFitnessAppLogin = {
  backHref: "/",
  backLabel: "View the shared workspace →",
  brand: "↗ Fitness OS",
  description:
    "Sign in with the same Google account as MyDevStudio. This browser keeps that session, so opening either app continues where you left off.",
  errors: {
    google_failed: "Google sign in did not complete. Try again or use your password.",
    setup: "Sign in is unavailable. Check setup or try again.",
    unconfirmed: "Confirm your account before continuing.",
  },
  eyebrow: "A LITTLE BETTER, EVERY DAY",
  submitLabel: "Open my day →",
  successPath: "/",
  titleEmphasis: "none" as const,
  titleLines: ["Welcome back,", "pick up where you left off."] as const,
};
