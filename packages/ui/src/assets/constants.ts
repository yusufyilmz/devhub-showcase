export const ASSET_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rustykey.io:8080";

export const ASSET_CACHE_VERSION = 1;

// Priority levels
export type AssetPriority = "critical" | "high" | "medium" | "low";

export const ASSET_CDN_PREFIX = "/cdn";

// Asset type definition
export interface Asset {
  name: string;
  url: string;
  priority: AssetPriority;
  description?: string;
  type?: "image" | "icon" | "font" | "config" | "media";
}

// Icons
export const ICONS = {
  favicon: {
    name: "favicon",
    url: `${ASSET_API_URL}/icons/favicon.ico`,
    priority: "critical" as AssetPriority,
    type: "icon",
    description: "Application favicon",
  },
  appIcon: {
    name: "app-icon",
    url: `${ASSET_API_URL}/icons/app-icon.svg`,
    priority: "critical" as AssetPriority,
    type: "icon",
    description: "Main application icon",
  },
  apple: {
    name: "apple-touch-icon",
    url: `${ASSET_API_URL}/icons/apple-touch-icon.png`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Apple touch icon",
  },
  android192: {
    name: "android-chrome-192",
    url: `${ASSET_API_URL}/icons/android-chrome-192x192.png`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "Android Chrome icon (192x192)",
  },
  android512: {
    name: "android-chrome-512",
    url: `${ASSET_API_URL}/icons/android-chrome-512x512.png`,
    priority: "low" as AssetPriority,
    type: "icon",
    description: "Android Chrome icon (512x512)",
  },
  iconUserMale: {
    name: "icon-user-male",
    url: `${ASSET_API_URL}/images/svgs/icon-user-male.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "User male icon",
  },
  iconBriefcase: {
    name: "icon-briefcase",
    url: `${ASSET_API_URL}/images/svgs/icon-briefcase.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Briefcase icon",
  },
  iconMailbox: {
    name: "icon-mailbox",
    url: `${ASSET_API_URL}/images/svgs/icon-mailbox.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Mailbox icon",
  },
  iconFavorites: {
    name: "icon-favorites",
    url: `${ASSET_API_URL}/images/svgs/icon-favorites.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Favorites icon",
  },
  iconSpeechBubble: {
    name: "icon-speech-bubble",
    url: `${ASSET_API_URL}/images/svgs/icon-speech-bubble.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Speech bubble icon",
  },
  iconConnect: {
    name: "icon-connect",
    url: `${ASSET_API_URL}/images/svgs/icon-connect.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Connect icon",
  },
  user1: {
    name: "user-1",
    url: `${ASSET_API_URL}/images/profile/user-1.jpg`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "User 1 avatar",
  },
  user2: {
    name: "user-2",
    url: `${ASSET_API_URL}/images/profile/user-2.jpg`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "User 2 avatar",
  },
  user3: {
    name: "user-3",
    url: `${ASSET_API_URL}/images/profile/user-3.jpg`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "User 3 avatar",
  },
  user4: {
    name: "user-4",
    url: `${ASSET_API_URL}/images/profile/user-4.jpg`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "User 4 avatar",
  },
  user5: {
    name: "user-5",
    url: `${ASSET_API_URL}/images/profile/user-5.jpg`,
    priority: "medium" as AssetPriority,
    type: "icon",
    description: "User 5 avatar",
  },
  account: {
    name: "account",
    url: `${ASSET_API_URL}/images/svgs/icon-account.svg`,
    priority: "high" as AssetPriority,
    type: "icon",
    description: "Account icon",
  },
};

export const VIDEOS = {
  banner: {
    name: "banner",
    url: `${ASSET_API_URL}/guest_public_info/${process.env.NEXT_PUBLIC_RK_GUEST_ID}/vids/banner.mp4`,
    priority: "critical" as AssetPriority,
    type: "media",
    description: "Banner video",
  },
};

// Logos
export const LOGOS = {
  light: {
    name: "logo-light",
    url: `${ASSET_API_URL}/guest_public_info/${process.env.NEXT_PUBLIC_RK_GUEST_ID}/images/logo.svg`,
    priority: "critical" as AssetPriority,
    type: "image",
    description: "Light mode logo",
  },
  full: {
    name: "logo-full",
    url: `${ASSET_API_URL}/images/logo-full.png`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Full logo",
  },
};

