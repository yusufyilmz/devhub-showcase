import { env } from "@/env";

const canonical = new URL(env.APP_URL || "https://myfitnessstudio.vercel.app").origin;

export const fitnessSeo = {
  canonical,
  description: "Your meals, movement, and daily momentum.",
  image: new URL("/share.png", canonical).href,
  previewUrl: new URL("/preview", canonical).href,
  title: "My Fitness Studio",
};
