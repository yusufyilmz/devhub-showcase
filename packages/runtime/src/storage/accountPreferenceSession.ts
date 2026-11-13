let preferences: Record<string, unknown> | undefined;
const eventName = "studio-account-preferences";

export const accountPreferenceSession = {
  active: () => preferences !== undefined,
  get: (key: string) => preferences?.[key],
  load(values: Record<string, unknown> | undefined) {
    preferences = values;
    window.dispatchEvent(new Event(eventName));
  },
  onChange(callback: (patch: Record<string, unknown>) => void) {
    const listener = (event: Event) => {
      const patch = (event as CustomEvent<Record<string, unknown>>).detail;
      if (patch) callback(patch);
    };
    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  },
  subscribe(callback: () => void) {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  },
  update(key: string, value: unknown) {
    if (!preferences) return false;
    preferences[key] = value;
    window.dispatchEvent(new CustomEvent(eventName, { detail: { [key]: value } }));
    return true;
  },
};