export const DYNAMIC_LOGO_URL = {
  logo: {
    name: "logo-for-client",
    url: (url: string) =>
      `${ASSET_API_URL}/guest_public_info/${process.env.NEXT_PUBLIC_RK_GUEST_ID}/images/${url}`,
    priority: "critical" as AssetPriority,
    type: "image",
    description: "Logo for user",
  },
};
// Images
export const IMAGES = {
  placeholder: {
    name: "placeholder",
    url: `${ASSET_API_URL}/images/placeholder.svg`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Placeholder image",
  },
  avatar: {
    name: "default-avatar",
    url: `${ASSET_API_URL}/images/default-avatar.png`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Default avatar",
  },
  background: {
    name: "background",
    url: `${ASSET_API_URL}/images/background.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Background image",
  },
  hero: {
    name: "hero-banner",
    url: `${ASSET_API_URL}/images/hero-banner.jpg`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Hero banner",
  },
  errorImg: {
    name: "error-image",
    url: `${ASSET_API_URL}/images/backgrounds/errorimg.svg`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Error page image",
  },
  maintenance: {
    name: "maintenance",
    url: `${ASSET_API_URL}/images/backgrounds/maintenance2.svg`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Maintenance page image",
  },
  chatBc: {
    name: "chat-breadcrumb",
    url: `${ASSET_API_URL}/images/breadcrumb/ChatBc.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Chat breadcrumb image",
  },
  emailSv: {
    name: "email-service",
    url: `${ASSET_API_URL}/images/breadcrumb/emailSv.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Email service image",
  },
  eventBc: {
    name: "event-breadcrumb",
    url: `${ASSET_API_URL}/images/event-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Event breadcrumb image",
  },
  homeBc: {
    name: "home-breadcrumb",
    url: `${ASSET_API_URL}/images/home-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Home breadcrumb image",
  },
  inboxBc: {
    name: "inbox-breadcrumb",
    url: `${ASSET_API_URL}/images/inbox-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Inbox breadcrumb image",
  },
  journalBc: {
    name: "journal-breadcrumb",
    url: `${ASSET_API_URL}/images/journal-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Journal breadcrumb image",
  },
  profileBc: {
    name: "profile-breadcrumb",
    url: `${ASSET_API_URL}/images/profile-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Profile breadcrumb image",
  },
  settingsBc: {
    name: "settings-breadcrumb",
    url: `${ASSET_API_URL}/images/settings-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Settings breadcrumb image",
  },
  signupBc: {
    name: "signup-breadcrumb",
    url: `${ASSET_API_URL}/images/signup-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Signup breadcrumb image",
  },
  loginBc: {
    name: "login-breadcrumb",
    url: `${ASSET_API_URL}/images/login-breadcrumb.png`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Login breadcrumb image",
  },
};

