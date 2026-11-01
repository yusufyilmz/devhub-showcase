"use client";

import { type ReactNode, useCallback } from "react";

import { StudioRequestProvider } from "@shared/components/studio";

export function StudioClient({ children }: { children: ReactNode }) {
  const request = useCallback((input: string, init?: RequestInit) => fetch(input, init), []);
  return <StudioRequestProvider request={request}>{children}</StudioRequestProvider>;
}
