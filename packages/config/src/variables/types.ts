export interface SharedEnvironmentConfig {
  ASSISTANT_TITLE: string;
  PUBLIC_API_PORT: string;
}

export interface SharedConfiguration {
  environment: SharedEnvironmentConfig;
}

export interface BrandingConfig {
  background_color: string;
  description: string;
  favicon_path: string;
  logo_path: string;
  name: string;
  short_name: string;
  theme_color: string;
}

export interface SiteConfig {
  branding: BrandingConfig;
  environment: CloneEnvironmentConfig;
}

export interface CloneEnvironmentConfig {
  APP_NAME: string;
  APP_VERSION: string;
  DOMAIN: string;
  PUBLIC_PORT: string;
  URL: string;
}

export interface SitesConfigFile {
  shared: { environment: SharedEnvironmentConfig };
  sites: Record<string, SiteConfig>;
}
