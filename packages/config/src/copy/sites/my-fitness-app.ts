export const myFitnessAppLogin = {
  backHref: "/preview",
  backLabel: "Explore the demo →",
  brand: "↗ Fitness OS",
  description: "Sign in with Google or your Fitness OS account to open your private workspace.",
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
