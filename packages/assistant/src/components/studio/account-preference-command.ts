import { themeOptions } from "@shared/config/theme";
import { accountPreferenceSession, companionStorage } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

export function applyAccountPreferenceCommand(message: string): string | undefined {
  const command = message.trim().toLowerCase().replace(/[.!]$/, "");
  const mode = /^(?:set theme |switch to )(light|dark|system)(?: theme| mode)?$/.exec(command)?.[1];
  if (mode === "light" || mode === "dark" || mode === "system") {
    useThemeStore.getState().setActiveMode(mode);
    return `Theme set to ${mode}.`;
  }

  const color = /^set companion color (\w+)$/.exec(command)?.[1];
  if (color && (themeOptions.companion as readonly string[]).includes(color)) {
    useThemeStore.getState().setThemePreferences({ companion: color });
    return `Companion color set to ${color}.`;
  }

  const layout = applyCompanionLayout(command);
  if (layout) return layout;

  const tips = /^(enable|disable) companion tips$/.exec(command)?.[1];
  if (tips) {
    const key = companionStorage.tipsKey("studio");
    const enabled = tips === "enable";
    if (accountPreferenceSession.active()) companionStorage.setTipsEnabled(key, enabled);
    else
      companionStorage.writeTips(key, {
        ...companionStorage.readTips(key),
        enabled,
        last: 0,
        seen: [],
      });
    return `Companion tips ${enabled ? "enabled" : "disabled"}.`;
  }
}

function applyCompanionLayout(command: string) {
  const position = /^move companion (left|right|top|bottom)$/.exec(command)?.[1];
  if (position) {
    const current = companionStorage.readLayout("studio") ?? { x: 0, y: 1 };
    const x = position === "left" ? 0 : position === "right" ? 1 : current.x;
    const y = position === "top" ? 0 : position === "bottom" ? 1 : current.y;
    companionStorage.writeLayout("studio", { ...current, x, y });
    return `Companion moved to the ${position}.`;
  }

  const size = Number(/^resize companion (\d+)(?: ?px)?$/.exec(command)?.[1]);
  if (size >= 48 && size <= 208) {
    const current = companionStorage.readLayout("studio") ?? { x: 0, y: 1 };
    companionStorage.writeLayout("studio", { ...current, size });
    return `Companion size set to ${size}px.`;
  }
}
