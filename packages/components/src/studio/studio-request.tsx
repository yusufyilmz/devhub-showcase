"use client";

import { createContext, type ReactNode, useContext } from "react";

export type StudioRequest = (input: string, init?: RequestInit) => Promise<Response>;

const defaultStudioRequest: StudioRequest = (input, init) => fetch(input, init);

const StudioRequestContext = createContext<StudioRequest | null>(null);

export function StudioRequestProvider({
  children,
  request,
}: {
  children: ReactNode;
  request: StudioRequest;
}) {
  return <StudioRequestContext.Provider value={request}>{children}</StudioRequestContext.Provider>;
}

export function useStudioRequest(): StudioRequest {
  const request = useContext(StudioRequestContext);
  return request ?? defaultStudioRequest;
}
