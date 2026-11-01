"use client";

import type { ReactNode } from "react";

import {
  defaultStudioRequest,
  type StudioRequest,
  StudioRequestContext,
} from "../studio/context/studio-request";

export function StudioRequestProvider({
  children,
  request,
}: {
  children: ReactNode;
  request?: StudioRequest;
}) {
  return (
    <StudioRequestContext.Provider value={request ?? defaultStudioRequest}>
      {children}
    </StudioRequestContext.Provider>
  );
}