export const AVATAR_URLS = {
  avatarRk: {
    name: "avatar-rk",
    url: `${ASSET_API_URL}/guest_public_info/247/avatarImages/avatar.jpg?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  avatarBb: {
    name: "avatar-bb",
    url: `${ASSET_API_URL}/guest_public_info/2/avatarImages/avatar.jpg?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  avatarBbGif: {
    name: "avatar-bb-gif",
    url: `${ASSET_API_URL}/guest_public_info/2/avatarImages/avatar.gif?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  avatarBbUnknownLogo: {
    name: "avatar-bb-unknown-logo",
    url: `${ASSET_API_URL}/guest_public_info/247/avatarImages/unknownLogo.png?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  avatarRkUnknownLogo: {
    name: "avatar-rk-unknown-logo",
    url: `${ASSET_API_URL}/guest_public_info/247/avatarImages/unknownLogo.png?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  issuerLogo: {
    name: "issuer-logo",
    url: (issuer: string) =>
      `${ASSET_API_URL}/guest_public_info/247/avatarImages/${issuer}Logo.png?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Issuer logo",
  },

  userAvatar: {
    name: "user-avatar",
    url: (id: string | number | undefined | null) =>
      id ? `${ASSET_API_URL}/guest_public_info/${String(id)}/avatarImages/avatar.jpg?url` : "",
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
  userAvatarUnknownLogo: {
    name: "user-avatar-unknown-logo",
    url: (id: string) =>
      `${ASSET_API_URL}/guest_public_info/${id}/avatarImages/unknownLogo.png?url`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Avatar image",
  },
};

// Config files
export const CONFIGS = {
  manifest: {
    name: "manifest",
    url: `${ASSET_API_URL}/manifest.json`,
    priority: "critical" as AssetPriority,
    type: "config",
    description: "Web app manifest",
  },
  config: {
    name: "config",
    url: `${ASSET_API_URL}/config.json`,
    priority: "medium" as AssetPriority,
    type: "config",
    description: "Application configuration",
  },
  robots: {
    name: "robots",
    url: `${ASSET_API_URL}/robots.txt`,
    priority: "low" as AssetPriority,
    type: "config",
    description: "Robots.txt file",
  },
  sitemap: {
    name: "sitemap",
    url: `${ASSET_API_URL}/sitemap.xml`,
    priority: "low" as AssetPriority,
    type: "config",
    description: "Sitemap XML",
  },
};

// Fonts
export const FONTS = {
  primary: {
    name: "roboto-regular",
    url: `${ASSET_API_URL}/fonts/roboto-v30-latin-regular.woff2`,
    priority: "high" as AssetPriority,
    type: "font",
    description: "Roboto Regular font",
  },
  bold: {
    name: "roboto-bold",
    url: `${ASSET_API_URL}/fonts/roboto-v30-latin-700.woff2`,
    priority: "high" as AssetPriority,
    type: "font",
    description: "Roboto Bold font",
  },
  italic: {
    name: "roboto-italic",
    url: `${ASSET_API_URL}/fonts/roboto-v30-latin-italic.woff2`,
    priority: "medium" as AssetPriority,
    type: "font",
    description: "Roboto Italic font",
  },
};

// Media
export const MEDIA = {
  screenshot1: {
    name: "screenshot-1",
    url: `${ASSET_API_URL}/screenshots/app-screenshot-1.png`,
    priority: "low" as AssetPriority,
    type: "media",
    description: "App screenshot 1",
  },
  screenshot2: {
    name: "screenshot-2",
    url: `${ASSET_API_URL}/screenshots/app-screenshot-2.png`,
    priority: "low" as AssetPriority,
    type: "media",
    description: "App screenshot 2",
  },
  video: {
    name: "demo-video",
    url: `${ASSET_API_URL}/videos/demo-video.mp4`,
    priority: "low" as AssetPriority,
    type: "media",
    description: "Demo video",
  },
};

// 3D Textures
export const TEXTURES = {
  sprite1: {
    name: "sprite1",
    url: `${ASSET_API_URL}/images/textures/sprite1.png`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "3D sprite texture 1",
  },
  grid: {
    name: "grid",
    url: `${ASSET_API_URL}/images/textures/grid.png`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Grid texture for 3D scenes",
  },
  colors: {
    name: "colors",
    url: `${ASSET_API_URL}/images/textures/colors.png`,
    priority: "high" as AssetPriority,
    type: "image",
    description: "Colors texture for 3D scenes",
  },
  // Coustics textures
  tiles: {
    name: "tiles",
    url: `${ASSET_API_URL}/images/textures/coustics/tiles.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Tiles texture for water pool",
  },
  xneg: {
    name: "xneg",
    url: `${ASSET_API_URL}/images/textures/coustics/xneg.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "X negative texture for water pool",
  },
  xpos: {
    name: "xpos",
    url: `${ASSET_API_URL}/images/textures/coustics/xpos.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "X positive texture for water pool",
  },
  ypos: {
    name: "ypos",
    url: `${ASSET_API_URL}/images/textures/coustics/ypos.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Y positive texture for water pool",
  },
  zneg: {
    name: "zneg",
    url: `${ASSET_API_URL}/images/textures/coustics/zneg.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Z negative texture for water pool",
  },
  zpos: {
    name: "zpos",
    url: `${ASSET_API_URL}/images/textures/coustics/zpos.jpg`,
    priority: "medium" as AssetPriority,
    type: "image",
    description: "Z positive texture for water pool",
  },
};

// For backward compatibility
export const ASSET_URLS = {
  icons: Object.fromEntries(Object.entries(ICONS).map(([key, asset]) => [key, asset.url])),
  logos: Object.fromEntries(Object.entries(LOGOS).map(([key, asset]) => [key, asset.url])),
  images: Object.fromEntries(Object.entries(IMAGES).map(([key, asset]) => [key, asset.url])),
  config: Object.fromEntries(Object.entries(CONFIGS).map(([key, asset]) => [key, asset.url])),
  fonts: Object.fromEntries(Object.entries(FONTS).map(([key, asset]) => [key, asset.url])),
  media: Object.fromEntries(Object.entries(MEDIA).map(([key, asset]) => [key, asset.url])),
  textures: Object.fromEntries(Object.entries(TEXTURES).map(([key, asset]) => [key, asset.url])),
  avatars: Object.fromEntries(Object.entries(AVATAR_URLS).map(([key, asset]) => [key, asset.url])),
};

// Export logo objects directly for SmartLogo component
export const LOGO_URLS = LOGOS;

// Removed console.log for production
// All assets in a flat structure for easy access
export const ASSETS = {
  ...ICONS,
  ...LOGOS,
  ...IMAGES,
  ...CONFIGS,
  ...FONTS,
  ...MEDIA,
  ...TEXTURES,
  ...AVATAR_URLS,
};

// Critical assets that should be preloaded
export const CRITICAL_ASSETS = Object.values(ASSETS)
  .filter((asset) => asset.priority === "critical")
  .map((asset) => asset.url);

// High priority assets for better UX
export const HIGH_PRIORITY_ASSETS = Object.values(ASSETS)
  .filter((asset) => asset.priority === "high")
  .map((asset) => asset.url);

// Medium priority assets
export const MEDIUM_PRIORITY_ASSETS = Object.values(ASSETS)
  .filter((asset) => asset.priority === "medium")
  .map((asset) => asset.url);

// Low priority assets
export const LOW_PRIORITY_ASSETS = Object.values(ASSETS)
  .filter((asset) => asset.priority === "low")
  .map((asset) => asset.url);
