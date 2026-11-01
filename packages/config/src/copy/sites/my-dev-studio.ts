export const myDevStudioLogin = {
  backHref: "/",
  backLabel: "← Back to portfolio",
  brand: "↗ MyDevStudio",
  contentId: "admin-content",
  description:
    "Sign in to create your portfolio and downloadable CV. Your information stays private until you publish it.",
  errors: {
    google_failed: "Google sign in did not complete. Try again or use your password.",
    not_owner: "Please sign in with a confirmed Google account.",
    setup: "Portfolio storage is not ready. Complete the Supabase migration first.",
  },
  eyebrow: "YOUR CONTENT, YOUR CONTROL",
  submitLabel: "Open studio →",
  successPath: "/admin",
  titleEmphasis: "second" as const,
  titleLines: ["Welcome to your", "portfolio studio."] as const,
};
