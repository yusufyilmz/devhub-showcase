export { storage } from "@shared/config/storage";
export { themeOptions } from "@shared/config/theme";

export { chatStorage, type VisitorMessage } from "./chatStorage";
export { companionStorage, type TipSettings } from "./companionStorage";
export { draftStorage } from "./draftStorage";
export {
  cleanThemePreferences,
  type ThemePreferences,
  themePreferenceAliases,
} from "./themePreferences";
export { type ThemeMode, themeBootstrapScript, themeStorage } from "./themeStorage";
export { type StoredUser, userStorage } from "./userStorage";
