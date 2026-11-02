import { themePreferenceAliases, themePreferenceOptions } from "./themePreferences";
export type StoredUser = { id: string; name: string; email?: string; avatarUrl?: string };

export const USER_CONFIG_STORAGE_KEY = "mydevstudio-userconfig-store";
export const USER_CONFIG_STORAGE_VERSION = 2;
export type UserConfigMode = "light" | "dark" | "system";
export function isUserConfigMode(value: unknown): value is UserConfigMode {
  return value === "light" || value === "dark" || value === "system";
}
/** Read a versioned record defensively; storage is never an authority for a session. */
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function legacyCustomizerMode(): unknown {
  try {
    return read("data-theme") ?? JSON.parse(read("ui-theme") ?? "null")?.state?.theme;
  } catch {
    return null;
  }
}

export function readLegacyUserConfig(storageKey: string) {
  let cached: { version?: unknown; state?: { theme?: unknown; user?: unknown } } | null = null;
  try {
    cached = JSON.parse(read("mydevstudio-storage") ?? "null");
  } catch {
    cached = null;
  }
  const oldMode = cached?.version === 1 ? cached.state?.theme : null;
  const raw = read("mydevstudio-theme") ?? read(storageKey) ?? read("data-theme");
  return {
    mode: [oldMode, raw, legacyCustomizerMode()].find(isUserConfigMode) ?? null,
    user: cleanStoredUser(cached?.version === 1 ? cached.state?.user : null),
  };
}
/** Remove the temporary duplicate only after the canonical record is durable. */
export function completeUserConfigMigration() {
  try {
    const saved = JSON.parse(read(USER_CONFIG_STORAGE_KEY) ?? "null");
    if (saved?.version === USER_CONFIG_STORAGE_VERSION && isUserConfigMode(saved.state?.activeMode))
      localStorage.removeItem("mydevstudio-storage");
    if (saved?.state?.themePreferences) {
      localStorage.removeItem("ui-theme");
      for (const key of Object.keys(themePreferenceOptions)) localStorage.removeItem(`data-${key}`);
      localStorage.removeItem("data-theme");
    }
  } catch {
    /* Keep the previous record if storage is unavailable. */
  }
}
/** Uses the same canonical, temporary-store, and legacy-key order as ThemeProvider. */
export function userConfigThemeScript(legacyKey: string, fallback: UserConfigMode) {
  return `(function(){var t;try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(USER_CONFIG_STORAGE_KEY)})||'null');if(p&&(p.version===1||p.version===${USER_CONFIG_STORAGE_VERSION})&&p.state)t=p.state.activeMode}catch(e){}if(t!=='light'&&t!=='dark'&&t!=='system'){try{var old=JSON.parse(localStorage.getItem('mydevstudio-storage')||'null');if(old&&old.version===1&&old.state)t=old.state.theme}catch(e){}}if(t!=='light'&&t!=='dark'&&t!=='system'){try{var raw=localStorage.getItem('mydevstudio-theme');t=raw===null?localStorage.getItem(${JSON.stringify(legacyKey)}):raw}catch(e){}}if(t!=='light'&&t!=='dark'&&t!=='system'){try{t=localStorage.getItem('data-theme')||JSON.parse(localStorage.getItem('ui-theme')||'null')?.state?.theme}catch(e){}}if(t!=='light'&&t!=='dark'&&t!=='system')t=${JSON.stringify(fallback)};document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t})();${userConfigAppearanceScript()}`;
}

export function userConfigAppearanceScript() {
  return `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(USER_CONFIG_STORAGE_KEY)})||'null');var a=p&&p.state&&p.state.themePreferences||{};var o=${JSON.stringify(themePreferenceOptions)};var d=document.documentElement;var aliases=${JSON.stringify(themePreferenceAliases)};var base={};Object.keys(o).forEach(function(k){var v=a[k];if(o[k].includes(v)){var attr='data-'+(k==='container'?'container-size':k);base[k]=d.getAttribute(attr);d.setAttribute(attr,aliases[k]&&aliases[k][v]||v)}});if(a.spacing==='cozy')d.dataset.spacing='relaxed';if(a.spacing==='extra')d.dataset.spacing='spacious';if(o.scale.includes(a.scale)&&!isNaN(Number(a.scale)))d.style.setProperty('--text-scale',String(Number(a.scale)/100));d.dataset.appearanceDefaults=JSON.stringify(base)}catch(e){}})()`;
}

export function cleanStoredUser(value: unknown): StoredUser | null {
  if (!value || typeof value !== "object") return null;
  const user = value as Record<string, unknown>;
  if (typeof user.id !== "string" || typeof user.name !== "string") return null;
  return {
    id: user.id.slice(0, 200),
    name: user.name.slice(0, 200),
    ...(typeof user.email === "string" ? { email: user.email.slice(0, 320) } : {}),
    ...(typeof user.avatarUrl === "string" ? { avatarUrl: user.avatarUrl.slice(0, 2000) } : {}),
  };
}
