import { z } from "zod";

// Shared environment
export const SharedEnvironmentConfigSchema = z.object({
  ASSISTANT_TITLE: z.string(),
  DISCLAIMER_MESSAGE: z.string().optional(),
  PUBLIC_API_PORT: z.string(),
});

export type SharedEnvironmentConfig = z.infer<typeof SharedEnvironmentConfigSchema>;

// Shared configuration
export const SharedConfigurationSchema = z.object({
  environment: SharedEnvironmentConfigSchema,
});

// Branding
export const BrandingConfigSchema = z.object({
  background_color: z.string(),
  description: z.string(),
  favicon_path: z.string(),
  logo_path: z.string(),
  name: z.string(),
  short_name: z.string(),
  theme_color: z.string(),
});

// Clone environment
export const CloneEnvironmentConfigSchema = z.object({
  APP_NAME: z.string(),
  APP_VERSION: z.string(),
  DOMAIN: z.string(),
  PUBLIC_PORT: z.string(),
  URL: z.string(),
});

// Site config
export const SiteConfigSchema = z.object({
  branding: BrandingConfigSchema,
  environment: CloneEnvironmentConfigSchema,
});

// Sites config file
export const SitesConfigFileSchema = z.object({
  shared: z.object({
    environment: SharedEnvironmentConfigSchema,
  }),
  sites: z.record(z.string(), SiteConfigSchema),
});
