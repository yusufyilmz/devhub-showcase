"use client";

import { defaultStudioRequest, StudioRequestContext } from "@shared/runtime/studio";

import type { StudioRequestProviderOptions } from "./types";

export function StudioRequestProvider({ children, request }: StudioRequestProviderOptions) {
  return (
    <StudioRequestContext.Provider value={request ?? defaultStudioRequest}>
      {children}
    </StudioRequestContext.Provider>
  );
}
