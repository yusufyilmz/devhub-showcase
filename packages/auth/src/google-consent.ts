"use client";

import { type GoogleProfileCategory, googleProfilePermissions } from "./google-profile-scopes";

type TokenResponse = { access_token?: string; scope?: string; error?: string };
export type GoogleConsent = {
  initTokenClient: (options: {
    client_id: string;
    scope: string;
    include_granted_scopes: boolean;
    callback: (response: TokenResponse) => void;
    error_callback: () => void;
  }) => { requestAccessToken: (options: { prompt: string }) => void };
};
function api() {
  return (window as Window & { google?: { accounts?: { oauth2?: GoogleConsent } } }).google
    ?.accounts?.oauth2;
}
let loading: Promise<GoogleConsent> | null = null;
/** Loads the official library only when the user opens the optional import feature. */
export function loadGoogleConsent(): Promise<GoogleConsent> {
  const ready = api();
  if (ready) return Promise.resolve(ready);
  if (loading) return loading;
  loading = new Promise<GoogleConsent>((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      script.remove();
      loading = null;
      reject(new Error("Google permission screen could not load. Try again."));
    };
    const timeout = window.setTimeout(fail, 15000);
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timeout);
      const oauth = api();
      if (oauth) resolve(oauth);
      else fail();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      fail();
    };
    document.head.append(script);
  });
  return loading;
}
export function grantedGoogleCategories(categories: GoogleProfileCategory[], scope: string) {
  const granted = new Set(scope.split(/\s+/));
  if (granted.has("profile")) granted.add("https://www.googleapis.com/auth/userinfo.profile");
  if (granted.has("email")) granted.add("https://www.googleapis.com/auth/userinfo.email");
  return categories.filter((category) =>
    googleProfilePermissions[category].scopes.every((value) => granted.has(value)),
  );
}
/** Must run synchronously from the user's click so browsers can open Google's dialog. */
export function requestGoogleProfileConsent(
  oauth: GoogleConsent,
  {
    clientId,
    categories,
    onToken,
    onError,
  }: {
    clientId: string;
    categories: GoogleProfileCategory[];
    onToken: (token: string, granted: GoogleProfileCategory[]) => void;
    onError: () => void;
  },
) {
  oauth
    .initTokenClient({
      callback: (response) => {
        if (response.error || !response.access_token || !response.scope) return onError();
        const granted = grantedGoogleCategories(categories, response.scope);
        if (!granted.length) return onError();
        onToken(response.access_token, granted);
      },
      client_id: clientId,
      error_callback: onError,
      include_granted_scopes: false,
      scope: categories.flatMap((category) => googleProfilePermissions[category].scopes).join(" "),
    })
    .requestAccessToken({ prompt: "consent" });
}
