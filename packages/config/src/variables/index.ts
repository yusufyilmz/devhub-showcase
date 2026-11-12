import { env } from "@shared/env";
export const environment = typeof window === "undefined" ? env.ENVIRONMENT : undefined;
export const site = typeof window === "undefined" ? env.SITE : undefined;
