export const USER_STORAGE_KEY = "mydevstudio-storage";
export const USER_STORAGE_VERSION = 1;
export type StorageTheme = "light" | "dark" | "system";

export function isStorageTheme(value: unknown): value is StorageTheme {
  return value === "light" || value === "dark" || value === "system";
}

/** Runs before paint. Keep its precedence identical to ThemeProvider's migration. */
export function storageThemeScript(legacyKey: string, fallback: StorageTheme) {
  return `(function(){var t;try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(USER_STORAGE_KEY)})||'null');if(p&&p.version===${USER_STORAGE_VERSION}&&p.state)t=p.state.theme}catch(e){}if(t!=='light'&&t!=='dark'&&t!=='system'){try{var old=localStorage.getItem('mydevstudio-theme');t=old===null?localStorage.getItem(${JSON.stringify(legacyKey)}):old}catch(e){}}if(t!=='light'&&t!=='dark'&&t!=='system')t=${JSON.stringify(fallback)};document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t})()`;
}
